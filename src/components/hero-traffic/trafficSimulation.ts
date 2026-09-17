/*
 * The traffic field's motion, with no Three.js or DOM in it, so it can be
 * reasoned about and tested on its own. After carcompany.care's hero scene.
 *
 * Particles ride a smooth, time-varying wind whose heading is rounded to the
 * nearest of four directions, then eased onto the nearest lane, so drift reads
 * as traffic turning a corner.
 */
import type { TrafficConfig } from "./config";

/* ── The wind ──
   Velocity is the curl of a scalar potential ψ, so the field is divergence-free
   before quantization. Constants are the reference's. */
const A1 = 3.2;
const A2 = 2.2;
const A3 = 1.6;
const KP = 0.1;
const KR = 0.13;
const KS = 0.075;
const KU = 0.055;
const QUARTER = Math.PI / 2;

// Unit vectors for the four quantized headings (+x, +z, -x, -z). A lookup
// rather than cos/sin of a rounded angle: exact, and no work per particle.
export const DIR_X = new Int8Array([1, 0, -1, 0]);
export const DIR_Z = new Int8Array([0, 1, 0, -1]);

/** Index into DIR_X/DIR_Z of the wind's heading at (x, z), rounded to 90°. */
export function headingIndex(x: number, z: number, t: number): number {
  const px = KP * x + 0.22 * t;
  const pz = KR * z - 0.18 * t;
  const p2 = KS * (x + 0.6 * z) + 0.15 * t;
  const p3 = KU * (x - 0.8 * z) - 0.11 * t;
  const dPsiDz =
    -A1 * KR * Math.sin(px) * Math.sin(pz) + A2 * KS * 0.6 * Math.cos(p2) + A3 * KU * 0.8 * Math.sin(p3);
  const dPsiDx = A1 * KP * Math.cos(px) * Math.cos(pz) + A2 * KS * Math.cos(p2) - A3 * KU * Math.sin(p3);
  // v = (∂ψ/∂z, -∂ψ/∂x). Only the heading matters, so the reference's speed
  // scale on v is dropped.
  const quarterTurns = Math.round(Math.atan2(-dPsiDx, dPsiDz) / QUARTER);
  return ((quarterTurns % 4) + 4) % 4;
}

/** Deterministic PRNG, so the field looks composed rather than random. */
export function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface TrafficSimulation {
  readonly capacity: number;
  readonly px: Float32Array;
  readonly pz: Float32Array;
  /** 1 where a particle is drawn in the accent colour. */
  readonly accent: Uint8Array;
  /** Advance the first `activeCount` particles by `dt` seconds at time `t`. */
  step(dt: number, t: number, activeCount: number, intensity: number): void;
  /** Put every particle exactly on its lane, for a composed still frame. */
  settle(t: number): void;
}

type SimulationConfig = Pick<TrafficConfig, "seed" | "accentRatio" | "world" | "motion">;

export function createTrafficSimulation(config: SimulationConfig, capacity: number): TrafficSimulation {
  const { world: W, motion: M } = config;
  const lane = W.laneSpacing;
  const px = new Float32Array(capacity);
  const pz = new Float32Array(capacity);
  const speed = new Float32Array(capacity);
  const life = new Float32Array(capacity);
  const accent = new Uint8Array(capacity);
  const rand = mulberry32(config.seed);

  // Quantized headings stop the flow being incompressible, so traffic would
  // slowly pool into a few lanes; a finite life keeps the spread even.
  const reseed = (k: number) => {
    px[k] = W.minX + rand() * (W.maxX - W.minX);
    pz[k] = W.minZ + rand() * (W.maxZ - W.minZ);
    speed[k] = M.speedMin + rand() * (M.speedMax - M.speedMin);
    life[k] = M.lifeMin + rand() * (M.lifeMax - M.lifeMin);
  };

  // Same draw order as the reference, so a given seed composes identically.
  for (let k = 0; k < capacity; k++) {
    reseed(k);
    accent[k] = rand() < config.accentRatio ? 1 : 0;
  }

  return {
    capacity,
    px,
    pz,
    accent,

    step(dt, t, activeCount, intensity) {
      const pull = Math.min(1, dt * M.lanePull);
      const windT = t * M.flowTimeScale;
      const travel = dt * intensity;
      const n = Math.min(activeCount, capacity);

      for (let k = 0; k < n; k++) {
        life[k] -= dt;
        if (life[k] <= 0) reseed(k);

        const d = headingIndex(px[k], pz[k], windT);
        const dx = DIR_X[d];
        px[k] += dx * speed[k] * travel;
        pz[k] += DIR_Z[d] * speed[k] * travel;

        // Ease the coordinate across the direction of travel onto its lane.
        if (dx !== 0) pz[k] += (Math.round(pz[k] / lane) * lane - pz[k]) * pull;
        else px[k] += (Math.round(px[k] / lane) * lane - px[k]) * pull;

        if (px[k] > W.maxX) px[k] = W.minX;
        else if (px[k] < W.minX) px[k] = W.maxX;
        if (pz[k] > W.maxZ) pz[k] = W.minZ;
        else if (pz[k] < W.minZ) pz[k] = W.maxZ;
      }
    },

    settle(t) {
      const windT = t * M.flowTimeScale;
      for (let k = 0; k < capacity; k++) {
        if (DIR_X[headingIndex(px[k], pz[k], windT)] !== 0) pz[k] = Math.round(pz[k] / lane) * lane;
        else px[k] = Math.round(px[k] / lane) * lane;
      }
    },
  };
}
