/*
 * Renders the traffic field and owns its lifecycle: renderer, observers,
 * pointer tilt, pausing and disposal. The motion itself lives in
 * trafficSimulation.ts. Kept free of React: the component only mounts and
 * disposes this, and nothing per-frame ever touches React state.
 */
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Fog,
  Group,
  LineBasicMaterial,
  LineSegments,
  NormalBlending,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  WebGLRenderer,
} from "three";
import { createWebGL2Context } from "@/lib/webgl";
import type { TrafficConfig } from "./config";
import { createTrafficSimulation } from "./trafficSimulation";

export interface TrafficSceneController {
  dispose(): void;
}

interface CreateOptions {
  /** Element the canvas is appended to; it must fill the hero. */
  mount: HTMLElement;
  /** The hero itself: sized, observed and listened on. */
  container: HTMLElement;
  config: TrafficConfig;
}

const DEG = Math.PI / 180;

/**
 * Builds the scene into `mount` and starts managing its own lifecycle.
 * Returns null when WebGL isn't available; the static CSS background the
 * component already paints is then the whole background.
 */
export function createTrafficScene({ mount, container, config }: CreateOptions): TrafficSceneController | null {
  if (typeof window === "undefined" || typeof WebGL2RenderingContext === "undefined") return null;

  const { world: W, particles: P } = config;
  const lane = W.laneSpacing;
  const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reducedMotion = reducedQuery.matches;

  const canvas = document.createElement("canvas");
  Object.assign(canvas.style, {
    position: "absolute",
    inset: "0",
    width: "100%",
    height: "100%",
    display: "block",
    // Faded in after the first frame, over the matching CSS background.
    opacity: "0",
    transition: reducedMotion ? "none" : "opacity 700ms ease",
  });
  mount.appendChild(canvas);

  // Ask for the context first: browsers refuse one for their own reasons
  // (acceleration off, blocklisted driver, GPU process down), and that is not
  // an error here — the static background simply stays.
  const context = createWebGL2Context(canvas, { antialias: true, powerPreference: "low-power" });
  if (!context) {
    canvas.remove();
    return null;
  }

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, context, antialias: true, alpha: false, powerPreference: "low-power" });
  } catch {
    canvas.remove();
    return null;
  }

  const background = new Color(config.background);
  renderer.setClearColor(background, 1);

  const scene = new Scene();
  scene.fog = new Fog(background, config.fog.near, config.fog.far);

  const camera = new PerspectiveCamera(config.camera.fov, 1, config.camera.near, config.camera.far);
  camera.position.set(...config.camera.position);
  camera.lookAt(0, 0, 0);

  const world = new Group();
  world.rotation.x = W.tiltX;
  scene.add(world);

  /* ── The street grid: one LineSegments, drawn faintly ── */
  const zFirst = Math.ceil(W.minZ / lane);
  const zLast = Math.floor(W.maxZ / lane);
  const xFirst = Math.ceil(W.minX / lane);
  const xLast = Math.floor(W.maxX / lane);
  const lineCount = zLast - zFirst + 1 + (xLast - xFirst + 1);
  const gridVerts = new Float32Array(lineCount * 6);
  let g = 0;
  // Integer steps, so the lines land exactly where particles snap.
  for (let i = zFirst; i <= zLast; i++) {
    const z = i * lane;
    gridVerts.set([W.minX, 0, z, W.maxX, 0, z], g);
    g += 6;
  }
  for (let i = xFirst; i <= xLast; i++) {
    const x = i * lane;
    gridVerts.set([x, 0, W.minZ, x, 0, W.maxZ], g);
    g += 6;
  }
  const gridGeometry = new BufferGeometry();
  gridGeometry.setAttribute("position", new BufferAttribute(gridVerts, 3));
  const gridMaterial = new LineBasicMaterial({
    color: config.foreground,
    transparent: true,
    opacity: config.gridOpacity,
    depthWrite: false,
  });
  const grid = new LineSegments(gridGeometry, gridMaterial);
  grid.position.y = W.gridY;
  world.add(grid);

  /* ── Particles: allocated for the larger count, drawn up to the active one,
     so crossing the mobile breakpoint needs no rebuild ── */
  const capacity = Math.max(P.desktop, P.mobile);
  const sim = createTrafficSimulation(config, capacity);
  const positions = new Float32Array(capacity * 3);
  // RGBA: opacity lives per particle, so accents can be stronger than the
  // ink particles in the same single draw call.
  const colors = new Float32Array(capacity * 4);

  const ink = new Color(config.foreground);
  const accentColor = new Color(config.accent);
  for (let k = 0; k < capacity; k++) {
    const isAccent = sim.accent[k] === 1;
    const c = isAccent ? accentColor : ink;
    colors[k * 4] = c.r;
    colors[k * 4 + 1] = c.g;
    colors[k * 4 + 2] = c.b;
    colors[k * 4 + 3] = isAccent ? config.accentOpacity : config.particleOpacity;
  }

  const pointsGeometry = new BufferGeometry();
  const positionAttr = new BufferAttribute(positions, 3);
  pointsGeometry.setAttribute("position", positionAttr);
  // A 4-component colour attribute makes three multiply the alpha in too.
  pointsGeometry.setAttribute("color", new BufferAttribute(colors, 4));
  const pointsMaterial = new PointsMaterial({
    size: P.size,
    vertexColors: true,
    transparent: true,
    // The per-particle alpha above carries the opacity.
    opacity: 1,
    sizeAttenuation: true,
    depthWrite: false,
    blending: config.blending === "additive" ? AdditiveBlending : NormalBlending,
  });
  const points = new Points(pointsGeometry, pointsMaterial);
  points.position.y = W.particleY;
  // Positions move every frame, so a bounding sphere computed once would be stale.
  points.frustumCulled = false;
  world.add(points);

  let activeCount = 0;
  const setActiveCount = (n: number) => {
    activeCount = Math.min(capacity, n);
    pointsGeometry.setDrawRange(0, activeCount);
  };
  setActiveCount(capacity);

  /* ── Simulation ── */
  let simTime = 0;

  // Only x and z change; y stays 0 and the Points object carries the height.
  const syncPositions = (count: number) => {
    const { px, pz } = sim;
    for (let k = 0; k < count; k++) {
      positions[k * 3] = px[k];
      positions[k * 3 + 2] = pz[k];
    }
    positionAttr.needsUpdate = true;
  };

  const settleOntoLanes = () => {
    sim.settle(simTime);
    syncPositions(capacity);
  };

  const step = (dt: number) => {
    sim.step(dt, simTime, activeCount, config.motionIntensity);
    syncPositions(activeCount);
  };

  /* ── Pointer tilt, relative to the hero ── */
  const pointerEnabled = !window.matchMedia("(pointer: coarse)").matches;
  let pointerX = 0;
  let pointerY = 0;
  let pointerDirty = false;
  let targetYaw = 0;
  let targetPitch = 0;

  const onPointerMove = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    pointerX = e.clientX;
    pointerY = e.clientY;
    pointerDirty = true;
  };
  const onPointerLeave = () => {
    pointerDirty = false;
    targetYaw = 0;
    targetPitch = 0;
  };

  // Read the hero's rect at most once per frame, and only after the pointer
  // moved, so rapid pointermove events never force repeated layouts.
  const resolvePointerTarget = () => {
    if (!pointerDirty) return;
    pointerDirty = false;
    const r = container.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return;
    const nx = Math.max(-1, Math.min(1, ((pointerX - r.left) / r.width - 0.5) * 2));
    const ny = Math.max(-1, Math.min(1, ((pointerY - r.top) / r.height - 0.5) * 2));
    targetYaw = nx * config.pointer.yaw * config.motionIntensity;
    targetPitch = ny * config.pointer.pitch * config.motionIntensity;
  };

  const poseStill = () => {
    targetYaw = 0;
    targetPitch = 0;
    world.rotation.set(W.tiltX, 0, 0);
    world.position.y = 0;
  };

  /* ── Rendering and the loop ── */
  let rafId = 0;
  let lastNow: number | null = null;
  let revealed = false;

  const render = () => {
    renderer.render(scene, camera);
    if (!revealed) {
      revealed = true;
      canvas.style.opacity = "1";
    }
  };

  const tick = (now: number) => {
    // Null after every (re)start, so a resume never produces a jump.
    const dt = lastNow === null ? 0 : Math.min(0.05, (now - lastNow) / 1000);
    lastNow = now;
    simTime += dt;

    resolvePointerTarget();
    step(dt);

    const ease = 1 - Math.exp(-config.pointer.damping * dt);
    world.rotation.y += (targetYaw - world.rotation.y) * ease;
    world.rotation.x += (W.tiltX + targetPitch - world.rotation.x) * ease;
    world.position.y = Math.sin(simTime * config.float.frequency) * config.float.amplitude * config.motionIntensity;

    render();
    rafId = requestAnimationFrame(tick);
  };

  const start = () => {
    if (rafId) return;
    lastNow = null;
    rafId = requestAnimationFrame(tick);
  };
  const stop = () => {
    if (!rafId) return;
    cancelAnimationFrame(rafId);
    rafId = 0;
  };

  /* ── What decides whether we animate ── */
  let onscreen = false;
  let pageVisible = !document.hidden;
  let hasSize = false;
  let contextLost = false;
  let disposed = false;

  const wantsMotion = () => config.mode === "animated" && config.motionIntensity > 0 && !reducedMotion;

  let listening = false;
  const setPointerListening = (on: boolean) => {
    if (on === listening) return;
    listening = on;
    if (on) {
      container.addEventListener("pointermove", onPointerMove, { passive: true });
      container.addEventListener("pointerleave", onPointerLeave, { passive: true });
    } else {
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onPointerLeave);
      onPointerLeave();
    }
  };

  const evaluate = () => {
    if (disposed) return;
    setPointerListening(pointerEnabled && wantsMotion());
    if (wantsMotion() && onscreen && pageVisible && hasSize && !contextLost) start();
    else stop();
  };

  const showStill = () => {
    stop();
    poseStill();
    settleOntoLanes();
    if (hasSize && !contextLost) render();
  };

  /* ── Sizing: the hero's real box, never the viewport ── */
  const frameCamera = (aspect: number) => {
    camera.aspect = aspect;
    const baseV = config.camera.fov * DEG;
    const minH = config.camera.minHorizontalFov * DEG;
    let fov = baseV;
    if (2 * Math.atan(Math.tan(baseV / 2) * aspect) < minH) {
      fov = Math.min(config.camera.maxFov * DEG, 2 * Math.atan(Math.tan(minH / 2) / aspect));
    }
    camera.fov = fov / DEG;
    camera.updateProjectionMatrix();
  };

  const resize = () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (width < 1 || height < 1) {
      hasSize = false;
      evaluate();
      return;
    }
    hasSize = true;
    const mobile = width < config.mobileBreakpoint;
    const dprCap = mobile ? config.pixelRatio.mobile : config.pixelRatio.desktop;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap));
    // `false`: size the drawing buffer only; CSS already sizes the canvas.
    renderer.setSize(width, height, false);
    frameCamera(width / height);
    setActiveCount(mobile ? P.mobile : P.desktop);
    // Resizing clears the drawing buffer, so repaint now rather than leave a
    // blank frame showing while paused.
    if (!contextLost) render();
    evaluate();
  };

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);

  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      onscreen = entries[entries.length - 1]?.isIntersecting ?? false;
      evaluate();
    },
    { threshold: 0 },
  );
  intersectionObserver.observe(container);

  const onVisibilityChange = () => {
    pageVisible = !document.hidden;
    evaluate();
  };
  document.addEventListener("visibilitychange", onVisibilityChange);

  const onReducedMotionChange = (e: MediaQueryListEvent) => {
    reducedMotion = e.matches;
    canvas.style.transition = reducedMotion ? "none" : "opacity 700ms ease";
    if (reducedMotion) showStill();
    evaluate();
  };
  reducedQuery.addEventListener("change", onReducedMotionChange);

  /* ── Context loss: fall back, allow one recovery, never loop ── */
  let restoresLeft = 1;
  const onContextLost = () => {
    contextLost = true;
    stop();
    canvas.style.opacity = "0";
  };
  const onContextRestored = () => {
    if (disposed || restoresLeft <= 0) return;
    restoresLeft -= 1;
    contextLost = false;
    revealed = false;
    if (!wantsMotion()) showStill();
    else if (hasSize) render();
    evaluate();
  };
  // Three registers its own handlers first (it calls preventDefault, which is
  // what makes restoration possible), so these run after its state is reset.
  canvas.addEventListener("webglcontextlost", onContextLost);
  canvas.addEventListener("webglcontextrestored", onContextRestored);

  // Start composed: particles on their lanes, still pose. The animated mode
  // simply begins moving from here.
  poseStill();
  settleOntoLanes();
  resize();

  return {
    dispose() {
      if (disposed) return;
      disposed = true;
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      reducedQuery.removeEventListener("change", onReducedMotionChange);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);

      gridGeometry.dispose();
      gridMaterial.dispose();
      pointsGeometry.dispose();
      pointsMaterial.dispose();
      // dispose() detaches three's own context listeners first, so the forced
      // loss below frees the context without any handler reacting to it.
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}
