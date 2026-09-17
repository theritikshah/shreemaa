"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import {
  DEFAULT_PALETTE,
  DEFAULT_SCENE,
  DESKTOP_TIMELINE,
  MOBILE_TIMELINE,
  type CommandCopy,
  type CommandPalette,
  type CommandSceneConfig,
} from "./config";
import type { CommandSceneController, SceneQuality } from "./heroParticleScene";
import { KnockoutHeading, type KnockoutHandle } from "./KnockoutHeading";
import { KNOCKOUT_LAYOUTS } from "./knockoutPaths";
import { ScrollActionLabels } from "./ScrollActionLabels";
import { knockoutFrame, sequenceAt } from "./timeline";

interface CommandHeroExperienceProps {
  /** The opening copy, usually a <HeroCopy>. Server-renderable; shown before any graphics load. */
  hero: ReactNode;
  copy: CommandCopy;
  palette?: CommandPalette;
  scene?: CommandSceneConfig;
  quality?: SceneQuality | "auto";
}

type Nav = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };

function resolveQuality(quality: SceneQuality | "auto"): SceneQuality {
  if (quality !== "auto") return quality;
  const nav = navigator as Nav;
  if (nav.connection?.saveData || (nav.hardwareConcurrency ?? 8) <= 2 || (nav.deviceMemory ?? 8) <= 2) return "low";
  return "high";
}

// Fine static grain for the low-quality path, which skips the shader pass.
const GRAIN_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

/**
 * Scroll-driven hero: flowing particles gather into rings, short action
 * labels cycle over them, and an oversized letter-shaped opening zooms out
 * into the final heading.
 *
 * One tall section with a sticky, viewport-sized stage. A single value —
 * viewport heights scrolled into the section — drives every layer through
 * `sequenceAt`, so the sequence reverses exactly and survives reloads midway.
 * Native scrolling only: nothing listens to wheel or touch input.
 *
 * With reduced motion the section is ordinary document flow: the hero over a
 * still composition, then the heading as plain text.
 */
export function CommandHeroExperience({
  hero,
  copy,
  palette = DEFAULT_PALETTE,
  scene = DEFAULT_SCENE,
  quality = "auto",
}: CommandHeroExperienceProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const grainRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const knockoutRef = useRef<KnockoutHandle>(null);

  const labelCount = copy.labels.length;
  // Scene and palette are plain data; key on their content, not identity.
  const sceneKey = JSON.stringify({ scene, palette, quality });

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const mount = mountRef.current;
    const copyEl = copyRef.current;
    const labels = labelsRef.current;
    if (!section || !stage || !mount || !copyEl || !labels) return;

    const { scene: sceneConfig, palette: paletteConfig, quality: qualitySetting } = JSON.parse(sceneKey) as {
      scene: CommandSceneConfig;
      palette: CommandPalette;
      quality: SceneQuality | "auto";
    };

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Same breakpoint as the section's CSS height, so both always agree.
    const desktopQuery = window.matchMedia(`(min-width: ${sceneConfig.mobileBreakpoint}px)`);
    const resolvedQuality = resolveQuality(qualitySetting);
    if (grainRef.current) grainRef.current.style.display = resolvedQuality === "low" ? "block" : "none";

    let controller: CommandSceneController | null = null;
    let cancelled = false;
    let frame = 0;
    // The stage is 100lvh tall. Measuring it (not innerHeight) keeps the pin
    // length stable while mobile browser toolbars show and hide.
    let viewportHeight = stage.clientHeight || window.innerHeight;
    let viewportWidth = stage.clientWidth || window.innerWidth;

    // Last applied position, as a fraction of the sequence, for keeping the
    // reader's place when a rotation or resize changes the section's length.
    let lastFraction = 0;
    let lastDesktop = desktopQuery.matches;

    const labelEls = Array.from(labels.children) as HTMLElement[];
    const labelWrap = labels.parentElement as HTMLElement;

    function resetForReducedMotion() {
      copyEl!.style.transform = "";
      copyEl!.inert = false;
      labelWrap.style.opacity = "0";
      knockoutRef.current?.apply({ layout: "desktop", frame: null, titleOpacity: 0, covered: false });
      controller?.update({ morph: 0, surface: 0, covered: false });
    }

    function apply() {
      frame = 0;
      if (reducedMotion.matches) {
        resetForReducedMotion();
        return;
      }
      const desktop = desktopQuery.matches;
      const timeline = desktop ? DESKTOP_TIMELINE : MOBILE_TIMELINE;
      const scrolled = -section!.getBoundingClientRect().top / viewportHeight;
      lastFraction = scrolled / timeline.total;
      lastDesktop = desktop;
      const state = sequenceAt(scrolled, timeline, labelCount);

      copyEl!.style.transform = `translate3d(0, ${(state.copyOffset * viewportHeight).toFixed(2)}px, 0)`;
      // Controls that have scrolled away must not stay keyboard-reachable.
      if (copyEl!.inert !== state.copyInert) copyEl!.inert = state.copyInert;

      labelWrap.style.opacity = state.labelsOpacity.toFixed(3);
      labelEls.forEach((el, i) => {
        el.style.opacity = state.labelOpacities[i].toFixed(3);
      });

      const layout = desktop ? "desktop" : "mobile";
      knockoutRef.current?.apply({
        layout,
        frame: state.mask < 0 ? null : knockoutFrame(state.mask, KNOCKOUT_LAYOUTS[layout], viewportWidth, viewportHeight, !desktop),
        titleOpacity: state.titleOpacity,
        covered: state.covered,
      });

      controller?.update({ morph: state.morph, surface: state.surface, covered: state.covered });
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const measure = () => {
      const previousHeight = viewportHeight;
      viewportHeight = stage.clientHeight || window.innerHeight;
      viewportWidth = stage.clientWidth || window.innerWidth;
      const desktop = desktopQuery.matches;
      // Mid-sequence, a new viewport height or breakpoint changes the pin
      // length; scroll to the same point in the sequence instead of the same
      // pixel offset. The stage is lvh-sized, so toolbar changes never land here.
      const lengthChanged = Math.abs(viewportHeight - previousHeight) > 1 || desktop !== lastDesktop;
      if (lengthChanged && !reducedMotion.matches && lastFraction > 0 && lastFraction < 1) {
        const timeline = desktop ? DESKTOP_TIMELINE : MOBILE_TIMELINE;
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: sectionTop + lastFraction * timeline.total * viewportHeight, behavior: "instant" });
      }
      schedule();
    };

    window.addEventListener("scroll", schedule, { passive: true });
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(stage);
    reducedMotion.addEventListener("change", schedule);
    desktopQuery.addEventListener("change", measure);
    // Layout can settle once web fonts arrive; re-evaluate then.
    document.fonts?.ready.then(() => !cancelled && measure());

    import("./heroParticleScene")
      .then(({ createCommandScene }) => {
        if (cancelled) return;
        controller = createCommandScene({
          mount,
          stage,
          config: sceneConfig,
          palette: paletteConfig,
          lift: DESKTOP_TIMELINE.surfaceLift,
          quality: resolvedQuality,
        });
        if (!controller && grainRef.current) grainRef.current.style.display = "block";
        apply();
      })
      .catch(() => {
        // Chunk failed to load: the CSS gradient and all content remain.
      });

    apply();

    return () => {
      cancelled = true;
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      resizeObserver.disconnect();
      reducedMotion.removeEventListener("change", schedule);
      desktopQuery.removeEventListener("change", measure);
      controller?.dispose();
      controller = null;
    };
  }, [sceneKey, labelCount]);

  const [g0, g1, g2] = palette.gradient;
  const style = {
    "--command-total-desktop": DESKTOP_TIMELINE.total,
    "--command-total-mobile": MOBILE_TIMELINE.total,
    backgroundColor: palette.endBackground,
  } as CSSProperties;

  return (
    <section
      ref={sectionRef}
      style={style}
      className="relative h-[calc(100lvh*(1+var(--command-total-mobile)))] text-white md:h-[calc(100lvh*(1+var(--command-total-desktop)))] motion-reduce:h-auto"
    >
      <div
        ref={stageRef}
        className="sticky top-0 isolate h-lvh w-full overflow-hidden motion-reduce:relative motion-reduce:h-auto motion-reduce:min-h-svh"
      >
        {/* Static gradient and glow: the whole look without WebGL, and the
            ground beneath it while the scene loads. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: `linear-gradient(135deg, ${g0} 0%, ${g1} 50%, ${g2} 100%)` }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(${palette.glowRadius * 170}% ${palette.glowRadius * 170}% at ${(palette.glowCentre[0] / 2 + 0.5) * 100}% ${(0.5 - palette.glowCentre[1]) * 100}%, ${palette.glow} 0%, transparent 70%)`,
            opacity: palette.glowOpacity,
          }}
        />
        <div ref={mountRef} aria-hidden="true" className="pointer-events-none absolute inset-0" />
        <div
          ref={grainRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
          style={{ backgroundImage: GRAIN_URL, display: "none" }}
        />

        <ScrollActionLabels ref={labelsRef} labels={copy.labels} />
        <KnockoutHeading handleRef={knockoutRef} overlayColor={palette.endBackground} textColor={palette.text} />

        <div
          ref={copyRef}
          className="relative z-50 flex h-lvh items-center justify-center pt-16 will-change-transform motion-reduce:h-auto motion-reduce:min-h-svh motion-reduce:py-36"
        >
          {hero}
        </div>
      </div>

      {/* The one announced heading and label summary. Visually the knockout
          and labels draw them; with reduced motion they show here as text. */}
      <div className="sr-only motion-reduce:not-sr-only motion-reduce:block motion-reduce:px-6 motion-reduce:pt-28 motion-reduce:pb-32 motion-reduce:text-center">
        <h2 className="font-display text-4xl font-bold tracking-tight md:text-6xl">{copy.heading}</h2>
        <p className="mx-auto mt-5 max-w-xl text-white/70">{copy.labelsDescription}</p>
      </div>
    </section>
  );
}
