import {
  BufferAttribute,
  BufferGeometry,
  CustomBlending,
  DataTexture,
  FloatType,
  Mesh,
  NearestFilter,
  OneFactor,
  OneMinusSrcAlphaFactor,
  OrthographicCamera,
  PlaneGeometry,
  Points,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  UnsignedByteType,
  Vector2,
  Vector3,
  WebGLRenderTarget,
  WebGLRenderer,
} from "three";
import type { CommandPalette, CommandSceneConfig } from "./config";
import {
  compositeFragmentShader,
  compositeVertexShader,
  particleFragmentShader,
  particleVertexShader,
} from "./shaders";
import {
  buildParticleAttributes,
  buildTrajectoryTexture,
  packSystemUniforms,
  sizeRanges,
  trajectoryRowCount,
} from "./trajectories";

export type SceneQuality = "high" | "low";

export interface SequenceInput {
  morph: number;
  /** Graphics lift, 0–1. */
  surface: number;
  /** The final heading fully covers the scene; stop drawing. */
  covered: boolean;
}

export interface CommandSceneOptions {
  mount: HTMLElement;
  /** The pinned stage: sized from, and observed for visibility. */
  stage: HTMLElement;
  config: CommandSceneConfig;
  palette: CommandPalette;
  /** Viewport heights the graphics lift across the sequence. */
  lift: number;
  quality: SceneQuality;
}

export interface CommandSceneController {
  update(input: SequenceInput): void;
  dispose(): void;
}

/** Vertical centre of a band's stack of rings. */
function bandCentre(band: CommandSceneConfig["systems"][number] | undefined): number {
  return band ? band.ringY + ((band.trajectories - 1) * band.ringSpacing) / 2 : 0;
}

function hexToVec3(hex: string): Vector3 {
  const n = Number.parseInt(hex.replace("#", ""), 16);
  return new Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

/**
 * Builds and runs the particle scene. Returns null if WebGL2 or the renderer
 * is unavailable, leaving the CSS gradient behind it in place.
 */
export function createCommandScene(options: CommandSceneOptions): CommandSceneController | null {
  const { mount, stage, config, palette, lift, quality } = options;
  if (typeof WebGL2RenderingContext === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, {
    position: "absolute",
    inset: "0",
    width: "100%",
    height: "100%",
    display: "block",
    opacity: "0",
    transition: "opacity 1200ms ease-out",
  });
  mount.appendChild(canvas);

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: "high-performance" });
  } catch {
    canvas.remove();
    return null;
  }
  renderer.autoClear = false;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const useTarget = quality === "high";

  // ── Trajectory data texture (rebuilt only when aspect changes) ─────────
  const rows = trajectoryRowCount(config);
  const pathTexture = new DataTexture(new Float32Array(config.samples * rows * 4), config.samples, rows, RGBAFormat, FloatType);
  pathTexture.minFilter = NearestFilter;
  pathTexture.magFilter = NearestFilter;
  pathTexture.generateMipmaps = false;

  const tilt = (config.tiltDeg * Math.PI) / 180;
  const [sysA, sysB, sysC, sysD] = packSystemUniforms(config);

  const shared = {
    uHalfWidth: { value: 0.8 },
    uShift: { value: lift },
    uRadius: { value: config.radius },
    uTiltSin: { value: Math.sin(tilt) },
  };

  // ── Particles ─────────────────────────────────────────────────────────
  const particleUniforms = {
    ...shared,
    uPaths: { value: pathTexture },
    uSamples: { value: config.samples },
    uTime: { value: 0 },
    uIntro: { value: 0 },
    uMorph: { value: 0 },
    uTiltCos: { value: Math.cos(tilt) },
    uFlowRate: { value: config.flowRate },
    uDpr: { value: 1 },
    uQuiet: { value: new Vector2(config.quietZone[0], config.quietZone[1]) },
    uSysA: { value: sysA },
    uSysB: { value: sysB },
    uSysC: { value: sysC },
    uSysD: { value: sysD },
    uSize: { value: sizeRanges(config) },
    uColor: { value: hexToVec3(palette.particle) },
  };
  const particleMaterial = new ShaderMaterial({
    vertexShader: particleVertexShader,
    fragmentShader: particleFragmentShader,
    uniforms: particleUniforms,
    defines: { SYSTEMS: config.systems.length },
    transparent: true,
    depthTest: false,
    depthWrite: false,
    blending: CustomBlending,
    blendSrc: OneFactor,
    blendDst: OneMinusSrcAlphaFactor,
    blendSrcAlpha: OneFactor,
    blendDstAlpha: OneMinusSrcAlphaFactor,
  });
  let particleGeometry = new BufferGeometry();
  const points = new Points(particleGeometry, particleMaterial);
  points.frustumCulled = false;
  const particleScene = new Scene();
  particleScene.add(points);

  // ── Composite: gradient, fills, particles, grain ──────────────────────
  const target = useTarget
    ? new WebGLRenderTarget(1, 1, { type: UnsignedByteType, minFilter: NearestFilter, magFilter: NearestFilter, depthBuffer: false })
    : null;
  const bands = config.systems.filter((s) => s.kind === "band");
  const compositeUniforms = {
    ...shared,
    uScene: { value: target?.texture ?? null },
    uUseScene: { value: useTarget ? 1 : 0 },
    uGradient0: { value: hexToVec3(palette.gradient[0]) },
    uGradient1: { value: hexToVec3(palette.gradient[1]) },
    uGradient2: { value: hexToVec3(palette.gradient[2]) },
    uFill: { value: hexToVec3(palette.fill) },
    uGlow: { value: hexToVec3(palette.glow) },
    uGlowOpacity: { value: palette.glowOpacity },
    uGlowCentre: { value: new Vector2(palette.glowCentre[0], palette.glowCentre[1]) },
    uGlowRadius: { value: palette.glowRadius },
    uFillOpacity: { value: config.fills.opacity },
    uFillMorph: { value: 0 },
    uBandY: {
      value: new Vector2(
        bandCentre(bands[0]),
        bandCentre(bands[1] ?? bands[0]),
      ),
    },
    // Low quality relies on a CSS grain layer instead.
    uGrain: { value: useTarget ? config.grain : 0 },
  };
  const compositeGeometry = new PlaneGeometry(2, 2);
  const compositeMaterial = new ShaderMaterial({
    vertexShader: compositeVertexShader,
    fragmentShader: compositeFragmentShader,
    uniforms: compositeUniforms,
    depthTest: false,
    depthWrite: false,
  });
  const compositeScene = new Scene();
  const quad = new Mesh(compositeGeometry, compositeMaterial);
  quad.frustumCulled = false;
  compositeScene.add(quad);

  // ── State ─────────────────────────────────────────────────────────────
  let width = 0;
  let mobile: boolean | null = null;
  let aspectBuilt = 0;
  let onscreen = true;
  let pageVisible = !document.hidden;
  let contextLost = false;
  let disposed = false;
  let revealed = false;
  let running = false;
  let frame = 0;
  let lastNow: number | null = null;

  const input: SequenceInput = { morph: 0, surface: 0, covered: false };
  // Displayed values follow scroll with a very short, frame-rate-independent
  // ease, which hides wheel stepping without noticeable lag.
  let morph = 0;
  let surface = 0;
  // Ambient clocks, independent of scroll.
  let time = 0;
  let intro = 0;

  const animated = () => !reducedMotion.matches;

  function rebuildParticles() {
    const density = quality === "low" ? config.density.low : mobile ? config.density.mobile : 1;
    const attrs = buildParticleAttributes(config, density);
    const geometry = new BufferGeometry();
    // The position attribute is unused by the shader but defines the draw count.
    geometry.setAttribute("position", new BufferAttribute(new Float32Array(attrs.count * 3), 3));
    geometry.setAttribute("aU", new BufferAttribute(attrs.u, 1));
    geometry.setAttribute("aRow", new BufferAttribute(attrs.row, 1));
    geometry.setAttribute("aSystem", new BufferAttribute(attrs.system, 1));
    geometry.setAttribute("aRing", new BufferAttribute(attrs.ring, 1));
    geometry.setAttribute("aSeed", new BufferAttribute(attrs.seed, 3));
    particleGeometry.dispose();
    particleGeometry = geometry;
    points.geometry = geometry;
    stage.dataset.commandParticles = String(attrs.count);
  }

  function rebuildTrajectories(aspect: number) {
    const texture = buildTrajectoryTexture(config, { aspect, mobile: !!mobile, density: 1 }, lift);
    (pathTexture.image.data as Float32Array).set(texture.data);
    pathTexture.needsUpdate = true;
    aspectBuilt = aspect;
  }

  function resize() {
    if (disposed) return;
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    if (w < 1 || h < 1) return;
    const nextMobile = w < config.mobileBreakpoint;
    const densityChanged = mobile !== nextMobile;
    width = w;
    mobile = nextMobile;

    const cap = quality === "low" ? config.pixelRatio.low : mobile ? config.pixelRatio.mobile : config.pixelRatio.desktop;
    const dpr = Math.min(window.devicePixelRatio || 1, cap);
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    target?.setSize(Math.round(w * dpr), Math.round(h * dpr));
    particleUniforms.uDpr.value = dpr;

    const aspect = w / h;
    shared.uHalfWidth.value = aspect / 2;
    shared.uRadius.value = Math.min(config.radius, config.maxRadiusOfHalfWidth * (aspect / 2));

    if (densityChanged) rebuildParticles();
    // Toolbar-sized height changes barely move the aspect; skip those rebuilds.
    if (densityChanged || Math.abs(aspect - aspectBuilt) / Math.max(aspectBuilt, 1e-3) > 0.02) rebuildTrajectories(aspect);
    evaluate();
    if (!running) renderFrame();
  }

  function applyUniforms() {
    particleUniforms.uTime.value = time;
    particleUniforms.uIntro.value = intro;
    particleUniforms.uMorph.value = morph;
    shared.uShift.value = lift * (1 - surface);
    compositeUniforms.uFillMorph.value = Math.min(1, Math.max(0, (morph - 0.55) / 0.45));
  }

  function renderFrame() {
    if (disposed || contextLost || width === 0 || input.covered) return;
    applyUniforms();
    if (target) {
      renderer.setRenderTarget(target);
      renderer.setClearColor(0x000000, 0);
      renderer.clear();
      renderer.render(particleScene, camera);
      renderer.setRenderTarget(null);
      renderer.render(compositeScene, camera);
    } else {
      renderer.setRenderTarget(null);
      renderer.render(compositeScene, camera);
      renderer.render(particleScene, camera);
    }
    if (!revealed) {
      revealed = true;
      canvas.style.opacity = "1";
    }
  }

  function tick(now: number) {
    frame = 0;
    if (!running) return;
    const dt = lastNow === null ? 0 : Math.min(0.05, (now - lastNow) / 1000);
    lastNow = now;
    time += dt;
    intro += dt;
    const ease = 1 - Math.exp(-14 * dt);
    morph += (input.morph - morph) * ease;
    surface += (input.surface - surface) * ease;
    renderFrame();
    frame = requestAnimationFrame(tick);
  }

  function start() {
    if (running) return;
    running = true;
    lastNow = null;
    frame = requestAnimationFrame(tick);
  }

  function stop() {
    running = false;
    lastNow = null;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  }

  function evaluate() {
    const canRender = !disposed && !contextLost && width > 0;
    if (canRender && animated() && onscreen && pageVisible && !input.covered) {
      start();
      return;
    }
    stop();
    if (!canRender || input.covered) return;
    if (!animated()) {
      // Static composition: fully appeared, settled on the current values.
      intro = 60;
      time = 8;
      morph = input.morph;
      surface = input.surface;
      renderFrame();
    }
  }

  const resizeObserver = new ResizeObserver(() => resize());
  resizeObserver.observe(stage);

  const intersectionObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) onscreen = entry.isIntersecting;
    evaluate();
  });
  intersectionObserver.observe(stage);

  const onVisibility = () => {
    pageVisible = !document.hidden;
    evaluate();
  };
  document.addEventListener("visibilitychange", onVisibility);
  reducedMotion.addEventListener("change", evaluate);

  const onContextLost = (event: Event) => {
    event.preventDefault();
    contextLost = true;
    canvas.style.opacity = "0";
    revealed = false;
    evaluate();
  };
  const onContextRestored = () => {
    contextLost = false;
    aspectBuilt = 0;
    resize();
  };
  canvas.addEventListener("webglcontextlost", onContextLost);
  canvas.addEventListener("webglcontextrestored", onContextRestored);

  resize();

  return {
    update(next) {
      const wasCovered = input.covered;
      input.morph = next.morph;
      input.surface = next.surface;
      input.covered = next.covered;
      if (!animated() || !running) {
        morph = next.morph;
        surface = next.surface;
      }
      canvas.style.visibility = next.covered ? "hidden" : "visible";
      if (wasCovered !== next.covered || !running) evaluate();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reducedMotion.removeEventListener("change", evaluate);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      particleGeometry.dispose();
      particleMaterial.dispose();
      compositeGeometry.dispose();
      compositeMaterial.dispose();
      pathTexture.dispose();
      target?.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
      delete stage.dataset.commandParticles;
    },
  };
}
