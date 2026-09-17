export type GlobeMode = "animated" | "static" | "disabled";
export type GlobeThemeName = "dark" | "light";
/** `auto` picks `low` on devices that report very limited cores or memory, or Save-Data. */
export type GlobeQuality = "auto" | "high" | "low";
/**
 * `none` keeps the canvas fully non-interactive. `drag` lets presses on the
 * globe itself rotate it; the hero's content must let pointer events through
 * wherever it overlaps the globe.
 */
export type GlobeInteraction = "none" | "drag";

export interface GlobeLocation {
  id: string;
  lat: number;
  lng: number;
  label?: string;
  /** Hubs get a slightly larger, gently pulsing accent marker. */
  hub?: boolean;
}

export interface GlobeConnection {
  /** Location ids. Connections naming an unknown id are skipped. */
  from: string;
  to: string;
}

export interface GlobeVisitor {
  lat: number;
  lng: number;
  label?: string;
}

export interface GlobePalette {
  background: string;
  particleColor: string;
  accentColor: string;
  arcColor: string;
  glowColor: string;
  /** Overall alpha of the continent particles. */
  particleOpacity: number;
  /** Resting alpha of the connection arcs, before front/back dimming. */
  arcOpacity: number;
  /** Extra alpha a travelling light adds to the arc it runs along. */
  packetOpacity: number;
  /** Peak alpha of the rim glow. */
  glowIntensity: number;
  /** Additive reads as luminous on dark grounds; light grounds need normal blending for contrast. */
  blending: "additive" | "normal";
  /** Alpha of the background colour at the outer edge of the edge vignette. */
  vignetteOpacity: number;
}

// Colours follow the site's tokens: --ink (oklch 0.17 0.01 60 ≈ #130e0b) and
// the warm off-white surface, with --brand (#e11b22) / --brand-2 (#ff4d4d) as
// the accent. The reference globe uses #F0F0F8 particles and a #E4007C accent.
export const GLOBE_THEMES: Record<GlobeThemeName, GlobePalette> = {
  dark: {
    background: "#130e0b",
    particleColor: "#f3efe9",
    accentColor: "#ff4d4d",
    arcColor: "#f3efe9",
    glowColor: "#f3efe9",
    particleOpacity: 1,
    arcOpacity: 0.26,
    packetOpacity: 0.42,
    glowIntensity: 0.24,
    blending: "additive",
    vignetteOpacity: 0.7,
  },
  light: {
    background: "#faf6f1",
    particleColor: "#130e0b",
    accentColor: "#e11b22",
    arcColor: "#130e0b",
    glowColor: "#130e0b",
    particleOpacity: 0.62,
    arcOpacity: 0.2,
    packetOpacity: 0.5,
    glowIntensity: 0.07,
    blending: "normal",
    vignetteOpacity: 0.75,
  },
};

/**
 * Where the globe sits in the hero. `x` and `y` place its centre as fractions
 * of the hero's width and height. Its diameter is the smallest of
 * `heightFraction × height`, `widthFraction × width` and `maxDiameter` px, so
 * it never outgrows either axis. Arcs rise to 1 + arcHeight radii, so the
 * fractions leave room for them.
 */
export interface GlobeLayout {
  x: number;
  y: number;
  heightFraction: number;
  widthFraction: number;
  maxDiameter: number;
}

export interface GlobeConfig extends GlobePalette {
  mode: GlobeMode;
  quality: GlobeQuality;
  interaction: GlobeInteraction;
  /** Scales breathing, twinkle, pulsing, rotation and pointer tilt. 0 is fully still. */
  motionIntensity: number;
  seed: number;
  /**
   * Fibonacci-sphere samples tested against the land mask. These are
   * candidates before ocean points are dropped; roughly 30% survive.
   */
  density: { desktop: number; mobile: number; low: number };
  layout: { desktop: GlobeLayout; mobile: GlobeLayout };
  /** Longitude facing the viewer when the globe first forms. */
  focusLongitude: number;
  /** Forward tilt in radians; positive shows more of the northern hemisphere. */
  tilt: number;
  /** Radians per second. */
  rotationSpeed: number;
  assembly: {
    /** Seconds for the continents to form. */
    duration: number;
    /** Camera starts this many times further back and settles in. */
    cameraStart: number;
    /** Seconds for the camera settle. */
    cameraDuration: number;
  };
  arcs: {
    /** Peak lift above the surface, in globe radii. */
    height: number;
    revealStart: number;
    revealDuration: number;
    /** Each connection's own light cycle is picked from this range, in seconds. */
    cycleMin: number;
    cycleMax: number;
    /** Share of a cycle spent travelling; the rest is a quiet interval. */
    tripFraction: number;
  };
  pointer: {
    enabled: boolean;
    /** Max yaw / pitch in radians at the hero's edges. */
    yaw: number;
    pitch: number;
    /** Exponential damping rate per second. */
    damping: number;
  };
  pixelRatio: { desktop: number; mobile: number; low: number };
  /** Hero widths below this use the mobile layout, particle count and pixel-ratio cap. */
  mobileBreakpoint: number;
  locations: GlobeLocation[];
  connections: GlobeConnection[];
  /**
   * Optional highlighted connection from `visitorHub` to a supplied
   * coordinate. Nothing here requests location: pass a coordinate you
   * already have, with the visitor's consent.
   */
  visitor: GlobeVisitor | null;
  visitorHub: string | null;
  /** Resting alpha of the visitor arc, drawn in the accent colour. */
  visitorArcOpacity: number;
  geoDataUrl: string;
}

/**
 * Example network for the Rio World hero. The hub is SMG's Gurugram office;
 * the other points are illustrative export destinations matching the page's
 * copy (Asia, the Middle East, Europe and beyond). They are not a list of
 * offices, partners or confirmed routes — replace them with real data.
 */
export const EXAMPLE_TRADE_LOCATIONS: GlobeLocation[] = [
  { id: "gurugram", lat: 28.4595, lng: 77.0266, label: "Gurugram", hub: true },
  { id: "dubai", lat: 25.2048, lng: 55.2708, label: "Dubai" },
  { id: "riyadh", lat: 24.7136, lng: 46.6753, label: "Riyadh" },
  { id: "istanbul", lat: 41.0082, lng: 28.9784, label: "Istanbul" },
  { id: "london", lat: 51.5074, lng: -0.1278, label: "London" },
  { id: "rotterdam", lat: 51.9244, lng: 4.4777, label: "Rotterdam" },
  { id: "nairobi", lat: -1.2921, lng: 36.8219, label: "Nairobi" },
  { id: "dhaka", lat: 23.8103, lng: 90.4125, label: "Dhaka" },
  { id: "singapore", lat: 1.3521, lng: 103.8198, label: "Singapore" },
  { id: "hong-kong", lat: 22.3193, lng: 114.1694, label: "Hong Kong" },
  { id: "jakarta", lat: -6.2088, lng: 106.8456, label: "Jakarta" },
  { id: "sydney", lat: -33.8688, lng: 151.2093, label: "Sydney" },
];

export const EXAMPLE_TRADE_CONNECTIONS: GlobeConnection[] = [
  "dubai",
  "riyadh",
  "istanbul",
  "london",
  "rotterdam",
  "nairobi",
  "dhaka",
  "singapore",
  "hong-kong",
  "jakarta",
  "sydney",
].map((to) => ({ from: "gurugram", to }));

export const DEFAULT_GLOBE_CONFIG: GlobeConfig = {
  ...GLOBE_THEMES.dark,
  mode: "animated",
  quality: "auto",
  interaction: "none",
  motionIntensity: 1,
  seed: 7,
  density: { desktop: 52000, mobile: 22000, low: 16000 },
  layout: {
    // Right of left-aligned copy, arcs included within the hero's height, and
    // nudged below the floating navigation.
    desktop: { x: 0.76, y: 0.54, heightFraction: 0.62, widthFraction: 0.36, maxDiameter: 560 },
    // Narrow screens: the copy fills the hero, so the globe rises from the
    // bottom-right corner behind the buttons as a deliberate crop.
    mobile: { x: 0.72, y: 0.94, heightFraction: 0.56, widthFraction: 0.95, maxDiameter: 480 },
  },
  focusLongitude: 92,
  tilt: 0.24,
  rotationSpeed: 0.055,
  assembly: { duration: 2.4, cameraStart: 1.145, cameraDuration: 3 },
  arcs: {
    height: 0.3,
    revealStart: 2.65,
    revealDuration: 1.3,
    cycleMin: 18,
    cycleMax: 30,
    tripFraction: 0.2,
  },
  pointer: { enabled: true, yaw: 0.12, pitch: 0.07, damping: 2.2 },
  pixelRatio: { desktop: 2, mobile: 1.5, low: 1 },
  // Below lg the copy spans the full width, so the globe moves out from beside it.
  mobileBreakpoint: 1024,
  locations: EXAMPLE_TRADE_LOCATIONS,
  connections: EXAMPLE_TRADE_CONNECTIONS,
  visitor: null,
  visitorHub: null,
  visitorArcOpacity: 0.55,
  geoDataUrl: "/geo/ne_110m_admin_0_countries.geojson",
};

type Grouped = "density" | "layout" | "assembly" | "arcs" | "pointer" | "pixelRatio";

export type GlobeConfigInput = Partial<Omit<GlobeConfig, Grouped>> & {
  /** Base palette; any colour or opacity passed alongside it wins. */
  theme?: GlobeThemeName;
  layout?: { desktop?: Partial<GlobeLayout>; mobile?: Partial<GlobeLayout> };
} & { [K in Exclude<Grouped, "layout">]?: Partial<GlobeConfig[K]> };

export function resolveGlobeConfig(input: GlobeConfigInput = {}): GlobeConfig {
  const { theme, density, layout, assembly, arcs, pointer, pixelRatio, ...flat } = input;
  const d = DEFAULT_GLOBE_CONFIG;
  return {
    ...d,
    ...(theme ? GLOBE_THEMES[theme] : null),
    ...flat,
    density: { ...d.density, ...density },
    layout: {
      desktop: { ...d.layout.desktop, ...layout?.desktop },
      mobile: { ...d.layout.mobile, ...layout?.mobile },
    },
    assembly: { ...d.assembly, ...assembly },
    arcs: { ...d.arcs, ...arcs },
    pointer: { ...d.pointer, ...pointer },
    pixelRatio: { ...d.pixelRatio, ...pixelRatio },
  };
}

/** `#rgb` / `#rrggbb` → `"r g b"`, the channel form `rgb(var(--x) / a)` expects. */
export function hexToRgbChannels(hex: string): string {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.replace(/./g, (c) => c + c);
  const n = Number.parseInt(h, 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}
