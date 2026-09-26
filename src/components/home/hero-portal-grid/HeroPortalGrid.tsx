"use client";

import { useEffect, useRef } from "react";
import type { PortalGridController } from "./portalGridScene";

export function HeroPortalGrid() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    const container = mount?.parentElement;
    if (!mount || !container) return;

    let cancelled = false;
    let controller: PortalGridController | null = null;

    import("./portalGridScene")
      .then(({ createPortalGridScene }) => {
        if (cancelled) return;
        controller = createPortalGridScene({ mount, container });
      })
      .catch(() => {
        // The hero remains complete without WebGL; the decorative layer simply stays absent.
      });

    return () => {
      cancelled = true;
      controller?.dispose();
      controller = null;
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div ref={mountRef} className="absolute inset-0 opacity-0 transition-opacity duration-700 [&.is-ready]:opacity-100" />
      <div className="absolute inset-x-0 top-[10%] h-[29%] bg-gradient-to-b from-transparent via-surface/80 to-surface" />
      <div className="absolute inset-x-0 bottom-[10%] h-[29%] bg-gradient-to-t from-transparent via-surface/80 to-surface" />
    </div>
  );
}
