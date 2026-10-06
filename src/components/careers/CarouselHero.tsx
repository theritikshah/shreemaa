"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import type { Photo } from "./types";
import { HeroCursorCta } from "./HeroCursorCta";
import { LifeCarousel } from "./LifeCarousel";

export function CarouselHero({ photos, suspended, onOpen }: {
  photos: Photo[];
  suspended: boolean;
  onOpen: (index: number) => void;
}) {
  const heroRef = useRef<HTMLElement>(null);

  return (
    <section ref={heroRef} aria-labelledby="careers-heading" className="relative overflow-hidden bg-surface pb-8 [--life-stage-h:clamp(340px,calc(100svh-440px),520px)] md:pb-10 md:[--life-stage-h:clamp(420px,calc(80svh-160px),860px)]">
      {/* Top padding clears the fixed nav. Extra bottom room when the static
          CTA is showing, so it doesn't sit on the carousel. */}
      <div className="flex flex-col items-center justify-end px-6 pb-6 pt-24 text-center md:min-h-[33svh] [@media(hover:hover)_and_(pointer:fine)]:pb-2">
        <h1 id="careers-heading" className="text-[clamp(2.5rem,6vw,4.75rem)] font-bold leading-[0.98] tracking-[-0.035em]">
          The people who
          <br />
          <span className="font-display font-normal italic text-accent">build SMG</span>
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft md:text-lg">
          Known by name, trusted with real decisions, and surrounded by people who
          genuinely like showing up.
        </p>
        {/* Touch devices get a static CTA; fine pointers get the cursor-following one */}
        <Link
          href="/jobs"
          className="group mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-ink/85 [@media(hover:hover)_and_(pointer:fine)]:hidden"
        >
          See open roles
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Curved 3D ring of photos (WebGL); the grid is the no-WebGL fallback */}
      <LifeCarousel
        photos={photos}
        suspended={suspended}
        onOpen={onOpen}
        stageHeight="var(--life-stage-h)"
        fallback={
          <div className="mx-auto mt-8 grid max-w-7xl grid-cols-2 gap-3 px-6 md:grid-cols-3 md:gap-5 lg:px-10">
            {photos.map((p, i) => (
              <button
                key={p.caption}
                type="button"
                onClick={() => onOpen(i)}
                className="group relative aspect-[4/5] cursor-zoom-in overflow-hidden rounded-2xl bg-ink/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                aria-label={`Open photo: ${p.caption}`}
              >
                <Image
                  src={p.src}
                  alt={p.caption}
                  fill
                  sizes="(min-width: 768px) 33vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </button>
            ))}
          </div>
        }
      />

      <HeroCursorCta hostRef={heroRef} />
    </section>
  );
}
