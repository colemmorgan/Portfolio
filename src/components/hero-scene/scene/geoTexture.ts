import * as THREE from 'three'

/**
 * Rasterises a GeoJSON FeatureCollection into an equirectangular mask that can
 * be sampled straight from sphere UVs.
 *
 * three's SphereGeometry is already equirectangular — uv.x runs once around the
 * equator and uv.y runs pole to pole — so a plate carree projection of the
 * countries lines up with no extra maths in the shader.
 *
 * Channels:
 *   R — land (filled polygons). 1 on land, 0 over water.
 *   G — country borders and coastlines (stroked rings).
 */

const TEXTURE_WIDTH = 4096
const TEXTURE_HEIGHT = 2048
const LINE_WIDTH = 2.5

type Ring = number[][]
type Geometry =
  | { type: 'Polygon'; coordinates: Ring[] }
  | { type: 'MultiPolygon'; coordinates: Ring[][] }

interface Feature {
  geometry: Geometry | null
}

function project(lon: number, lat: number): [number, number] {
  return [
    ((lon + 180) / 360) * TEXTURE_WIDTH,
    ((90 - lat) / 180) * TEXTURE_HEIGHT,
  ]
}

function strokeRing(ctx: CanvasRenderingContext2D, ring: Ring) {
  let started = false
  let prevLon = 0

  for (const point of ring) {
    const [lon, lat] = point
    if (typeof lon !== 'number' || typeof lat !== 'number') continue

    const [x, y] = project(lon, lat)

    // A jump of more than half the globe means the ring crossed the
    // antimeridian. Drawing straight through would smear a horizontal line
    // across the whole texture, so lift the pen and restart on the far side.
    if (started && Math.abs(lon - prevLon) > 180) {
      ctx.moveTo(x, y)
    } else if (started) {
      ctx.lineTo(x, y)
    } else {
      ctx.moveTo(x, y)
      started = true
    }

    prevLon = lon
  }
}

/**
 * Unlike the stroke, a fill must keep every ring closed, so the pen never
 * lifts. The only antimeridian crossing in the dataset is Antarctica running
 * along the south pole from +180 to -180, which is exactly the bottom edge of
 * the texture — drawing straight through it closes the continent correctly.
 */
function traceRing(ctx: CanvasRenderingContext2D, ring: Ring) {
  let started = false
  for (const point of ring) {
    const [lon, lat] = point
    if (typeof lon !== 'number' || typeof lat !== 'number') continue
    const [x, y] = project(lon, lat)
    if (started) ctx.lineTo(x, y)
    else {
      ctx.moveTo(x, y)
      started = true
    }
  }
  ctx.closePath()
}

function forEachPolygon(features: Feature[], fn: (polygon: Ring[]) => void) {
  for (const feature of features) {
    const geometry = feature.geometry
    if (!geometry) continue
    if (geometry.type === 'Polygon') fn(geometry.coordinates)
    else if (geometry.type === 'MultiPolygon') geometry.coordinates.forEach(fn)
  }
}

function fillLand(ctx: CanvasRenderingContext2D, features: Feature[]) {
  ctx.fillStyle = '#ff0000'
  // One path per polygon so evenodd punches interior rings out as holes
  // (lakes, enclaves) without neighbouring countries cancelling each other.
  forEachPolygon(features, (polygon) => {
    ctx.beginPath()
    for (const ring of polygon) traceRing(ctx, ring)
    ctx.fill('evenodd')
  })
}

function strokeBorders(ctx: CanvasRenderingContext2D, features: Feature[]) {
  ctx.strokeStyle = '#00ff00'
  ctx.lineWidth = LINE_WIDTH
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  // Add into G without disturbing the land fill already sitting in R.
  ctx.globalCompositeOperation = 'lighter'

  ctx.beginPath()
  // Interior rings are holes, but for an outline every ring is a border.
  forEachPolygon(features, (polygon) => {
    for (const ring of polygon) strokeRing(ctx, ring)
  })
  ctx.stroke()

  ctx.globalCompositeOperation = 'source-over'
}

/**
 * Returns a texture immediately so the material never binds a null sampler.
 * It starts as all water and fills in once the GeoJSON has been fetched.
 */
export function createGeoTexture(url: string, maxAnisotropy = 1) {
  const canvas = document.createElement('canvas')
  canvas.width = TEXTURE_WIDTH
  canvas.height = TEXTURE_HEIGHT

  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT)
  }

  const texture = new THREE.CanvasTexture(canvas)
  // u wraps seamlessly around the equator; v must not, or the poles bleed.
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  texture.anisotropy = maxAnisotropy
  // A mask, not colour — leave it out of the sRGB transform.
  texture.colorSpace = THREE.NoColorSpace

  let disposed = false

  const ready = fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`${url} -> ${res.status}`)
      return res.json()
    })
    .then((geojson: { features?: Feature[] }) => {
      if (disposed || !ctx || !geojson.features) return
      fillLand(ctx, geojson.features)
      strokeBorders(ctx, geojson.features)
      texture.needsUpdate = true
    })
    .catch((err) => {
      console.error('[hero] failed to build globe mask', err)
    })

  return {
    texture,
    ready,
    dispose() {
      disposed = true
      texture.dispose()
    },
  }
}
