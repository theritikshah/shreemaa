"use client";

import Link from "next/link";
import Image from "next/image";
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

const heroFloatingPhotos = [
  { i: 3, left: 1, top: 7, width: 18, aspect: 1.05, lag: 0.14, shrink: 0.1 },
  { i: 4, left: 91, top: 12, width: 7, aspect: 0.92, lag: 0.2, shrink: 0.14 },
  { i: 5, left: 1, top: 66, width: 5, aspect: 0.72, lag: 0.1, shrink: 0.08 },
  { i: 6, left: 16, top: 70, width: 19, aspect: 1.35, lag: 0.22, shrink: 0.16 },
  { i: 7, left: 46, top: 73, width: 7, aspect: 0.88, lag: 0.16, shrink: 0.1 },
  { i: 8, left: 67, top: 72, width: 14, aspect: 1.18, lag: 0.08, shrink: 0.12 },
];

const pillars = [
  { n: "01", t: "People first, always", d: "Twenty-eight years in, we still know everyone by name. Birthdays, weddings, festivals — we show up for each other." },
  { n: "02", t: "Real ownership", d: "Flat structure. Your work ships to millions of customers across India, not into a slide deck nobody reads." },
  { n: "03", t: "Learn by doing", d: "Sit beside category heads, trade ops, marketplace leads. Pick up in months what takes years at bigger places." },
  { n: "04", t: "Celebrate everything", d: "Diwali, Christmas, Holi, ethnic days, birthdays, milestone wins. There's almost always something happening." },
];

export function CareersView() {
  const [active, setActive] = useState<number | null>(null);
  const heroPhotoRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const floatingStageRef = useRef<HTMLDivElement>(null);
  const floatingPhotoRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // The reference images move at roughly two-thirds of page speed and shrink
  // apart as the hero leaves the viewport. The centre image retains more scale.
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targetScales = [0.64, 0.78, 0.64];
    const restingY = [34, 0, 34];
    let frame = 0;
    const paint = () => {
      const distance = Math.min(680, Math.max(0, window.scrollY));
      const progress = distance / 680;
      heroPhotoRefs.current.forEach((card, index) => {
        if (!card) return;
        const parallax = reducedMotion ? 0 : distance * 0.33;
        const scale = reducedMotion ? 1 : 1 + (targetScales[index] - 1) * progress;
        card.style.transform = `translate3d(0, ${restingY[index] + parallax}px, 0) scale(${scale})`;
      });

      const stage = floatingStageRef.current;
      if (stage) {
        const rect = stage.getBoundingClientRect();
        const viewportHeight = window.innerHeight || 800;
        const stageProgress = Math.min(
          1,
          Math.max(0, (viewportHeight - rect.top) / (rect.height + viewportHeight)),
        );
        floatingPhotoRefs.current.forEach((card, index) => {
          if (!card) return;
          const config = heroFloatingPhotos[index];
          const lag = reducedMotion ? 0 : stageProgress * viewportHeight * config.lag;
          const scale = reducedMotion ? 1 : 1 - stageProgress * config.shrink;
          card.style.transform = `translate3d(0, ${lag}px, 0) scale(${scale})`;
        });
      }
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
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
      {/* ── HERO ── */}
      <section className="relative overflow-x-clip bg-bg pt-32 md:pt-40 pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-7">
              <div className="text-[11px] uppercase tracking-[0.28em] text-brand font-semibold">Work with us</div>
              <h1 className="mt-6 text-[clamp(2.75rem,8vw,6.5rem)] font-bold tracking-[-0.03em] leading-[0.95]">
                The people<br />
                <span className="italic font-display font-normal text-brand">who actually</span><br />
                build SMG.
              </h1>
            </div>
            <div className="lg:col-span-5 lg:pl-8">
              <p className="text-lg text-ink leading-relaxed max-w-md">
                What&apos;s actually rare isn&apos;t free snacks or ping-pong tables. It&apos;s a workplace where you&apos;re known by name, trusted with real decisions, and surrounded by people who genuinely like showing up.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/jobs" className="group inline-flex items-center gap-2 bg-ink text-white px-6 py-3.5 rounded-full text-sm font-semibold hover:bg-ink/85 transition-colors">
                  See open roles <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <a href="mailto:careers@shrimaa.com" className="inline-flex items-center gap-2 border border-line text-ink px-6 py-3.5 rounded-full text-sm font-semibold hover:bg-surface-2 transition-colors">
                  careers@shrimaa.com
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Full-width three-image composition with scroll-linked scale/parallax. */}
        <div className="mt-14 grid w-full grid-cols-3 gap-2 overflow-visible px-2 pb-20 md:mt-20 md:gap-3 md:px-3 md:pb-28">
          {gallery.slice(0, 3).map((photo, index) => (
            <button
              key={photo.caption}
              ref={(element) => {
                heroPhotoRefs.current[index] = element;
              }}
              type="button"
              onClick={() => setActive(index)}
              className="group relative aspect-square min-w-0 origin-center overflow-hidden rounded-[18px] will-change-transform cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-brand md:rounded-[24px]"
              aria-label={`Open photo: ${photo.caption}`}
            >
              <Image
                src={photo.src}
                alt={photo.caption}
                fill
                sizes="33vw"
                priority={index === 0}
                className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
              />
              <span className="absolute inset-0 bg-ink/0 transition-colors group-hover:bg-ink/15" />
            </button>
          ))}
        </div>

        {/* The remaining photos and statement complete the same composition. */}
        <div
          ref={floatingStageRef}
          className="relative mx-auto -mt-16 h-[86svh] min-h-[620px] max-w-[1440px] overflow-visible md:-mt-24 md:h-[105vh] md:min-h-[780px]"
        >
          {heroFloatingPhotos.map((config, index) => {
            const photo = gallery[config.i];
            return (
              <button
                key={photo.caption}
                ref={(element) => {
                  floatingPhotoRefs.current[index] = element;
                }}
                type="button"
                onClick={() => setActive(config.i)}
                className="group absolute overflow-hidden rounded-[18px] bg-ink/5 shadow-[0_20px_45px_-30px_rgba(20,18,16,0.55)] will-change-transform cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-brand md:rounded-[24px]"
                style={{
                  left: `${config.left}%`,
                  top: `${config.top}%`,
                  width: `${config.width}%`,
                  aspectRatio: String(config.aspect),
                  transformOrigin: "center",
                }}
                aria-label={`Open photo: ${photo.caption}`}
              >
                <Image
                  src={photo.src}
                  alt={photo.caption}
                  fill
                  sizes="(min-width: 768px) 20vw, 24vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </button>
            );
          })}

          <div className="pointer-events-none absolute left-1/2 top-[42%] z-10 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 px-8 text-center md:top-[43%]">
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-ink-soft md:text-lg">
              We hire for curiosity and follow-through, not for a résumé that ticks the right boxes.
            </p>
            <h2 className="mt-5 text-3xl font-bold leading-[1.05] tracking-tight md:mt-6 md:text-5xl">
              Real work, real ownership,{" "}
              <span className="italic font-display font-normal text-brand">from day one.</span>
            </h2>
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
                Group photos in indigo. Pink-day kurta sessions. Diwali rangoli mornings. Cricket trophies. Christmas hampers. Tap any image to open the full story.
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
