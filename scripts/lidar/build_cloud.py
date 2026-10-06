"""
Cut a square out of a USGS 3DEP point cloud and pack it for the hero scene.

The USGS publishes 3DEP LiDAR on AWS as Entwine Point Tiles (EPT): an octree
of LAZ files plus a JSON hierarchy saying how many points live in each node.
EPT is additive — a node's points are *extra* detail on top of its parents —
so the full-resolution cloud for an area is the union of every node, at every
depth, whose bounds touch it. That lets us pull just the few dozen tiles we
need over HTTP instead of downloading a whole county.

Output (data/lidar/<name>.bin + <name>.json) — a raw intermediate; run
cull_to_view.py and pack_cloud.py to get what the site loads:
  positions  float32 x3   metres, centred on the crop; x east, y up, z south
                          (three.js convention, so north is -z)
  color      uint8   x3   the dataset's own RGB if it has any, else zeros
  intensity  uint8        return intensity, percentile-normalised to 0..255
  class      uint8        ASPRS classification (2 ground, 6 building, ...)

Usage:
  python build_cloud.py --dataset NY_NewYorkCity --lat 40.7127 --lon -74.0134 \
      --size 1400 --voxel 0.6 --name manhattan

Needs: numpy, laspy[lazrs], requests
"""

from __future__ import annotations

import argparse
import io
import json
import math
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import laspy
import numpy as np
import requests

BUCKET = "https://s3-us-west-2.amazonaws.com/usgs-lidar-public"
NOISE_CLASSES = (7, 18)  # low noise, high noise
WEB_MERCATOR_R = 6378137.0

session = requests.Session()


def lonlat_to_mercator(lon: float, lat: float) -> tuple[float, float]:
    x = math.radians(lon) * WEB_MERCATOR_R
    y = math.log(math.tan(math.pi / 4 + math.radians(lat) / 2)) * WEB_MERCATOR_R
    return x, y


def node_bounds(cube, key):
    d, x, y, z = key
    size = (cube[3] - cube[0]) / (2**d)
    return (
        cube[0] + x * size,
        cube[1] + y * size,
        cube[2] + z * size,
        cube[0] + (x + 1) * size,
        cube[1] + (y + 1) * size,
        cube[2] + (z + 1) * size,
    )


def intersects_xy(b, box):
    return b[0] < box[2] and b[3] > box[0] and b[1] < box[3] and b[4] > box[1]


def collect_nodes(dataset, cube, box, max_depth):
    """Walk the EPT hierarchy, returning (key, count) for overlapping nodes."""
    found = []

    def load(key_str):
        url = f"{BUCKET}/{dataset}/ept-hierarchy/{key_str}.json"
        return session.get(url, timeout=60).json()

    pending = [load("0-0-0-0")]
    while pending:
        hierarchy = pending.pop()
        for key_str, count in hierarchy.items():
            key = tuple(int(v) for v in key_str.split("-"))
            if key[0] > max_depth:
                continue
            if not intersects_xy(node_bounds(cube, key), box):
                continue
            if count == -1:
                # This branch continues in its own hierarchy file.
                pending.append(load(key_str))
            elif count > 0:
                found.append((key, count))
    # Sub-hierarchy roots appear in both files; keep one copy of each.
    return sorted(set(found))


def fetch_node(dataset, key):
    key_str = "-".join(str(v) for v in key)
    url = f"{BUCKET}/{dataset}/ept-data/{key_str}.laz"
    res = session.get(url, timeout=120)
    res.raise_for_status()
    return laspy.read(io.BytesIO(res.content))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dataset", required=True)
    ap.add_argument("--lat", type=float, required=True)
    ap.add_argument("--lon", type=float, required=True)
    ap.add_argument("--size", type=float, default=1200, help="crop edge, ground metres")
    ap.add_argument("--voxel", type=float, default=0.5, help="thinning cell, metres")
    ap.add_argument("--max-depth", type=int, default=None)
    ap.add_argument("--target", type=int, default=6_000_000, help="raw points to fetch")
    ap.add_argument("--name", required=True)
    ap.add_argument("--out", default=str(Path(__file__).resolve().parents[2] / "data" / "lidar"))
    args = ap.parse_args()

    meta = session.get(f"{BUCKET}/{args.dataset}/ept.json", timeout=60).json()
    cube = meta["bounds"]
    srs = meta["srs"].get("horizontal")
    if srs != "3857":
        raise SystemExit(f"expected EPSG:3857, dataset is {srs}")

    # Web Mercator stretches distances by 1/cos(lat); grow the crop to match
    # so --size is true ground metres, and shrink back when we export.
    stretch = 1 / math.cos(math.radians(args.lat))
    cx, cy = lonlat_to_mercator(args.lon, args.lat)
    half = args.size / 2 * stretch
    box = (cx - half, cy - half, cx + half, cy + half)

    # Pick the deepest level that keeps the download near --target points.
    # Node counts cover the whole node, so this overestimates a little.
    depth = args.max_depth
    if depth is None:
        depth = 0
        for d in range(4, 16):
            nodes = collect_nodes(args.dataset, cube, box, d)
            total = sum(c for _, c in nodes)
            print(f"depth {d}: {len(nodes)} nodes, {total:,} points")
            if total > args.target * 2.5:
                break
            depth = d
            if all(k[0] < d for k, _ in nodes):
                break  # dataset bottoms out above this depth
    nodes = collect_nodes(args.dataset, cube, box, depth)
    print(f"using depth {depth}: {len(nodes)} nodes, {sum(c for _, c in nodes):,} points")

    with ThreadPoolExecutor(max_workers=12) as pool:
        clouds = list(pool.map(lambda n: fetch_node(args.dataset, n[0]), nodes))

    has_rgb = "red" in clouds[0].point_format.dimension_names
    parts = {k: [] for k in ("x", "y", "z", "i", "c", "r", "g", "b")}
    for las in clouds:
        x, y = np.asarray(las.x), np.asarray(las.y)
        keep = (x >= box[0]) & (x <= box[2]) & (y >= box[1]) & (y <= box[3])
        keep &= ~np.isin(np.asarray(las.classification), NOISE_CLASSES)
        parts["x"].append(x[keep])
        parts["y"].append(y[keep])
        parts["z"].append(np.asarray(las.z)[keep])
        parts["i"].append(np.asarray(las.intensity)[keep])
        parts["c"].append(np.asarray(las.classification)[keep])
        if has_rgb:
            parts["r"].append(np.asarray(las.red)[keep])
            parts["g"].append(np.asarray(las.green)[keep])
            parts["b"].append(np.asarray(las.blue)[keep])

    x = (np.concatenate(parts["x"]) - cx) / stretch
    y = (np.concatenate(parts["y"]) - cy) / stretch
    z = np.concatenate(parts["z"])
    intensity = np.concatenate(parts["i"]).astype(np.float32)
    cls = np.concatenate(parts["c"]).astype(np.uint8)
    print(f"cropped: {len(x):,} points")

    # Stray returns (birds, multipath) survive classification sometimes; clip
    # elevation to a generous percentile band rather than trusting the max.
    z_lo, z_hi = np.percentile(z, [0.05, 99.995])
    ok = (z >= z_lo - 2) & (z <= z_hi + 2)

    # Voxel thinning: keep the first point in each cell so density is even
    # across overlapping flight lines.
    cells = np.floor(np.stack([x, y, z], 1)[ok] / args.voxel).astype(np.int64)
    _, first = np.unique(cells, axis=0, return_index=True)
    idx = np.flatnonzero(ok)[np.sort(first)]
    # Shuffle so any prefix of the file is a uniform sample — handy for
    # dropping density on slow devices later without reprocessing.
    np.random.default_rng(7).shuffle(idx)
    print(f"thinned at {args.voxel} m: {len(idx):,} points")

    ground = z[idx][cls[idx] == 2]
    z0 = float(np.median(ground)) if len(ground) else float(np.percentile(z[idx], 5))

    positions = np.stack([x[idx], z[idx] - z0, -y[idx]], 1).astype(np.float32)

    lo, hi = np.percentile(intensity[idx], [1, 99])
    inten = np.clip((intensity[idx] - lo) / max(hi - lo, 1) * 255, 0, 255).astype(np.uint8)

    if has_rgb:
        rgb = np.stack([np.concatenate(parts[k])[idx] for k in "rgb"], 1).astype(np.float32)
        # 16-bit colour in most LAS files, but some producers store 8-bit.
        rgb = rgb / (257 if rgb.max() > 255 else 1)
        color = np.clip(rgb, 0, 255).astype(np.uint8)
    else:
        color = np.zeros((len(idx), 3), np.uint8)

    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    blobs = [positions.tobytes(), color.tobytes(), inten.tobytes(), cls[idx].tobytes()]
    (out / f"{args.name}.bin").write_bytes(b"".join(blobs))

    offsets, at = {}, 0
    for name, blob in zip(("positions", "color", "intensity", "classification"), blobs):
        offsets[name] = at
        at += len(blob)

    bbox_min = positions.min(0).tolist()
    bbox_max = positions.max(0).tolist()
    (out / f"{args.name}.json").write_text(json.dumps({
        "source": f"USGS 3DEP {args.dataset}",
        "center": {"lat": args.lat, "lon": args.lon},
        "count": int(len(idx)),
        "hasColor": bool(has_rgb),
        "voxel": args.voxel,
        "cropRadius": args.size / 2,
        "offsets": offsets,
        "bounds": {"min": bbox_min, "max": bbox_max},
    }, indent=2))
    mb = at / 1e6
    print(f"wrote {out / args.name}.bin ({mb:.1f} MB), bounds {bbox_min} .. {bbox_max}")


if __name__ == "__main__":
    main()
