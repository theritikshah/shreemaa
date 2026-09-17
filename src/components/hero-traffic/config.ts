export type TrafficMode = "animated" | "static" | "disabled";
export type TrafficThemeName = "dark" | "light" | "reference";

export interface TrafficPalette {
  background: string;
  foreground: string;
  accent: string;
  gridOpacity: number;
  particleOpacity: number;
  /**
   * Opacity of the accent particles, separate from the rest. On a light ground
   * a saturated accent blended at the base particle opacity washes out toward
   * the background (red at 0.55 over cream reads as salmon), so it can be
   * drawn at full strength while the ink particles stay quiet.
   */
  accentOpacity: number;
  blending: "additive" | "normal";
  /** Alpha of the background colour at the outer edge of the radial vignette. */
  vignetteOpacity: number;
  /** Alpha of the background colour at the very bottom of the fade. */
  bottomFadeOpacity: number;
}

// `dark` and `light` follow the site's tokens: --ink (oklch 0.17 0.01 60) and
// --surface (oklch 0.985 0.008 75) as their grounds, so each sits seamlessly on
// a section using that token. `reference` keeps carcompany.care's own palette
// for comparison.
export const TRAFFIC_THEMES: Record<TrafficThemeName, TrafficPalette> = {
  dark: {
    background: "#130e0b",
    foreground: "#f7f6f3",
    accent: "#ff7a45",
    gridOpacity: 0.07,
    particleOpacity: 0.85,
    accentOpacity: 0.85,
    blending: "additive",
    vignetteOpacity: 0.6,
    bottomFadeOpacity: 0.82,
  },
  light: {
    background: "#fdf9f4",
    foreground: "#130e0b",
    accent: "#fe0000",
    gridOpacity: 0.09,
    particleOpacity: 0.55,
    accentOpacity: 1,
    blending: "normal",
    vignetteOpacity: 0.65,
    bottomFadeOpacity: 0.88,
  },
  reference: {
    background: "#0f0e10",
    foreground: "#f7f6f3",
    accent: "#e6674b",
    gridOpacity: 0.07,
    particleOpacity: 0.85,
    accentOpacity: 0.85,
    blending: "additive",
    vignetteOpacity: 0.6,
    bottomFadeOpacity: 0.82,
  },
};

export interface TrafficConfig extends TrafficPalette {
  mode: TrafficMode;
  /** Scales particle speed, floating and pointer tilt. 0 renders a static frame. */
  motionIntensity: number;
  /** Share of particles drawn in the accent colour. */
  accentRatio: number;
  /** Seed for the deterministic PRNG, so the opening composition is repeatable. */
  seed: number;
  particles: { desktop: number; mobile: number; size: number };
  camera: {
    fov: number;
    near: number;
    far: number;
    position: [number, number, number];
    /**
     * On narrow heroes the vertical FOV is widened until at least this much
     * horizontal FOV is visible, so the grid is reframed rather than stretched
     * or cropped to a few lanes. Capped by `maxFov`.
     */
    minHorizontalFov: number;
    maxFov: number;
  };
  world: {
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
    laneSpacing: number;
    gridY: number;
    particleY: number;
    tiltX: number;
  };
  fog: { near: number; far: number };
  motion: {
    speedMin: number;
    speedMax: number;
    lifeMin: number;
    lifeMax: number;
    /** Lane snap rate; the per-frame pull is min(1, dt × lanePull). */
    lanePull: number;
    flowTimeScale: number;
  };
  pointer: {
    yaw: number;
    pitch: number;
    /** Exponential damping rate per second, so smoothing is refresh-rate independent. */
    damping: number;
  };
  float: { amplitude: number; frequency: number };
  pixelRatio: { desktop: number; mobile: number };
  /** Hero widths below this use the mobile particle count and pixel-ratio cap. */
  mobileBreakpoint: number;
}

export const DEFAULT_TRAFFIC_CONFIG: TrafficConfig = {
  ...TRAFFIC_THEMES.dark,
  mode: "animated",
  motionIntensity: 1,
  accentRatio: 0.1,
  seed: 31,
  particles: { desktop: 1500, mobile: 700, size: 0.16 },
  camera: {
    fov: 42,
    near: 0.1,
    far: 120,
    position: [0, 7.5, 24],
    minHorizontalFov: 46,
    maxFov: 64,
  },
  world: {
    minX: -34,
    maxX: 34,
    minZ: -22,
    maxZ: 12,
    laneSpacing: 3.2,
    gridY: -1.25,
    particleY: -1.2,
    tiltX: -0.12,
  },
  fog: { near: 26, far: 60 },
  motion: {
    speedMin: 0.75,
    speedMax: 1.7,
    lifeMin: 18,
    lifeMax: 58,
    lanePull: 3.2,
    flowTimeScale: 2.1,
  },
  // The reference eases by 0.04 per frame; at 60 Hz that is a rate of
  // -ln(0.96) × 60 ≈ 2.45/s, which is what keeps it identical at 120 Hz.
  pointer: { yaw: 0.05, pitch: 0.03, damping: 2.45 },
  float: { amplitude: 0.2, frequency: 0.24 },
  pixelRatio: { desktop: 2, mobile: 1.5 },
  mobileBreakpoint: 768,
};

type Grouped = "particles" | "camera" | "world" | "fog" | "motion" | "pointer" | "float" | "pixelRatio";

export type TrafficConfigInput = Partial<Omit<TrafficConfig, Grouped>> & {
  /** Base palette; any colour or opacity passed alongside it wins. */
  theme?: TrafficThemeName;
} & { [K in Grouped]?: Partial<TrafficConfig[K]> };

export function resolveTrafficConfig(input: TrafficConfigInput = {}): TrafficConfig {
  const { theme, particles, camera, world, fog, motion, pointer, float, pixelRatio, ...flat } = input;
  return {
    ...DEFAULT_TRAFFIC_CONFIG,
    ...(theme ? TRAFFIC_THEMES[theme] : null),
    ...flat,
    particles: { ...DEFAULT_TRAFFIC_CONFIG.particles, ...particles },
    camera: { ...DEFAULT_TRAFFIC_CONFIG.camera, ...camera },
    world: { ...DEFAULT_TRAFFIC_CONFIG.world, ...world },
    fog: { ...DEFAULT_TRAFFIC_CONFIG.fog, ...fog },
    motion: { ...DEFAULT_TRAFFIC_CONFIG.motion, ...motion },
    pointer: { ...DEFAULT_TRAFFIC_CONFIG.pointer, ...pointer },
    float: { ...DEFAULT_TRAFFIC_CONFIG.float, ...float },
    pixelRatio: { ...DEFAULT_TRAFFIC_CONFIG.pixelRatio, ...pixelRatio },
  };
}

/** `#rgb` / `#rrggbb` → `"r g b"`, the channel form `rgb(var(--x) / a)` expects. */
export function hexToRgbChannels(hex: string): string {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.replace(/./g, (c) => c + c);
  const n = Number.parseInt(h, 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}
