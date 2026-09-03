"use client";

import { useEffect, useRef, useState } from "react";

const statementLines = [
  "Built for serious scale.",
  "Nationwide reach,",
  "three decades of retail relationships",
  "and the capital strength",
  "to carry a brand's growth.",
];
const statement = statementLines.join(" ");

export function ScrollFillStatement() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 800;
      const revealStart = viewportHeight * 0.4;
      const revealDistance = viewportHeight * 0.95;
      const next = Math.min(1, Math.max(0, (revealStart - rect.top) / revealDistance));
      setProgress((current) => (Math.abs(current - next) > 0.001 ? next : current));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative flex min-h-[100svh] items-center justify-center bg-[#f6f4ef] px-5 py-24 md:px-10 md:py-32">
      <div className="w-full">
        <p
          aria-label={statement}
          className="mx-auto text-center font-display text-[clamp(1.05rem,4.8vw,5.8rem)] font-semibold leading-[1.02] tracking-[-0.052em]"
        >
          {statementLines.map((line, index) => {
            const lineProgress = Math.min(1, Math.max(0, (progress - index * 0.08) / 0.55));
            const stop = lineProgress * 100;
            return (
              <span
                key={line}
                aria-hidden="true"
                className="mx-auto block w-fit whitespace-nowrap text-transparent"
                style={{
                  backgroundImage: `linear-gradient(90deg, rgb(25, 24, 22) 0%, rgb(25, 24, 22) ${stop}%, rgba(25, 24, 22, 0.14) ${stop}%, rgba(25, 24, 22, 0.14) 100%)`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                }}
              >
                {line}
              </span>
            );
          })}
        </p>
      </div>
    </section>
  );
}
