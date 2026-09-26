import * as THREE from "three";
import { createWebGL2Context } from "@/lib/webgl";

const vertex = /* glsl */ `
  attribute vec4 aSeed;
  uniform float uTime;
  uniform float uAspect;
  uniform float uDpr;
  uniform float uMobile;
  uniform vec2 uPointer;
  varying float vAlpha;
  varying float vTint;
  void main() {
    float t = uTime;
    vec3 p;
    float depth = aSeed.z;
    // A low, rippling bed of motes extending beneath the copy.
    float x = aSeed.x * 2.5 - 1.25;
    float wave = sin(x * 5.0 + depth * 4.0 + t * .19) * .11;
    wave += sin(x * 9.0 - t * .12 + aSeed.y * 5.0) * .045;
    p = vec3(x * uAspect, -.72 + wave + (aSeed.y - .5) * .30, depth);
    p.y += .24 * pow(abs(x), 2.0) * sin(depth * 5.0 + t * .1);
    vAlpha = .05 + pow(aSeed.z, 3.0) * .22;
    vec2 delta = p.xy - uPointer;
    float influence = exp(-dot(delta, delta) * 9.0);
    p.xy += normalize(delta + vec2(.001)) * influence * .13;
    // Preserve a quiet reading area rather than placing bright motes over text.
    float leftQuiet = smoothstep(-.15 * uAspect, .42 * uAspect, p.x);
    float belowCopy = 1.0 - smoothstep(-.65, -.38, p.y);
    vAlpha *= mix(.12, 1.0, max(leftQuiet, belowCopy));
    vTint = aSeed.y;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p.xy, 0.0, 1.0);
    float size = .65 + pow(aSeed.z, 5.0) * 2.05;
    gl_PointSize = size * uDpr;
  }
`;
const fragment = /* glsl */ `
  uniform vec3 uBrand;
  uniform vec3 uPaper;
  varying float vAlpha;
  varying float vTint;
  void main() {
    // Square, softly edged fragments like the reference's particle field.
    float edge = max(abs(gl_PointCoord.x-.5), abs(gl_PointCoord.y-.5));
    float alpha = (1.0-smoothstep(.35,.5,edge)) * vAlpha;
    vec3 color = mix(uBrand, uPaper, smoothstep(.32,.96,vTint) * .78);
    gl_FragColor = vec4(color, alpha);
    #include <colorspace_fragment>
  }
`;

export function createAboutField(mount: HTMLElement) {
  const canvas = document.createElement("canvas");
  const context = createWebGL2Context(canvas);
  if (!context) return null;
  const renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  mount.append(canvas);
  canvas.style.cssText = "display:block;width:100%;height:100%";
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, .1, 10);
  camera.position.z = 2;
  // Just the bed now: its share (58%) of the original 16k / 42k, so its density is unchanged.
  const count = window.innerWidth < 768 ? 9300 : 24400;
  const seeds = new Float32Array(count * 4);
  let seed = 1997;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  for (let i = 0; i < seeds.length; i++) seeds[i] = random();
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 4));
  const uniforms = {
    uTime: { value: 0 }, uAspect: { value: 1 },
    uDpr: { value: renderer.getPixelRatio() }, uMobile: { value: 0 },
    uPointer: { value: new THREE.Vector2(10, 10) },
    // Two greys, so the motes keep their tonal variation on the light surface.
    uBrand: { value: new THREE.Color("#6b6b6b") },
    uPaper: { value: new THREE.Color("#a3a3a3") },
  };
  const material = new THREE.ShaderMaterial({ vertexShader: vertex, fragmentShader: fragment,
    uniforms, transparent: true, depthWrite: false, depthTest: false });
  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  scene.add(points);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let visible = true;
  let disposed = false;
  let last = 0;
  let time = 0;
  const target = new THREE.Vector2(10, 10);
  const render = () => renderer.render(scene, camera);
  const resize = () => {
    const { clientWidth: w, clientHeight: h } = mount;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    const aspect = w / h;
    camera.left = -aspect; camera.right = aspect;
    camera.updateProjectionMatrix();
    uniforms.uAspect.value = aspect;
    uniforms.uMobile.value = w < 768 ? 1 : 0;
    render();
  };
  const ro = new ResizeObserver(resize); ro.observe(mount); resize();
  const tick = (now: number) => {
    const dt = Math.min((now - last) / 1000, .05); last = now;
    if (!visible || document.hidden || disposed) return;
    time += dt;
    uniforms.uTime.value = time;
    uniforms.uPointer.value.lerp(target, 1 - Math.exp(-dt * 4));
    render();
  };
  const sync = () => {
    renderer.setAnimationLoop(!reduced.matches && visible && !document.hidden ? tick : null);
    if (reduced.matches) { uniforms.uTime.value = 0; render(); }
    last = performance.now();
  };
  const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
  io.observe(mount);
  const parent = mount.parentElement!;
  const move = (event: PointerEvent) => {
    if (reduced.matches || event.pointerType === "touch") return;
    const rect = mount.getBoundingClientRect();
    target.set(((event.clientX - rect.left) / rect.width * 2 - 1) * uniforms.uAspect.value,
      1 - (event.clientY - rect.top) / rect.height * 2);
  };
  const leave = () => target.set(10, 10);
  const lost = (event: Event) => { event.preventDefault(); renderer.setAnimationLoop(null); canvas.style.opacity = "0"; };
  parent.addEventListener("pointermove", move);
  parent.addEventListener("pointerleave", leave);
  canvas.addEventListener("webglcontextlost", lost);
  reduced.addEventListener("change", sync);
  document.addEventListener("visibilitychange", sync);
  sync();
  return () => {
    disposed = true; renderer.setAnimationLoop(null); ro.disconnect(); io.disconnect();
    parent.removeEventListener("pointermove", move); parent.removeEventListener("pointerleave", leave);
    canvas.removeEventListener("webglcontextlost", lost); reduced.removeEventListener("change", sync);
    document.removeEventListener("visibilitychange", sync);
    geometry.dispose(); material.dispose(); renderer.dispose(); canvas.remove();
  };
}
