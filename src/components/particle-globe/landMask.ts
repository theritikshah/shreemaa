import type { FeatureCollection, Geometry, Position } from "geojson";

export type LandSampler = (lat: number, lng: number) => boolean;

const MASK_WIDTH = 2048;
const MASK_HEIGHT = 1024;

const lngToX = (lng: number) => ((lng + 180) / 360) * MASK_WIDTH;
const latToY = (lat: number) => ((90 - lat) / 180) * MASK_HEIGHT;

interface PreparedRing {
  points: Position[];
  /** Whole-world copies (in degrees) needed to cover the ±180° seam. */
  shifts: number[];
}

/**
 * Makes a ring drawable on a flat 360°-wide canvas.
 *
 * Longitudes are unwrapped so an edge never jumps across the antimeridian
 * (a naive draw turns those into bands spanning the whole map). A ring that
 * then extends past ±180° is also drawn one world-width over, so the part
 * beyond the seam lands on the other side.
 *
 * A ring whose unwrapped longitudes advance a full 360° encircles a pole
 * (Antarctica in Natural Earth). It has no interior on a flat map until it is
 * closed along that pole, and needs a copy either side to cover the width.
 */
function prepareRing(ring: Position[]): PreparedRing | null {
  if (ring.length < 3) return null;
  const points: Position[] = [[ring[0][0], ring[0][1]]];
  let prev = ring[0][0];
  let offset = 0;
  let minLng = prev;
  let maxLng = prev;
  let latSum = ring[0][1];
  for (let i = 1; i < ring.length; i++) {
    const raw = ring[i][0];
    const delta = raw - prev;
    if (delta > 180) offset -= 360;
    else if (delta < -180) offset += 360;
    prev = raw;
    const lng = raw + offset;
    points.push([lng, ring[i][1]]);
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
    latSum += ring[i][1];
  }

  const winding = points[points.length - 1][0] - points[0][0];
  if (Math.abs(winding) > 180) {
    const poleLat = latSum / ring.length < 0 ? -90 : 90;
    points.push([points[points.length - 1][0], poleLat], [points[0][0], poleLat]);
    return { points, shifts: [-360, 0, 360] };
  }

  const shifts = [0];
  if (minLng < -180) shifts.push(360);
  if (maxLng > 180) shifts.push(-360);
  return { points, shifts };
}

function drawGeometry(ctx: CanvasRenderingContext2D, geometry: Geometry | null) {
  if (!geometry) return;
  const polygons =
    geometry.type === "Polygon"
      ? [geometry.coordinates]
      : geometry.type === "MultiPolygon"
        ? geometry.coordinates
        : [];

  for (const polygon of polygons) {
    const rings = polygon.map(prepareRing).filter((r): r is PreparedRing => r !== null);
    if (rings.length === 0) continue;
    const shifts = new Set(rings.flatMap((r) => r.shifts));
    // One path per copy, holes included, filled even-odd so interior rings
    // cut out of their outer ring. Copies are filled separately so they can
    // never cancel each other where they meet.
    for (const shift of shifts) {
      ctx.beginPath();
      for (const { points } of rings) {
        for (let i = 0; i < points.length; i++) {
          const x = lngToX(points[i][0] + shift);
          const y = latToY(points[i][1]);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
      }
      ctx.fill("evenodd");
    }
  }
}

/**
 * Loads country polygons and rasterises them to an equirectangular land mask
 * (land white, ocean black), read back once into a byte buffer. The returned
 * sampler answers "is this coordinate land?" by pixel lookup.
 *
 * Returns null when the data is unusable or 2D canvas is unavailable. Rejects
 * with an AbortError if `signal` aborts.
 */
export async function loadLandSampler(url: string, signal: AbortSignal): Promise<LandSampler | null> {
  const response = await fetch(url, { signal });
  if (!response.ok) return null;
  const data = (await response.json()) as FeatureCollection | null;
  if (signal.aborted || !data || !Array.isArray(data.features)) return null;

  const canvas = document.createElement("canvas");
  canvas.width = MASK_WIDTH;
  canvas.height = MASK_HEIGHT;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, MASK_WIDTH, MASK_HEIGHT);
  ctx.fillStyle = "#fff";
  for (const feature of data.features) drawGeometry(ctx, feature.geometry);

  const pixels = ctx.getImageData(0, 0, MASK_WIDTH, MASK_HEIGHT).data;
  // Only the byte buffer is kept; release the canvas backing store now.
  canvas.width = 0;
  canvas.height = 0;

  return (lat, lng) => {
    const x = Math.min(MASK_WIDTH - 1, Math.max(0, Math.floor(lngToX(lng))));
    const y = Math.min(MASK_HEIGHT - 1, Math.max(0, Math.floor(latToY(lat))));
    return pixels[(y * MASK_WIDTH + x) * 4] > 127;
  };
}
