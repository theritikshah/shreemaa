"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ArrowUpRight, X, ChevronLeft, ChevronRight } from "lucide-react";
import life3 from "@/assets/life-3.jpeg";
import life4 from "@/assets/life-4.jpeg";
import life5 from "@/assets/life-5.jpeg";
import life6 from "@/assets/life-6.jpeg";
import life7 from "@/assets/life-7.jpeg";
import life8 from "@/assets/life-8.jpeg";
import life9 from "@/assets/life-9.jpeg";
import utsavAwards from "@/assets/life/shri-utsav-2025-ultimate-kings.jpeg";
import utsavDance from "@/assets/life/shri-utsav-2025-dance-performance.jpeg";
import utsavStage from "@/assets/life/shri-utsav-2025-stage.jpeg";
import splWinners from "@/assets/life/spl-champions-trophy.jpeg";
import splSelfie from "@/assets/life/spl-sideline-selfie.jpeg";
import splToss from "@/assets/life/spl-toss.jpeg";
import purpleDay from "@/assets/life/purple-day-courtyard.jpeg";
import flowerCrowns from "@/assets/life/pink-day-flower-crowns.jpeg";
import independenceDay from "@/assets/life/independence-day-office.jpeg";
import pinkTerrace from "@/assets/life/pink-day-terrace-celebration.jpeg";
import christmasHats from "@/assets/life/christmas-santa-hats.jpeg";
import { Counter } from "@/components/Counter";
import { CarouselHero } from "./CarouselHero";
import type { Photo } from "./types";

const gallery: Photo[] = [
  { src: life7, caption: "The full team, together in indigo", tag: "Team day" },
  { src: life8, caption: "Women of SMG", tag: "Culture" },
  { src: life9, caption: "Pink day at the office", tag: "Theme day" },
  { src: life3, caption: "Award winners on stage", tag: "Recognition" },
  { src: life4, caption: "Christmas at the office", tag: "Festivals" },
  { src: life5, caption: "Off-site dinner that ran past midnight", tag: "Off-site" },
  { src: life6, caption: "Diwali, decked up", tag: "Festivals" },
  { src: utsavAwards, caption: "Meet the ultimate kings of SMG", tag: "Recognition" },
  { src: utsavDance, caption: "Opening performance at Shri Utsav 2025", tag: "Festivals" },
  { src: utsavStage, caption: "Shri Utsav 2025, stage set for the night", tag: "Festivals" },
  { src: splWinners, caption: "SMG Premier League champions", tag: "Wins" },
  { src: splSelfie, caption: "Cheering from the sidelines at SPL", tag: "Off-site" },
  { src: splToss, caption: "Toss time at the SMG Premier League", tag: "Off-site" },
  { src: purpleDay, caption: "Purple day in the courtyard", tag: "Theme day" },
  { src: flowerCrowns, caption: "Flower crowns and pink, all together", tag: "Culture" },
  { src: independenceDay, caption: "Independence Day at the office", tag: "Festivals" },
  { src: pinkTerrace, caption: "Pink day on the terrace", tag: "Theme day" },
  { src: christmasHats, caption: "Santa hats on for Christmas", tag: "Festivals" },
];

const stats = [
  { to: 28, suffix: "", label: ["Years building", "together"] },
  { to: 500, suffix: "+", label: ["Team members", "nationwide"] },
  { to: 12, suffix: "+", label: ["Cities and", "locations"] },
  { to: 80, suffix: "K+", label: ["Retail partners", "we serve"] },
];

const pillars = [
  { n: "01", t: "People first, always", d: "Even as SMG grows, colleagues know the people they work with. We make time for the moments that matter to each other." },
  { n: "02", t: "Real ownership", d: "Your decisions move real stock, reach real retailers and shape what customers can buy." },
  { n: "03", t: "Learn by doing", d: "Work alongside the teams that run marketplace categories, trading desks and field distribution. Learn by solving live business problems." },
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
      {/* ── HERO ── headline in the top third, the photo carousel below ── */}
      {/* An alternative photo-wall hero is archived in ./archive/PhotoWallHero */}
      <CarouselHero photos={gallery} suspended={active !== null} onOpen={setActive} />

      {/* ── STATS + PILLARS ── the numbers lead straight into the points ── */}
      <section className="pb-24 pt-6 md:pb-32 md:pt-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 text-center md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label[0]} className="rounded-2xl border border-line bg-white p-5 shadow-2xs">
                <div className="text-3xl font-bold tracking-tight text-brand-gradient lg:text-4xl">
                  <Counter to={s.to} suffix={s.suffix} />
                </div>
                <div className="mt-1.5 text-xs font-medium leading-snug text-ink-soft">
                  {s.label[0]}<br />{s.label[1]}
                </div>
              </div>
            ))}
          </div>

          <div className="mb-16 mt-20 max-w-3xl md:mt-24">
            <div className="text-xs uppercase tracking-[0.24em] text-accent font-semibold">Why people stay</div>
            <h2 className="mt-4 text-4xl md:text-6xl font-bold tracking-tight leading-[1.02]">
              Four things our team mentions, <span className="italic font-display font-normal text-accent">unprompted.</span>
            </h2>
          </div>

          <div className="divide-y divide-line border-y border-line">
            {pillars.map((p) => (
              <div key={p.n} className="grid grid-cols-12 gap-6 py-10 md:py-14 group hover:bg-surface-2 transition-colors px-2 md:px-6 -mx-2 md:-mx-6 rounded-2xl">
                <div className="col-span-12 md:col-span-2">
                  <div className="text-sm font-mono text-accent tracking-wider">{p.n}</div>
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
