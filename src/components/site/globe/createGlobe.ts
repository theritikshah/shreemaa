import * as THREE from "three";
import { geoEquirectangular, geoOrthographic, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import { DEFAULT_PALETTE } from "@/components/command-hero/config";

export type GlobeLocation = {
  city: string;
  country: string;
  role: string;
  coords: [number, number];
};

/**
 * A lighter shade of the section's background gradient: its first stop's hue
 * and saturation at a raised lightness (sRGB). Land stays in the same warm
 * family as the section, just lifted enough to read against it.
 */
function sectionShade(lightness: number): string {
  const hsl = { h: 0, s: 0, l: 0 };
  new THREE.Color(DEFAULT_PALETTE.gradient[0]).getHSL(hsl, THREE.SRGBColorSpace);
  return `#${new THREE.Color().setHSL(hsl.h, hsl.s, lightness, THREE.SRGBColorSpace).getHexString(THREE.SRGBColorSpace)}`;
}

// All visual controls are kept here so the treatment can be tuned as one system.
const settings = {
  background: "#fcf9f3",
  /** The ocean keeps the site's surface colour, faded so the section shows through. */
  oceanOpacity: 0.05,
  land: sectionShade(0.34),
  /** Brighter land, for noise highlights and bright particles. */
  landHighlight: sectionShade(0.58),
  particles: 150000,
  mobileParticles: 65000,
  radius: 1,
  cameraZ: 3.5,
  rotationSpeed: 0.035,
  trailDecay: 2.4,
  trailRadius: 0.068,
  /** Drifting heat-glow noise that lifts the land toward white, as on the reference. */
  shine: {
    frequency: 1.4,
    speed: 0.21,
    /** Stretches our value noise toward the reference's wider-ranging fractal noise. */
    contrast: 1.6,
    threshold: 0.16,
    power: 2.5,
    strength: 0.7,
    whiteness: 0.9,
    landMask: 1.61,
    emissiveThreshold: 0.22,
    emissiveStrength: 1.1,
  },
};

const noise = `
float hash(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
float noise3(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fbm(vec3 p){return noise3(p)*.65+noise3(p*2.03)*.25+noise3(p*4.01)*.1;}
uniform float uShineFrequency,uShineSpeed,uShineContrast,uShineThreshold,uShinePower,uShineStrength;
// Shine heat at a point on the unit sphere; the sphere and particles share one field.
float shineHeat(vec3 p,float time){float n=(fbm(p*uShineFrequency+vec3(0,time*uShineSpeed,0))-.5)*uShineContrast+.5;
return pow(smoothstep(uShineThreshold,1.,n),uShinePower)*uShineStrength;}
`;

function locationVector([lon, lat]: [number, number], radius = 1.025) {
  const phi = THREE.MathUtils.degToRad(lat),
    theta = THREE.MathUtils.degToRad(lon);
  return new THREE.Vector3(
    Math.cos(phi) * Math.sin(theta),
    Math.sin(phi),
    Math.cos(phi) * Math.cos(theta),
  ).multiplyScalar(radius);
}

export async function createGlobe(
  host: HTMLDivElement,
  locations: GlobeLocation[],
  markers: (HTMLButtonElement | null)[],
  signal: AbortSignal,
) {
  const response = await fetch("/globe/land-110m.json", { signal });
  if (!response.ok) throw new Error("Unable to load globe geography");
  const topology = (await response.json()) as Topology<{ land: GeometryCollection }>;
  if (signal.aborted) throw new DOMException("Aborted", "AbortError");
  const land = feature(topology, topology.objects.land);
  const map = document.createElement("canvas");
  map.width = 2048;
  map.height = 1024;
  const context = map.getContext("2d", { willReadFrequently: true })!;
  context.fillStyle = "black";
  context.fillRect(0, 0, map.width, map.height);
  const projection = geoEquirectangular()
    .scale(map.width / (2 * Math.PI))
    .translate([map.width / 2, map.height / 2]);
  context.beginPath();
  geoPath(projection, context)(land);
  context.fillStyle = "white";
  context.fill();
  const pixels = context.getImageData(0, 0, map.width, map.height).data;
  const reducedQuery = matchMedia("(prefers-reduced-motion: reduce)");
  let reduced = reducedQuery.matches;
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "low-power",
    });
  } catch {
    // A real geographic fallback, including for browsers with WebGL disabled.
    const fallback = document.createElement("canvas");
    fallback.width = 900;
    fallback.height = 700;
    const c = fallback.getContext("2d")!;
    const p = geoOrthographic().rotate([-65, -10]).scale(250).translate([450, 345]);
    c.beginPath();
    c.arc(450, 345, 250, 0, Math.PI * 2);
    c.globalAlpha = settings.oceanOpacity;
    c.fillStyle = settings.background;
    c.fill();
    c.globalAlpha = 1;
    c.beginPath();
    geoPath(p, c)(land);
    c.fillStyle = settings.land;
    c.fill();
    host.appendChild(fallback);
    return {
      fallback: true,
      reducedMotion: true,
      setPaused: () => {},
      reset: () => {},
      dispose: () => fallback.remove(),
    };
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setClearColor(settings.background, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  const group = new THREE.Group();
  scene.add(group);
  group.rotation.set(0.14, -1.18, -0.06);
  const mapTexture = new THREE.CanvasTexture(map);
  mapTexture.wrapS = THREE.RepeatWrapping;
  const trail = document.createElement("canvas");
  trail.width = trail.height = 256;
  const trailContext = trail.getContext("2d")!;
  trailContext.fillStyle = "black";
  trailContext.fillRect(0, 0, 256, 256);
  const trailTexture = new THREE.CanvasTexture(trail);
  trailTexture.minFilter = THREE.LinearFilter;
  trailTexture.generateMipmaps = false;
  // Resolve the site's OKLCH surface token into linear light for shader mixing.
  const theme = getComputedStyle(host);
  const colorCanvas = document.createElement("canvas");
  colorCanvas.width = colorCanvas.height = 1;
  const colorContext = colorCanvas.getContext("2d", { willReadFrequently: true })!;
  colorContext.fillStyle = settings.background;
  colorContext.fillStyle = theme.getPropertyValue("--surface").trim() || settings.background;
  colorContext.fillRect(0, 0, 1, 1);
  const [r, g, b] = colorContext.getImageData(0, 0, 1, 1).data;
  const surfaceColor = new THREE.Color().setRGB(r / 255, g / 255, b / 255, THREE.SRGBColorSpace);
  const landColor = new THREE.Color(settings.land);
  const landHighlightColor = new THREE.Color(settings.landHighlight);
  const uniforms = {
    uTime: { value: 0 },
    uMap: { value: mapTexture },
    uTrail: { value: trailTexture },
    uDpr: { value: renderer.getPixelRatio() },
    uHeight: { value: 600 },
    uReduced: { value: reduced ? 1 : 0 },
    uOcean: { value: surfaceColor },
    uLand: { value: landColor },
    uLandHighlight: { value: landHighlightColor },
    uOceanOpacity: { value: settings.oceanOpacity },
    uShineFrequency: { value: settings.shine.frequency },
    uShineSpeed: { value: settings.shine.speed },
    uShineContrast: { value: settings.shine.contrast },
    uShineThreshold: { value: settings.shine.threshold },
    uShinePower: { value: settings.shine.power },
    uShineStrength: { value: settings.shine.strength },
    uShineWhiteness: { value: settings.shine.whiteness },
    uShineLandMask: { value: settings.shine.landMask },
    uShineEmissiveThreshold: { value: settings.shine.emissiveThreshold },
    uShineEmissiveStrength: { value: settings.shine.emissiveStrength },
  };
  const sphereMaterial = new THREE.ShaderMaterial({
    uniforms,
    // Translucent ocean. It still writes depth, so the far hemisphere's
    // particles stay hidden and the globe keeps its solid form.
    transparent: true,
    vertexShader: `varying vec3 vPosition; varying vec3 vNormal; varying vec3 vView;
    void main(){vPosition=position; vec4 mv=modelViewMatrix*vec4(position,1.);vNormal=normalize(normalMatrix*normal);vView=-mv.xyz;gl_Position=projectionMatrix*mv;}`,
    fragmentShader: `${noise}
    uniform sampler2D uMap;uniform float uTime,uOceanOpacity;uniform vec3 uOcean,uLand,uLandHighlight;varying vec3 vPosition,vNormal,vView;
    uniform float uShineWhiteness,uShineLandMask,uShineEmissiveThreshold,uShineEmissiveStrength;
    void main(){vec3 p=normalize(vPosition);vec2 uv=vec2(atan(p.x,p.z)/6.2831853+.5,asin(p.y)/3.14159265+.5);
    float land=0.;for(int x=-2;x<=2;x++){for(int y=-2;y<=2;y++){land+=texture2D(uMap,uv+vec2(float(x),float(y))*.003).r;}}land/=25.;
    float n=fbm(p*3.2+vec3(0,uTime*.13,0));float facing=max(dot(normalize(vNormal),normalize(vView)),0.);float rim=pow(1.-facing,2.3);
    vec3 landColor=mix(uLand,uLandHighlight,smoothstep(.27,.78,n));
    float landMix=land*.84;
    vec3 color=mix(uOcean,landColor,landMix);color=mix(color,vec3(1.),rim*.88);
    // Shine: slow noise drifting over the land, lifting it toward white. The
    // reference blooms an emissive pass; that term is added directly here.
    float heat=shineHeat(p,uTime)*pow(clamp(land*uShineLandMask,0.,1.),uShinePower);
    vec3 shineTone=mix(landColor,vec3(1.),uShineWhiteness);
    color+=shineTone*(heat+smoothstep(uShineEmissiveThreshold,1.,heat)*uShineEmissiveStrength);color=min(color,vec3(1.));
    // Ocean at its own low opacity; land stays solid.
    gl_FragColor=vec4(color,mix(uOceanOpacity,1.,landMix));
    #include <colorspace_fragment>
    }`,
  });
  const sphereGeometry = new THREE.SphereGeometry(settings.radius, 96, 64);
  // Draw order is explicit now the ocean is translucent: sphere first, so its
  // depth hides the far side before the particles and halo are drawn.
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.renderOrder = 0;
  group.add(sphere);

  // Sample geography once. Animation and pointer displacement remain on the GPU.
  const positions: number[] = [],
    seeds: number[] = [];
  let seed = 12345;
  const random = () => {
    seed = (Math.imul(1664525, seed) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const count = host.clientWidth < 600 ? settings.mobileParticles : settings.particles;
  for (let i = 0; i < count; i++) {
    const lon = random() * 360 - 180,
      lat = (Math.asin(random() * 2 - 1) * 180) / Math.PI;
    const x = Math.min(2047, Math.floor(((lon + 180) / 360) * 2048));
    const y = Math.min(1023, Math.floor(((90 - lat) / 180) * 1024));
    if (pixels[(y * 2048 + x) * 4] < 100) continue;
    const p = locationVector([lon, lat], 1.004);
    positions.push(p.x, p.y, p.z);
    seeds.push(random());
  }
  const particlesGeometry = new THREE.BufferGeometry();
  particlesGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  particlesGeometry.setAttribute("aSeed", new THREE.Float32BufferAttribute(seeds, 1));
  const particlesMaterial = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    vertexShader: `${noise}
    uniform float uTime,uDpr,uHeight,uReduced;uniform sampler2D uTrail;attribute float aSeed;varying float vTrail,vSeed,vShine;
    void main(){vec3 p=normalize(position);vec4 clip=projectionMatrix*modelViewMatrix*vec4(position,1.);vec2 uv=clip.xy/clip.w*.5+.5;
    vTrail=texture2D(uTrail,uv).r*(1.-uReduced);vSeed=aSeed;vShine=shineHeat(p,uTime);
    float displacement=fbm(p*2.7+vec3(0,uTime*.22,0))*.025+vTrail*.125;
    vec4 mv=modelViewMatrix*vec4(p*(1.004+displacement),1.);gl_Position=projectionMatrix*mv;
    gl_PointSize=clamp((.006+aSeed*.003)*uHeight*uDpr/(-mv.z)*(1.+vTrail*.45),1.,5.);}`,
    fragmentShader: `uniform vec3 uLand,uLandHighlight,uOcean;uniform float uShineWhiteness,uShineEmissiveThreshold,uShineEmissiveStrength;varying float vTrail,vSeed,vShine;
    void main(){float d=length(gl_PointCoord-.5);float alpha=(1.-smoothstep(.25,.5,d))*(.25+vSeed*.4+vTrail*.5);
    // Land particles in the same warm range as the land beneath them.
    vec3 color=mix(uLand,uLandHighlight,smoothstep(.1,.7,vSeed));color=mix(color,uLandHighlight*1.2,vTrail*.5);
    // The particles cover most of the land, so they carry the shine too.
    vec3 shineTone=mix(color,vec3(1.),uShineWhiteness);
    color=min(color+shineTone*(vShine+smoothstep(uShineEmissiveThreshold,1.,vShine)*uShineEmissiveStrength),vec3(1.));
    gl_FragColor=vec4(color,min(alpha*(1.+vShine*1.5),1.));
    #include <colorspace_fragment>
    }`,
  });
  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  particles.renderOrder = 1;
  group.add(particles);
  // A feathered Fresnel shell supplies the reference's soft halo without a costly full-screen bloom pass.
  const haloMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.BackSide,
    vertexShader: `varying vec3 n,v;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);n=normalize(normalMatrix*normal);v=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}`,
    fragmentShader: `varying vec3 n,v;void main(){float a=pow(1.-abs(dot(normalize(n),normalize(v))),4.)*.16;gl_FragColor=vec4(.82,.9,1.,a);}`,
  });
  const halo = new THREE.Mesh(sphereGeometry, haloMaterial);
  halo.scale.setScalar(1.028);
  halo.renderOrder = 2;
  group.add(halo);
  const markerPositions = locations.map((location) => locationVector(location.coords));
  const world = new THREE.Vector3(),
    projected = new THREE.Vector3(),
    cameraDirection = new THREE.Vector3();
  let width = 1,
    height = 1,
    visible = false,
    paused = reduced,
    frame = 0,
    last = 0,
    time = 0;
  let dragging = false,
    pointerId: number | null = null,
    previousX = 0,
    previousY = 0,
    velocity = 0;
  const pointer = new THREE.Vector2(-1, -1),
    previousPointer = new THREE.Vector2(-1, -1);
  const resize = () => {
    width = host.clientWidth;
    height = host.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / Math.max(height, 1);
    camera.position.set(0, 0, width < 600 ? 4.15 : settings.cameraZ);
    camera.setViewOffset(width, height, width > 900 ? -width * 0.075 : 0, 0, width, height);
    camera.updateProjectionMatrix();
    uniforms.uHeight.value = height;
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  resize();
  const tick = (now: number) => {
    frame = 0;
    if (!visible || document.hidden) return;
    const dt = Math.min((now - (last || now)) / 1000, 0.05);
    last = now;
    if (!paused && !reduced) time += dt;
    uniforms.uTime.value = time;
    if (!dragging && !paused) {
      group.rotation.y += velocity + (reduced ? 0 : dt * settings.rotationSpeed);
      velocity *= Math.pow(0.92, dt * 60);
    }
    trailContext.globalCompositeOperation = "source-over";
    trailContext.fillStyle = `rgba(0,0,0,${1 - Math.exp(-dt * settings.trailDecay)})`;
    trailContext.fillRect(0, 0, 256, 256);
    if (pointer.x >= 0 && !reduced) {
      if (previousPointer.x < 0) previousPointer.copy(pointer);
      const distance = previousPointer.distanceTo(pointer),
        steps = Math.max(1, Math.ceil(distance * 100));
      trailContext.globalCompositeOperation = "lighter";
      for (let i = 0; i <= steps; i++) {
        const x = THREE.MathUtils.lerp(previousPointer.x, pointer.x, i / steps) * 256;
        const y = THREE.MathUtils.lerp(previousPointer.y, pointer.y, i / steps) * 256;
        const radius = settings.trailRadius * 256;
        const gradient = trailContext.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, "rgba(255,255,255,.18)");
        gradient.addColorStop(1, "rgba(255,255,255,0)");
        trailContext.fillStyle = gradient;
        trailContext.fillRect(x - radius, y - radius, radius * 2, radius * 2);
      }
      previousPointer.copy(pointer);
    } else previousPointer.set(-1, -1);
    trailTexture.needsUpdate = true;
    group.updateMatrixWorld();
    markerPositions.forEach((position, index) => {
      const element = markers[index];
      if (!element) return;
      world.copy(position).applyMatrix4(group.matrixWorld);
      cameraDirection.copy(camera.position).sub(world).normalize();
      const front = world.clone().normalize().dot(cameraDirection) > 0.13;
      projected.copy(world).project(camera);
      const shown = front && Math.abs(projected.x) < 0.94 && Math.abs(projected.y) < 0.9;
      element.style.visibility = shown ? "visible" : "hidden";
      element.tabIndex = shown ? 0 : -1;
      element.style.transform = `translate(${(projected.x * 0.5 + 0.5) * width}px,${(-projected.y * 0.5 + 0.5) * height}px) translate(-50%,-50%)`;
    });
    renderer.render(scene, camera);
    frame = requestAnimationFrame(tick);
  };
  const start = () => {
    if (!frame && visible && !document.hidden) {
      last = 0;
      frame = requestAnimationFrame(tick);
    }
  };
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start();
    else {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  });
  observer.observe(host);
  const onVisibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else start();
  };
  document.addEventListener("visibilitychange", onVisibility);
  const move = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    const rect = host.getBoundingClientRect();
    pointer.set((event.clientX - rect.left) / width, (event.clientY - rect.top) / height);
    if (dragging) {
      velocity = (event.clientX - previousX) * 0.004;
      group.rotation.y += velocity;
      group.rotation.x = THREE.MathUtils.clamp(
        group.rotation.x + (event.clientY - previousY) * 0.003,
        -0.8,
        0.8,
      );
    }
    previousX = event.clientX;
    previousY = event.clientY;
  };
  const down = (event: PointerEvent) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    dragging = true;
    pointerId = event.pointerId;
    previousX = event.clientX;
    previousY = event.clientY;
    velocity = 0;
    host.setPointerCapture(event.pointerId);
  };
  const up = () => {
    dragging = false;
    if (pointerId !== null && host.hasPointerCapture(pointerId))
      host.releasePointerCapture(pointerId);
    pointerId = null;
  };
  const leave = () => {
    pointer.set(-1, -1);
    if (!dragging) previousPointer.set(-1, -1);
  };
  const motionChange = () => {
    reduced = reducedQuery.matches;
    uniforms.uReduced.value = reduced ? 1 : 0;
    if (reduced) {
      paused = true;
      velocity = 0;
    }
  };
  reducedQuery.addEventListener("change", motionChange);
  host.addEventListener("pointermove", move);
  host.addEventListener("pointerdown", down);
  host.addEventListener("pointerup", up);
  host.addEventListener("pointercancel", up);
  host.addEventListener("lostpointercapture", up);
  host.addEventListener("pointerleave", leave);
  return {
    fallback: false,
    reducedMotion: reduced,
    setPaused(value: boolean) {
      paused = value;
      velocity = 0;
    },
    reset() {
      group.rotation.set(0.14, -1.18, -0.06);
      velocity = 0;
    },
    dispose() {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reducedQuery.removeEventListener("change", motionChange);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerdown", down);
      host.removeEventListener("pointerup", up);
      host.removeEventListener("pointercancel", up);
      host.removeEventListener("lostpointercapture", up);
      host.removeEventListener("pointerleave", leave);
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      haloMaterial.dispose();
      mapTexture.dispose();
      trailTexture.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
