"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowRight, ArrowUpRight, X, ChevronLeft, ChevronRight } from "lucide-react";
import life1 from "@/assets/life-1.jpeg";
import life2 from "@/assets/life-2.jpeg";
import life3 from "@/assets/life-3.jpeg";
import life4 from "@/assets/life-4.jpeg";
import life5 from "@/assets/life-5.jpeg";
import life6 from "@/assets/life-6.jpeg";
import life7 from "@/assets/life-7.jpeg";
import life8 from "@/assets/life-8.jpeg";
import life9 from "@/assets/life-9.jpeg";
import type { StaticImageData } from "next/image";

type Photo = { src: StaticImageData; caption: string; tag: string };

const gallery: Photo[] = [
  { src: life7, caption: "The full team, together in indigo", tag: "Team day" },
  { src: life8, caption: "Women of SMG", tag: "Culture" },
  { src: life9, caption: "Pink day at the office", tag: "Theme day" },
  { src: life1, caption: "Everyday in the office", tag: "On the floor" },
  { src: life2, caption: "Celebrating a milestone win", tag: "Wins" },
  { src: life3, caption: "Award winners on stage", tag: "Recognition" },
  { src: life4, caption: "Christmas at the office", tag: "Festivals" },
  { src: life5, caption: "Off-site dinner that ran past midnight", tag: "Off-site" },
  { src: life6, caption: "Diwali, decked up", tag: "Festivals" },
];

// The gallery is doubled so the ring has enough slices to read as a solid
// wall. Because backface-visibility hides the far half, the ~180° that is
// ever visible spans nine consecutive cards — so no photo is on screen twice.
const ring = [...gallery, ...gallery];

// Circular portraits flanking the opening statement. left/top/size are
// percentages of the stage, kept clear of the centre column so the headline
// always has room. `lag` is the fraction of a viewport each one holds back by
// as the page scrolls, so they drift vertically at different speeds.
const avatarRing = [
  { i: 0, left: 2.6, top: 2, size: 5.8, lag: 0.10 },
  { i: 1, left: 12.3, top: 9, size: 6.3, lag: 0.20 },
  { i: 2, left: 1.5, top: 30, size: 5.1, lag: 0.06 },
  { i: 3, left: 9.9, top: 27.6, size: 6.0, lag: 0.16 },
  { i: 4, left: 14.5, top: 44.3, size: 4.2, lag: 0.24 },
  { i: 5, left: 4.4, top: 48, size: 7.6, lag: 0.08 },
  { i: 6, left: 14.3, top: 63.4, size: 4.4, lag: 0.18 },
  { i: 7, left: 78.1, top: 16.2, size: 7.6, lag: 0.14 },
  { i: 8, left: 90.9, top: 11.7, size: 5.3, lag: 0.22 },
  { i: 0, left: 91.2, top: 27.6, size: 7.4, lag: 0.07 },
  { i: 2, left: 83.3, top: 38.2, size: 5.3, lag: 0.19 },
  { i: 4, left: 88.8, top: 52.4, size: 4.0, lag: 0.11 },
  { i: 6, left: 79.6, top: 56.8, size: 7.6, lag: 0.25 },
];

const pillars = [
  { n: "01", t: "People first, always", d: "Even as SMG grows, colleagues know the people they work with. We make time for the moments that matter to each other." },
  { n: "02", t: "Real ownership", d: "Your decisions move real stock, reach real retailers and shape what customers can buy." },
  { n: "03", t: "Learn by doing", d: "Work alongside the teams that run marketplace categories, trading desks and field distribution. Learn by solving live business problems." },
  { n: "04", t: "Celebrate everything", d: "Diwali, Christmas, Holi, ethnic days, birthdays, milestone wins. There's almost always something happening." },
];

export function CareersView() {
  const [active, setActive] = useState<number | null>(null);
  const ringStageRef = useRef<HTMLDivElement>(null);
  const ringRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Vertical drift only, at a different rate per circle. Reads just scrollY and
  // writes transforms, so it forces no layout; painting straight from the
  // scroll event means a dropped frame can't wedge a latch and kill it.
  useEffect(() => {
    const stage = ringStageRef.current;
    if (!stage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const paint = () => {
      const vh = window.innerHeight || 800;
      const p = Math.min(1, Math.max(0, window.scrollY / vh));
      for (let i = 0; i < avatarRing.length; i++) {
        const el = ringRefs.current[i];
        if (!el) continue;
        el.style.transform = `translate3d(0, ${(p * vh * avatarRing[i].lag).toFixed(1)}px, 0)`;
      }
    };

    paint();
    window.addEventListener("scroll", paint, { passive: true });
    window.addEventListener("resize", paint, { passive: true });
    return () => {
      window.removeEventListener("scroll", paint);
      window.removeEventListener("resize", paint);
    };
  }, []);

  const close = useCallback(() => setActive(null), []);
  const next = useCallback(() => setActive((i) => (i === null ? i : (i + 1) % gallery.length)), []);
  const prev = useCallback(() => setActive((i) => (i === null ? i : (i - 1 + gallery.length) % gallery.length)), []);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [active, close, next, prev]);

  return (
    <>
      {/* ── OPENING STATEMENT ── centred copy ringed by circular portraits ── */}
      {/* Fills the viewport and centres its contents, so the copy sits on the
          optical centre instead of being pushed down by a large top padding.
          The top padding only needs to clear the fixed nav. */}
      <section className="relative flex min-h-[620px] items-center overflow-hidden bg-bg pb-10 pt-20 md:min-h-[680px] md:pb-12 md:pt-24">
        <div
          ref={ringStageRef}
          // One shared vanishing point for the whole ring: the circles fly in
          // along Z, so off-centre ones sweep outward as they come forward.
          // Per-element perspective would flatten this back to a plain scale.
          className="relative mx-auto h-[460px] w-full max-w-[1400px] [perspective:1200px] md:h-[clamp(500px,62svh,560px)]"
        >
          {/* Circles sit behind the copy and are decorative only */}
          {avatarRing.map((a, n) => {
            const p = gallery[a.i];
            return (
              // Outer: position + the scroll-linked vertical drift.
              <div
                key={n}
                aria-hidden
                ref={(el) => {
                  ringRefs.current[n] = el;
                }}
                className="absolute hidden will-change-transform md:block"
                style={{
                  left: `${a.left}%`,
                  top: `${a.top}%`,
                  width: `clamp(56px, ${a.size}vw, 104px)`,
                  aspectRatio: "1",
                  // Keeps the inner circle inside the stage's 3D space, so its
                  // translateZ resolves against the shared vanishing point.
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Middle: the endless ambient drift. Pure CSS, so it costs
                    nothing per frame, and it waits for the entrance to land
                    before starting. */}
                <div
                  className="ring-float h-full w-full [transform-style:preserve-3d]"
                  style={
                    {
                      "--float-y": `${5 + (n % 4) * 2.5}px`,
                      "--float-dur": `${28 + (n % 5) * 5}s`,
                      "--float-delay": `${1.3 + n * 0.06}s`,
                    } as CSSProperties
                  }
                >
                  {/* Inner: the entrance — rushing in from depth along Z. Runs on
                      mount rather than on scroll-into-view: this sits above the
                      fold, so an observer would only add a way for it to never
                      fire and leave the ring blank. */}
                  <motion.div
                    // Hairline outline with the photo inset from it. Padding is
                    // a percentage so the gap stays proportional across circles
                    // that range from ~45px to ~120px wide.
                    className="h-full w-full rounded-full border border-ink/10 p-[4%]"
                    initial={{ opacity: 0, z: -900 }}
                    animate={{ opacity: 1, z: 0 }}
                    transition={{
                      duration: 1.05,
                      delay: 0.2 + n * 0.055,
                      ease: [0.16, 1, 0.3, 1],
                      opacity: { duration: 0.5, delay: 0.2 + n * 0.055 },
                    }}
                  >
                    {/* `fill` resolves against inset-0 and would ignore the
                        padding above, so the photo needs its own clip box. */}
                    <div className="relative h-full w-full overflow-hidden rounded-full bg-ink/5">
                      <Image src={p.src} alt="" fill sizes="(min-width: 768px) 12vw, 0px" className="object-cover" />
                    </div>
                  </motion.div>
                </div>
              </div>
            );
          })}

          {/* Centred copy */}
          <div className="relative mx-auto flex h-[460px] max-w-3xl flex-col items-center justify-center px-6 text-center md:h-[clamp(500px,62svh,560px)]">
            <h2 className="text-[clamp(2.5rem,6vw,4.75rem)] font-bold tracking-[-0.035em] leading-[0.98]">
              The people who{" "}
              <span className="italic font-display font-normal text-brand">build SMG</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft md:text-lg">
              Known by name, trusted with real decisions, and surrounded by people who
              genuinely like showing up.
            </p>
            <div className="mt-7">
              <Link
                href="/jobs"
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-ink/85"
              >
                See open roles
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="border-y border-line bg-ink text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            ["28", "years building together"],
            ["500+", "team members nationwide"],
            ["12+", "cities and locations"],
            ["80k+", "retail partners we serve"],
          ].map(([n, l]) => (
            <div key={l}>
              <div className="text-4xl md:text-5xl font-bold tracking-tight">{n}</div>
              <div className="mt-2 text-xs uppercase tracking-[0.18em] text-white/60">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── LIFE AT SMG ── interactive gallery ── */}
      {/* No bottom padding: the next section's top padding already supplies
          the page's standard gap between content blocks. */}
      <section className="pt-16 md:pt-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-10 mb-4 md:mb-5 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <div className="text-xs uppercase tracking-[0.24em] text-brand font-semibold">Life at SMG</div>
              <h2 className="mt-4 text-4xl md:text-6xl font-bold tracking-tight leading-[1.02]">
                What it looks like<br />from the <span className="italic font-display font-normal text-brand">inside.</span>
              </h2>
            </div>
            <div className="lg:col-span-5 lg:col-start-8 flex items-end">
              <p className="text-lg text-ink-soft leading-relaxed">
                From launch wins to Diwali celebrations, these are the people behind the business. Explore moments from life across our teams.
              </p>
            </div>
          </div>

        </div>

        {/* Rotating 3D cylinder of photos — full-bleed so the edge mask reads */}
        <div className="life-scene">
          <div className="life-ring" style={{ "--n": ring.length } as CSSProperties}>
            {ring.map((p, i) => {
              const isClone = i >= gallery.length;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(i % gallery.length)}
                  className="life-card group cursor-zoom-in bg-ink/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  style={{ "--i": i } as CSSProperties}
                  // The far half of the ring is hidden by backface-visibility,
                  // so the clones are decorative only — keep them out of the
                  // tab order and the accessibility tree.
                  aria-hidden={isClone}
                  tabIndex={isClone ? -1 : 0}
                  aria-label={`Open photo: ${p.caption}`}
                >
                  <Image
                    src={p.src}
                    alt={isClone ? "" : p.caption}
                    fill
                    sizes="(min-width: 768px) 340px, 200px"
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PILLARS ── */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl mb-16">
            <div className="text-xs uppercase tracking-[0.24em] text-brand font-semibold">Why people stay</div>
            <h2 className="mt-4 text-4xl md:text-6xl font-bold tracking-tight leading-[1.02]">
              Four things our team mentions, <span className="italic font-display font-normal text-brand">unprompted.</span>
            </h2>
          </div>

          <div className="divide-y divide-line border-y border-line">
            {pillars.map((p) => (
              <div key={p.n} className="grid grid-cols-12 gap-6 py-10 md:py-14 group hover:bg-surface-2 transition-colors px-2 md:px-6 -mx-2 md:-mx-6 rounded-2xl">
                <div className="col-span-12 md:col-span-2">
                  <div className="text-sm font-mono text-brand tracking-wider">{p.n}</div>
                </div>
                <div className="col-span-12 md:col-span-5">
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight">{p.t}</h3>
                </div>
                <div className="col-span-12 md:col-span-5">
                  <p className="text-ink-soft leading-relaxed text-[15px]">{p.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="pb-24 md:pb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-ink text-white p-10 md:p-20">
            <div className="absolute inset-0 opacity-90 bg-brand-gradient" />
            <div className="absolute -top-32 -left-20 h-[420px] w-[420px] rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-32 -right-20 h-[420px] w-[420px] rounded-full bg-white/10 blur-3xl" />
            <div className="relative grid md:grid-cols-12 gap-8 items-end">
              <div className="md:col-span-8">
                <div className="text-[11px] uppercase tracking-[0.28em] text-white/70 font-medium">Now hiring</div>
                <h2 className="mt-5 text-4xl md:text-6xl font-bold tracking-tight leading-[1.02]">
                  Come build something<br />that <span className="italic font-display font-normal">lasts.</span>
                </h2>
                <p className="mt-5 text-white/85 text-lg max-w-xl leading-relaxed">
                  Roles across operations, sales, trade, technology, marketing and finance, based out of Mumbai, Bhiwandi and Bengaluru.
                </p>
              </div>
              <div className="md:col-span-4 flex md:justify-end">
                <Link href="/jobs" className="group inline-flex items-center gap-2 bg-white text-ink px-7 py-4 rounded-full font-semibold hover:bg-white/90 transition-colors">
                  Browse open roles <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LIGHTBOX ── */}
      {active !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Photo: ${gallery[active].caption}`}
          className="fixed inset-0 z-[100] bg-ink/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-200"
          onClick={close}
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); close(); }}
            className="absolute top-5 right-5 grid place-items-center h-11 w-11 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Close gallery"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 grid place-items-center h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 grid place-items-center h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Next photo"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <figure
            className="relative max-w-6xl w-full max-h-full flex flex-col items-center gap-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              key={gallery[active].caption}
              src={gallery[active].src}
              alt={gallery[active].caption}
              className="max-h-[78vh] w-auto max-w-full object-contain rounded-2xl shadow-elevated"
              sizes="100vw"
            />
            <figcaption className="text-center text-white/90 max-w-2xl">
              <span className="inline-block text-[10px] uppercase tracking-[0.24em] text-white/60 mb-2">
                {gallery[active].tag} · {active + 1} / {gallery.length}
              </span>
              <p className="text-base md:text-lg">{gallery[active].caption}</p>
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
