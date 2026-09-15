"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight, Handshake, Landmark, MapPin, ShoppingBag, Truck, Warehouse, type LucideIcon } from "lucide-react";
import UnicornScene from "unicornstudio-react/next";

type Offer = { index: string; eyebrow: string; title: string; accent: string; description: string; stat: ReactNode; statLabel: string; note: string; href: string; icon: LucideIcon };

const offers: Offer[] = [
  { index: "01", eyebrow: "Nationwide reach", title: "Reach every", accent: "opportunity.", description: "Active presence across India with the network to move brands from metros to emerging markets without losing speed or control.", stat: "80%", statLabel: "Pincode coverage", note: "15+ fulfilment centres", href: "/businesses/distribution-network", icon: MapPin },
  { index: "02", eyebrow: "Marketplace expertise", title: "Operate at", accent: "marketplace speed.", description: "Deep operational fluency across Amazon, Flipkart and emerging marketplaces—from catalogues and campaigns to fulfilment and customer experience.", stat: "55K+", statLabel: "Orders every month", note: "One accountable operating team", href: "/businesses/marketplace-operations", icon: ShoppingBag },
  { index: "03", eyebrow: "Distribution leadership", title: "Built into", accent: "the channel.", description: "Three decades of trusted retail relationships give partner brands meaningful access, visibility and execution across India.", stat: "80K+", statLabel: "Retailers served", note: "600+ distributors", href: "/businesses/distribution-network", icon: Truck },
  { index: "04", eyebrow: "Infrastructure at scale", title: "Space to", accent: "keep growing.", description: "Owned warehousing and operating facilities create a dependable foundation for faster fulfilment and the next stage of demand.", stat: "150K", statLabel: "Sq ft owned", note: "Across four operating hubs", href: "/about", icon: Warehouse },
  { index: "05", eyebrow: "Capital strength", title: "Growth without", accent: "the drag.", description: "A strong revenue base and balance-sheet depth support working capital, inventory movement and ambitious channel expansion.", stat: "₹4,000 Cr", statLabel: "Revenue base", note: "Working capital carried by SMG", href: "/businesses/commerce-trading", icon: Landmark },
  { index: "06", eyebrow: "Long-term partnerships", title: "Here for the", accent: "long run.", description: "Multi-decade relationships with demanding manufacturers are built on transparent execution, shared accountability and durable value.", stat: "1997", statLabel: "Operating since", note: "100+ manufacturer relationships", href: "/contact", icon: Handshake },
];

export function ScaleOffersSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const distance = section.offsetHeight - window.innerHeight;
      const next = distance > 0 ? Math.min(1, Math.max(0, -rect.top / distance)) : 0;
      setProgress((current) => (Math.abs(current - next) > 0.0005 ? next : current));
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

  const settleEnd = 0.22;
  const horizontalProgress = Math.min(1, Math.max(0, (progress - settleEnd) / (1 - settleEnd)));

  return (
    <>
    <section className="bg-[#f6f4ef] py-16 md:hidden" aria-label="Why brands choose SMG">
      <div className="px-5">
        <p className="font-display text-[clamp(2.1rem,10vw,3.5rem)] font-semibold leading-[0.98] tracking-[-0.052em] text-ink">
          Built for <span className="text-[#fd0000]">serious scale.</span>
        </p>
        <p className="mt-5 max-w-[34ch] text-sm leading-6 text-ink/60">
          Nationwide reach, three decades of retail relationships and the capital strength to carry a brand&apos;s growth.
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-4 px-3">
        {offers.map((offer) => {
          const Icon = offer.icon;
          return (
            <Link key={offer.index} href={offer.href} target={offer.href.startsWith("http") ? "_blank" : undefined} rel={offer.href.startsWith("http") ? "noopener noreferrer" : undefined} className="overflow-hidden rounded-[22px] bg-white text-ink shadow-[0_18px_45px_-30px_rgba(20,18,16,0.4)]">
              <div className="p-6 pb-7">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/45">{offer.eyebrow}</span>
                  <ArrowUpRight className="h-4 w-4" />
                </div>
                <h3 className="mt-10 max-w-[11ch] font-display text-[clamp(2.35rem,12vw,4rem)] font-semibold leading-[0.86] tracking-[-0.06em]">
                  {offer.title} <span className="text-[#fd0000]">{offer.accent}</span>
                </h3>
                <p className="mt-5 text-sm leading-6 text-ink/60">{offer.description}</p>
              </div>
              <div className="relative overflow-hidden bg-ink px-6 py-7 text-white">
                <div aria-hidden className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-[rgba(225,27,34,0.3)] blur-[55px]" />
                <div className="relative flex items-end justify-between gap-5">
                  <div>
                    <div className="font-display text-4xl font-semibold tracking-[-0.05em]">{offer.stat}</div>
                    <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">{offer.statLabel}</div>
                    <div className="mt-3 text-[10px] text-white/45">{offer.note}</div>
                  </div>
                  <div className="grid h-14 w-14 flex-none place-items-center rounded-full border border-white/20"><Icon className="h-5 w-5" strokeWidth={1.4} /></div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>

    <section ref={sectionRef} className="relative hidden h-[350svh] bg-ink md:block" aria-label="Why brands choose SMG — horizontal story">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-ink text-white">
        <div className="absolute inset-0 overflow-hidden bg-ink">
          <div aria-hidden className="pointer-events-none absolute -right-[120px] -top-[180px] h-[560px] w-[560px] rounded-full bg-[rgba(225,27,34,0.22)] blur-[150px]" />
          <div aria-hidden className="pointer-events-none absolute -bottom-[200px] -left-[100px] h-[520px] w-[520px] rounded-full bg-[rgba(255,122,69,0.14)] blur-[160px]" />
          <div className="absolute inset-0">
            <UnicornScene projectId="tnAhw4e67txvvqrBP7oz" width="100%" height="100%" scale={1} dpi={1.25} lazyLoad ariaLabel="Animated SMG growth network" placeholderClassName="h-full w-full bg-transparent" />
          </div>
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundImage: "linear-gradient(135deg, #b30000 0%, #fd0000 100%)", mixBlendMode: "multiply" }} />

        <div
          className="pointer-events-none absolute inset-x-0 top-20 z-[5] flex h-[calc(50svh-5rem)] items-end px-5 pb-10 md:px-10 lg:px-[4.5vw]"
        >
          <div className="max-w-xl text-left">
            <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/45">
              Why brands choose SMG
            </div>
            <h2 className="mt-3 font-display text-[clamp(1.8rem,2.6vw,3rem)] font-medium leading-none tracking-[-0.04em]">
              Built for scale.
            </h2>
            <p className="mt-3 max-w-[48ch] text-sm leading-relaxed text-white/55 md:text-[15px]">
              Nationwide reach, established retail relationships and the operating strength to carry growth.
            </p>
          </div>
        </div>

        <div
          className="absolute inset-x-0 bottom-0 z-10 flex h-[50svh] will-change-transform"
          style={{
            width: `${offers.length * 100}vw`,
            transform: `translate3d(-${horizontalProgress * (offers.length - 1) * 100}vw, 0, 0)`,
          }}
        >
          {offers.map((offer) => {
            const Icon = offer.icon;
            return (
              <article key={offer.index} className="grid h-full w-screen flex-none grid-cols-2">
                <div
                  className="relative z-10 flex min-w-0 flex-col bg-[#f6f4ef] px-5 py-5 text-ink will-change-transform md:px-10 md:py-7 lg:px-[4.5vw]"
                >
                  <div className="text-[10px] font-medium tracking-[0.2em] text-ink/35 md:text-xs">
                    {offer.index}
                  </div>
                  <div className="mt-auto">
                    <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/55 md:text-xs">{offer.eyebrow}</div>
                    <h3 className="max-w-[12ch] font-display text-[clamp(1.8rem,3.5vw,4.25rem)] font-semibold leading-[0.88] tracking-[-0.055em]">{offer.title} <span className="text-[#fd0000]">{offer.accent}</span></h3>
                    <Link href={offer.href} className="mt-3 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] transition-colors hover:text-[#fd0000] md:text-xs">Explore <ArrowUpRight className="h-4 w-4" /></Link>
                  </div>
                </div>

                <div className="relative overflow-hidden">
                  <div className="absolute inset-0">
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="relative grid h-[clamp(100px,18vw,220px)] w-[clamp(100px,18vw,220px)] -translate-y-[8%] place-items-center rounded-full border border-white/25">
                      <div className="absolute inset-[12%] rotate-45 rounded-[20%] border border-white/20" />
                      <div className="absolute h-px w-[140%] rotate-[-32deg] bg-white/20" />
                      <div className="absolute h-[140%] w-px rotate-[32deg] bg-white/15" />
                      <div className="relative grid h-[44%] w-[44%] place-items-center rounded-full border border-white/35 bg-black/15 backdrop-blur-sm"><Icon className="h-[30%] w-[30%] text-white" strokeWidth={1.35} /></div>
                    </div>
                  </div>
                  <div className="absolute bottom-5 left-5 right-5 md:bottom-7 md:left-10 md:right-10">
                    <div className="font-display text-[clamp(1.5rem,3vw,3.25rem)] font-semibold leading-none tracking-[-0.055em]">{offer.stat}</div>
                    <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/65 md:text-xs">{offer.statLabel}</div>
                  </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

      </div>
    </section>
    </>
  );
}
