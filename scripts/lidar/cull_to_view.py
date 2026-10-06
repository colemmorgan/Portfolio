"""
Drop every point the hero camera can never see.

Simulates the camera LidarScene can reach — its sway, the pointer parallax and
the elevation clamp — on the widest screen we care about, and keeps only the
points that land in frame at least once and sit inside the edge-fade disc.
Mirror the constants below if the camera in LidarScene.tsx changes.

Usage:
  python cull_to_view.py --name manhattan --out-name manhattan-topdown
  python cull_to_view.py --name manhattan --out-name manhattan-portrait --aspect 1
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np

# -- Mirrors LidarScene.tsx ---------------------------------------------------
TARGET = np.array([0.0, 40.0, -60.0])
DISTANCE = 942.0
FOV_DEG = 35.0
ELEVATION = 89.0
MAX_ELEVATION = 89.5
SWAY_DEG = 9.0
PARALLAX_AZIMUTH_DEG = 4.0
PARALLAX_ELEVATION_DEG = 3.0

ASPECT = 21 / 9   # widest screen to keep whole; vertical FOV is fixed
MARGIN = 0.06     # NDC slack, so small camera tweaks don't expose a cut edge

FIELDS = ("positions", "color", "intensity", "classification")
WIDTHS = {"positions": 12, "color": 3, "intensity": 1, "classification": 1}


def frame_mask(points, az_deg, el_deg, aspect):
    az, el = np.radians(az_deg), np.radians(el_deg)
    eye = TARGET + DISTANCE * np.array(
        [np.cos(el) * np.sin(az), np.sin(el), np.cos(el) * np.cos(az)]
    )
    # Same basis three's Object3D.lookAt builds for a camera.
    z = eye - TARGET
    z /= np.linalg.norm(z)
    x = np.cross([0.0, 1.0, 0.0], z)
    x /= np.linalg.norm(x)
    y = np.cross(z, x)

    d = points - eye
    depth = -(d @ z)
    t = np.tan(np.radians(FOV_DEG) / 2)
    with np.errstate(divide="ignore", invalid="ignore"):
        nx = (d @ x) / depth / (t * aspect)
        ny = (d @ y) / depth / t
    return (depth > 0) & (np.abs(nx) < 1 + MARGIN) & (np.abs(ny) < 1 + MARGIN)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--name", required=True)
    ap.add_argument("--out-name", required=True)
    ap.add_argument("--dir", default=str(Path(__file__).resolve().parents[2] / "data" / "lidar"))
    ap.add_argument("--aspect", type=float, default=ASPECT, help="widest width/height to cover")
    args = ap.parse_args()

    root = Path(args.dir)
    meta = json.loads((root / f"{args.name}.json").read_text())
    raw = (root / f"{args.name}.bin").read_bytes()
    n = meta["count"]

    arrays = {
        f: np.frombuffer(raw, np.uint8, n * WIDTHS[f], meta["offsets"][f]).reshape(n, WIDTHS[f])
        for f in FIELDS
    }
    points = arrays["positions"].copy().view(np.float32).reshape(n, 3).astype(np.float64)

    # The crop's half-width; LidarScene fades to nothing at this radius.
    crop_radius = meta.get("cropRadius") or float(
        min(-points[:, 0].min(), points[:, 0].max(), -points[:, 2].min(), points[:, 2].max())
    )
    keep = np.hypot(points[:, 0], points[:, 2]) < crop_radius

    seen = np.zeros(n, bool)
    sway = SWAY_DEG + PARALLAX_AZIMUTH_DEG
    for az in np.linspace(-sway, sway, 13):
        for el in np.linspace(ELEVATION - PARALLAX_ELEVATION_DEG, MAX_ELEVATION, 6):
            seen |= frame_mask(points, az, min(el, MAX_ELEVATION), args.aspect)
    keep &= seen

    idx = np.flatnonzero(keep)  # preserves the shuffled order
    blobs = [arrays[f][idx].tobytes() for f in FIELDS]
    (root / f"{args.out_name}.bin").write_bytes(b"".join(blobs))

    offsets, at = {}, 0
    for f, blob in zip(FIELDS, blobs):
        offsets[f] = at
        at += len(blob)
    kept = points[idx].astype(np.float32)
    meta.update(
        count=int(len(idx)),
        offsets=offsets,
        cropRadius=crop_radius,
        culledFrom=f"{args.name} ({n:,} points) for the top-down hero camera, aspect <= {args.aspect:.2f}",
        bounds={"min": kept.min(0).tolist(), "max": kept.max(0).tolist()},
    )
    (root / f"{args.out_name}.json").write_text(json.dumps(meta, indent=2))
    print(f"kept {len(idx):,} of {n:,} points ({len(idx) / n:.1%}), {at / 1e6:.1f} MB")


if __name__ == "__main__":
    main()
