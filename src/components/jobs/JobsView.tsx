"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MapPin, Briefcase, ArrowRight, X, ArrowLeft } from "lucide-react";
import UnicornScene from "unicornstudio-react/next";

const jobs = [
  { id: 1, title: "Senior Manager · Marketplace Operations", dept: "Operations", location: "Mumbai", type: "Full-time", desc: "Lead end-to-end Amazon/Flipkart operations for category brands." },
  { id: 2, title: "Regional Sales Head · West", dept: "Sales", location: "Mumbai", type: "Full-time", desc: "Own P&L for the western region across distribution channels." },
  { id: 3, title: "Supply Chain Lead", dept: "Supply Chain", location: "Bhiwandi", type: "Full-time", desc: "Optimize warehouse operations across 300,000+ sq ft of infrastructure." },
  { id: 4, title: "Performance Marketing Manager", dept: "Marketing", location: "Mumbai", type: "Full-time", desc: "Drive paid-media performance across Amazon Ads and Flipkart CPC." },
  { id: 5, title: "Finance Manager · Treasury", dept: "Finance", location: "Mumbai", type: "Full-time", desc: "Manage working capital and channel financing programs." },
  { id: 6, title: "Engineering Lead · Internal Tools", dept: "Technology", location: "Bengaluru", type: "Full-time", desc: "Build internal systems supporting nationwide operations." },
  { id: 7, title: "Trade Operations Executive", dept: "Operations", location: "Mumbai", type: "Full-time", desc: "Coordinate cross-border trade documentation and logistics." },
  { id: 8, title: "Category Manager · Smartphones", dept: "Operations", location: "Mumbai", type: "Full-time", desc: "Own the smartphone category P&L across marketplaces." },
];

const departments = ["All", "Sales", "Operations", "Supply Chain", "Finance", "Marketing", "Technology"];

const heroPhrases = [
  "problem solvers",
  "category builders",
  "commercial thinkers",
  "hands-on operators",
  "curious minds",
  "people who deliver",
];

export function JobsView() {
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState<typeof jobs[number] | null>(null);
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;
    const timer = window.setInterval(
      () => setPhraseIndex((index) => (index + 1) % heroPhrases.length),
      1900,
    );
    return () => window.clearInterval(timer);
  }, []);

  const filtered = filter === "All" ? jobs : jobs.filter((j) => j.dept === filter);

  return (
    <>
      <section className="relative mx-3 mt-20 min-h-[calc(100svh-96px)] overflow-hidden rounded-[26px] bg-ink text-white md:mx-5 md:rounded-[34px]">
        <div className="absolute inset-0 overflow-hidden bg-ink">
          <div aria-hidden className="pointer-events-none absolute -right-[120px] -top-[180px] h-[560px] w-[560px] rounded-full bg-[rgba(225,27,34,0.22)] blur-[150px]" />
          <div aria-hidden className="pointer-events-none absolute -bottom-[200px] -left-[100px] h-[520px] w-[520px] rounded-full bg-[rgba(255,122,69,0.14)] blur-[160px]" />
          <div className="absolute inset-0">
            <UnicornScene
              projectId="tnAhw4e67txvvqrBP7oz"
              width="100%"
              height="100%"
              scale={1}
              dpi={1.5}
              lazyLoad={false}
              ariaLabel="Animated dark gradient background"
              placeholderClassName="h-full w-full bg-transparent"
            />
          </div>
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(135deg, #b30000 0%, #fd0000 100%)",
            mixBlendMode: "multiply",
            opacity: 1,
          }}
        />

        <div className="relative z-10 flex min-h-[calc(100svh-96px)] flex-col justify-center px-6 py-24 md:px-12 lg:px-[8vw]">
          <h1 className="sr-only">Open roles for problem solvers at SMG</h1>

          <div className="flex flex-col text-[clamp(1.75rem,6vw,6rem)] font-medium leading-[0.96] tracking-[-0.055em] md:flex-row md:items-center md:gap-[0.22em]">
            <span className="relative z-20 shrink-0 text-white">For the</span>
            <div className="relative mt-3 h-[4.8em] min-w-0 flex-1 md:mt-0 md:h-[3.3em]">
              {heroPhrases.map((phrase, index) => {
                const length = heroPhrases.length;
                let offset = index - phraseIndex;
                if (offset > length / 2) offset -= length;
                if (offset < -length / 2) offset += length;
                const distance = Math.abs(offset);
                return (
                  <span
                    key={phrase}
                    aria-hidden={offset !== 0}
                    className="absolute left-0 top-1/2 whitespace-nowrap transition-[transform,opacity,filter,color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{
                      transform: `translateY(calc(-50% + ${offset * 1.02}em))`,
                      opacity: distance === 0 ? 1 : distance <= 3 ? Math.max(0.08, 0.3 - distance * 0.07) : 0,
                      filter: distance === 0 ? "blur(0px)" : `blur(${Math.min(distance * 0.7, 2)}px)`,
                      color: offset === 0 ? "white" : "rgba(255,255,255,0.38)",
                    }}
                  >
                    {phrase}
                  </span>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      <section id="open-roles" className="scroll-mt-24 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Link href="/careers" className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-brand mb-8">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to life at SMG
          </Link>

          <div className="mb-12">
            <div className="grid lg:grid-cols-12 gap-8 items-end pb-6 border-b border-line">
              <div className="lg:col-span-5">
                <div className="text-[11px] uppercase tracking-[0.28em] text-brand font-semibold">Departments</div>
                <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight leading-[1.05]">
                  <span className="font-display italic">{String(filtered.length).padStart(2, "0")}</span> positions <br className="hidden md:block" />open right now.
                </h2>
              </div>
              <div className="lg:col-span-7 lg:text-right">
                <p className="text-sm text-ink-soft max-w-md lg:ml-auto leading-relaxed">
                  Filter by team to find where you fit. Every role reports into a flat structure with real ownership from day one.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-1 gap-y-2 -mx-2 pt-4">
              {departments.map((d) => {
                const active = filter === d;
                const count = d === "All" ? jobs.length : jobs.filter((j) => j.dept === d).length;
                return (
                  <button
                    key={d}
                    onClick={() => setFilter(d)}
                    className={`group relative px-3 py-2 text-sm font-medium tracking-tight transition-colors ${
                      active ? "text-ink" : "text-ink-soft hover:text-ink"
                    }`}
                  >
                    <span className="inline-flex items-baseline gap-1.5">
                      {d}
                      <span className={`text-[10px] font-mono tabular-nums transition-colors ${active ? "text-brand" : "text-ink-soft/60"}`}>
                        {String(count).padStart(2, "0")}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className={`absolute left-3 right-3 -bottom-px h-px transition-all duration-300 ${
                        active ? "bg-ink opacity-100" : "bg-ink opacity-0 group-hover:opacity-30"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="divide-y divide-line border-b border-line">
            {filtered.map((j) => (
              <button
                key={j.id}
                onClick={() => setOpen(j)}
                className="w-full text-left py-6 grid grid-cols-12 gap-4 items-center hover:bg-surface-2 transition-colors px-4 group"
              >
                <div className="col-span-12 md:col-span-6">
                  <div className="text-lg font-semibold tracking-tight group-hover:text-brand transition-colors">{j.title}</div>
                  <div className="mt-1 text-sm text-ink-soft">{j.desc}</div>
                </div>
                <div className="col-span-6 md:col-span-2 text-sm text-ink-soft flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" />{j.dept}</div>
                <div className="col-span-6 md:col-span-2 text-sm text-ink-soft flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{j.location}</div>
                <div className="col-span-12 md:col-span-2 md:text-right">
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand">View role <ArrowRight className="h-3.5 w-3.5" /></span>
                </div>
              </button>
            ))}
          </div>

          <p className="mt-8 text-sm text-ink-soft text-center">
            Don&apos;t see your role? Email <a href="mailto:careers@shrimaa.com" className="text-brand font-medium hover:underline">careers@shrimaa.com</a>
          </p>
        </div>
      </section>

      {open && <ApplyDialog job={open} onClose={() => setOpen(null)} />}
    </>
  );
}

function ApplyDialog({ job, onClose }: { job: typeof jobs[number]; onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="fixed inset-0 z-[100] bg-ink/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6 animate-in fade-in" onClick={onClose}>
      <div className="bg-white rounded-t-3xl md:rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white p-6 border-b border-line flex items-start justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-brand font-semibold">{job.dept} · {job.location}</div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight">{job.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-2 rounded-full"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-6">
          <p className="text-ink-soft leading-relaxed">{job.desc}</p>
          {submitted ? (
            <div className="p-8 rounded-2xl bg-brand-gradient text-white text-center">
              <div className="text-2xl font-bold">Application received</div>
              <p className="mt-2 text-white/90 text-sm">Our team will be in touch within one week.</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
              {[["Full name", "text"], ["Email", "email"], ["Phone", "tel"], ["LinkedIn URL", "url"]].map(([l, t]) => (
                <div key={l}>
                  <label className="text-xs font-medium uppercase tracking-wider text-ink-soft">{l}</label>
                  <input type={t} required className="mt-1.5 w-full px-4 py-3 rounded-xl border border-line focus:border-brand focus:outline-none transition-colors" />
                </div>
              ))}
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-ink-soft">Resume</label>
                <input type="file" accept=".pdf,.doc,.docx" className="mt-1.5 w-full text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-ink-soft">Message</label>
                <textarea rows={4} className="mt-1.5 w-full px-4 py-3 rounded-xl border border-line focus:border-brand focus:outline-none" />
              </div>
              <button type="submit" className="w-full inline-flex items-center justify-center gap-2 bg-ink text-white py-3.5 rounded-full font-semibold hover:bg-ink/85">
                Submit application <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
