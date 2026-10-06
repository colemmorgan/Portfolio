import * as THREE from 'three'

/**
 * Decoder for the .lpc point clouds written by scripts/lidar/pack_cloud.py.
 *
 *   "LPC1" | uint32 header length | JSON header | gzip payload
 *   payload: x lo, x hi, y lo, y hi, z lo, z hi, intensity — n bytes each
 *
 * Positions are zigzagged deltas between consecutive points on a grid of
 * `step` metres; the browser inflates the gzip natively.
 */

export interface LpcHeader {
  version: number
  count: number
  step: number
  origin: [number, number, number]
  intensityBits: number
  /** Half-width of the original crop — the edge fade lands here. */
  cropRadius: number | null
  bounds: { min: [number, number, number]; max: [number, number, number] }
  source?: string
}

export type CloudGeometry = THREE.BufferGeometry & { userData: { header: LpcHeader } }

export async function loadLpc(url: string, signal?: AbortSignal): Promise<CloudGeometry> {
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`${url} -> ${res.status}`)
  const file = new Uint8Array(await res.arrayBuffer())

  const view = new DataView(file.buffer, file.byteOffset, file.byteLength)
  const magic = String.fromCharCode(...file.subarray(0, 4))
  if (magic !== 'LPC1') throw new Error(`${url} is not an LPC1 file`)
  const headerLength = view.getUint32(4, true)
  const header: LpcHeader = JSON.parse(
    new TextDecoder().decode(file.subarray(8, 8 + headerLength))
  )

  const compressed = file.subarray(8 + headerLength)
  const inflated = await new Response(
    new Blob([compressed]).stream().pipeThrough(new DecompressionStream('gzip'))
  ).arrayBuffer()
  const planes = new Uint8Array(inflated)

  const n = header.count
  if (planes.length !== n * 7) throw new Error(`${url}: payload is ${planes.length} bytes, expected ${n * 7}`)

  const { step, origin } = header
  const positions = new Float32Array(n * 3)
  // Cheap deterministic PRNG for the in-cell jitter, so every load matches.
  let seed = 0x9e3779b9
  const rand = () => {
    seed ^= seed << 13
    seed ^= seed >>> 17
    seed ^= seed << 5
    return (seed >>> 0) / 4294967296 - 0.5
  }

  for (let axis = 0; axis < 3; axis++) {
    const lo = planes.subarray(axis * 2 * n, (axis * 2 + 1) * n)
    const hi = planes.subarray((axis * 2 + 1) * n, (axis * 2 + 2) * n)
    let cell = 0
    for (let i = 0; i < n; i++) {
      const zigzag = lo[i] | (hi[i] << 8)
      cell += (zigzag >>> 1) ^ -(zigzag & 1)
      // Jitter within the cell so the quantisation grid never reads as a
      // lattice; the error stays under half a step, well below a pixel.
      positions[i * 3 + axis] = origin[axis] + (cell + rand()) * step
    }
  }

  // Expand the stored bits back to the full 0..255 range.
  const bits = header.intensityBits
  const intensity = planes.slice(6 * n, 7 * n)
  for (let i = 0; i < n; i++) {
    const v = intensity[i]
    intensity[i] = (v << (8 - bits)) | (v >> Math.max(0, 2 * bits - 8))
  }

  const geometry = new THREE.BufferGeometry() as CloudGeometry
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aIntensity', new THREE.BufferAttribute(intensity, 1, true))
  geometry.boundingBox = new THREE.Box3(
    new THREE.Vector3(...header.bounds.min),
    new THREE.Vector3(...header.bounds.max)
  )
  geometry.boundingSphere = geometry.boundingBox.getBoundingSphere(new THREE.Sphere())
  geometry.userData.header = header
  return geometry
}
