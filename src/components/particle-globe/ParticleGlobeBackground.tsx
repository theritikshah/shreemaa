"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { hexToRgbChannels, resolveGlobeConfig, type GlobeConfig, type GlobeConfigInput } from "./config";
import type { GlobeSceneController } from "./globeScene";

interface ParticleGlobeBackgroundProps {
  config?: GlobeConfigInput;
  /**
   * Quiet area behind the hero copy. `left` suits left-aligned copy: a fade
   * from the left at lg and up, and from the top below that, where the
   * copy spans the full width and the globe sits below it.
   */
  copyScrim?: "none" | "left";
  className?: string;
}

/**
 * Animated particle globe as a decorative hero background.
 *
 * Render it as the first child of a positioned, `overflow-hidden` hero; it
 * fills that element and reads size, visibility and pointer from it. It is
 * aria-hidden and never takes pointer events, so the hero's own content
 * works exactly as it would without it.
 *
 * The static background and fades render on the server. Three.js and the
 * geography load after mount, in their own chunk and request, and the canvas
 * fades in only once a globe exists. If anything is unavailable — WebGL, the
 * data, or JavaScript itself — the static background simply remains.
 */
export function ParticleGlobeBackground({ config: input, copyScrim = "none", className }: ParticleGlobeBackgroundProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);

  const config = resolveGlobeConfig(input);
  // A value, not an object identity: inline config does not rebuild the scene each render.
  const configKey = JSON.stringify(config);

  useEffect(() => {
    const mount = mountRef.current;
    const container = rootRef.current?.parentElement;
    if (!mount || !container) return;

    const resolved = JSON.parse(configKey) as GlobeConfig;
    if (resolved.mode === "disabled") return;

    // In Strict Mode, or on a quick unmount, cleanup runs before the chunk
    // resolves; that stale resolution must not create a renderer.
    let cancelled = false;
    let controller: GlobeSceneController | null = null;

    import("./globeScene")
      .then(({ createGlobeScene }) => {
        if (cancelled) return;
        controller = createGlobeScene({ mount, container, config: resolved });
      })
      .catch(() => {
        // Chunk failed to load (offline, stale deploy). The static background stays.
      });

    return () => {
      cancelled = true;
      controller?.dispose();
      controller = null;
    };
  }, [configKey]);

  // Fades are painted in the background colour, so they blend seamlessly over
  // both the canvas and the static fallback.
  const bgHex = config.background === "transparent" ? "#130e0b" : config.background;
  const style = {
    backgroundColor: config.background,
    "--globe-bg": hexToRgbChannels(bgHex),
    "--globe-vignette": config.vignetteOpacity,
  } as CSSProperties;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
      style={style}
    >
      {/* The engine appends and owns its canvas here. */}
      <div ref={mountRef} className="absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(130%_100%_at_60%_50%,transparent_58%,rgb(var(--globe-bg)/var(--globe-vignette))_100%)]" />
      <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(to_bottom,rgb(var(--globe-bg)/0.9),rgb(var(--globe-bg)/0))]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(to_top,rgb(var(--globe-bg)/0.9),rgb(var(--globe-bg)/0))]" />
      {copyScrim === "left" && (
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(var(--globe-bg)/0.88)_0%,rgb(var(--globe-bg)/0.8)_52%,rgb(var(--globe-bg)/0)_74%)] lg:bg-[linear-gradient(to_right,rgb(var(--globe-bg)/0.92)_0%,rgb(var(--globe-bg)/0.72)_40%,rgb(var(--globe-bg)/0)_62%)]" />
      )}
    </div>
  );
}
