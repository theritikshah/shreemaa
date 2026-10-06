"use client";

// ARCHIVED: photo-wall careers hero (hanging columns of photo cards that tilt
// on hover and randomly wipe to new photos). Not rendered anywhere. To use it,
// render <PhotoWallHero photos={gallery} onOpen={setActive} /> in CareersView
// in place of <CarouselHero />.

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Photo } from "../types";

// Hanging columns of photos above the headline. `lift` raises a column by a
// fraction of a card's height, so the faded placeholder on top is partly
// cut off and the columns sit at staggered heights. `show` decides from which
// breakpoint a column appears; second photos in a column only show from lg,
// where the side columns are clear of the headline.
type Column = { lift: number; photos: number[]; show: "base" | "md" | "lg" | "xl"; accent?: boolean };

const columns: Column[] = [
  { lift: 0.8, photos: [6, 11], show: "xl" },
  { lift: 0.55, photos: [13, 1], show: "lg" },
  { lift: 0.95, photos: [0, 14], show: "md", accent: true },
  { lift: 0.3, photos: [12], show: "base" },
  { lift: 0.75, photos: [10], show: "base" },
  { lift: 0.5, photos: [9], show: "base" },
  { lift: 0.85, photos: [15], show: "base" },
  { lift: 0.4, photos: [2], show: "base" },
  { lift: 0.95, photos: [17, 3], show: "md", accent: true },
  { lift: 0.55, photos: [5, 16], show: "lg" },
  { lift: 0.35, photos: [4, 8], show: "xl" },
];

const showClass = { base: "flex", md: "hidden md:flex", lg: "hidden lg:flex", xl: "hidden xl:flex" };

// Cards are sized from the viewport so the visible columns (--cols) always
// run past both edges: the row is ~0.6 of a card wider than the screen.
const cardWidth = "min(220px, calc((100vw - (var(--cols) - 1) * var(--gap)) / (var(--cols) - 0.6)))";

// Where the column tops start, just under the fixed nav.
const TOP = "72px";

// How often one card wipes over to a photo that isn't on the wall yet.
const FLIP_EVERY = 1800;

/**
 * One photo card that tilts toward the cursor and lifts on hover. When
 * `photoIndex` changes, the new photo loads on the hidden layer first and
 * then wipes in over the old one, so a wipe never reveals a blank card.
 */
function TiltCard({ photos, photoIndex, delay, onOpen, cardRef, className = "" }: {
  photos: Photo[];
  photoIndex: number;
  delay: number;
  onOpen: (index: number) => void;
  cardRef: (el: HTMLDivElement | null) => void;
  className?: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [faces, setFaces] = useState<[number, number]>([photoIndex, photoIndex]);
  const [turns, setTurns] = useState(0);
  const [pending, setPending] = useState(false);
  const [prevIndex, setPrevIndex] = useState(photoIndex);
  const front = turns % 2;
  const back = 1 - front;

  // React to a new photo during render (no effect), per React's
  // "adjusting state when a prop changes" pattern.
  if (photoIndex !== prevIndex) {
    setPrevIndex(photoIndex);
    if (photoIndex === faces[back]) {
      // Already loaded on the hidden layer; just wipe.
      setTurns((t) => t + 1);
    } else if (photoIndex !== faces[front]) {
      setFaces(back === 0 ? [photoIndex, faces[1]] : [faces[0], photoIndex]);
      setPending(true);
    }
  }

  const onFaceLoad = (face: number) => {
    if (face !== back || !pending) return;
    setPending(false);
    setTurns((t) => t + 1);
  };

  const onMove = (e: PointerEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${(-y * 16).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(x * 16).toFixed(2)}deg`);
  };
  const onLeave = () => {
    ref.current?.style.setProperty("--rx", "0deg");
    ref.current?.style.setProperty("--ry", "0deg");
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative [perspective:700px] hover:z-10 ${className}`}
      initial={{ opacity: 0, y: -28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <button
        ref={ref}
        type="button"
        onClick={() => onOpen(photoIndex)}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        aria-label={`Open photo: ${photos[photoIndex].caption}`}
        className="pointer-events-auto relative block h-[var(--card-h)] w-[var(--card-w)] cursor-zoom-in overflow-hidden rounded-xl bg-ink/5 shadow-[0_1px_2px_rgba(0,0,0,0.06)] ring-1 ring-ink/5 transition-[transform,box-shadow] duration-300 ease-out [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] hover:shadow-[0_28px_50px_-18px_rgba(0,0,0,0.4)] hover:[transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))_scale(1.08)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand motion-reduce:transition-none md:rounded-2xl"
      >
        {/* Two stacked layers. The current one sits on top fully revealed;
            the other waits underneath, clipped away, until it holds the
            next photo. It then comes to the top and wipes in left to right.
            The outgoing layer only re-clips once the wipe has finished. */}
        {faces.map((p, face) => {
          const isFront = face === front;
          return (
            <motion.div
              key={face}
              aria-hidden
              className="absolute inset-0"
              style={{ zIndex: isFront ? 1 : 0 }}
              initial={false}
              animate={{ clipPath: isFront ? "inset(0% 0% 0% 0%)" : "inset(0% 100% 0% 0%)" }}
              transition={isFront ? { duration: 0.9, ease: [0.65, 0, 0.35, 1] } : { duration: 0, delay: 0.95 }}
            >
              <Image
                src={photos[p].src}
                alt=""
                fill
                sizes="(min-width: 768px) 220px, 90px"
                className="object-cover"
                onLoad={() => onFaceLoad(face)}
              />
            </motion.div>
          );
        })}
      </button>
    </motion.div>
  );
}

// Slot numbers for each column's photos, in render order.
const slotStart = columns.map((_, c) => columns.slice(0, c).reduce((n, col) => n + col.photos.length, 0));
const initialAssignment = columns.flatMap((col) => col.photos);

export function PhotoWallHero({ photos, onOpen }: {
  photos: Photo[];
  onOpen: (index: number) => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardEls = useRef<(HTMLDivElement | null)[]>([]);
  const [assignment, setAssignment] = useState(initialAssignment);
  const assignmentRef = useRef(assignment);
  useEffect(() => { assignmentRef.current = assignment; }, [assignment]);

  // Every few seconds a random visible card flips to a photo that isn't
  // currently on screen. Skips hovered cards, and pauses while the hero is
  // off screen or the tab is hidden.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let inView = true;
    let lastSlot = -1;
    const io = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; });
    io.observe(section);

    const id = window.setInterval(() => {
      if (!inView || document.hidden) return;
      const current = assignmentRef.current;
      // Hidden columns and cards have no offsetParent.
      const visible = current.map((_, s) => s).filter((s) => cardEls.current[s]?.offsetParent);
      const shown = new Set(visible.map((s) => current[s]));
      const spare = photos.map((_, i) => i).filter((i) => !shown.has(i));
      const candidates = visible.filter((s) => s !== lastSlot && !cardEls.current[s]?.matches(":hover"));
      if (!spare.length || !candidates.length) return;

      const slot = candidates[Math.floor(Math.random() * candidates.length)];
      const next = [...current];
      next[slot] = spare[Math.floor(Math.random() * spare.length)];
      lastSlot = slot;
      setAssignment(next);
    }, FLIP_EVERY);

    return () => {
      window.clearInterval(id);
      io.disconnect();
    };
  }, [photos]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="careers-heading"
      className="relative overflow-hidden bg-surface pb-20 [--card-h:calc(var(--card-w)*1.22)] [--cols:5] [--gap:10px] md:pb-28 md:[--cols:7] md:[--gap:14px] lg:[--cols:9] xl:[--cols:11]"
      style={{ "--card-w": cardWidth } as CSSProperties}
    >
      {/* Photo columns. The layer ignores the pointer so only the cards
          themselves are interactive. */}
      <div className="pointer-events-none absolute inset-0 flex justify-center gap-[var(--gap)]">
        {columns.map((col, c) => (
          <div
            key={c}
            className={`${showClass[col.show]} flex-col items-center gap-[var(--gap)]`}
            style={{ marginTop: `calc(${TOP} - ${col.lift} * var(--card-h))` } as CSSProperties}
          >
            {/* Faded placeholder card */}
            <div aria-hidden className="h-[var(--card-h)] w-[var(--card-w)] shrink-0 rounded-xl bg-gradient-to-b from-transparent to-ink/[0.045] md:rounded-2xl" />

            {col.photos.map((_, n) => (
              <TiltCard
                key={n}
                photos={photos}
                photoIndex={assignment[slotStart[c] + n]}
                cardRef={(el) => { cardEls.current[slotStart[c] + n] = el; }}
                onOpen={onOpen}
                delay={0.15 + c * 0.05 + n * 0.12}
                className={n > 0 ? "hidden lg:block" : ""}
              />
            ))}

            {/* Dotted guide running down from the column */}
            <div
              aria-hidden
              className={`w-px flex-1 bg-[repeating-linear-gradient(to_bottom,currentColor_0_3px,transparent_3px_8px)] [mask-image:linear-gradient(to_bottom,black,transparent_85%)] ${col.accent ? "text-accent/45" : "text-ink/15"}`}
            />
          </div>
        ))}
      </div>

      {/* Copy sits below the shortest centre column */}
      <div className="relative mx-auto flex max-w-2xl flex-col items-center px-6 pt-[calc(1.7*var(--card-h)+120px)] text-center md:pt-[calc(1.7*var(--card-h)+140px)]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          <span className="rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-medium text-ink shadow-2xs">
            Life at SMG
          </span>
          <h1 id="careers-heading" className="mt-5 text-[clamp(2.5rem,6vw,4.75rem)] font-bold leading-[0.98] tracking-[-0.035em]">
            The people who
            <br />
            <span className="font-display font-normal italic text-accent">build SMG</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft md:text-lg">
            Known by name, trusted with real decisions, and surrounded by people who
            genuinely like showing up.
          </p>
          <Link
            href="/jobs"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand"
          >
            See open roles
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
