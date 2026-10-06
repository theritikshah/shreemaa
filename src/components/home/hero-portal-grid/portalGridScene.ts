import {
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

export interface PortalGridController {
  dispose(): void;
}

export type PortalGridTheme = "light" | "dark";

// Fog matches the section background so the grid fades into it; lines
// contrast with it. Dark is --ink (oklch 0.17 0.01 60) in sRGB.
const THEMES: Record<PortalGridTheme, { fog: string; line: string }> = {
  light: { fog: "#fdf9f4", line: "#342d28" },
  dark: { fog: "#130e0b", line: "#f3efe9" },
};

type SceneOptions = {
  mount: HTMLDivElement;
  container: HTMLElement;
  theme?: PortalGridTheme;
};

type AnimatedPlane = {
  lines: LineSegments;
  points: Points;
  update(time: number, pointerX: number): void;
  dispose(): void;
};

const GRID = {
  minX: -40,
  maxX: 40,
  minZ: -60,
  maxZ: 14,
  spacing: 4.1,
  baseY: 9.45,
  xSubdivision: 10,
  zSubdivision: 5,
};

function surfaceY(x: number, z: number, sign: 1 | -1, time: number, pointerX: number) {
  const depth = (z - GRID.minZ) / (GRID.maxZ - GRID.minZ);
  const edgeBend = Math.pow(Math.abs(x) / GRID.maxX, 1.65) * 3.3;
  const longWave = Math.sin(z * 0.125 + time * 0.72) * (0.42 + depth * 0.18);
  const crossWave = Math.sin(x * 0.09 + z * 0.045 - time * 0.46) * 0.18;
  const breathing = Math.sin(time * 0.48 + z * 0.035) * 0.48;
  const pointerWarp = (x / GRID.maxX) * pointerX * 0.65;
  return sign * (GRID.baseY + edgeBend + longWave + crossWave + breathing + pointerWarp);
}

function makeAnimatedPlane(sign: 1 | -1, lineColor: Color, accentColor: Color): AnimatedPlane {
  const lineBase: number[] = [];
  const addSegment = (ax: number, az: number, bx: number, bz: number) => lineBase.push(ax, az, bx, bz);

  for (let x = Math.ceil(GRID.minX / GRID.spacing) * GRID.spacing; x <= GRID.maxX; x += GRID.spacing) {
    const steps = Math.ceil((GRID.maxZ - GRID.minZ) / (GRID.spacing / GRID.zSubdivision));
    for (let i = 0; i < steps; i++) {
      const az = GRID.minZ + ((GRID.maxZ - GRID.minZ) * i) / steps;
      const bz = GRID.minZ + ((GRID.maxZ - GRID.minZ) * (i + 1)) / steps;
      addSegment(x, az, x, bz);
    }
  }

  for (let z = Math.ceil(GRID.minZ / GRID.spacing) * GRID.spacing; z <= GRID.maxZ; z += GRID.spacing) {
    const steps = Math.ceil((GRID.maxX - GRID.minX) / (GRID.spacing / GRID.xSubdivision));
    for (let i = 0; i < steps; i++) {
      const ax = GRID.minX + ((GRID.maxX - GRID.minX) * i) / steps;
      const bx = GRID.minX + ((GRID.maxX - GRID.minX) * (i + 1)) / steps;
      addSegment(ax, z, bx, z);
    }
  }

  const linePositions = new Float32Array((lineBase.length / 2) * 3);
  const lineGeometry = new BufferGeometry();
  const lineAttribute = new BufferAttribute(linePositions, 3);
  lineGeometry.setAttribute("position", lineAttribute);
  const lineMaterial = new LineBasicMaterial({
    color: lineColor,
    transparent: true,
    opacity: 0.12,
    depthWrite: false,
  });
  const lines = new LineSegments(lineGeometry, lineMaterial);

  const nodeBase: number[] = [];
  const nodeColors: number[] = [];
  let nodeIndex = 0;
  for (let z = Math.ceil(GRID.minZ / GRID.spacing) * GRID.spacing; z <= GRID.maxZ; z += GRID.spacing) {
    for (let x = Math.ceil(GRID.minX / GRID.spacing) * GRID.spacing; x <= GRID.maxX; x += GRID.spacing) {
      nodeBase.push(x, z);
      const isAccent = Math.abs((nodeIndex * 17 + Math.round(z)) % 41) === 0;
      const color = isAccent ? accentColor : lineColor;
      nodeColors.push(color.r, color.g, color.b);
      nodeIndex++;
    }
  }

  const pointPositions = new Float32Array((nodeBase.length / 2) * 3);
  const pointGeometry = new BufferGeometry();
  const pointAttribute = new BufferAttribute(pointPositions, 3);
  pointGeometry.setAttribute("position", pointAttribute);
  pointGeometry.setAttribute("color", new BufferAttribute(new Float32Array(nodeColors), 3));
  const pointMaterial = new PointsMaterial({
    size: 0.105,
    vertexColors: true,
    transparent: true,
    opacity: 0.74,
    sizeAttenuation: true,
    depthWrite: false,
    blending: NormalBlending,
  });
  const points = new Points(pointGeometry, pointMaterial);

  const update = (time: number, pointerX: number) => {
    let write = 0;
    for (let i = 0; i < lineBase.length; i += 4) {
      const ax = lineBase[i];
      const az = lineBase[i + 1];
      const bx = lineBase[i + 2];
      const bz = lineBase[i + 3];
      linePositions[write++] = ax;
      linePositions[write++] = surfaceY(ax, az, sign, time, pointerX);
      linePositions[write++] = az;
      linePositions[write++] = bx;
      linePositions[write++] = surfaceY(bx, bz, sign, time, pointerX);
      linePositions[write++] = bz;
    }
    lineAttribute.needsUpdate = true;

    write = 0;
    for (let i = 0; i < nodeBase.length; i += 2) {
      const x = nodeBase[i];
      const z = nodeBase[i + 1];
      pointPositions[write++] = x;
      pointPositions[write++] = surfaceY(x, z, sign, time, pointerX);
      pointPositions[write++] = z;
    }
    pointAttribute.needsUpdate = true;
  };
  update(0, 0);

  return {
    lines,
    points,
    update,
    dispose() {
      lineGeometry.dispose();
      lineMaterial.dispose();
      pointGeometry.dispose();
      pointMaterial.dispose();
    },
  };
}

export function createPortalGridScene({ mount, container, theme = "light" }: SceneOptions): PortalGridController {
  const colors = THEMES[theme];
  const scene = new Scene();
  scene.fog = new Fog(new Color(colors.fog), 20, 64);

  const camera = new PerspectiveCamera(44, 1, 0.1, 130);
  camera.position.set(0, 0, 17.5);
  camera.lookAt(0, 0, -13);

  const renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  renderer.domElement.style.display = "block";
  mount.appendChild(renderer.domElement);

  const world = new Group();
  scene.add(world);

  const ink = new Color(colors.line);
  const brand = new Color("#fe0000");
  const ceiling = makeAnimatedPlane(1, ink, brand);
  const floor = makeAnimatedPlane(-1, ink, brand);
  world.add(ceiling.lines, ceiling.points, floor.lines, floor.points);

  const pointer = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const onPointerMove = (event: PointerEvent) => {
    const bounds = container.getBoundingClientRect();
    target.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    target.y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
  };
  const onPointerLeave = () => {
    target.x = 0;
    target.y = 0;
  };
  container.addEventListener("pointermove", onPointerMove, { passive: true });
  container.addEventListener("pointerleave", onPointerLeave);

  let width = 0;
  let height = 0;
  const resize = () => {
    const nextWidth = Math.max(1, container.clientWidth);
    const nextHeight = Math.max(1, container.clientHeight);
    if (nextWidth === width && nextHeight === height) return;
    width = nextWidth;
    height = nextHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // Widen the field on portrait screens instead of cropping it to a few columns.
    camera.fov = width < 768 ? 57 : 44;
    camera.updateProjectionMatrix();
  };
  resize();
  const observer = new ResizeObserver(resize);
  observer.observe(container);

  let frame = 0;
  const started = performance.now();
  const render = (now: number) => {
    frame = requestAnimationFrame(render);
    resize();
    const elapsed = (now - started) / 1000;
    const time = reducedMotion ? 0 : elapsed;
    pointer.x += (target.x - pointer.x) * 0.045;
    pointer.y += (target.y - pointer.y) * 0.045;

    ceiling.update(time, pointer.x);
    floor.update(time + 0.65, -pointer.x);

    camera.position.x = pointer.x * 1.45;
    camera.position.y = pointer.y * -0.72;
    camera.lookAt(pointer.x * 0.75, pointer.y * -0.32, -13);
    world.rotation.z = reducedMotion ? 0 : Math.sin(time * 0.22) * 0.004;
    renderer.render(scene, camera);
  };
  frame = requestAnimationFrame(render);
  mount.classList.add("is-ready");

  return {
    dispose() {
      cancelAnimationFrame(frame);
      observer.disconnect();
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onPointerLeave);
      ceiling.dispose();
      floor.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      mount.classList.remove("is-ready");
    },
  };
}
