/**
 * GLSL for the particle globe. All motion — assembly flights, rotation,
 * breathing, pulsing and light packets — runs here from uniforms, so the
 * buffers built in `geometry.ts` are uploaded once and never touched again.
 *
 * Uniform colours arrive in three's linear working space, so each fragment
 * shader ends with `colorspace_fragment` to encode back to the canvas's sRGB.
 */

/** Y spin then X tilt. The same function in every shader keeps arcs, packets and dots aligned. */
const ROTATE_GLOBE = /* glsl */ `
  vec3 rotateGlobe(vec3 v) {
    float cy = cos(uRotY);
    float sy = sin(uRotY);
    vec3 r = vec3(cy * v.x + sy * v.z, v.y, -sy * v.x + cy * v.z);
    float cx = cos(uRotX);
    float sx = sin(uRotX);
    return vec3(r.x, cx * r.y - sx * r.z, sx * r.y + cx * r.z);
  }
`;

/**
 * Where a connection's light is, 0–1 along its arc, plus whether it is in
 * flight. Shared by the packet (points) and its trail (lines) so both read
 * the same clock and cannot drift apart.
 */
const TRIP = /* glsl */ `
  // Returns eased trip progress in x and 1.0 while travelling in y.
  vec2 trip(float frequency, float offset) {
    float cycle = fract(uTime * frequency + offset);
    float running = step(cycle, uTripFraction);
    float t = clamp(cycle / uTripFraction, 0.0, 1.0);
    return vec2(t * t * (3.0 - 2.0 * t), running);
  }

  // Gentle fade out of the origin and into the destination.
  float tripFade(float t) {
    return smoothstep(0.0, 0.08, t) * (1.0 - smoothstep(0.92, 1.0, t));
  }
`;

export const pointsVertexShader = /* glsl */ `
  attribute vec3 aScatter;
  attribute float aDelay;
  attribute float aSize;
  attribute float aPhase;
  attribute float aAccent;
  attribute float aArcT;

  uniform float uTime;
  uniform float uProgress;
  uniform float uArcProgress;
  uniform float uPixelRatio;
  uniform float uScale;
  uniform float uMotion;
  uniform float uRotY;
  uniform float uRotX;
  uniform float uTripFraction;
  uniform float uArcHeight;
  uniform float uOpacity;

  varying float vAlpha;
  varying float vAccent;

  ${ROTATE_GLOBE}
  ${TRIP}

  float expoOut(float x) {
    return x >= 1.0 ? 1.0 : 1.0 - pow(2.0, -10.0 * x);
  }

  void main() {
    // 0 = globe particle, 1 = light packet travelling an arc.
    float isPacket = step(0.0, aArcT);
    float motionOn = step(0.0001, uMotion);

    // Globe particle: flies from its fixed world-space start to its target.
    // Only the target rotates, so starts stay pinned beyond the canvas edge.
    vec3 target = rotateGlobe(position);
    float flight = expoOut(clamp((uProgress - aDelay) / 0.45, 0.0, 1.0));
    vec3 globePos = mix(aScatter, target, flight);
    globePos += target * sin(uTime * 0.6 + aPhase * 6.2831853) * 0.004 * flight * uMotion;

    // Packet: slerp from origin (position) to destination (aScatter), lifted
    // exactly as its arc is. aDelay holds the frequency, aArcT the offset.
    float angle = acos(clamp(dot(position, aScatter), -1.0, 1.0));
    float sinAngle = max(sin(angle), 0.0001);
    vec2 packet = trip(aDelay, aArcT);
    float tt = packet.x;
    vec3 along = (sin((1.0 - tt) * angle) * position + sin(tt * angle) * aScatter) / sinAngle;
    vec3 packetPos = rotateGlobe(along * (1.0 + uArcHeight * sin(3.14159265 * tt)));

    vec3 pos = mix(globePos, packetPos, isPacket);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);

    // 1 facing the camera, 0 at the far side: depth without lighting.
    float front = clamp((pos.z + 1.0) * 0.5, 0.0, 1.0);

    // Only full accents (hubs) pulse; 0.5 marks steady accent-coloured destinations.
    float pulse = 1.0 + step(0.75, aAccent) * (1.0 - isPacket) * 0.3 * sin(uTime * 2.2 + aPhase * 6.2831853) * uMotion;
    float size = aSize * pulse * mix(0.72, 1.0, front);
    gl_PointSize = size * uScale * uPixelRatio / max(-mv.z, 0.001);

    float twinkle = 0.86 + 0.14 * sin(uTime * 1.4 + aPhase * 12.566) * uMotion;
    float globeAlpha = smoothstep(0.0, 0.12, uProgress) * twinkle * uOpacity;

    float gate = smoothstep(0.85, 1.0, uArcProgress) * motionOn;
    float packetAlpha = gate * tripFade(tt) * packet.y;

    vAlpha = mix(globeAlpha, packetAlpha, isPacket) * mix(0.16, 1.0, front);
    vAccent = step(0.25, aAccent);
    gl_Position = projectionMatrix * mv;
  }
`;

export const pointsFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uAccentColor;

  varying float vAlpha;
  varying float vAccent;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float disc = 1.0 - smoothstep(0.14, 0.5, d);
    if (disc < 0.004) discard;
    gl_FragColor = vec4(mix(uColor, uAccentColor, vAccent), disc * vAlpha);
    #include <colorspace_fragment>
  }
`;

export const arcsVertexShader = /* glsl */ `
  attribute float aProgress;
  attribute float aOffset;
  attribute float aFrequency;

  uniform float uRotY;
  uniform float uRotX;

  varying float vProgress;
  varying float vOffset;
  varying float vFrequency;
  varying float vFront;

  ${ROTATE_GLOBE}

  void main() {
    vec3 p = rotateGlobe(position);
    vFront = clamp((p.z + 1.0) * 0.5, 0.0, 1.0);
    vProgress = aProgress;
    vOffset = aOffset;
    vFrequency = aFrequency;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

export const arcsFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uArcProgress;
  uniform float uMotion;
  uniform float uTripFraction;
  uniform vec3 uColor;
  uniform float uBase;
  uniform float uPacket;

  varying float vProgress;
  varying float vOffset;
  varying float vFrequency;
  varying float vFront;

  ${TRIP}

  void main() {
    // Drawn from the origin (0) towards the destination (1).
    float reveal = clamp((uArcProgress - vProgress * 0.85) / 0.15, 0.0, 1.0);

    // A short trail behind the packet's head, on the packet's own clock.
    vec2 packet = trip(vFrequency, vOffset);
    float behind = packet.x - vProgress;
    float trail = (behind >= 0.0 ? exp(-behind * 40.0) : 0.0) * packet.y * tripFade(packet.x);
    float gate = smoothstep(0.85, 1.0, uArcProgress) * step(0.0001, uMotion);

    float alpha = (uBase + trail * uPacket * gate) * reveal * mix(0.28, 1.0, vFront);
    gl_FragColor = vec4(uColor, alpha);
    #include <colorspace_fragment>
  }
`;

export const glowVertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

export const glowFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  uniform float uPower;

  varying vec3 vNormal;
  varying vec3 vView;

  void main() {
    // Zero where the surface faces the viewer, so the centre stays clear.
    float rim = pow(1.0 - abs(dot(vView, normalize(vNormal))), uPower);
    gl_FragColor = vec4(uColor, rim * uIntensity);
    #include <colorspace_fragment>
  }
`;
