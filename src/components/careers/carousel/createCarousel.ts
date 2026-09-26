import * as THREE from "three";

export type CarouselOptions = {
  onActiveChange: (index: number) => void;
  onSelect: (index: number) => void;
  onError: () => void;
};

export type CarouselScene = {
  goTo: (index: number) => void;
  step: (dir: 1 | -1) => void;
  dispose: () => void;
  reducedMotion: boolean;
  setPaused: (paused: boolean) => void;
};

const RADIUS = 4.3;
const PANEL_WIDTH = 1.6;
const SLOTS = 15;
const TILT = THREE.MathUtils.degToRad(-13);
const PANEL_HEIGHT = 1.6;

const AUTO_SPEED = -0.04; // radians per second
const SEGMENTS = 48;

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uImageAspect;
  uniform float uPlaneAspect;
  uniform float uRadius;
  uniform float uHover;
  uniform float uOpacity;
  uniform float uLoaded;
  varying vec2 vUv;

  float roundedBox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }

  void main() {
    // object-fit: cover
    vec2 scale = uImageAspect > uPlaneAspect
      ? vec2(uPlaneAspect / uImageAspect, 1.0)
      : vec2(1.0, uImageAspect / uPlaneAspect);
    scale *= 1.0 - 0.06 * uHover;
    vec2 uv = (vUv - 0.5) * scale + 0.5;
    vec4 tex = texture2D(uMap, uv);
    vec3 color = mix(vec3(0.9, 0.89, 0.87), tex.rgb, uLoaded);

    vec2 p = (vUv - 0.5) * vec2(uPlaneAspect, 1.0);
    float d = roundedBox(p, vec2(uPlaneAspect * 0.5, 0.5), uRadius);
    float alpha = 1.0 - smoothstep(-fwidth(d), fwidth(d), d);

    alpha *= uOpacity;
    if (alpha < 0.002) discard;
    gl_FragColor = vec4(color, alpha);
    #include <colorspace_fragment>
  }
`;

/** Gently convex panels, viewed from outside the tilted ring. */
function curvedPlane(width: number, height: number) {
  const geo = new THREE.PlaneGeometry(width, height, SEGMENTS, 1);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const edge = pos.getX(i) / (width / 2);
    pos.setZ(i, -0.12 * edge * edge);
  }
  geo.computeVertexNormals();
  return geo;
}

const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

export function createCarousel(
  mount: HTMLElement,
  urls: string[],
  { onActiveChange, onSelect, onError }: CarouselOptions,
): CarouselScene {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let disposed = false;
  let paused = false;
  let resumeAt = 0;
  const count = SLOTS;
  const slot = (Math.PI * 2) / count;
  const panelWidth = PANEL_WIDTH;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  mount.appendChild(renderer.domElement);
  const canvas = renderer.domElement;
  canvas.style.display = "block";
  canvas.style.touchAction = "pan-y";

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(24, 1, 0.1, 100);
  const group = new THREE.Group();
  camera.position.z = 8.6;
  group.rotation.x = TILT;
  group.position.y = RADIUS * Math.sin(TILT);
  scene.add(group);

  const geometry = curvedPlane(panelWidth, PANEL_HEIGHT);
  const loader = new THREE.TextureLoader();
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const panels: THREE.Mesh[] = [];
  const materials: THREE.ShaderMaterial[] = [];
  const textures: THREE.Texture[] = [];


  Array.from({ length: count }, (_, i) => urls[i % urls.length]).forEach((url, i) => {
    const uniforms = {
      uMap: { value: null as THREE.Texture | null },
      uImageAspect: { value: 1 },
      uPlaneAspect: { value: panelWidth / PANEL_HEIGHT },
      uRadius: { value: 0.05 },
      uHover: { value: 0 },
      uOpacity: { value: 1 },
      uLoaded: { value: 0 },
    };
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geometry, material);
    const angle = i * slot;
    mesh.rotation.y = angle;
    mesh.position.set(Math.sin(angle) * RADIUS, 0, Math.cos(angle) * RADIUS);
    mesh.userData.index = i % urls.length;
    group.add(mesh);
    panels.push(mesh);
    materials.push(material);

    loader.load(url, (tex) => {
      if (disposed) { tex.dispose(); return; }
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = maxAniso;
      textures.push(tex);
      const img = tex.image as HTMLImageElement;
      for (const m of [material]) {
        m.uniforms.uMap.value = tex;
        m.uniforms.uImageAspect.value = img.width / img.height;
        m.uniforms.uLoaded.value = 1;
      }
    }, undefined, () => { if (!disposed) onError(); });
  });

  // ── Motion state ──
  // The front panel has base angle + rotation equal to zero.
  let rotation = 0;
  let velocity = reducedMotion ? 0 : AUTO_SPEED;
  let target: number | null = null;
  let active = -1;
  let visible = true;
  let hovered = -1;

  const emitActive = () => {
    const i = ((Math.round(-rotation / slot) % count + count) % count) % urls.length;
    if (i !== active) {
      active = i;
      onActiveChange(i);
    }
  };

  const goTo = (index: number) => {
    const candidates = panels.map((panel, i) => panel.userData.index === index ? rotation + wrap(-i * slot - rotation) : Infinity);
    target = candidates.reduce((best, candidate) => Math.abs(candidate - rotation) < Math.abs(best - rotation) ? candidate : best, Infinity);
    resumeAt = performance.now() + 5000;
    if (reducedMotion) { rotation = target; target = null; velocity = 0; }
  };
  const step = (dir: 1 | -1) => {
    goTo((active + dir + urls.length) % urls.length);
  };

  // ── Sizing ──
  const resize = () => {
    const w = mount.clientWidth;
    const h = mount.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    camera.aspect = w / h;
    camera.fov = w <= 768 ? 49 : w <= 1024 ? 40 : 24;
    const radius = w <= 768 ? 4 : RADIUS;
    group.position.y = radius * Math.sin(TILT);
    panels.forEach((panel, i) => panel.position.set(Math.sin(i * slot) * radius, 0, Math.cos(i * slot) * radius));
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(mount);
  resize();

  // Pointer drag rotates the ring; a short click opens the selected photo.
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let dragging = false;
  let dragMoved = 0;
  let lastX = 0;
  let lastT = 0;
  let pointerId = -1;

  const pick = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    ndc.set(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1,
    );
    raycaster.setFromCamera(ndc, camera);
    const hit = raycaster.intersectObjects(panels, false)[0];
    return hit ? (hit.object.userData.index as number) : -1;
  };



  const onDown = (e: PointerEvent) => {
    if (e.button !== 0 || dragging) return;
    dragging = true;
    dragMoved = 0;
    lastX = e.clientX;
    lastT = performance.now();
    pointerId = e.pointerId;
    target = null;
  };
  const onMove = (e: PointerEvent) => {
    if (dragging && e.pointerId === pointerId) {
      const dx = e.clientX - lastX;
      const now = performance.now();
      dragMoved += Math.abs(dx);
      if (dragMoved > 6 && !canvas.hasPointerCapture(e.pointerId))
        canvas.setPointerCapture(e.pointerId);
      const delta = dx * 0.005;
      rotation += delta;
      velocity = (delta / Math.max(now - lastT, 1)) * 1000;
      lastX = e.clientX;
      lastT = now;
      canvas.style.cursor = "grabbing";
      return;
    }
    if (e.pointerType === "mouse") {
      hovered = pick(e);
      canvas.style.cursor = hovered >= 0 ? "pointer" : "grab";
    }
  };
  const onUp = (e: PointerEvent) => {
    if (!dragging || e.pointerId !== pointerId) return;
    dragging = false;
    if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    canvas.style.cursor = "grab";
    resumeAt = performance.now() + 5000;
    if (e.type !== "pointercancel" && dragMoved < 6) {
      const i = pick(e);
      if (i >= 0) onSelect(i);
      velocity = 0;
    }
  };
  const onLeave = () => {
    hovered = -1;
  };

  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onUp);
  canvas.addEventListener("pointerleave", onLeave);
  canvas.style.cursor = "grab";

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  });
  io.observe(mount);

  // ── Loop ──
  const clock = new THREE.Clock();
  const tick = () => {
    const dt = Math.min(clock.getDelta(), 0.05);
    if (!visible || document.hidden || disposed) return;

    if (target !== null) {
      const diff = target - rotation;
      rotation += diff * (1 - Math.exp(-dt * 6));
      if (Math.abs(diff) < 0.0005) {
        rotation = target;
        target = null;
        velocity = 0;
      }
    } else if (!dragging) {
      const rest = reducedMotion || paused || performance.now() < resumeAt ? 0 : AUTO_SPEED;
      if (paused || reducedMotion) velocity = 0;
      velocity += (rest - velocity) * (1 - Math.exp(-dt * 2.2));
      rotation += velocity * dt;
    }
    group.rotation.y = rotation;

    for (let i = 0; i < count; i++) {
      materials[i].uniforms.uHover.value = 0;
      const facing = Math.cos(i * slot + rotation);
      materials[i].uniforms.uOpacity.value = facing >= 0.5 ? 1 : Math.max(0, (facing + 1) / 1.5);
    }

    emitActive();
    renderer.render(scene, camera);
  };
  renderer.setAnimationLoop(tick);
  const onContextLost = (event: Event) => { event.preventDefault(); onError(); };
  canvas.addEventListener("webglcontextlost", onContextLost);

  return {
    goTo,
    step,
    reducedMotion,
    setPaused: (value) => { paused = value; if (value) velocity = 0; },
    dispose: () => {
      if (disposed) return;
      disposed = true;
      canvas.removeEventListener("webglcontextlost", onContextLost);
      renderer.setAnimationLoop(null);
      ro.disconnect();
      io.disconnect();

      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
      geometry.dispose();
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      renderer.dispose();
      canvas.remove();
    },
  };
}
