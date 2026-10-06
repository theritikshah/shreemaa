"use client";

import { useEffect, useRef } from "react";
import type { PortalGridController, PortalGridTheme } from "./portalGridScene";

export function HeroPortalGrid({ theme = "light" }: { theme?: PortalGridTheme }) {
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
        controller = createPortalGridScene({ mount, container, theme });
      })
      .catch(() => {
        // The hero remains complete without WebGL; the decorative layer simply stays absent.
      });

    return () => {
      cancelled = true;
      controller?.dispose();
      controller = null;
    };
  }, [theme]);

  // The horizon band fades to the section background.
  const fade = theme === "dark" ? "via-ink/80 to-ink" : "via-surface/80 to-surface";

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div ref={mountRef} className="absolute inset-0 opacity-0 transition-opacity duration-700 [&.is-ready]:opacity-100" />
      <div className={`absolute inset-x-0 top-[10%] h-[29%] bg-gradient-to-b from-transparent ${fade}`} />
      <div className={`absolute inset-x-0 bottom-[10%] h-[29%] bg-gradient-to-t from-transparent ${fade}`} />
    </div>
  );
}
