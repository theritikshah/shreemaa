"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, X, ChevronLeft, ChevronRight, Expand } from "lucide-react";
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

const pillars = [
  { n: "01", t: "People first, always", d: "Twenty-eight years in, we still know everyone by name. Birthdays, weddings, festivals — we show up for each other." },
  { n: "02", t: "Real ownership", d: "Flat structure. Your work ships to millions of customers across India, not into a slide deck nobody reads." },
  { n: "03", t: "Learn by doing", d: "Sit beside category heads, trade ops, marketplace leads. Pick up in months what takes years at bigger places." },
  { n: "04", t: "Celebrate everything", d: "Diwali, Christmas, Holi, ethnic days, birthdays, milestone wins. There's almost always something happening." },
];

export function CareersView() {
  const [active, setActive] = useState<number | null>(null);

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
      <section className="relative bg-bg pt-32 md:pt-40 pb-16 md:pb-24">
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

          {/* Hero photo band */}
          <div className="mt-16 md:mt-20 grid grid-cols-12 gap-3 md:gap-4">
            <button
              type="button"
              onClick={() => setActive(0)}
              className="col-span-12 md:col-span-8 aspect-[16/9] rounded-2xl overflow-hidden group relative cursor-zoom-in"
              aria-label="Open photo: SMG team gathering"
            >
              <Image src={gallery[0].src} alt={gallery[0].caption} fill sizes="(min-width: 768px) 66vw, 100vw" className="object-cover group-hover:scale-[1.03] transition-transform duration-700" priority />
              <span className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition-colors" />
              <span className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm font-medium">{gallery[0].caption}</span>
                <Expand className="h-4 w-4" />
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActive(1)}
              className="col-span-12 md:col-span-4 aspect-[3/4] md:aspect-auto rounded-2xl overflow-hidden group relative cursor-zoom-in"
              aria-label="Open photo: Women of SMG"
            >
              <Image src={gallery[1].src} alt={gallery[1].caption} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover group-hover:scale-[1.03] transition-transform duration-700" />
              <span className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition-colors" />
            </button>
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
      <section className="py-24 md:py-32 bg-surface-2">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid lg:grid-cols-12 gap-10 mb-14">
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

          {/* Uniform card grid — predictable, scannable, interactive */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
            {gallery.map((p, i) => (
              <button
                key={p.caption}
                type="button"
                onClick={() => setActive(i)}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink/5 cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                aria-label={`Open photo: ${p.caption}`}
              >
                <Image
                  src={p.src}
                  alt={p.caption}
                  fill
                  sizes="(min-width: 768px) 33vw, 50vw"
                  className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-white/95 text-ink text-[10px] font-semibold uppercase tracking-[0.14em] px-2.5 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                  {p.tag}
                </span>
                <span className="absolute bottom-0 left-0 right-0 p-4 text-white translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <span className="block text-sm font-medium leading-snug">{p.caption}</span>
                </span>
                <span className="absolute top-3 right-3 grid place-items-center h-8 w-8 rounded-full bg-white/95 text-ink opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300">
                  <Expand className="h-3.5 w-3.5" />
                </span>
              </button>
            ))}
          </div>

          <p className="mt-8 text-xs text-ink-soft text-center uppercase tracking-[0.18em]">
            More moments added every quarter · Use ← → to browse
          </p>
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
