#!/usr/bin/env node
/**
 * Generates SVG outlines for the command hero's knockout heading.
 *
 * The heading is drawn from paths rather than live SVG text so the mask and
 * the solid heading share identical geometry in every browser, with no
 * dependence on web-font loading before measurement.
 *
 * Usage: node scripts/generate-knockout-paths.mjs
 * Edit HEADINGS below, then rerun. Output: src/components/command-hero/knockoutPaths.ts
 *
 * Font: Space Grotesk (the site's display face), SIL Open Font License 1.1,
 * read from the @fontsource/space-grotesk dev dependency.
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import opentype from "opentype.js";

const require = createRequire(import.meta.url);
const FONT_FILE = require.resolve("@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff");
const OUT_FILE = path.resolve("src/components/command-hero/knockoutPaths.ts");

// Glyph units: the font is set at 100 units, so a layout rendered at
// `fontPx` is scaled by fontPx / 100.
const UNITS = 100;
// Matches the site's heading tracking (h1–h4: letter-spacing −0.025em).
const TRACKING = -0.025 * UNITS;
const LINE_HEIGHT = 1.08 * UNITS;

// `focus` names the letter the zoom starts inside: [line, character index].
// A plain vertical stem opens as a clean band; junctions (t, +) read as shapes.
const HEADINGS = {
  desktop: { lines: ["Every marketplace, on command."], focus: [0, "Every marketplace, on command.".indexOf("l")] },
  mobile: { lines: ["Every marketplace,", "on command."], focus: [0, "Every marketplace,".indexOf("l")] },
};

const fontBytes = fs.readFileSync(FONT_FILE);
// Node pools small Buffers; hand opentype.js exactly this file's bytes.
const font = opentype.parse(fontBytes.buffer.slice(fontBytes.byteOffset, fontBytes.byteOffset + fontBytes.byteLength));

/** Lays out one line of glyphs from `x`, returning its outline, advance width and flattened contours. */
function layoutLine(text, baselineY, x0 = 0) {
  const glyphs = font.stringToGlyphs(text);
  const scale = UNITS / font.unitsPerEm;
  let x = x0;
  const pieces = [];
  const contours = [];
  const glyphContours = [];
  for (let i = 0; i < glyphs.length; i++) {
    const glyphPath = glyphs[i].getPath(x, baselineY, UNITS);
    pieces.push(glyphPath.toPathData(2));
    const flat = flatten(glyphPath.commands);
    glyphContours.push(flat);
    contours.push(...flat);
    x += glyphs[i].advanceWidth * scale;
    if (i < glyphs.length - 1) x += font.getKerningValue(glyphs[i], glyphs[i + 1]) * scale + TRACKING;
  }
  return { d: pieces.filter(Boolean).join(""), width: x - x0, contours, glyphContours };
}

/** Curves → polylines, for hit-testing the focus point. */
function flatten(commands) {
  const out = [];
  let current = [];
  let px = 0;
  let py = 0;
  const STEPS = 10;
  for (const c of commands) {
    if (c.type === "M") {
      if (current.length) out.push(current);
      current = [[c.x, c.y]];
    } else if (c.type === "L") {
      current.push([c.x, c.y]);
    } else if (c.type === "Q") {
      for (let s = 1; s <= STEPS; s++) {
        const t = s / STEPS;
        const mt = 1 - t;
        current.push([mt * mt * px + 2 * mt * t * c.x1 + t * t * c.x, mt * mt * py + 2 * mt * t * c.y1 + t * t * c.y]);
      }
    } else if (c.type === "C") {
      for (let s = 1; s <= STEPS; s++) {
        const t = s / STEPS;
        const mt = 1 - t;
        current.push([
          mt ** 3 * px + 3 * mt * mt * t * c.x1 + 3 * mt * t * t * c.x2 + t ** 3 * c.x,
          mt ** 3 * py + 3 * mt * mt * t * c.y1 + 3 * mt * t * t * c.y2 + t ** 3 * c.y,
        ]);
      }
    } else if (c.type === "Z") {
      if (current.length) out.push(current);
      current = [];
    }
    if (c.x !== undefined) {
      px = c.x;
      py = c.y;
    }
  }
  if (current.length) out.push(current);
  return out;
}

function inside(contours, x, y) {
  let winding = 0;
  for (const ring of contours) {
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i];
      const [xj, yj] = ring[j];
      if (yj <= y) {
        if (yi > y && (xi - xj) * (y - yj) - (x - xj) * (yi - yj) > 0) winding++;
      } else if (yi <= y && (xi - xj) * (y - yj) - (x - xj) * (yi - yj) < 0) winding--;
    }
  }
  return winding !== 0;
}

function edgeDistance(contours, x, y) {
  let best = Infinity;
  for (const ring of contours) {
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [ax, ay] = ring[j];
      const [bx, by] = ring[i];
      const dx = bx - ax;
      const dy = by - ay;
      const len2 = dx * dx + dy * dy || 1;
      const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / len2));
      best = Math.min(best, Math.hypot(x - ax - t * dx, y - ay - t * dy));
    }
  }
  return best;
}

/**
 * The zoom starts inside a letter, so its opening must cover the whole
 * viewport. Pick the point with the largest clearance to any edge, lightly
 * biased toward the composition's centre so the zoom-out reads as centred.
 */
function findFocus(contours, glyph) {
  // Search only the chosen glyph's bounds, but measure clearance against every
  // outline so a neighbouring letter can't be too close.
  const xs = glyph.flat().map((p) => p[0]);
  const ys = glyph.flat().map((p) => p[1]);
  const glyphMidY = (Math.min(...ys) + Math.max(...ys)) / 2;
  let best = null;
  for (let y = Math.floor(Math.min(...ys)); y < Math.max(...ys); y += 0.5) {
    for (let x = Math.floor(Math.min(...xs)); x < Math.max(...xs); x += 0.5) {
      if (!inside(glyph, x, y)) continue;
      const clearance = edgeDistance(contours, x, y);
      // Among equal clearances prefer the glyph's vertical middle, so the
      // letter's ends appear late and evenly as the zoom pulls back.
      const score = clearance - 0.001 * Math.abs(y - glyphMidY);
      if (!best || score > best.score) best = { x, y, r: clearance, score };
    }
  }
  return { x: +best.x.toFixed(2), y: +best.y.toFixed(2), r: +best.r.toFixed(2) };
}

const ascender = (font.ascender / font.unitsPerEm) * UNITS;
const descender = (-font.descender / font.unitsPerEm) * UNITS;
const output = {};
for (const [key, { lines, focus: [focusLine, focusChar] }] of Object.entries(HEADINGS)) {
  const baseline = (i) => ascender + i * LINE_HEIGHT;
  const widths = lines.map((text, i) => layoutLine(text, baseline(i)).width);
  const width = Math.max(...widths);
  // Each line centred within the block, as the heading itself is centred.
  const laid = lines.map((text, i) => layoutLine(text, baseline(i), (width - widths[i]) / 2));
  const height = baseline(lines.length - 1) + descender;
  output[key] = {
    lines,
    d: laid.map((l) => l.d).join(""),
    width: +width.toFixed(2),
    height: +height.toFixed(2),
    focus: findFocus(laid.flatMap((l) => l.contours), laid[focusLine].glyphContours[focusChar]),
  };
}

const banner = `// Generated by scripts/generate-knockout-paths.mjs — do not edit by hand.
// Space Grotesk Bold, © The Space Grotesk Project Authors, SIL Open Font License 1.1.
// Units: the font set at ${UNITS}; scale by fontPx / ${UNITS}.
`;
const body = `export interface KnockoutLayout {
  lines: string[];
  /** Outline of every glyph, all lines, in one path (nonzero fill). */
  d: string;
  width: number;
  height: number;
  /** A point deep inside a letter stroke, with its clearance \`r\` to the nearest edge. */
  focus: { x: number; y: number; r: number };
}

export const KNOCKOUT_LAYOUTS: Record<"desktop" | "mobile", KnockoutLayout> = ${JSON.stringify(output, null, 2)};
`;
fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
fs.writeFileSync(OUT_FILE, banner + body);
for (const [k, v] of Object.entries(output)) console.log(k, v.lines, "width", v.width, "height", v.height, "focus", v.focus, "d chars", v.d.length);
