/**
 * GLSL for the command hero. Three compiles ShaderMaterial as GLSL ES 3.0,
 * so `texelFetch` and dynamic uniform-array indexing are available.
 *
 * Colours are passed and written in sRGB with no conversion: the canvas is
 * an sRGB surface, and these are flat 2D layers rather than lit materials.
 *
 * Coordinates: "vh units" from the viewport centre, y up. A point at
 * (x, y) maps to clip space (x / halfWidth, y / 0.5).
 */

export const particleVertexShader = /* glsl */ `
  attribute float aU;
  attribute float aRow;
  attribute float aSystem;
  attribute float aRing;
  attribute vec3 aSeed;

  uniform sampler2D uPaths;
  uniform float uSamples;
  uniform float uTime;
  uniform float uIntro;
  uniform float uMorph;
  uniform float uShift;
  uniform float uHalfWidth;
  uniform float uRadius;
  uniform float uTiltCos;
  uniform float uTiltSin;
  uniform float uFlowRate;
  uniform float uDpr;
  uniform vec2 uQuiet;
  uniform vec4 uSysA[SYSTEMS]; // ringY, ringSpacing, radiusScale, settledJitter
  uniform vec4 uSysB[SYSTEMS]; // noise, sineAmplitude, sineFrequency, sineSpeed
  uniform vec4 uSysC[SYSTEMS]; // pulseAmplitude, pulseSpeed, opacity, appearDelay
  uniform vec4 uSysD[SYSTEMS]; // morphStart, morphEnd, kind, strandSpacing
  uniform vec2 uSize[SYSTEMS];

  varying float vAlpha;

  const float TAU = 6.2831853;

  // Linear interpolation between neighbouring samples of a trajectory row.
  vec3 pathAt(float row, float u) {
    float f = clamp(u, 0.0, 1.0) * (uSamples - 1.0);
    float i0 = floor(f);
    int r = int(row + 0.5);
    vec3 a = texelFetch(uPaths, ivec2(int(i0), r), 0).xyz;
    vec3 b = texelFetch(uPaths, ivec2(int(min(i0 + 1.0, uSamples - 1.0)), r), 0).xyz;
    return mix(a, b, f - i0);
  }

  // Smooth, cheap wandering offset: a few incommensurate sines per axis.
  vec2 drift(float seed, float t) {
    return vec2(
      sin(t * 0.9 + seed * 17.0) + 0.5 * sin(t * 2.1 + seed * 41.0),
      cos(t * 0.7 + seed * 23.0) + 0.5 * sin(t * 1.7 + seed * 31.0)
    ) / 1.5;
  }

  void main() {
    int si = int(aSystem + 0.5);
    vec4 A = uSysA[si];
    vec4 B = uSysB[si];
    vec4 C = uSysC[si];
    vec4 D = uSysD[si];
    bool spoke = abs(D.z - 1.0) < 0.5;

    // One position along the trajectory drives both the flow and the ring.
    float u = fract(aU + uTime * uFlowRate);

    // Staggered convergence within this system's share of the morph.
    float start = D.x + aSeed.x * 0.18 * (D.y - D.x) + aRing * 0.01;
    float m = smoothstep(start, D.y, uMorph);

    // ── Flowing strands ────────────────────────────────────────────
    float uf = spoke ? fract(u + (aSeed.y - 0.5) * 0.03) : u;
    vec3 p = pathAt(aRow, uf);
    vec2 tangent = pathAt(aRow, uf + 0.004).xy - pathAt(aRow, uf - 0.004).xy;
    tangent /= max(length(tangent), 1e-5);
    vec2 normal = vec2(-tangent.y, tangent.x);
    float across = spoke ? (aRing - 0.5) * D.w : 0.0;
    float wave = B.y * sin(TAU * uf * B.z + uTime * B.w * TAU + aSeed.x * TAU);
    vec2 flowPos = p.xy + normal * (across + wave) + drift(aSeed.x * 7.0 + aSeed.z, uTime * 0.35 + uf * 5.0) * B.x;

    // ── Settled rings ──────────────────────────────────────────────
    // A circle in the XZ plane at height y, tilted about X and viewed
    // orthographically. The front of each ring runs left to right, the same
    // direction as the strands, and u = 0.5 lands at the front centre.
    float radius = uRadius * A.z;
    float theta = -TAU * (u + 0.25);
    float y = A.x + aRing * A.y;
    vec3 c = vec3(radius * cos(theta), y, radius * sin(theta));
    float projectedY = c.y * uTiltCos - c.z * uTiltSin;
    float projectedZ = c.y * uTiltSin + c.z * uTiltCos;
    vec2 ringPos = vec2(c.x, projectedY) + drift(aSeed.z * 13.0, uTime * 0.5 + u * 9.0) * A.w;
    float ringDepth = clamp(projectedZ / max(radius, 1e-3), -1.0, 1.0);

    vec2 world = mix(flowPos, ringPos, m);
    float depth = mix(p.z, ringDepth, m);
    vec2 screen = world - vec2(0.0, uShift);
    gl_Position = vec4(screen.x / uHalfWidth, screen.y / 0.5, 0.0, 1.0);

    float near = depth * 0.5 + 0.5;
    float size = mix(uSize[si].x, uSize[si].y, aSeed.z) * mix(0.72, 1.18, near) * uDpr;
    float alpha = C.z * mix(0.5, 1.0, near);
    alpha *= 1.0 - C.x * 0.5 + C.x * 0.5 * sin(uTime * C.y + aSeed.y * TAU);

    // Staggered fade-in on first appearance.
    float delay = C.w + aSeed.y * 0.9;
    alpha *= smoothstep(delay, delay + 1.4, uIntro);

    // Hide the wrap from one end of an open path to the other.
    float seam = smoothstep(0.0, 0.06, uf) * (1.0 - smoothstep(0.94, 1.0, uf));
    alpha *= mix(seam, 1.0, m);

    // Keep the centre quiet behind the opening copy.
    float q = length(vec2(screen.x / (uQuiet.x * uHalfWidth), screen.y / uQuiet.y));
    alpha *= mix(mix(0.12, 1.0, smoothstep(0.55, 1.15, q)), 1.0, m);

    // Sub-pixel points are drawn at one pixel with proportionally less
    // alpha, so tiny particles don't read as bright clamped dots.
    if (size < 1.0) {
      alpha *= size;
      size = 1.0;
    }
    gl_PointSize = size;
    vAlpha = alpha;
  }
`;

export const particleFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = (1.0 - smoothstep(0.28, 0.5, d)) * vAlpha;
    if (a <= 0.002) discard;
    // Premultiplied, to match the premultiplied blend.
    gl_FragColor = vec4(uColor * a, a);
  }
`;

export const compositeVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = position.xy * 0.5 + 0.5;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

/**
 * Background gradient, elliptical ring fills, the particle layer (when
 * rendered to a target), then grain and dithering over everything.
 */
export const compositeFragmentShader = /* glsl */ `
  uniform sampler2D uScene;
  uniform float uUseScene;
  uniform vec3 uGradient0;
  uniform vec3 uGradient1;
  uniform vec3 uGradient2;
  uniform vec3 uFill;
  uniform float uFillOpacity;
  uniform float uFillMorph;
  uniform vec2 uBandY;
  uniform float uHalfWidth;
  uniform float uShift;
  uniform float uRadius;
  uniform float uTiltSin;
  uniform float uGrain;
  uniform vec3 uGlow;
  uniform float uGlowOpacity;
  uniform vec2 uGlowCentre;
  uniform float uGlowRadius;

  varying vec2 vUv;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float fill(vec2 s, float bandY) {
    vec2 e = vec2(s.x / uRadius, (s.y - (bandY - uShift)) / max(uRadius * uTiltSin, 1e-3));
    float d = length(e);
    return 1.0 - smoothstep(0.15, 1.05, d);
  }

  void main() {
    vec2 s = vec2((vUv.x - 0.5) * 2.0 * uHalfWidth, vUv.y - 0.5);

    // Low-contrast diagonal, top-left to bottom-right, aspect-correct.
    vec2 dir = normalize(vec2(1.0, -1.0));
    float reach = abs(dot(vec2(uHalfWidth, 0.5), normalize(vec2(1.0, 1.0))));
    float t = clamp(0.5 + 0.5 * dot(s, dir) / reach, 0.0, 1.0);
    vec3 color = t < 0.5 ? mix(uGradient0, uGradient1, t / 0.5) : mix(uGradient1, uGradient2, (t - 0.5) / 0.5);

    // Broad brand glow, the soft-blurred circle the site's dark sections use.
    vec2 g = vec2(s.x - uGlowCentre.x * uHalfWidth, s.y - uGlowCentre.y);
    color = mix(color, uGlow, exp(-dot(g, g) / (2.0 * uGlowRadius * uGlowRadius)) * uGlowOpacity);

    float f = max(fill(s, uBandY.x), fill(s, uBandY.y)) * uFillOpacity * uFillMorph;
    color = mix(color, uFill, f);

    if (uUseScene > 0.5) {
      vec4 scene = texture2D(uScene, vUv);
      color = color * (1.0 - scene.a) + scene.rgb;
    }

    // Static grain: a surface texture, not flickering noise.
    color += (hash(gl_FragCoord.xy) - 0.5) * uGrain;
    // Sub-quantum dither against banding in the dark gradient.
    color += (hash(gl_FragCoord.yx + 17.0) - 0.5) / 255.0;

    gl_FragColor = vec4(color, 1.0);
  }
`;
