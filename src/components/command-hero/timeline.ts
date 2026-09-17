import type { CommandTimeline } from "./config";
import type { KnockoutLayout } from "./knockoutPaths";

/**
 * Maps one number — viewport heights scrolled into the section — to every
 * animated value in the sequence. Pure, so scrolling backwards simply
 * evaluates earlier states and nothing depends on direction or history.
 */

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const range = (x: number, [a, b]: [number, number]) => clamp01((x - a) / (b - a));
export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export interface SequenceState {
  /** Hero copy offset, in viewport heights (negative = up). */
  copyOffset: number;
  copyInert: boolean;
  /** How far the graphics have lifted, 0–1 of the configured lift. */
  surface: number;
  morph: number;
  labelsOpacity: number;
  labelOpacities: number[];
  /** Knockout zoom progress 0–1; −1 before it starts. */
  mask: number;
  titleOpacity: number;
  /** The solid heading has fully taken over; the scene can stop rendering. */
  covered: boolean;
}

export function sequenceAt(scroll: number, t: CommandTimeline, labelCount: number): SequenceState {
  const s = Math.max(0, Math.min(t.total, scroll));
  const exit = range(s, t.copyExit);
  const labelOpacities: number[] = [];
  for (let i = 0; i < labelCount; i++) {
    const enter = t.labelStart + i * t.labelStep;
    const leave = enter + t.labelStep;
    const fadeIn = i === 0 ? 1 : clamp01((s - (enter - t.labelFade / 2)) / t.labelFade);
    const fadeOut = i === labelCount - 1 ? 0 : clamp01((s - (leave - t.labelFade / 2)) / t.labelFade);
    labelOpacities.push(fadeIn * (1 - fadeOut));
  }
  const mask = s < t.mask[0] ? -1 : range(s, t.mask);
  // Eased in: the scene stays visible through the letters until late.
  const titleOpacity = Math.pow(range(s, t.title), 2.4);
  return {
    copyOffset: -exit * (t.copyExit[1] - t.copyExit[0]),
    copyInert: s >= t.copyInertAt,
    surface: easeInOutCubic(range(s, t.surfaceShift)),
    morph: range(s, t.morph),
    labelsOpacity: range(s, t.labelsIn) * (1 - range(s, t.labelsOut)),
    labelOpacities,
    mask,
    titleOpacity,
    covered: mask >= 1 && titleOpacity >= 1,
  };
}

export interface KnockoutFrame {
  scale: number;
  x: number;
  y: number;
  /** Rendered font size of the final heading, px. */
  fontPx: number;
}

/** Final heading size: large but always inside ~88% of the viewport width. */
export function headingFontPx(layout: KnockoutLayout, width: number, mobile: boolean): number {
  const fit = (width * 0.88 * 100) / layout.width;
  const desired = mobile ? 44 : Math.min(64, Math.max(36, width * 0.042));
  return Math.min(desired, fit);
}

/**
 * Group transform (translate, then scale) for the knockout at zoom progress
 * `p`. It starts so enlarged that the clearance around the focus point —
 * a point inside a letter stroke — covers the viewport's half-diagonal, so the
 * whole screen sits inside that letter. Scale shrinks exponentially, which
 * reads as a steady zoom, while the focus point glides from the viewport
 * centre to its place in the centred heading.
 */
export function knockoutFrame(p: number, layout: KnockoutLayout, width: number, height: number, mobile: boolean): KnockoutFrame {
  const fontPx = headingFontPx(layout, width, mobile);
  const finalScale = fontPx / 100;
  const halfDiagonal = Math.hypot(width, height) / 2;
  const startScale = Math.max(finalScale * 2, (halfDiagonal / layout.focus.r) * 1.35);

  // Slow at first, gathering pace, landing exactly on the final size.
  const e = Math.pow(clamp01(p), 1.7);
  const scale = Math.exp(Math.log(startScale) + (Math.log(finalScale) - Math.log(startScale)) * e);

  const originX = (width - layout.width * finalScale) / 2;
  const originY = (height - layout.height * finalScale) / 2;
  const focusFinalX = originX + layout.focus.x * finalScale;
  const focusFinalY = originY + layout.focus.y * finalScale;
  const cx = width / 2 + (focusFinalX - width / 2) * e;
  const cy = height / 2 + (focusFinalY - height / 2) * e;

  return { scale, x: cx - layout.focus.x * scale, y: cy - layout.focus.y * scale, fontPx };
}
