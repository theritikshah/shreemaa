import type { GlobeLocation } from "./config";

/**
 * Pure geometry for the particle globe: no Three.js and no DOM, so it can be
 * checked in isolation. Everything is written straight into typed arrays that
 * become GPU attributes once and are never rebuilt; motion happens in shaders.
 */

export type Vec3 = [number, number, number];

const DEG = Math.PI / 180;

/**
 * Geographic → unit-sphere position. With the camera looking down −z, north
 * is +y and east runs left-to-right across the front of the globe.
 */
export function latLngToVector(lat: number, lng: number, radius = 1): Vec3 {
  const phi = lat * DEG;
  const lambda = lng * DEG;
  return [
    radius * Math.cos(phi) * Math.cos(lambda),
    radius * Math.sin(phi),
    -radius * Math.cos(phi) * Math.sin(lambda),
  ];
}

/** Inverse of `latLngToVector` for a unit vector, in degrees. */
export function vectorToLatLng(x: number, y: number, z: number): { lat: number; lng: number } {
  return {
    lat: Math.asin(Math.max(-1, Math.min(1, y))) / DEG,
    lng: Math.atan2(-z, x) / DEG,
  };
}

/** Small seeded PRNG, so the composition is identical on every load. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Rotation about Y that brings `longitude` to the front of the globe (+z,
 * facing the camera). Mirrors `rotateGlobe` in the shaders.
 */
export function spinForLongitude(longitude: number): number {
  const [x, , z] = latLngToVector(0, longitude);
  return -Math.atan2(x, z);
}

export interface ArcSpec {
  a: Vec3;
  b: Vec3;
  /** Great-circle angle between the endpoints, radians. */
  angle: number;
  sinAngle: number;
  /** Phase offset of this arc's light cycle, 0–1. */
  offset: number;
  /** Light cycles per second. */
  frequency: number;
  accent: boolean;
}

/** Below this the endpoints are treated as the same place and no arc is drawn. */
const MIN_ARC_ANGLE = 0.02;
/** Below this sin(angle) the endpoints are nearly antipodal and slerp is unstable. */
const MIN_ARC_SIN = 1e-3;

function normalize(v: Vec3): Vec3 {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

/**
 * Describes one arc, or returns null for coincident endpoints. Nearly
 * antipodal endpoints have infinitely many great circles between them, so the
 * destination is nudged a hair off antipodal to pick one deterministically —
 * the shaders then never divide by a vanishing sine.
 */
export function createArcSpec(
  from: Vec3,
  to: Vec3,
  cycleSeconds: number,
  offset: number,
  accent = false,
): ArcSpec | null {
  const a = normalize(from);
  let b = normalize(to);
  let dot = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  let angle = Math.acos(dot);
  if (angle < MIN_ARC_ANGLE) return null;

  if (Math.sin(angle) < MIN_ARC_SIN) {
    let perp = cross(a, [0, 1, 0]);
    if (Math.hypot(perp[0], perp[1], perp[2]) < 1e-3) perp = cross(a, [1, 0, 0]);
    perp = normalize(perp);
    b = normalize([b[0] + perp[0] * 0.02, b[1] + perp[1] * 0.02, b[2] + perp[2] * 0.02]);
    dot = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
    angle = Math.acos(dot);
  }

  return { a, b, angle, sinAngle: Math.sin(angle), offset, frequency: 1 / cycleSeconds, accent };
}

export interface ArcBuffers {
  /** LineSegments vertex pairs, lifted off the surface. */
  position: Float32Array;
  /** Path progress 0 (origin) → 1 (destination) per vertex. */
  progress: Float32Array;
  offset: Float32Array;
  frequency: Float32Array;
}

/**
 * Batches arcs into one LineSegments buffer. Each arc is a slerp between its
 * endpoints, raised by `1 + height × sin(π t)` so it lifts off the surface and
 * lands back on it; longer arcs get more segments.
 */
export function buildArcBuffers(arcs: ArcSpec[], height: number): ArcBuffers {
  let segmentTotal = 0;
  const segmentCounts = arcs.map((arc) => {
    const n = Math.max(32, Math.round(64 * arc.angle));
    segmentTotal += n - 1;
    return n;
  });

  const position = new Float32Array(segmentTotal * 6);
  const progress = new Float32Array(segmentTotal * 2);
  const offset = new Float32Array(segmentTotal * 2);
  const frequency = new Float32Array(segmentTotal * 2);

  let seg = 0;
  arcs.forEach((arc, index) => {
    const n = segmentCounts[index];
    const { a, b, angle, sinAngle } = arc;
    let px = 0;
    let py = 0;
    let pz = 0;
    let pt = 0;
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      const wa = Math.sin((1 - t) * angle) / sinAngle;
      const wb = Math.sin(t * angle) / sinAngle;
      const lift = 1 + height * Math.sin(Math.PI * t);
      const x = (a[0] * wa + b[0] * wb) * lift;
      const y = (a[1] * wa + b[1] * wb) * lift;
      const z = (a[2] * wa + b[2] * wb) * lift;
      if (i > 0) {
        position.set([px, py, pz, x, y, z], seg * 6);
        progress[seg * 2] = pt;
        progress[seg * 2 + 1] = t;
        offset[seg * 2] = offset[seg * 2 + 1] = arc.offset;
        frequency[seg * 2] = frequency[seg * 2 + 1] = arc.frequency;
        seg++;
      }
      px = x;
      py = y;
      pz = z;
      pt = t;
    }
  });

  return { position, progress, offset, frequency };
}

/**
 * Describes the visible frustum when the particles are built, so scattered
 * start positions can be placed just beyond the canvas edges in world space.
 * The globe sits at the origin; the camera looks down −z from `cameraZ` with
 * a lens shift that puts the globe's centre at (`centerNdcX`, `centerNdcY`).
 */
export interface ScatterFrame {
  aspect: number;
  cameraZ: number;
  tanHalfFov: number;
  centerNdcX: number;
  centerNdcY: number;
}

export interface ParticleBuffers {
  /** Target position on the unit sphere (or an arc's origin, for packets). */
  position: Float32Array;
  /** Scattered start in world space (or an arc's destination, for packets). */
  scatter: Float32Array;
  /** Assembly delay in progress units (or light cycles per second, for packets). */
  delay: Float32Array;
  size: Float32Array;
  phase: Float32Array;
  accent: Float32Array;
  /** −1 for globe particles; an arc's cycle offset (≥ 0) for its light packet. */
  arcT: Float32Array;
  count: number;
  landCount: number;
}

export interface BuildParticlesOptions {
  isLand: (lat: number, lng: number) => boolean;
  candidates: number;
  random: () => number;
  frame: ScatterFrame;
  locations: GlobeLocation[];
  arcs: ArcSpec[];
  /** Extra accent markers, such as a supplied visitor coordinate. */
  extraMarkers?: Vec3[];
}

/**
 * Samples a Fibonacci sphere, keeps the points that fall on land, and appends
 * location markers and one light packet per arc. Each gets a scattered start
 * position outside the visible canvas for the assembly flight.
 */
export function buildParticleBuffers({
  isLand,
  candidates,
  random,
  frame,
  locations,
  arcs,
  extraMarkers = [],
}: BuildParticlesOptions): ParticleBuffers {
  const capacity = candidates + locations.length + extraMarkers.length + arcs.length;
  const position = new Float32Array(capacity * 3);
  const scatter = new Float32Array(capacity * 3);
  const delay = new Float32Array(capacity);
  const size = new Float32Array(capacity);
  const phase = new Float32Array(capacity);
  const accent = new Float32Array(capacity);
  const arcT = new Float32Array(capacity);
  let count = 0;

  const { aspect, cameraZ, tanHalfFov, centerNdcX, centerNdcY } = frame;

  // A start point just past a random canvas edge, at a random depth around
  // the globe, expressed in world space so it stays fixed while the globe's
  // targets rotate underneath it.
  const writeScatter = (i: number) => {
    const along = random() * 2 - 1;
    const beyond = 1.06 + random() * 0.28;
    let ndcX: number;
    let ndcY: number;
    if (random() < aspect / (aspect + 1)) {
      ndcX = along * beyond;
      ndcY = random() < 0.5 ? beyond : -beyond;
    } else {
      ndcX = random() < 0.5 ? beyond : -beyond;
      ndcY = along * beyond;
    }
    const depth = Math.max(0.3, cameraZ - 1.2 + random() * 2.8);
    const halfHeight = depth * tanHalfFov;
    scatter[i * 3] = (ndcX - centerNdcX) * halfHeight * aspect;
    scatter[i * 3 + 1] = (ndcY - centerNdcY) * halfHeight;
    scatter[i * 3 + 2] = cameraZ - depth;
  };

  const push = (p: Vec3, d: number, s: number, acc: number, t: number) => {
    position[count * 3] = p[0];
    position[count * 3 + 1] = p[1];
    position[count * 3 + 2] = p[2];
    delay[count] = d;
    size[count] = s;
    phase[count] = random();
    accent[count] = acc;
    arcT[count] = t;
    count++;
  };

  // Delays sweep west → east with jitter; the latest particle starts at
  // progress 0.55 and, with a 0.45 flight, lands exactly at progress 1.
  const sweepDelay = (lng: number) => ((lng + 180) / 360) * 0.33 + random() * 0.22;

  const golden = Math.PI * (3 - Math.sqrt(5));
  const denominator = Math.max(1, candidates - 1);
  for (let i = 0; i < candidates; i++) {
    const y = 1 - (i / denominator) * 2;
    const ring = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    const x = Math.cos(theta) * ring;
    const z = Math.sin(theta) * ring;
    const { lat, lng } = vectorToLatLng(x, y, z);
    if (!isLand(lat, lng)) continue;
    writeScatter(count);
    push([x, y, z], sweepDelay(lng), 0.008 + random() * 0.005, 0, -1);
  }
  const landCount = count;

  for (const location of locations) {
    writeScatter(count);
    const target = latLngToVector(location.lat, location.lng);
    // Accent 1 = hub (accent colour, pulsing); 0.5 = destination (accent colour, steady).
    if (location.hub) push(target, 0.05, 0.02, 1, -1);
    else push(target, sweepDelay(location.lng), 0.013, 0.5, -1);
  }

  for (const marker of extraMarkers) {
    writeScatter(count);
    push(normalize(marker), 0.4, 0.014, 1, -1);
  }

  // Packets reuse the same attributes: origin in `position`, destination in
  // `scatter`, frequency in `delay` and cycle offset in `arcT`.
  for (const arc of arcs) {
    scatter.set(arc.b, count * 3);
    push(arc.a, arc.frequency, 0.012, 1, arc.offset);
  }

  return {
    position: position.slice(0, count * 3),
    scatter: scatter.slice(0, count * 3),
    delay: delay.slice(0, count),
    size: size.slice(0, count),
    phase: phase.slice(0, count),
    accent: accent.slice(0, count),
    arcT: arcT.slice(0, count),
    count,
    landCount,
  };
}
