"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image, { type StaticImageData } from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play, Users, Sparkles, Trophy, Coffee, PartyPopper, ArrowUpRight } from "lucide-react";
import type { CarouselScene } from "./carousel/createCarousel";

type Photo = { src: StaticImageData; caption: string; tag: string };
const categories = [
  { label: "Our people", tags: ["Team day", "Culture"], icon: Users },
  { label: "Everyday moments", tags: ["On the floor", "Theme day"], icon: Coffee },
  { label: "Shared wins", tags: ["Wins", "Recognition"], icon: Trophy },
  { label: "Celebrations", tags: ["Festivals"], icon: Sparkles },
  { label: "Beyond the office", tags: ["Off-site"], icon: PartyPopper },
];

const DEFAULT_STAGE_HEIGHT = "min(clamp(420px, 23.4375vw + 345px, 720px), calc(100dvh - clamp(24px, 2.5vw + 16px, 56px) - 48px))";

export function LifeCarousel({ photos, onOpen, fallback, suspended = false, stageHeight = DEFAULT_STAGE_HEIGHT }: {
  photos: Photo[];
  onOpen: (index: number) => void;
  fallback: ReactNode;
  suspended?: boolean;
  stageHeight?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const controls = useRef<CarouselScene | null>(null);
  const openRef = useRef(onOpen);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [engaged, setEngaged] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  useEffect(() => { openRef.current = onOpen; }, [onOpen]);
  useEffect(() => {
    controls.current?.setPaused(paused || engaged || suspended);
  }, [paused, engaged, suspended, status]);

  useEffect(() => {
    const mount = host.current;
    if (!mount) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    const observer = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      try {
        const { createCarousel } = await import("./carousel/createCarousel");
        if (disposed) return;
        const scene = createCarousel(mount, photos.map((p) => p.src.src), {
          onActiveChange: setActive,
          onSelect: (i) => openRef.current(i),
          onError: () => { if (!disposed) setStatus("error"); },
        });
        cleanup = scene.dispose;
        controls.current = scene;
        setStatus("ready");
      } catch { if (!disposed) setStatus("error"); }
    }, { rootMargin: "300px" });
    observer.observe(mount);
    return () => { disposed = true; observer.disconnect(); cleanup?.(); controls.current = null; };
  }, [photos]);

  useEffect(() => {
    if (status === "error") { controls.current?.dispose(); controls.current = null; }
  }, [status]);

  if (status === "error") return <>{fallback}</>;
  const current = photos[active];
  return (
    <div role="region" aria-label="Life at SMG photo carousel" aria-roledescription="carousel"
      onFocusCapture={() => setEngaged(true)}
      onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setEngaged(false); }}>
      <div className="relative" style={{ height: stageHeight }}>
        {status === "loading" && <div className="absolute inset-6 mx-auto max-w-xl overflow-hidden rounded-3xl">
          <Image src={photos[0].src} alt="" fill sizes="(min-width: 768px) 560px, 90vw" className="object-cover" />
        </div>}
        <div ref={host} aria-hidden="true" className={`h-full w-full transition-opacity duration-700 ${status === "ready" ? "opacity-100" : "opacity-0"}`} />
      </div>
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mt-[clamp(24px,2.5vw+16px,56px)] flex flex-wrap justify-center gap-x-[clamp(16px,1.875vw+10px,40px)] gap-y-1" aria-label="Photo categories">
          {categories.map(({label, tags, icon: Icon}) => {
            const selected = tags.includes(current.tag);
            return <button key={label} type="button" aria-pressed={selected} disabled={status !== "ready"}
              onClick={() => controls.current?.goTo(photos.findIndex((p) => tags.includes(p.tag)))}
              className={`inline-flex min-h-11 items-center gap-2 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand md:text-sm ${selected ? "text-ink" : "text-ink-soft hover:text-ink"}`}>
              <Icon className={`h-4 w-4 ${selected ? "text-accent" : ""}`} />{label}
            </button>;
          })}
        </div>
        <div className="sr-only focus-within:not-sr-only focus-within:mx-auto focus-within:mt-6 focus-within:flex focus-within:max-w-3xl focus-within:items-center focus-within:justify-between">
          <button type="button" onClick={() => onOpen(active)} className="group flex items-center gap-3 text-left focus-visible:outline-2 focus-visible:outline-brand">
            <span className="font-mono text-xs text-accent">{String(active + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}</span>
            <span className="text-sm font-medium">{current.caption}</span>
            <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-0.5" />
          </button>
          <div className="flex shrink-0 items-center gap-2">
            <button type="button" aria-label="Previous photo" onClick={() => controls.current?.step(-1)} className="grid h-11 w-11 place-items-center rounded-full border border-line transition-colors hover:bg-ink hover:text-white"><ChevronLeft className="h-4 w-4" /></button>
            <button type="button" aria-label={paused ? "Play carousel" : "Pause carousel"} aria-pressed={paused} onClick={() => setPaused(!paused)} className="grid h-11 w-11 place-items-center rounded-full border border-line transition-colors hover:bg-ink hover:text-white">{paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}</button>
            <button type="button" aria-label="Next photo" onClick={() => controls.current?.step(1)} className="grid h-11 w-11 place-items-center rounded-full border border-line transition-colors hover:bg-ink hover:text-white"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>

      </div>
    </div>
  );
}
