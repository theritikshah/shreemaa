"use client";

import { useEffect, useRef } from "react";

// Two families of thin rings, each ring a circle tilted slightly differently
// in 3D and projected flat. Rings in a family touch where their tilt axes
// meet (the bold edge) and fan apart elsewhere. Both families rotate once per
// 20s, drift around the centre and gently breathe, matching the
// bitnomial.com hero loop. Units are in a 1500px reference frame.
const FRAME = 1500;
const PERIOD = 10;
const STRANDS = 30;
const SEGMENTS = 200;
const RADIUS = 650;
const CENTER = { x: 734, y: 747 };
const LINE = 1.6;
const ALPHA = { inner: 0.13, edge: 0.75, curve: 2.5 };
const COLOR = "254, 0, 0"; // #fe0000

const FAMILIES = [
  { tilt: 0.35, tiltSpread: 0.5, breathe: 0.15, breathePhase: 0, axis: 0.9, axisSpread: 0.3, spin: 0.5, drift: 42, driftPhase: 0.3 },
  { tilt: 0.35, tiltSpread: 0.5, breathe: 0.15, breathePhase: Math.PI / 2, axis: 2.5, axisSpread: -0.3, spin: 0.5, drift: 42, driftPhase: 0.3 + Math.PI },
];

export function WaveRing({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let size = 0;
    let raf = 0;
    let visible = false;
    let time = 0;
    let last = 0;

    const draw = (t: number) => {
      ctx.clearRect(0, 0, size, size);
      const k = size / FRAME;
      const w = (Math.PI * 2) / PERIOD;
      ctx.lineWidth = Math.max(0.5, LINE * k);

      for (const f of FAMILIES) {
        const drift = f.driftPhase + w * t;
        const ox = CENTER.x + f.drift * Math.cos(drift);
        const oy = CENTER.y + f.drift * Math.sin(drift);
        for (let i = 0; i < STRANDS; i++) {
          const u = i / (STRANDS - 1);
          const tilt = f.tilt + f.tiltSpread * (u - 0.5) + f.breathe * Math.sin(w * t + f.breathePhase);
          const axis = f.axis + f.axisSpread * (u - 0.5) + f.spin * w * t;
          const minor = Math.cos(tilt);
          const ca = Math.cos(axis);
          const sa = Math.sin(axis);
          ctx.strokeStyle = `rgba(${COLOR}, ${ALPHA.inner + (ALPHA.edge - ALPHA.inner) * u ** ALPHA.curve})`;
          ctx.beginPath();
          for (let m = 0; m <= SEGMENTS; m++) {
            const s = (m / SEGMENTS) * Math.PI * 2;
            const X = RADIUS * Math.cos(s);
            const Y = RADIUS * Math.sin(s) * minor;
            const x = (ox + X * ca - Y * sa) * k;
            const y = (oy + X * sa + Y * ca) * k;
            if (m === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      }
    };

    const frame = (now: number) => {
      raf = 0;
      time += Math.min((now - last) / 1000, 0.1);
      last = now;
      draw(time);
      if (visible) raf = requestAnimationFrame(frame);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = canvas.getBoundingClientRect().width;
      canvas.width = canvas.height = Math.round(size * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(time);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && !reduced;
      if (visible && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });
    io.observe(canvas);
    resize();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
