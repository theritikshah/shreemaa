/**
 * Shared WebGL2 context creation for the animated backgrounds.
 *
 * A browser can refuse a context for reasons that have nothing to do with the
 * page — hardware acceleration switched off, a blocklisted driver, a GPU
 * process that failed to start, or too many live contexts on one page. Asking
 * for the context here, and handing the result to three, keeps that refusal
 * quiet: three only reports and throws when it has to create one itself.
 *
 * Returns null when no context is available; every caller then leaves its
 * static background in place.
 */

export interface WebGL2ContextOptions {
  antialias?: boolean;
  powerPreference?: WebGLPowerPreference;
}

export function createWebGL2Context(
  canvas: HTMLCanvasElement,
  { antialias = false, powerPreference = "default" }: WebGL2ContextOptions = {},
): WebGL2RenderingContext | null {
  if (typeof WebGL2RenderingContext === "undefined") return null;
  try {
    // Mirrors three's own defaults, so passing this context behaves exactly as
    // letting three create one. (three always asks for alpha and composites
    // opaque output through the clear colour.)
    return canvas.getContext("webgl2", {
      alpha: true,
      depth: true,
      stencil: false,
      antialias,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
      powerPreference,
      failIfMajorPerformanceCaveat: false,
    }) as WebGL2RenderingContext | null;
  } catch {
    return null;
  }
}
