/**
 * Shared configuration for the command hero: palette, scroll timeline and
 * the authored particle systems. Everything the sequence does is driven from
 * here, so tuning never means touching the engine or shaders.
 *
 * Units
 * - Timeline positions are in viewport heights (vh) of scroll into the section.
 * - Scene positions are in viewport heights measured from the viewport centre
 *   (y up). Flow-path x values are fractions of the viewport's half-width, so
 *   compositions reflow with aspect ratio instead of scaling uniformly.
 */

export interface CommandPalette {
  /** Diagonal background gradient, top-left → bottom-right. */
  gradient: [string, string, string];
  /** Solid background the scene fades into, behind the final heading. */
  endBackground: string;
  particle: string;
  /** Soft fill behind the settled rings. */
  fill: string;
  /** Broad brand glow, as the site's other dark sections carry. */
  glow: string;
  glowOpacity: number;
  /** Glow centre: x in half-widths, y in vh from the centre. */
  glowCentre: [number, number];
  /** Glow falloff radius, in vh. */
  glowRadius: number;
  text: string;
  mutedText: string;
}

/**
 * The site's dark-section look: warm near-black --ink (oklch 0.17 0.01 60)
 * with a --brand (#e11b22) glow, as `bg-ink` + `bg-brand/20 blur-3xl`
 * sections use elsewhere. The reference's charcoal-purple is
 * `REFERENCE_PALETTE` below.
 */
export const DEFAULT_PALETTE: CommandPalette = {
  gradient: ["#2b1c18", "#1a1210", "#130e0b"],
  endBackground: "#130e0b",
  particle: "#f3efe9",
  fill: "#e1675c",
  glow: "#e11b22",
  glowOpacity: 0.1,
  glowCentre: [-0.78, 0.46],
  glowRadius: 0.4,
  text: "#f7f6f3",
  mutedText: "rgba(247, 246, 243, 0.72)",
};

/** The reference's palette, for comparison. */
export const REFERENCE_PALETTE: CommandPalette = {
  ...DEFAULT_PALETTE,
  gradient: ["#37334D", "#242430", "#1E1E2A"],
  endBackground: "#16161f",
  particle: "#ecebf6",
  fill: "#8f89c4",
  glow: "#5b54a8",
  glowOpacity: 0.12,
  text: "#f4f3fa",
  mutedText: "rgba(236, 235, 246, 0.72)",
};

/** Scroll positions in viewport heights. `[start, end]` pairs are inclusive ranges. */
export interface CommandTimeline {
  /** Scroll length of the sequence; the section is 1 + total viewport heights tall. */
  total: number;
  /** Hero copy moves up 1:1 with scroll across this range. */
  copyExit: [number, number];
  /** Copy is made inert (not focusable) past this point. */
  copyInertAt: number;
  /** Graphics lift by `surfaceLift` viewport heights across this range. */
  surfaceShift: [number, number];
  surfaceLift: number;
  /** Flow → rings. */
  morph: [number, number];
  labelsIn: [number, number];
  labelsOut: [number, number];
  /** First label becomes current here; each then holds for `labelStep`. */
  labelStart: number;
  labelStep: number;
  /** Crossfade length between labels. */
  labelFade: number;
  /** Knockout zoom from inside a letter down to the readable heading. */
  mask: [number, number];
  /** Solid heading fades in over the knockout. */
  title: [number, number];
}

/**
 * Phase positions as a proportion of the sequence. `SEQUENCE_SCALE` stretches
 * the whole thing over more scroll without changing its shape, so every phase
 * — and the pin that holds the stage — grows together.
 */
const BASE_TIMELINE: CommandTimeline = {
  total: 2.25,
  copyExit: [0, 1.1],
  copyInertAt: 0.45,
  surfaceShift: [0, 0.75],
  surfaceLift: 0.5,
  morph: [0.1, 0.8],
  labelsIn: [0.62, 0.78],
  labelsOut: [1.28, 1.52],
  labelStart: 0.72,
  labelStep: 0.13,
  labelFade: 0.04,
  mask: [0.8, 1.85],
  title: [1.42, 1.85],
};

/** How much scroll the sequence takes, relative to the base shape above. */
export const SEQUENCE_SCALE = 1.45;

export const DESKTOP_TIMELINE: CommandTimeline = scaleTimeline(BASE_TIMELINE, SEQUENCE_SCALE);

/** Narrow screens run the same sequence a little shorter. */
export const MOBILE_TIMELINE: CommandTimeline = scaleTimeline(BASE_TIMELINE, SEQUENCE_SCALE * 0.85);

function scaleTimeline(t: CommandTimeline, k: number): CommandTimeline {
  const r = (v: [number, number]): [number, number] => [v[0] * k, v[1] * k];
  return {
    total: t.total * k,
    copyExit: r(t.copyExit),
    copyInertAt: t.copyInertAt * k,
    surfaceShift: r(t.surfaceShift),
    surfaceLift: t.surfaceLift,
    morph: r(t.morph),
    labelsIn: r(t.labelsIn),
    labelsOut: r(t.labelsOut),
    labelStart: t.labelStart * k,
    labelStep: t.labelStep * k,
    labelFade: t.labelFade * k,
    mask: r(t.mask),
    title: r(t.title),
  };
}

export type SystemKind = "band" | "spoke" | "outer" | "node";

export interface ParticleSystemConfig {
  kind: SystemKind;
  /** Circular trajectories in this system (rings in the settled state). */
  trajectories: number;
  /** Particles per trajectory on desktop; mobile uses `density.mobile` of this. */
  particlesPerTrajectory: number;
  /**
   * Flow path in the opening composition: [x, y] with x as a fraction of the
   * viewport's half-width and y in vh from the centre, as first seen.
   */
  flow: [number, number][];
  /** Spacing between neighbouring strands, in vh. */
  strandSpacing: number;
  /**
   * Target rings: height of the first ring and the step to each next ring (vh,
   * negative stacks downward), and radius scale. For spokes, `ringSpacing` is
   * the vertical extent from `ringY`.
   */
  ringY: number;
  ringSpacing: number;
  radiusScale: number;
  /** Noise and sine displacement while flowing, in vh. Settled rings keep `settledJitter`. */
  noise: number;
  sine: { amplitude: number; frequency: number; speed: number };
  settledJitter: number;
  /** Brightness pulse amplitude (0–1) and speed. */
  pulse: { amplitude: number; speed: number };
  /** Point size range in CSS px. */
  size: [number, number];
  opacity: number;
  /** Portion of the morph range this system converges over, as 0–1 fractions. */
  morphRange: [number, number];
  /** Seconds before this system starts fading in. */
  appearDelay: number;
  /** Relative depth variation along the flow, 0–1. */
  flowDepth: number;
}

export interface CommandSceneConfig {
  seed: number;
  /** Ring tilt about X, degrees. */
  tiltDeg: number;
  /** Base ring radius in vh, capped by `maxRadiusOfHalfWidth` × half-width. */
  radius: number;
  maxRadiusOfHalfWidth: number;
  /** Flow position along each path, in path-lengths per second. */
  flowRate: number;
  /** Samples stored per trajectory in the data texture. */
  samples: number;
  systems: ParticleSystemConfig[];
  /** Quiet ellipse behind the hero copy while flowing: half-sizes in half-width fractions / vh. */
  quietZone: [number, number];
  grain: number;
  fills: { opacity: number };
  pixelRatio: { desktop: number; mobile: number; low: number };
  density: { mobile: number; low: number };
  mobileBreakpoint: number;
  /** Vertical nudge for mobile flow paths, in vh (positive = up). */
  mobileFlowOffsetY: number;
}

// Two bands of closely stacked rings joined by spokes, a faint outer ring,
// and sparse bright nodes. In the opening they are five loose strand groups
// sweeping up across the lower half, with the nodes drifting above.
export const DEFAULT_SCENE: CommandSceneConfig = {
  seed: 20251,
  tiltDeg: 22.5,
  radius: 0.6,
  maxRadiusOfHalfWidth: 0.9,
  flowRate: 0.018,
  samples: 257,
  quietZone: [0.62, 0.2],
  grain: 0.045,
  fills: { opacity: 0.07 },
  pixelRatio: { desktop: 2, mobile: 1.5, low: 1 },
  density: { mobile: 0.5, low: 0.4 },
  mobileBreakpoint: 768,
  mobileFlowOffsetY: 0.02,
  systems: [
    {
      kind: "band",
      trajectories: 5,
      particlesPerTrajectory: 520,
      flow: [[-1.35, -0.2], [-0.7, -0.3], [-0.05, -0.28], [0.55, -0.16], [1.35, 0.02]],
      strandSpacing: 0.016,
      ringY: 0.1,
      ringSpacing: -0.014,
      radiusScale: 1,
      noise: 0.018,
      sine: { amplitude: 0.022, frequency: 2.2, speed: 0.35 },
      settledJitter: 0.0015,
      pulse: { amplitude: 0.35, speed: 1.3 },
      size: [1.3, 2.3],
      opacity: 0.9,
      morphRange: [0, 0.8],
      appearDelay: 0.2,
      flowDepth: 0.6,
    },
    {
      kind: "band",
      trajectories: 5,
      particlesPerTrajectory: 520,
      flow: [[-1.35, -0.42], [-0.6, -0.4], [0.05, -0.36], [0.7, -0.24], [1.35, -0.12]],
      strandSpacing: 0.017,
      ringY: -0.04,
      ringSpacing: -0.014,
      radiusScale: 1,
      noise: 0.02,
      sine: { amplitude: 0.026, frequency: 1.8, speed: 0.3 },
      settledJitter: 0.0015,
      pulse: { amplitude: 0.35, speed: 1.1 },
      size: [1.3, 2.3],
      opacity: 0.9,
      morphRange: [0.1, 0.9],
      appearDelay: 0.55,
      flowDepth: 0.6,
    },
    {
      kind: "spoke",
      trajectories: 1,
      particlesPerTrajectory: 420,
      flow: [[-1.35, -0.31], [-0.65, -0.35], [0, -0.32], [0.62, -0.2], [1.35, -0.05]],
      strandSpacing: 0.05,
      // From the lowest ring of the upper band down to the top of the lower band.
      ringY: 0.1 - 4 * 0.014,
      ringSpacing: -0.04 - (0.1 - 4 * 0.014),
      radiusScale: 1,
      noise: 0.03,
      sine: { amplitude: 0.02, frequency: 2.6, speed: 0.4 },
      settledJitter: 0.001,
      pulse: { amplitude: 0.2, speed: 1.7 },
      size: [1, 1.6],
      opacity: 0.55,
      morphRange: [0.3, 1],
      appearDelay: 0.9,
      flowDepth: 0.5,
    },
    {
      kind: "outer",
      trajectories: 2,
      particlesPerTrajectory: 520,
      flow: [[-1.35, -0.55], [-0.5, -0.5], [0.2, -0.45], [0.8, -0.34], [1.35, -0.26]],
      strandSpacing: 0.03,
      ringY: -0.2,
      ringSpacing: -0.012,
      radiusScale: 1.16,
      noise: 0.03,
      sine: { amplitude: 0.03, frequency: 1.3, speed: 0.25 },
      settledJitter: 0.002,
      pulse: { amplitude: 0.3, speed: 0.9 },
      size: [1, 1.7],
      opacity: 0.38,
      morphRange: [0.2, 1],
      appearDelay: 1.1,
      flowDepth: 0.8,
    },
    {
      kind: "node",
      trajectories: 3,
      particlesPerTrajectory: 190,
      flow: [[-1.35, 0.32], [-0.55, 0.14], [0.2, 0.26], [0.8, 0.1], [1.35, 0.2]],
      strandSpacing: 0.13,
      ringY: 0.1,
      ringSpacing: -0.07,
      radiusScale: 1,
      noise: 0.09,
      sine: { amplitude: 0.05, frequency: 1.1, speed: 0.2 },
      settledJitter: 0.001,
      pulse: { amplitude: 0.45, speed: 0.8 },
      size: [2, 3.1],
      opacity: 0.95,
      morphRange: [0.15, 0.95],
      appearDelay: 0,
      flowDepth: 1,
    },
  ],
};

export interface CommandCopy {
  /** Short actions shown over the settled rings, one at a time. */
  labels: string[];
  /** Accessible description of the label sequence, read once. */
  labelsDescription: string;
  /** Final heading as spoken; the visual is generated in knockoutPaths.ts. */
  heading: string;
}

export const MARKETPLACE_COPY: CommandCopy = {
  labels: ["List products", "Run ads", "Plan inventory", "Ship orders", "Handle returns"],
  labelsDescription:
    "We list products, run ads, plan inventory, ship orders and handle returns across every marketplace.",
  heading: "Every marketplace, one team.",
};
