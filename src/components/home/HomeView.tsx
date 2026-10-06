"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, Rocket } from "lucide-react";
import { ImpactSection } from "@/components/home/ImpactSection";
import { OurBusinessesSection } from "@/components/home/OurBusinessesSection";
import { ScaleOffersSection } from "@/components/home/ScaleOffersSection";
import { CommandHeroExperience } from "@/components/command-hero/CommandHeroExperience";
import { HeroCopy } from "@/components/command-hero/HeroCopy";
import { HOME_COPY } from "@/components/command-hero/config";

const brands = ["Amazon", "Flipkart", "Samsung", "Xiaomi", "OPPO", "vivo", "realme", "Lenovo", "ASUS", "boAt", "Croma", "Reliance Digital"];

export function HomeView() {
  return (
    <>
      {/* HERO: particles → rings → "Five businesses. One commerce engine." */}
      <CommandHeroExperience
        copy={HOME_COPY}
        hero={
          <HeroCopy
            eyebrow={
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] backdrop-blur">
                <Rocket className="h-3 w-3" /> Launch · Scale · Operate
              </div>
            }
            title={
              <>
                The launchpad for <br />
                <span className="font-display italic text-accent">global brands.</span>
              </>
            }
            description={
              <>
                A global commerce network, helping the world&apos;s leading brands launch, scale and operate across
                e-commerce, retail, distribution and international trade.
              </>
            }
            actions={
              <>
                <Link
                  href="/businesses/marketplace-operations"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-ink transition hover:bg-white/90"
                >
                  Explore businesses <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold backdrop-blur transition hover:bg-white/20"
                >
                  Partner with us
                </Link>
              </>
            }
          />
        }
      />

      {/* TRUSTED BY */}
      <section className="py-14 bg-surface-2 border-y border-line overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 mb-8">
          <p className="text-center text-[10px] uppercase tracking-[0.28em] text-ink-soft font-medium">
            Trusted by global brands & India&apos;s largest marketplaces
          </p>
        </div>
        <div className="relative">
          <div className="flex gap-16 animate-marquee whitespace-nowrap">
            {[...brands, ...brands].map((b, i) => (
              <span key={i} className="text-xl md:text-2xl font-display font-semibold text-ink/35 hover:text-ink/80 transition-colors">
                {b}
              </span>
            ))}
          </div>
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-surface-2 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-surface-2 to-transparent pointer-events-none" />
        </div>
      </section>

      {/* IMPACT AT SCALE */}
      <ImpactSection />

      {/* WHO WE ARE - interactive eras */}
      <WhoWeAre />

      {/* OUR BUSINESSES */}
      <OurBusinessesSection />

      {/* WHY BRANDS CHOOSE SMG */}
      {/* <WhyBrandsSection /> */}

      {/* FULL-BLEED SCALE OFFERS */}
      <ScaleOffersSection />

      {/* INFRASTRUCTURE */}
      {/* <InfrastructureSection /> */}

    </>
  );
}

const eras = [
  {
    year: "1997",
    tag: "Foundations",
    title: "A trading house is born.",
    body: "SMG begins in Bhopal, building the retailer and supplier relationships that still anchor the group today.",
    metric: "Year one",
  },
  {
    year: "2008",
    tag: "Distribution",
    title: "Scale across India.",
    body: "Distribution expands to 80,000+ retailers and 600+ partners, making SMG one of central India's most trusted networks.",
    metric: "80K+ retailers",
  },
  {
    year: "2017",
    tag: "Digital commerce",
    title: "Built for marketplaces.",
    body: "We move online, becoming a top operator on Amazon, Flipkart and the next generation of Indian marketplaces.",
    metric: "55K+ orders / mo",
  },
  {
    year: "2024",
    tag: "Global trade",
    title: "Across borders.",
    body: "Rio World and OYU Green extend the group into international trade and climate solutions for the next decade of growth.",
    metric: "Cross-border",
  },
];

const kineticWords = ["commerce.", "distribution.", "marketplaces.", "exports."];

function WhoWeAre() {
  const [active, setActive] = useState(0);
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setWordIdx((i) => (i + 1) % kineticWords.length), 2400);
    return () => clearInterval(id);
  }, []);

  const era = eras[active];

  return (
    <section className="relative overflow-hidden bg-ink text-white py-28 md:py-36">
      {/* ambient glows */}
      <div className="absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-brand/30 blur-[140px]" />
      <div className="absolute -bottom-40 right-0 h-[480px] w-[480px] rounded-full bg-brand-3/20 blur-[160px]" />
      {/* hairline grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.24em] text-accent font-semibold">Who we are</div>
            <h2 className="mt-4 text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.02]">
              Three decades.
              <br />
              One network for{" "}
              <span className="relative inline-block align-baseline text-accent font-serif-display italic">
                <span className="invisible" aria-hidden="true">marketplaces.</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={wordIdx}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute left-0"
                  >
                    {kineticWords[wordIdx]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h2>
          </div>
          <p className="md:max-w-xs text-white/65 leading-relaxed">
            From one distribution business in Bhopal to five businesses connecting brands and markets, SMG has grown with the way India buys and sells. Founded in 1997, the group now spans e-commerce, distribution, trading, exports and sustainability.
          </p>
        </div>

        {/* Interactive eras */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Era picker */}
          <div className="lg:col-span-5">
            <ul>
              {eras.map((e, i) => {
                const isActive = active === i;
                return (
                  <li key={e.year}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onClick={() => setActive(i)}
                      className="group w-full text-left py-5 flex items-center gap-6 transition-colors"
                    >
                      <span
                        className={`text-sm font-mono tabular-nums transition-colors ${isActive ? "text-accent" : "text-white/40 group-hover:text-white/70"
                          }`}
                      >
                        {e.year}
                      </span>
                      <span
                        className={`relative flex-1 text-2xl md:text-3xl font-display tracking-tight transition-all ${isActive ? "text-white translate-x-1" : "text-white/55 group-hover:text-white/85"
                          }`}
                      >
                        {e.tag}
                      </span>
                      <motion.span
                        aria-hidden
                        animate={{ width: isActive ? 56 : 12, opacity: isActive ? 1 : 0.3 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="h-px bg-brand-gradient"
                      />
                    </button>
                  </li>
                );
              })}
            </ul>

            <Link
              href="/about"
              className="mt-10 inline-flex items-center gap-2 text-sm font-semibold border-b border-white/30 pb-1 hover:border-brand hover:text-accent transition-colors"
            >
              More about SMG <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Era detail card */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-8 md:p-12 min-h-[360px] overflow-hidden">
              <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand-gradient opacity-20 blur-3xl" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={era.year}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="relative"
                >
                  <div className="flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-white/50">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                    Chapter {String(active + 1).padStart(2, "0")} · {era.year}
                  </div>
                  <h3 className="mt-6 text-3xl md:text-5xl font-bold tracking-tight leading-[1.05]">
                    {era.title}
                  </h3>
                  <p className="mt-6 text-white/75 text-lg leading-relaxed max-w-xl">
                    {era.body}
                  </p>
                  <div className="mt-10 inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/15 text-sm">
                    <span className="text-accent font-semibold">{era.metric}</span>
                    <span className="h-1 w-1 rounded-full bg-white/30" />
                    <span className="text-white/60">{era.tag}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Mini stats strip */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10">
              {[
                ["30 yrs", "In market"],
                ["5", "Businesses"],
                ["Pan-India", "Footprint"],
                ["Global", "Reach"],
              ].map(([n, l]) => (
                <div key={l} className="bg-ink p-5">
                  <div className="text-xl md:text-2xl font-display font-semibold tracking-tight">{n}</div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-white/50 mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
