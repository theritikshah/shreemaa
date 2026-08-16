import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
}) {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div className="absolute inset-0 opacity-90">
        <div className="absolute inset-0 bg-brand-gradient animate-gradient" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.25),transparent_60%)]" />
        <div className="absolute -bottom-32 -left-20 h-[420px] w-[420px] rounded-full bg-white/10 blur-3xl animate-float-slow" />
      </div>
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10 pt-28 pb-24 md:pt-36 md:pb-32">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-[11px] uppercase tracking-[0.18em] font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-white" /> {eyebrow}
        </div>
        <h1 className="mt-6 text-5xl md:text-7xl font-bold tracking-tight max-w-4xl leading-[1.02]">
          {title}
        </h1>
        <p className="mt-6 text-lg md:text-xl text-white/85 max-w-2xl leading-relaxed">{subtitle}</p>
      </div>
    </section>
  );
}
