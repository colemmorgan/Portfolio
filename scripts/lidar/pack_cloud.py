"""
Pack a raw cloud from data/lidar into the compact .lpc file the site loads.

Only what the hero renders survives: position and return intensity. Then:

  1. Quantise positions to a --step grid (25 cm by default). The cloud was
     thinned at 1 m and is seen from ~940 m, where a pixel covers ~0.5 m of
     ground, so this is far below anything visible. The loader jitters each
     point back within its cell so the grid never shows as a lattice.
  2. Sort along a Morton (Z-order) curve, so neighbours in the file are
     neighbours in space, and store each axis as deltas from the previous
     point — mostly tiny numbers.
  3. Zigzag the deltas to unsigned, split them into byte planes (all low
     bytes, then all high bytes) and gzip. Similar bytes sit together, which
     is what gzip is good at, and browsers can inflate it natively with
     DecompressionStream — no decoder library to ship.

File layout (little-endian):
  "LPC1" | uint32 header length | JSON header | gzip payload
  payload: x lo, x hi, y lo, y hi, z lo, z hi, intensity — n bytes each

The file is named <out-name>.<content hash>.lpc and its URL recorded in
src/data/lidarClouds.ts, which the scene imports. A rebuilt cloud therefore
always gets a new URL, which is what lets the server cache these forever
(see routeRules in vite.config.ts).

Usage:
  python pack_cloud.py --name manhattan-topdown --out-name manhattan-wide
"""

from __future__ import annotations

import argparse
import gzip
import hashlib
import json
import re
import struct
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
WIDTHS = {"positions": 12, "color": 3, "intensity": 1, "classification": 1}


def spread_bits(v: np.ndarray) -> np.ndarray:
    """Interleave two zero bits after each of the low 16 bits (for Morton)."""
    v = v.astype(np.uint64) & 0xFFFF
    v = (v | (v << 16)) & 0x0000FF0000FF
    v = (v | (v << 8)) & 0x00F00F00F00F
    v = (v | (v << 4)) & 0x0C30C30C30C3
    v = (v | (v << 2)) & 0x249249249249
    return v


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--name", required=True, help="raw cloud in data/lidar")
    ap.add_argument("--out-name", required=True, help="writes public/lidar/<out-name>.lpc")
    ap.add_argument("--step", type=float, default=0.25, help="position grid, metres")
    ap.add_argument("--intensity-bits", type=int, default=5)
    args = ap.parse_args()

    src = ROOT / "data" / "lidar"
    meta = json.loads((src / f"{args.name}.json").read_text())
    raw = (src / f"{args.name}.bin").read_bytes()
    n = meta["count"]

    positions = (
        np.frombuffer(raw, np.float32, n * 3, meta["offsets"]["positions"])
        .reshape(n, 3)
        .astype(np.float64)
    )
    intensity = np.frombuffer(raw, np.uint8, n, meta["offsets"]["intensity"])

    origin = positions.min(0)
    q = np.round((positions - origin) / args.step).astype(np.int64)
    if q.max() > 0xFFFF:
        raise SystemExit("cloud too large for 16-bit cells at this step; raise --step")

    morton = spread_bits(q[:, 0]) | (spread_bits(q[:, 1]) << 1) | (spread_bits(q[:, 2]) << 2)
    order = np.argsort(morton, kind="stable")
    q = q[order]

    deltas = np.diff(q, axis=0, prepend=0)
    zigzag = ((deltas << 1) ^ (deltas >> 63)).astype(np.uint64)
    if zigzag.max() > 0xFFFF:
        raise SystemExit("delta overflowed 16 bits")

    planes = [
        ((zigzag[:, axis] >> shift) & 0xFF).astype(np.uint8).tobytes()
        for axis in range(3)
        for shift in (0, 8)
    ]
    planes.append((intensity[order] >> (8 - args.intensity_bits)).astype(np.uint8).tobytes())
    payload = gzip.compress(b"".join(planes), compresslevel=9, mtime=0)

    header = json.dumps({
        "version": 1,
        "count": int(n),
        "step": args.step,
        "origin": origin.tolist(),
        "intensityBits": args.intensity_bits,
        "cropRadius": meta.get("cropRadius"),
        "bounds": meta["bounds"],
        "source": meta.get("source"),
        "center": meta.get("center"),
    }, separators=(",", ":")).encode()

    blob = b"LPC1" + struct.pack("<I", len(header)) + header + payload
    digest = hashlib.sha256(blob).hexdigest()[:10]

    out_dir = ROOT / "public" / "lidar"
    out_dir.mkdir(parents=True, exist_ok=True)
    # Drop superseded builds of this cloud so stale versions don't ship.
    for old in [*out_dir.glob(f"{args.out_name}.*.lpc"), out_dir / f"{args.out_name}.lpc"]:
        if old.exists():
            old.unlink()
    out = out_dir / f"{args.out_name}.{digest}.lpc"
    out.write_bytes(blob)
    write_manifest(args.out_name, f"/lidar/{out.name}")

    size = len(blob)
    print(f"wrote {out.name}: {n:,} points, {size / 1e6:.2f} MB ({size * 8 / n:.1f} bits/pt)")


MANIFEST = ROOT / "src" / "data" / "lidarClouds.ts"
MANIFEST_ENTRY = re.compile(r'^  "([^"]+)": "([^"]+)",$', re.M)


def write_manifest(name: str, url: str):
    entries = dict(MANIFEST_ENTRY.findall(MANIFEST.read_text(encoding="utf-8"))) if MANIFEST.exists() else {}
    entries[name] = url
    body = "".join(f'  "{k}": "{v}",\n' for k, v in sorted(entries.items()))
    MANIFEST.write_text(
        "// Generated by scripts/lidar/pack_cloud.py — do not edit by hand.\n"
        "// Filenames carry a content hash, so they are safe to cache forever.\n"
        f"export const LIDAR_CLOUDS = {{\n{body}}} as const;\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
