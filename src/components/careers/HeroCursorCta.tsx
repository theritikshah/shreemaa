"use client";

import Link from "next/link";
import { useEffect, useRef, type RefObject } from "react";
import { ArrowUpRight } from "lucide-react";

// Fraction of the remaining distance covered each frame.
const EASE = 0.12;

/**
 * "See open roles" pill that follows the cursor around the hero with a lerped
 * ease, centred on the cursor. Only on fine-pointer devices; touch gets a
 * static link in the hero.
 */
export function HeroCursorCta({ hostRef }: { hostRef: RefObject<HTMLElement | null> }) {
  const pillRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const pill = pillRef.current;
    if (!host || !pill) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const ease = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : EASE;

    // Resting spot for keyboard focus before the cursor has entered the hero.
    let x = host.clientWidth / 2 - pill.offsetWidth / 2;
    let y = host.clientHeight * 0.3;
    let tx = x;
    let ty = y;
    let clientX = 0;
    let clientY = 0;
    let inside = false;
    let raf = 0;

    const paint = () => {
      pill.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    };
    const tick = () => {
      x += (tx - x) * ease;
      y += (ty - y) * ease;
      paint();
      raf = Math.abs(tx - x) > 0.1 || Math.abs(ty - y) > 0.1 ? requestAnimationFrame(tick) : 0;
    };
    const retarget = () => {
      if (!inside) return;
      const r = host.getBoundingClientRect();
      tx = clientX - r.left - pill.offsetWidth / 2;
      ty = clientY - r.top - pill.offsetHeight / 2;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      clientX = e.clientX;
      clientY = e.clientY;
      if (!inside) {
        // Appear at the cursor rather than flying in from the last position.
        inside = true;
        retarget();
        x = tx;
        y = ty;
        paint();
        pill.dataset.visible = "true";
        return;
      }
      retarget();
    };
    const onLeave = () => {
      inside = false;
      pill.dataset.visible = "false";
    };

    paint();
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", retarget, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", retarget);
    };
  }, [hostRef]);

  return (
    <Link
      ref={pillRef}
      href="/jobs"
      data-visible="false"
      className="group absolute left-0 top-0 z-20 hidden items-center gap-2 whitespace-nowrap rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white opacity-0 shadow-[0_18px_40px_-14px_rgba(0,0,0,0.45)] will-change-transform scale-90 transition-[opacity,scale,background-color] duration-300 hover:bg-brand focus-visible:opacity-100 focus-visible:scale-100 data-[visible=true]:opacity-100 data-[visible=true]:scale-100 [@media(hover:hover)_and_(pointer:fine)]:inline-flex"
    >
      See open roles
      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  );
}
