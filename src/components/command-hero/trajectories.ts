import type { CommandSceneConfig, ParticleSystemConfig, SystemKind } from "./config";

/**
 * Pure trajectory and particle generation: no Three.js, no DOM. The engine
 * uploads these arrays once; all motion happens in the vertex shader.
 *
 * Every particle belongs to one trajectory. While flowing it rides that
 * trajectory's authored path (a row of the data texture); once settled it
 * rides the matching circle. Its position along both is the same `u`, so a
 * particle keeps its identity through the whole transformation.
 */

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

export const KIND_INDEX: Record<SystemKind, number> = { band: 0, spoke: 1, outer: 2, node: 3 };

/** Spokes sit at this many evenly spaced angles around the rings. */
export const SPOKE_COUNT = 56;

export interface TrajectoryTexture {
  /** RGBA float texels: x, y (vh, pre-lift world space), depth (−1…1), unused. */
  data: Float32Array;
  width: number;
  height: number;
}

export interface ParticleAttributes {
  /** Base position along the trajectory, 0–1. */
  u: Float32Array;
  /** Data-texture row of the trajectory. */
  row: Float32Array;
  system: Float32Array;
  /** Ring index within the system (or 0–1 height along a spoke). */
  ring: Float32Array;
  /** Noise seed, pulse offset, size mix — each 0–1. */
  seed: Float32Array;
  count: number;
}

export interface SceneLayout {
  /** Viewport width / height. */
  aspect: number;
  mobile: boolean;
  /** Density multiplier applied to every system. */
  density: number;
}

type Point = [number, number];

function catmullRom(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
  const t2 = t * t;
  const t3 = t2 * t;
  const f = (a: number, b: number, c: number, d: number) =>
    0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
  return [f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])];
}

/** Dense polyline through the control points (endpoints clamped). */
function densePath(points: Point[], stepsPerSegment = 160): Point[] {
  const out: Point[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    for (let s = 0; s < stepsPerSegment; s++) out.push(catmullRom(p0, p1, p2, p3, s / stepsPerSegment));
  }
  out.push(points[points.length - 1]);
  return out;
}

/** Offsets a polyline sideways by `distance` along its local normal. */
function offsetPath(path: Point[], distance: number): Point[] {
  if (distance === 0) return path;
  return path.map((p, i) => {
    const a = path[Math.max(0, i - 1)];
    const b = path[Math.min(path.length - 1, i + 1)];
    const tx = b[0] - a[0];
    const ty = b[1] - a[1];
    const len = Math.hypot(tx, ty) || 1;
    return [p[0] - (ty / len) * distance, p[1] + (tx / len) * distance];
  });
}

/**
 * Resamples a polyline at `count` points evenly spaced by arc length, so a
 * constant rate along `u` is a constant speed along the path.
 */
export function resampleByArcLength(path: Point[], count: number): Point[] {
  const cumulative = new Float64Array(path.length);
  for (let i = 1; i < path.length; i++) {
    cumulative[i] = cumulative[i - 1] + Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]);
  }
  const total = cumulative[path.length - 1];
  const out: Point[] = [];
  let seg = 1;
  for (let i = 0; i < count; i++) {
    const target = (i / (count - 1)) * total;
    while (seg < path.length - 1 && cumulative[seg] < target) seg++;
    const span = cumulative[seg] - cumulative[seg - 1] || 1;
    const t = Math.min(1, Math.max(0, (target - cumulative[seg - 1]) / span));
    out.push([
      path[seg - 1][0] + (path[seg][0] - path[seg - 1][0]) * t,
      path[seg - 1][1] + (path[seg][1] - path[seg - 1][1]) * t,
    ]);
  }
  return out;
}

/** Rows in the data texture: one per trajectory, systems in order. */
export function trajectoryRowCount(config: CommandSceneConfig): number {
  return config.systems.reduce((n, s) => n + s.trajectories, 0);
}

/**
 * Samples every trajectory's flow path for the current aspect ratio. Only the
 * texture depends on aspect, so a resize refreshes this without touching the
 * particle buffers.
 */
export function buildTrajectoryTexture(config: CommandSceneConfig, layout: SceneLayout, lift: number): TrajectoryTexture {
  const width = config.samples;
  const height = trajectoryRowCount(config);
  const data = new Float32Array(width * height * 4);
  const halfWidth = layout.aspect / 2;
  const offsetY = layout.mobile ? config.mobileFlowOffsetY : 0;

  let row = 0;
  config.systems.forEach((system, systemIndex) => {
    // Opening composition → world space: x from half-width fractions, and y
    // lifted, because the graphics start `lift` viewport heights lower.
    const control: Point[] = system.flow.map(([fx, fy]) => [fx * halfWidth, fy + offsetY + lift]);
    const centreline = densePath(control);
    for (let k = 0; k < system.trajectories; k++) {
      const offset = (k - (system.trajectories - 1) / 2) * system.strandSpacing;
      const samples = resampleByArcLength(offsetPath(centreline, offset), width);
      for (let i = 0; i < width; i++) {
        const o = (row * width + i) * 4;
        const s = i / (width - 1);
        data[o] = samples[i][0];
        data[o + 1] = samples[i][1];
        data[o + 2] = system.flowDepth * Math.sin(Math.PI * 2 * (s * 0.85 + k * 0.07 + systemIndex * 0.19));
        data[o + 3] = 0;
      }
      row++;
    }
  });

  return { data, width, height };
}

export function particlesForSystem(system: ParticleSystemConfig, density: number): number {
  return Math.max(1, Math.round(system.particlesPerTrajectory * density));
}

/** Per-particle attributes. Depends on density only, never on aspect ratio. */
export function buildParticleAttributes(config: CommandSceneConfig, density: number): ParticleAttributes {
  const random = mulberry32(config.seed);
  const count = config.systems.reduce((n, s) => n + s.trajectories * particlesForSystem(s, density), 0);
  const u = new Float32Array(count);
  const row = new Float32Array(count);
  const system = new Float32Array(count);
  const ring = new Float32Array(count);
  const seed = new Float32Array(count * 3);

  let i = 0;
  let rowIndex = 0;
  config.systems.forEach((s, systemIndex) => {
    const perTrajectory = particlesForSystem(s, density);
    for (let k = 0; k < s.trajectories; k++) {
      for (let p = 0; p < perTrajectory; p++) {
        if (s.kind === "spoke") {
          // Spoke particles share a handful of angles and spread vertically
          // between the two bands.
          u[i] = Math.floor(random() * SPOKE_COUNT) / SPOKE_COUNT;
          ring[i] = random();
        } else {
          // Even spacing with a little jitter reads as a dotted line once settled.
          u[i] = (p + random() * 0.35) / perTrajectory;
          ring[i] = k;
        }
        row[i] = rowIndex;
        system[i] = systemIndex;
        seed[i * 3] = random();
        seed[i * 3 + 1] = random();
        seed[i * 3 + 2] = random();
        i++;
      }
      rowIndex++;
    }
  });

  return { u, row, system, ring, seed, count };
}

/**
 * Per-system parameters, packed as four vec4 uniform arrays so the shader can
 * index them by system without per-particle copies.
 */
export function packSystemUniforms(config: CommandSceneConfig): Float32Array[] {
  const n = config.systems.length;
  const a = new Float32Array(n * 4);
  const b = new Float32Array(n * 4);
  const c = new Float32Array(n * 4);
  const d = new Float32Array(n * 4);
  config.systems.forEach((s, i) => {
    a.set([s.ringY, s.ringSpacing, s.radiusScale, s.settledJitter], i * 4);
    b.set([s.noise, s.sine.amplitude, s.sine.frequency, s.sine.speed], i * 4);
    c.set([s.pulse.amplitude, s.pulse.speed, s.opacity, s.appearDelay], i * 4);
    d.set([s.morphRange[0], s.morphRange[1], KIND_INDEX[s.kind], s.strandSpacing], i * 4);
  });
  return [a, b, c, d];
}

export function sizeRanges(config: CommandSceneConfig): Float32Array {
  const out = new Float32Array(config.systems.length * 2);
  config.systems.forEach((s, i) => out.set(s.size, i * 2));
  return out;
}
