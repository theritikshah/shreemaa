"use client";

import { useEffect, useRef } from "react";

// Animated hero backdrop: short vertical dashes march along a family of nested,
// bow-shaped curves, with a handful of dashes briefly lit in the accent colour.

const DESIGN_W = 1440;
const DESIGN_H = 842;
const DASH_H = 30; // dash length in design units
const SPACING = 40; // arc-length gap between dashes along a curve
const SPEED = 0.7; // slots advanced per second
const ACCENTS = 6; // accent dashes visible at once
const ACCENT_LIFE = 1.2; // seconds

type Point = [number, number];

// Deterministic jitter so the pattern is stable across renders.
function hash(n: number) {
  const s = Math.sin(n * 127.1) * 43758.5453;
  return s - Math.floor(s);
}

// Each curve is a sideways hyperbola: vertical in the middle, opening out to the
// right towards the top and bottom edges. Points are resampled by arc length.
function buildCurves(): Point[][] {
  const curves: Point[][] = [];
  for (let i = 0, x0 = -620; x0 < DESIGN_W + 80; i++, x0 += 96) {
    // Vary the vertex height and width smoothly so neighbouring curves stay nested.
    const ym = 470 - i * 9 + (hash(i) - 0.5) * 12;
    const b = 250 + i * 2;
    const a = b * 1.45;
    const raw: Point[] = [];
    for (let y = DESIGN_H + 140; y >= -140; y -= 4) {
      const t = (y - ym) / b;
      raw.push([x0 + a * (Math.sqrt(1 + t * t) - 1), y]);
    }
    const pts: Point[] = [raw[0]];
    let carry = 0;
    for (let k = 1; k < raw.length; k++) {
      const [px, py] = raw[k - 1];
      const [qx, qy] = raw[k];
      const seg = Math.hypot(qx - px, qy - py);
      let d = SPACING - carry;
      while (d <= seg) {
        const f = d / seg;
        pts.push([px + (qx - px) * f, py + (qy - py) * f]);
        d += SPACING;
      }
      carry = seg - (d - SPACING);
    }
    curves.push(pts);
  }
  return curves;
}

type Accent = { ci: number; slot: number; birth: number; life: number };

export function DashFlowBackground({
  dashColor = "#5e524d",
  accentColor = "#e11b22",
  className = "",
}: {
  dashColor?: string;
  accentColor?: string;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const curves = buildCurves();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0, h = 0, scale = 1, offX = 0, offY = 0, lineW = 3.75;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      scale = Math.max(w / DESIGN_W, h / DESIGN_H);
      offX = (w - DESIGN_W * scale) / 2;
      offY = (h - DESIGN_H * scale) / 2;
      // 2.5px on phones, 3.75px at 1440, 6.5px at 2560
      lineW = w <= 1440
        ? 2.5 + 1.25 * Math.max(0, (w - 375) / (1440 - 375))
        : Math.min(6.5, 3.75 + 2.75 * ((w - 1440) / (2560 - 1440)));
    };

    let accents: Accent[] = [];
    const spawn = (now: number) => {
      for (let tries = 0; tries < 30; tries++) {
        const ci = (Math.random() * curves.length) | 0;
        const slot = (Math.random() * curves[ci].length) | 0;
        if (!accents.some((a) => a.ci === ci && a.slot === slot)) {
          accents.push({ ci, slot, birth: now, life: ACCENT_LIFE * (0.7 + 0.6 * Math.random()) });
          return true;
        }
      }
      return false;
    };

    // Position of the dash in `slot` of curve `pts` after `phase` slots of travel.
    const dashAt = (pts: Point[], slot: number, phase: number): Point | null => {
      const n = pts.length;
      const s = (phase + slot) % n;
      const i = s | 0;
      if (i >= n - 1) return null;
      const f = s - i;
      const x = (pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f) * scale + offX;
      const y = (pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f) * scale + offY;
      const half = (DASH_H * scale) / 2;
      if (x < -half || x > w + half || y < -half * 2 || y > h + half * 2) return null;
      return [x, y];
    };

    let phase = 0;
    let last = performance.now();
    let raf = 0;
    let visible = true;

    const draw = (now: number) => {
      const secs = now / 1000;
      phase += SPEED * Math.min((now - last) / 1000, 0.05);
      last = now;

      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = lineW;
      ctx.lineCap = "butt";
      const half = (DASH_H * scale) / 2;

      accents = accents.filter((a) => secs - a.birth < a.life);
      if (!reduceMotion) while (accents.length < ACCENTS && spawn(secs));
      const lit = new Set(accents.map((a) => a.ci * 1000 + a.slot));

      ctx.strokeStyle = dashColor;
      ctx.beginPath();
      curves.forEach((pts, ci) => {
        for (let slot = 0; slot < pts.length; slot++) {
          if (lit.has(ci * 1000 + slot)) continue;
          const p = dashAt(pts, slot, phase);
          if (!p) continue;
          ctx.moveTo(p[0], p[1] - half);
          ctx.lineTo(p[0], p[1] + half);
        }
      });
      ctx.stroke();

      ctx.strokeStyle = accentColor;
      ctx.beginPath();
      for (const a of accents) {
        const p = dashAt(curves[a.ci], a.slot, phase);
        if (!p) continue;
        ctx.moveTo(p[0], p[1] - half);
        ctx.lineTo(p[0], p[1] + half);
      }
      ctx.stroke();

      if (!reduceMotion && visible) raf = requestAnimationFrame(draw);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      last = performance.now();
      raf = requestAnimationFrame(draw);
    };

    resize();
    start();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        if (reduceMotion || !visible) draw(performance.now());
      }, 150);
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !reduceMotion) start();
    });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      ro.disconnect();
      io.disconnect();
    };
  }, [dashColor, accentColor]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{
        maskImage: "linear-gradient(to bottom, transparent 0%, #000 20%, #000 80%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 20%, #000 80%, transparent 100%)",
      }}
    />
  );
}
