"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform, type MotionValue } from "framer-motion";

/*
 * "What we do": a rotating dot sphere wired to the eight capabilities the
 * marketplace team runs in-house. Dots scatter from the cursor, and as the
 * section scrolls through the viewport the dots nearest each connector light
 * up in brand red.
 */

const BRAND = "#fe0000";
// --ink (oklch 0.17 0.01 60) in sRGB, for lines and dots.
const INK_RGB = "19, 14, 11";

// Connector geometry in a 1200 × 560 viewBox. The sphere (radius 0.47 × 560)
// sits at the centre; each node lies on its edge, each line runs out to a label.
const NODE_YS = [105, 230, 330, 455];
const LABEL_YS = [50, 215, 345, 510];
const LABEL_XS = [290, 240, 240, 290];
const SPHERE_R = 0.47 * 560;
const nodeX = (y: number) => 600 - Math.sqrt(SPHERE_R * SPHERE_R - (y - 280) * (y - 280));
const LEFT_NODES = NODE_YS.map((y) => [Math.round(nodeX(y)), y] as [number, number]);
const RIGHT_NODES = LEFT_NODES.map(([x, y]) => [1200 - x, y] as [number, number]);
const NODES = [...LEFT_NODES, ...RIGHT_NODES];
const LEFT_PATHS = LEFT_NODES.map(([x, y], i) => `M${LABEL_XS[i]} ${LABEL_YS[i]} L${x} ${y}`);
const RIGHT_PATHS = RIGHT_NODES.map(([x, y], i) => `M${1200 - LABEL_XS[i]} ${LABEL_YS[i]} L${x} ${y}`);
const ANCHORS = NODES.map(([x, y]) => [x / 1200, y / 560] as const);
const LABEL_TOPS = LABEL_YS.map((y) => `${((y / 560) * 100).toFixed(2)}%`);
const LABEL_INSETS = LABEL_XS.map((x) => `${(((1200 - x) / 1200) * 100).toFixed(2)}%`);

const LEFT_LABELS = ["Catalog & content", "Performance marketing", "Growth strategy", "Inventory planning"];
const RIGHT_LABELS = ["Multi-state fulfillment", "Customer experience", "Returns & RTO", "Marketplace compliance"];

const LABEL_CLASS =
  "inline-block whitespace-nowrap rounded-full border border-line bg-surface px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-soft";

const DOTS = 2300;
const REPEL_RADIUS = 140;

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function SignalSphere({ active, progress }: { active: boolean; progress: MotionValue<number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Fibonacci sphere: evenly spread unit vectors.
    const points = new Float32Array(DOTS * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < DOTS; i++) {
      const y = 1 - (i / (DOTS - 1)) * 2;
      const ring = Math.sqrt(1 - y * y);
      points[i * 3] = Math.cos(golden * i) * ring;
      points[i * 3 + 1] = y;
      points[i * 3 + 2] = Math.sin(golden * i) * ring;
    }
    // Per-dot screen offset and velocity for the cursor spring.
    const offset = new Float32Array(DOTS * 2);
    const velocity = new Float32Array(DOTS * 2);

    let width = 0;
    let height = 0;
    let pointerX = -9999;
    let pointerY = -9999;
    let angle = 0;
    let frame = 0;
    let visible = true;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      width = r.width;
      height = r.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
    };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointerX = e.clientX - r.left;
      pointerY = e.clientY - r.top;
    };
    const onLeave = () => {
      pointerX = -9999;
      pointerY = -9999;
    };

    const draw = () => {
      if (!reducedMotion) angle += 0.0016;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const radius = 0.47 * Math.min(width, height);
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      // How far the red glow has spread from each connector, driven by scroll.
      const reach = smoothstep(0.22, 0.85, progress.get()) * radius * 1.15;

      for (let i = 0; i < DOTS; i++) {
        const px = points[i * 3];
        const py = points[i * 3 + 1];
        const pz = points[i * 3 + 2];
        const rx = px * cos + pz * sin;
        const depth = -px * sin + pz * cos;
        let x = cx + rx * radius;
        let y = cy + py * radius;

        // Push away from the cursor, then spring back.
        const dx = x - pointerX;
        const dy = y - pointerY;
        const d2 = dx * dx + dy * dy;
        if (d2 < REPEL_RADIUS * REPEL_RADIUS) {
          const d = Math.sqrt(d2) || 1;
          const falloff = 1 - d / REPEL_RADIUS;
          const force = falloff * falloff * 1.4;
          velocity[i * 2] += (dx / d) * force;
          velocity[i * 2 + 1] += (dy / d) * force;
        }
        velocity[i * 2] = (velocity[i * 2] - 0.045 * offset[i * 2]) * 0.9;
        velocity[i * 2 + 1] = (velocity[i * 2 + 1] - 0.045 * offset[i * 2 + 1]) * 0.9;
        offset[i * 2] += velocity[i * 2];
        offset[i * 2 + 1] += velocity[i * 2 + 1];
        x += offset[i * 2];
        y += offset[i * 2 + 1];

        let nearest = Infinity;
        for (const [ax, ay] of ANCHORS) {
          const ex = x - ax * width;
          const ey = y - ay * height;
          nearest = Math.min(nearest, ex * ex + ey * ey);
        }
        const heat = reach > 0 ? smoothstep(reach, reach - 60, Math.sqrt(nearest)) : 0;

        const front = (depth + 1) / 2;
        const size = (0.6 + 1.1 * front) * (1 + 1.4 * heat);
        // Fade the dots behind the centre copy.
        const fromCentre = Math.hypot(x - cx, y - cy);
        const clear = 0.1 + 0.9 * smoothstep(0.26 * radius, 0.6 * radius, fromCentre);
        const alpha = ((0.1 + 0.45 * front) * (1 - heat) + (0.2 + 0.7 * front) * heat) * clear;
        // Ink → brand red (#fe0000).
        const r = Math.round(19 + 235 * heat);
        const g = Math.round(14 - 14 * heat);
        const b = Math.round(11 - 11 * heat);

        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      frame = visible ? requestAnimationFrame(draw) : 0;
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    // Stop drawing while the section is off screen.
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame) frame = requestAnimationFrame(draw);
    });
    visibility.observe(canvas);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibility.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [active, progress]);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}

function CentreCopy() {
  return (
    <div className="relative flex flex-col items-center px-6 text-center">
      <div
        aria-hidden="true"
        className="absolute -inset-x-28 -inset-y-20"
        style={{
          background:
            "radial-gradient(ellipse 58% 56% at 50% 50%, color-mix(in oklch, var(--surface) 92%, transparent) 0%, color-mix(in oklch, var(--surface) 55%, transparent) 48%, transparent 74%)",
        }}
      />
      <div className="relative">
        <p className="font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">One team, one roof.</p>
        <p className="mt-2.5 text-sm text-ink-soft md:text-base">From the first listing to high-volume orders</p>
      </div>
    </div>
  );
}

export function ShelfSignalSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "0px 0px -10% 0px" });
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const pulseOffset = useTransform(scrollYProgress, [0, 0.65], [1.1, -0.5]);
  const centreY = useTransform(scrollYProgress, [0, 1], [16, -16]);
  const paths = [...LEFT_PATHS, ...RIGHT_PATHS];
  const perSide = LEFT_LABELS.length;

  return (
    <section id="capabilities" ref={sectionRef} className="relative overflow-hidden bg-surface py-28 text-ink">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 items-end gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">What we do</div>
            <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
              The full marketplace stack, <span className="font-display italic">operated in-house.</span>
            </h2>
          </div>
          <p className="leading-relaxed text-ink-soft lg:col-span-5">
            From the first listing to high-volume orders, one team handles the critical work under one roof. Brands
            get clear ownership across content, campaigns, stock and fulfilment.
          </p>
        </div>

        {/* Desktop: sphere with connectors and labels. */}
        <div className="relative mt-10 hidden aspect-[1200/560] w-full lg:mt-14 lg:block">
          <SignalSphere active={inView} progress={scrollYProgress} />
          <svg viewBox="0 0 1200 560" fill="none" aria-hidden="true" className="absolute inset-0 h-full w-full">
            {paths.map((d, i) => (
              <motion.path
                key={`line-${i}`}
                d={d}
                stroke={`rgba(${INK_RGB},0.18)`}
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 + (i % perSide) * 0.12, ease: "easeOut" }}
              />
            ))}
            {paths.map((d, i) => (
              <motion.path
                key={`pulse-${i}`}
                d={d}
                pathLength={1}
                stroke={BRAND}
                strokeWidth="1.5"
                strokeDasharray="0.22 0.78"
                style={{ strokeDashoffset: pulseOffset }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.9 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.8 }}
              />
            ))}
            {NODES.map(([x, y], i) => (
              <motion.rect
                key={`node-${i}`}
                x={x - 3}
                y={y - 3}
                width="6"
                height="6"
                fill="var(--surface)"
                stroke={`rgba(${INK_RGB},0.4)`}
                strokeWidth="1"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.8 + 0.06 * i }}
              />
            ))}
          </svg>

          {LEFT_LABELS.map((label, i) => (
            <motion.div
              key={label}
              className="pointer-events-none absolute -translate-y-1/2 text-right"
              style={{ top: LABEL_TOPS[i], right: LABEL_INSETS[i] }}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 + 0.1 * i }}
            >
              <span className={LABEL_CLASS}>{label}</span>
            </motion.div>
          ))}
          {RIGHT_LABELS.map((label, i) => (
            <motion.div
              key={label}
              className="pointer-events-none absolute -translate-y-1/2"
              style={{ top: LABEL_TOPS[i], left: LABEL_INSETS[i] }}
              initial={{ opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 + 0.1 * i }}
            >
              <span className={LABEL_CLASS}>{label}</span>
            </motion.div>
          ))}

          <motion.div
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            style={{ y: centreY }}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <CentreCopy />
          </motion.div>
        </div>

        {/* Below lg: square sphere, labels as a grid below. */}
        <div className="mx-auto mt-12 max-w-xl lg:hidden">
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-line">
            <SignalSphere active={inView} progress={scrollYProgress} />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <CentreCopy />
            </div>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
            {[...LEFT_LABELS, ...RIGHT_LABELS].map((label) => (
              <div
                key={label}
                className="flex items-center justify-center bg-surface px-3 py-5 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-soft"
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
