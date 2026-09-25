import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  LineSegments,
  Mesh,
  NormalBlending,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  WebGLRenderer,
  type Blending,
} from "three";
import { createWebGL2Context } from "@/lib/webgl";
import type { GlobeConfig, GlobeLayout } from "./config";
import {
  buildArcBuffers,
  buildParticleBuffers,
  createArcSpec,
  latLngToVector,
  mulberry32,
  spinForLongitude,
  type ArcSpec,
  type ScatterFrame,
  type Vec3,
} from "./geometry";
import { loadLandSampler, type LandSampler } from "./landMask";
import {
  arcsFragmentShader,
  arcsVertexShader,
  glowFragmentShader,
  glowVertexShader,
  pointsFragmentShader,
  pointsVertexShader,
} from "./shaders";

export interface GlobeSceneOptions {
  /** Element the engine appends its canvas to. */
  mount: HTMLElement;
  /** The hero: sized, observed for visibility, and the source of pointer tilt. */
  container: HTMLElement;
  config: GlobeConfig;
}

export interface GlobeSceneController {
  dispose(): void;
}

const FOV = 40;
const TAN_HALF_FOV = Math.tan((FOV * Math.PI) / 360);
const GLOW_RADIUS = 1.045;
const GLOW_POWER = 3.5;
const FADE_IN_MS = 900;

const expoOut = (x: number) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

type Nav = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };

function resolveQuality(quality: GlobeConfig["quality"]): "high" | "low" {
  if (quality !== "auto") return quality;
  const nav = navigator as Nav;
  if (nav.connection?.saveData) return "low";
  if ((nav.hardwareConcurrency ?? 8) <= 2) return "low";
  if ((nav.deviceMemory ?? 8) <= 2) return "low";
  return "high";
}

/**
 * Builds the particle globe into `mount` and runs it until `dispose()`.
 *
 * Returns null when WebGL2 or the renderer is unavailable, leaving the
 * caller's static background in place. Geography loads asynchronously; the
 * canvas only fades in once there is a globe to show, so a failed load also
 * leaves the static background untouched.
 */
export function createGlobeScene({ mount, container, config }: GlobeSceneOptions): GlobeSceneController | null {
  if (typeof window === "undefined" || typeof WebGL2RenderingContext === "undefined") return null;

  const quality = resolveQuality(config.quality);
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

  // ── Renderer ──────────────────────────────────────────────────────────
  // The engine owns its canvas: a context released by forceContextLoss() can
  // never be recovered, so a remount (Strict Mode, navigation) needs a fresh one.
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, {
    position: "absolute",
    inset: "0",
    width: "100%",
    height: "100%",
    display: "block",
    opacity: "0",
    pointerEvents: config.interaction === "drag" ? "auto" : "none",
  });
  mount.appendChild(canvas);

  // Ask for the context first: a browser that refuses one (acceleration off,
  // blocklisted driver, GPU process down) leaves the static background, and
  // that is not an error worth reporting.
  const context = createWebGL2Context(canvas, { powerPreference: "default" });
  if (!context) {
    canvas.remove();
    return null;
  }

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, context, antialias: false, alpha: true, powerPreference: "default" });
  } catch {
    canvas.remove();
    return null;
  }
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 50);

  const blending: Blending = config.blending === "additive" ? AdditiveBlending : NormalBlending;

  // ── Shared uniforms ───────────────────────────────────────────────────
  const uniforms = {
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uArcProgress: { value: 0 },
    uPixelRatio: { value: 1 },
    uScale: { value: 1 },
    uMotion: { value: 0 },
    uRotY: { value: 0 },
    uRotX: { value: config.tilt },
    uTripFraction: { value: config.arcs.tripFraction },
    uArcHeight: { value: config.arcs.height },
    uOpacity: { value: config.particleOpacity },
    uColor: { value: new Color(config.particleColor) },
    uAccentColor: { value: new Color(config.accentColor) },
  };

  // ── Rim glow ──────────────────────────────────────────────────────────
  const glowSegments = quality === "low" ? 32 : 48;
  const glowGeometry = new SphereGeometry(GLOW_RADIUS, glowSegments, glowSegments);
  const glowMaterial = new ShaderMaterial({
    vertexShader: glowVertexShader,
    fragmentShader: glowFragmentShader,
    uniforms: {
      uColor: { value: new Color(config.glowColor) },
      uIntensity: { value: 0 },
      uPower: { value: GLOW_POWER },
    },
    transparent: true,
    blending,
    depthWrite: false,
    depthTest: false,
  });
  const glow = new Mesh(glowGeometry, glowMaterial);
  glow.renderOrder = 0;
  scene.add(glow);

  // Filled in once geography has loaded.
  const disposables: { dispose(): void }[] = [glowGeometry, glowMaterial];
  let ready = false;
  let pendingSampler: LandSampler | null = null;

  // ── State ─────────────────────────────────────────────────────────────
  const assemblyEnd = Math.max(
    config.assembly.duration,
    config.assembly.cameraDuration,
    config.arcs.revealStart + config.arcs.revealDuration,
  );
  // Assembly time only advances while frames run, so the flight plays when
  // the globe is actually seen. Once complete it is never replayed.
  let assemblyElapsed = 0;
  let spin = spinForLongitude(config.focusLongitude);
  let spinVelocity = config.rotationSpeed * config.motionIntensity;

  let width = 0;
  let height = 0;
  let isMobile = false;
  let cameraDistance = 3;
  let centerNdcX = 0;
  let centerNdcY = 0;
  // The globe's footprint in CSS px, for drag hit-testing.
  let globeCenterX = 0;
  let globeCenterY = 0;
  let globeRadius = 0;

  let onscreen = true;
  let pageVisible = !document.hidden;
  let hasSize = false;
  let contextLost = false;
  let restoreCount = 0;
  let disposed = false;
  let revealed = false;

  let running = false;
  let frame = 0;
  let lastNow: number | null = null;

  const motionAllowed = () =>
    config.mode === "animated" && config.motionIntensity > 0 && !reducedMotionQuery.matches;

  if (!motionAllowed()) assemblyElapsed = assemblyEnd;

  // ── Layout ────────────────────────────────────────────────────────────
  function layoutFor(w: number): GlobeLayout {
    return w < config.mobileBreakpoint ? config.layout.mobile : config.layout.desktop;
  }

  function applyLayout() {
    const layout = layoutFor(width);
    const diameter = Math.max(
      16,
      Math.min(layout.heightFraction * height, layout.widthFraction * width, layout.maxDiameter),
    );
    // Distance at which a unit sphere spans `diameter` px of a `height` px view.
    cameraDistance = height / (TAN_HALF_FOV * diameter);
    const cx = layout.x * width;
    const cy = layout.y * height;
    centerNdcX = (2 * cx) / width - 1;
    centerNdcY = 1 - (2 * cy) / height;
    globeCenterX = cx;
    globeCenterY = cy;
    globeRadius = diameter / 2;

    camera.aspect = width / height;
    // A lens shift rather than moving the camera: the globe is still seen
    // head-on, just drawn off-centre, so it stays a true circle.
    camera.setViewOffset(width, height, width / 2 - cx, height / 2 - cy, width, height);
    camera.updateProjectionMatrix();
    uniforms.uScale.value = (0.5 * height) / TAN_HALF_FOV;
  }

  function applyAssembly() {
    const { duration, cameraStart, cameraDuration } = config.assembly;
    uniforms.uProgress.value = Math.min(1, assemblyElapsed / duration);
    uniforms.uArcProgress.value = clamp01((assemblyElapsed - config.arcs.revealStart) / config.arcs.revealDuration);
    const settle = expoOut(Math.min(1, assemblyElapsed / cameraDuration));
    camera.position.z = cameraDistance * (1 + (cameraStart - 1) * (1 - settle));
    glowMaterial.uniforms.uIntensity.value = config.glowIntensity * expoOut(Math.min(1, assemblyElapsed / duration));
  }

  // ── Pointer tilt ──────────────────────────────────────────────────────
  let pointerClientX = 0;
  let pointerClientY = 0;
  let pointerInside = false;
  let pointerYaw = 0;
  let pointerPitch = 0;
  let pointerListening = false;

  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    pointerClientX = event.clientX;
    pointerClientY = event.clientY;
    pointerInside = true;
  };
  const onPointerLeave = () => {
    pointerInside = false;
  };

  function setPointerListening(on: boolean) {
    if (on === pointerListening) return;
    pointerListening = on;
    if (on) {
      container.addEventListener("pointermove", onPointerMove, { passive: true });
      container.addEventListener("pointerleave", onPointerLeave, { passive: true });
    } else {
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onPointerLeave);
      pointerInside = false;
    }
  }

  const wantsPointer = () => config.pointer.enabled && finePointerQuery.matches && motionAllowed();

  // ── Optional drag ─────────────────────────────────────────────────────
  // Only presses on the globe itself grab it; the rest of the canvas is inert.
  // touch-action: pan-y keeps vertical swipes scrolling the page on touch.
  let dragging = false;
  let dragTilt = 0;
  let dragLastX = 0;
  let dragLastY = 0;

  const isOverGlobe = (event: PointerEvent) => {
    if (!ready || !hasSize) return false;
    const rect = canvas.getBoundingClientRect();
    const dx = event.clientX - rect.left - globeCenterX;
    const dy = event.clientY - rect.top - globeCenterY;
    return Math.hypot(dx, dy) <= globeRadius * 1.08;
  };

  const onDragStart = (event: PointerEvent) => {
    if (event.button !== 0 || !isOverGlobe(event)) return;
    event.preventDefault();
    dragging = true;
    dragLastX = event.clientX;
    dragLastY = event.clientY;
    spinVelocity = 0;
    canvas.setPointerCapture(event.pointerId);
    canvas.style.cursor = "grabbing";
  };
  const onDragMove = (event: PointerEvent) => {
    if (!dragging) {
      if (event.pointerType === "mouse") canvas.style.cursor = isOverGlobe(event) ? "grab" : "";
      return;
    }
    const dx = event.clientX - dragLastX;
    const dy = event.clientY - dragLastY;
    dragLastX = event.clientX;
    dragLastY = event.clientY;
    spin += dx * 0.0045;
    spinVelocity = Math.max(-2.2, Math.min(2.2, dx * 0.0045 * 60));
    dragTilt = Math.max(-0.55, Math.min(0.55, dragTilt + dy * 0.0035));
    if (!running) renderFrame();
  };
  const onDragEnd = (event: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    canvas.style.cursor = isOverGlobe(event) ? "grab" : "";
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  };

  if (config.interaction === "drag") {
    canvas.style.touchAction = "pan-y";
    canvas.addEventListener("pointerdown", onDragStart);
    canvas.addEventListener("pointermove", onDragMove);
    canvas.addEventListener("pointerup", onDragEnd);
    canvas.addEventListener("pointercancel", onDragEnd);
  }

  // ── Frame loop ────────────────────────────────────────────────────────
  function renderFrame() {
    if (disposed || contextLost || !ready || !hasSize) return;
    uniforms.uRotY.value = spin + pointerYaw;
    uniforms.uRotX.value = config.tilt + dragTilt + pointerPitch;
    renderer.render(scene, camera);
    if (!revealed) {
      revealed = true;
      canvas.style.opacity = "1";
    }
  }

  function tick(now: number) {
    frame = 0;
    if (!running) return;
    // Elapsed-time animation. The cap keeps a long hitch from teleporting
    // the globe, and lastNow is cleared on every pause so resuming never jumps.
    const dt = lastNow === null ? 0 : Math.min(0.05, (now - lastNow) / 1000);
    lastNow = now;

    const intensity = config.motionIntensity;
    uniforms.uTime.value += dt;
    if (assemblyElapsed < assemblyEnd) assemblyElapsed = Math.min(assemblyEnd, assemblyElapsed + dt);
    applyAssembly();

    if (!dragging) {
      const target = config.rotationSpeed * intensity;
      spinVelocity += (target - spinVelocity) * (1 - Math.exp(-1.6 * dt));
      spin += spinVelocity * dt;
      dragTilt += (0 - dragTilt) * (1 - Math.exp(-0.9 * dt));
    }

    let yawTarget = 0;
    let pitchTarget = 0;
    if (pointerListening && pointerInside) {
      const rect = container.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const nx = clamp01((pointerClientX - rect.left) / rect.width) * 2 - 1;
        const ny = clamp01((pointerClientY - rect.top) / rect.height) * 2 - 1;
        yawTarget = nx * config.pointer.yaw * intensity;
        pitchTarget = ny * config.pointer.pitch * intensity;
      }
    }
    const ease = 1 - Math.exp(-config.pointer.damping * dt);
    pointerYaw += (yawTarget - pointerYaw) * ease;
    pointerPitch += (pitchTarget - pointerPitch) * ease;

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

  /** The single place that decides whether frames should run. */
  function evaluate() {
    const animated = motionAllowed();
    uniforms.uMotion.value = animated ? config.motionIntensity : 0;
    setPointerListening(!disposed && wantsPointer());

    const canRender = !disposed && ready && hasSize && !contextLost;
    if (canRender && animated && onscreen && pageVisible) {
      start();
    } else {
      stop();
      // Static mode draws one settled frame; nothing keeps running.
      if (canRender && !animated) renderFrame();
    }
  }

  // ── Resize ────────────────────────────────────────────────────────────
  function resize() {
    if (disposed) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w < 1 || h < 1) {
      hasSize = false;
      evaluate();
      return;
    }
    hasSize = true;
    width = w;
    height = h;
    isMobile = w < config.mobileBreakpoint;

    const dprCap = quality === "low" ? config.pixelRatio.low : isMobile ? config.pixelRatio.mobile : config.pixelRatio.desktop;
    const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    uniforms.uPixelRatio.value = dpr;

    applyLayout();
    applyAssembly();

    // Scattered starts are placed against the real frustum, so geography
    // that arrived before the hero had a size is built now.
    if (pendingSampler && !ready) {
      const sampler = pendingSampler;
      pendingSampler = null;
      buildGlobe(sampler);
      return;
    }
    // A running loop draws the new size next frame; static mode redraws in evaluate().
    evaluate();
  }

  // ── Geography → GPU buffers (once) ────────────────────────────────────
  function buildGlobe(isLand: LandSampler) {
    const random = mulberry32(config.seed);
    const byId = new Map(config.locations.map((l) => [l.id, l]));
    const cycle = () => config.arcs.cycleMin + random() * (config.arcs.cycleMax - config.arcs.cycleMin);

    const networkArcs: ArcSpec[] = [];
    for (const { from, to } of config.connections) {
      const a = byId.get(from);
      const b = byId.get(to);
      if (!a || !b) continue;
      const spec = createArcSpec(latLngToVector(a.lat, a.lng), latLngToVector(b.lat, b.lng), cycle(), random());
      if (spec) networkArcs.push(spec);
    }

    const visitorArcs: ArcSpec[] = [];
    const extraMarkers: Vec3[] = [];
    const visitorHub = config.visitorHub ? byId.get(config.visitorHub) : undefined;
    if (config.visitor && visitorHub) {
      const target = latLngToVector(config.visitor.lat, config.visitor.lng);
      const spec = createArcSpec(latLngToVector(visitorHub.lat, visitorHub.lng), target, 12 + random() * 4, random(), true);
      if (spec) {
        visitorArcs.push(spec);
        extraMarkers.push(target);
      }
    }

    // Starts are placed against the frustum as it will be at the first frame.
    const frame: ScatterFrame = {
      aspect: width / height,
      cameraZ: cameraDistance * config.assembly.cameraStart,
      tanHalfFov: TAN_HALF_FOV,
      centerNdcX,
      centerNdcY,
    };

    const candidates =
      quality === "low" ? config.density.low : isMobile ? config.density.mobile : config.density.desktop;

    const particles = buildParticleBuffers({
      isLand,
      candidates,
      random,
      frame,
      locations: config.locations,
      arcs: [...networkArcs, ...visitorArcs],
      extraMarkers,
    });

    const pointsGeometry = new BufferGeometry();
    pointsGeometry.setAttribute("position", new BufferAttribute(particles.position, 3));
    pointsGeometry.setAttribute("aScatter", new BufferAttribute(particles.scatter, 3));
    pointsGeometry.setAttribute("aDelay", new BufferAttribute(particles.delay, 1));
    pointsGeometry.setAttribute("aSize", new BufferAttribute(particles.size, 1));
    pointsGeometry.setAttribute("aPhase", new BufferAttribute(particles.phase, 1));
    pointsGeometry.setAttribute("aAccent", new BufferAttribute(particles.accent, 1));
    pointsGeometry.setAttribute("aArcT", new BufferAttribute(particles.arcT, 1));
    const pointsMaterial = new ShaderMaterial({
      vertexShader: pointsVertexShader,
      fragmentShader: pointsFragmentShader,
      uniforms,
      transparent: true,
      blending,
      depthWrite: false,
      depthTest: false,
    });
    const points = new Points(pointsGeometry, pointsMaterial);
    points.frustumCulled = false;
    points.renderOrder = 2;

    const makeArcs = (arcs: ArcSpec[], color: string, base: number) => {
      const buffers = buildArcBuffers(arcs, config.arcs.height);
      const geometry = new BufferGeometry();
      geometry.setAttribute("position", new BufferAttribute(buffers.position, 3));
      geometry.setAttribute("aProgress", new BufferAttribute(buffers.progress, 1));
      geometry.setAttribute("aOffset", new BufferAttribute(buffers.offset, 1));
      geometry.setAttribute("aFrequency", new BufferAttribute(buffers.frequency, 1));
      const material = new ShaderMaterial({
        vertexShader: arcsVertexShader,
        fragmentShader: arcsFragmentShader,
        uniforms: {
          uTime: uniforms.uTime,
          uArcProgress: uniforms.uArcProgress,
          uMotion: uniforms.uMotion,
          uRotY: uniforms.uRotY,
          uRotX: uniforms.uRotX,
          uTripFraction: uniforms.uTripFraction,
          uColor: { value: new Color(color) },
          uBase: { value: base },
          uPacket: { value: config.packetOpacity },
        },
        transparent: true,
        blending,
        depthWrite: false,
        depthTest: false,
      });
      const lines = new LineSegments(geometry, material);
      lines.frustumCulled = false;
      lines.renderOrder = 1;
      scene.add(lines);
      disposables.push(geometry, material);
    };

    if (networkArcs.length) makeArcs(networkArcs, config.arcColor, config.arcOpacity);
    if (visitorArcs.length) makeArcs(visitorArcs, config.accentColor, config.visitorArcOpacity);
    scene.add(points);
    disposables.push(pointsGeometry, pointsMaterial);

    container.dataset.globeParticles = String(particles.count);
    ready = true;
    resize();
  }

  const abort = new AbortController();
  loadLandSampler(config.geoDataUrl, abort.signal)
    .then((sampler) => {
      if (disposed || !sampler) return;
      if (hasSize) buildGlobe(sampler);
      else pendingSampler = sampler;
    })
    .catch(() => {
      // Aborted on unmount, or the data failed to load: the static background stays.
    });

  // ── Observers and events ──────────────────────────────────────────────
  const resizeObserver = new ResizeObserver(() => resize());
  resizeObserver.observe(container);

  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) onscreen = entry.isIntersecting;
      evaluate();
    },
    { threshold: 0 },
  );
  intersectionObserver.observe(container);

  const onVisibility = () => {
    pageVisible = !document.hidden;
    evaluate();
  };
  document.addEventListener("visibilitychange", onVisibility);

  const onMotionPreference = () => {
    if (!motionAllowed()) {
      // Settle immediately rather than finishing a flight.
      assemblyElapsed = assemblyEnd;
      pointerYaw = 0;
      pointerPitch = 0;
      applyAssembly();
    }
    canvas.style.transition = reducedMotionQuery.matches ? "none" : `opacity ${FADE_IN_MS}ms ease-out`;
    evaluate();
  };
  reducedMotionQuery.addEventListener("change", onMotionPreference);
  finePointerQuery.addEventListener("change", evaluate);
  canvas.style.transition = reducedMotionQuery.matches ? "none" : `opacity ${FADE_IN_MS}ms ease-out`;

  const onContextLost = (event: Event) => {
    event.preventDefault();
    contextLost = true;
    canvas.style.opacity = "0";
    revealed = false;
    evaluate();
  };
  const onContextRestored = () => {
    // One recovery. A context that keeps being lost is left on the static background.
    if (restoreCount >= 1) return;
    restoreCount++;
    contextLost = false;
    resize();
  };
  canvas.addEventListener("webglcontextlost", onContextLost);
  canvas.addEventListener("webglcontextrestored", onContextRestored);

  resize();

  return {
    dispose() {
      if (disposed) return;
      disposed = true;
      abort.abort();
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reducedMotionQuery.removeEventListener("change", onMotionPreference);
      finePointerQuery.removeEventListener("change", evaluate);
      setPointerListening(false);
      canvas.removeEventListener("pointerdown", onDragStart);
      canvas.removeEventListener("pointermove", onDragMove);
      canvas.removeEventListener("pointerup", onDragEnd);
      canvas.removeEventListener("pointercancel", onDragEnd);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      for (const item of disposables) item.dispose();
      scene.clear();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
      delete container.dataset.globeParticles;
    },
  };
}
