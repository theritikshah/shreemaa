"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { hexToRgbChannels, resolveTrafficConfig, type TrafficConfig, type TrafficConfigInput } from "./config";
import type { TrafficSceneController } from "./trafficScene";

interface HeroTrafficBackgroundProps {
  config?: TrafficConfigInput;
  /**
   * Extra fade behind the hero copy, for when it sits over the field rather
   * than below it. `left` suits left-aligned copy: it fades in from the left
   * on wide screens, and from the top on narrow ones where copy spans the
   * full width.
   */
  copyScrim?: "none" | "left";
  className?: string;
}

/**
 * Animated street-grid particle background for a hero.
 *
 * Render it as the first child of a positioned, `overflow-hidden` hero; it
 * fills that element and reads its size and pointer from it. Everything here
 * is decorative and non-interactive, so the hero's own content and controls
 * work exactly as they would without it.
 *
 * The static background and fades render on the server, so the hero is
 * complete before any script runs. Three.js loads in its own chunk after
 * mount and fades the canvas in on top; if it never loads, or WebGL is
 * unavailable, the static background simply remains.
 */
export function HeroTrafficBackground({ config: input, copyScrim = "none", className }: HeroTrafficBackgroundProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);

  const config = resolveTrafficConfig(input);
  // A value, not an object identity: callers can pass config inline without
  // the scene being rebuilt on every render.
  const configKey = JSON.stringify(config);

  useEffect(() => {
    const root = rootRef.current;
    const mount = mountRef.current;
    const container = root?.parentElement;
    if (!mount || !container) return;

    const resolved = JSON.parse(configKey) as TrafficConfig;
    if (resolved.mode === "disabled") return;

    // Guards the import: in Strict Mode, or on a fast unmount, the effect is
    // cleaned up before the chunk resolves, and that stale resolution must
    // not create a renderer.
    let cancelled = false;
    let controller: TrafficSceneController | null = null;

    import("./trafficScene")
      .then(({ createTrafficScene }) => {
        if (cancelled) return;
        controller = createTrafficScene({ mount, container, config: resolved });
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

  // Every fade is drawn in the background colour itself, so it is seamless
  // over both the canvas and the static fallback.
  const style = {
    backgroundColor: config.background,
    "--traffic-bg": hexToRgbChannels(config.background),
    "--traffic-vignette": config.vignetteOpacity,
    "--traffic-bottom": config.bottomFadeOpacity,
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
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_40%,transparent_55%,rgb(var(--traffic-bg)/var(--traffic-vignette))_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(var(--traffic-bg)/var(--traffic-bottom))_0%,rgb(var(--traffic-bg)/0)_42%)]" />
      {copyScrim === "left" && (
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(var(--traffic-bg)/0.78)_0%,rgb(var(--traffic-bg)/0.72)_62%,rgb(var(--traffic-bg)/0)_88%)] md:bg-[linear-gradient(to_right,rgb(var(--traffic-bg)/0.86)_0%,rgb(var(--traffic-bg)/0.62)_34%,rgb(var(--traffic-bg)/0)_64%)]" />
      )}
    </div>
  );
}
