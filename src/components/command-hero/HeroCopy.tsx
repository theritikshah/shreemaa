import type { ReactNode } from "react";

interface HeroCopyProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}

// A restrained opacity/blur rise, staggered per line. Pure CSS, so the copy
// appears without waiting on JavaScript or WebGL.
const reveal =
  "animate-in fade-in blur-in-md slide-in-from-bottom-2 fill-mode-both duration-[1400ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] motion-reduce:animate-none";

/** Centred opening copy for the command hero. */
export function HeroCopy({ eyebrow, title, description, actions }: HeroCopyProps) {
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
      {eyebrow && <div className={reveal}>{eyebrow}</div>}
      <h1 className={`mt-6 text-5xl font-bold leading-[1.02] tracking-tight md:text-7xl ${reveal} delay-[120ms]`}>{title}</h1>
      {description && (
        <p className={`mt-6 max-w-2xl text-lg leading-relaxed text-white/75 md:text-xl ${reveal} delay-[240ms]`}>
          {description}
        </p>
      )}
      {actions && <div className={`mt-9 flex flex-wrap justify-center gap-3 ${reveal} delay-[360ms]`}>{actions}</div>}
    </div>
  );
}
