"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { ArrowUpRight, Handshake, Landmark, MapPin, ShoppingBag, Truck, Warehouse, type LucideIcon } from "lucide-react";
import UnicornScene from "unicornstudio-react/next";

type Offer = { index: string; eyebrow: string; title: string; accent: string; description: string; stat: ReactNode; statLabel: string; note: string; href: string; icon: LucideIcon };

const offers: Offer[] = [
  { index: "01", eyebrow: "Nationwide reach", title: "Reach every", accent: "opportunity.", description: "Active presence across India with the network to move brands from metros to emerging markets without losing speed or control.", stat: "80%", statLabel: "Pincode coverage", note: "15+ fulfilment centres", href: "/businesses/distribution-network", icon: MapPin },
  { index: "02", eyebrow: "Marketplace expertise", title: "Operate at", accent: "marketplace speed.", description: "Deep operational fluency across Amazon, Flipkart and emerging marketplaces—from catalogues and campaigns to fulfilment and customer experience.", stat: "55K+", statLabel: "Orders every month", note: "One accountable operating team", href: "/businesses/marketplace-operations", icon: ShoppingBag },
  { index: "03", eyebrow: "Distribution leadership", title: "Built into", accent: "the channel.", description: "Three decades of trusted retail relationships give partner brands meaningful access, visibility and execution across India.", stat: "80K+", statLabel: "Retailers served", note: "600+ distributors", href: "/businesses/distribution-network", icon: Truck },
  { index: "04", eyebrow: "Infrastructure at scale", title: "Space to", accent: "keep growing.", description: "Owned warehousing and operating facilities create a dependable foundation for faster fulfilment and the next stage of demand.", stat: "150K", statLabel: "Sq ft owned", note: "Across four operating hubs", href: "/about", icon: Warehouse },
  { index: "05", eyebrow: "Capital strength", title: "Growth without", accent: "the drag.", description: "A strong revenue base and balance-sheet depth support working capital, inventory movement and ambitious channel expansion.", stat: "₹4,000 Cr", statLabel: "Revenue base", note: "Working capital carried by SMG", href: "/about", icon: Landmark },
  { index: "06", eyebrow: "Long-term partnerships", title: "Here for the", accent: "long run.", description: "Multi-decade relationships with demanding manufacturers are built on transparent execution, shared accountability and durable value.", stat: "1997", statLabel: "Operating since", note: "100+ manufacturer relationships", href: "/contact", icon: Handshake },
];

export function ScaleOffersSection() {
  return (
    <section className="relative bg-ink py-20 text-white md:py-32" aria-label="Why brands choose SMG — Built for scale">
      {/* Ambient background scene */}
      <div className="absolute inset-0 overflow-hidden bg-ink">
        <div aria-hidden className="pointer-events-none absolute -right-[120px] -top-[180px] h-[560px] w-[560px] rounded-full bg-[rgba(225,27,34,0.22)] blur-[150px]" />
        <div aria-hidden className="pointer-events-none absolute -bottom-[200px] -left-[100px] h-[520px] w-[520px] rounded-full bg-[rgba(255,122,69,0.14)] blur-[160px]" />
        <div className="absolute inset-0">
          <UnicornScene projectId="tnAhw4e67txvvqrBP7oz" width="100%" height="100%" scale={1} dpi={1.25} lazyLoad ariaLabel="Animated SMG growth network" placeholderClassName="h-full w-full bg-transparent" />
        </div>
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundImage: "linear-gradient(135deg, #b30000 0%, #fd0000 100%)", mixBlendMode: "multiply" }} />

      {/* Content Grid */}
      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-10 lg:px-[4.5vw]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-start">
          
          {/* Sticky Left Header */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start text-left">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-white/50">
              Why brands choose SMG
            </div>
            <h2 className="mt-3 font-display text-[clamp(2.2rem,3.8vw,4.25rem)] font-semibold leading-[0.96] tracking-[-0.04em]">
              Built for <br className="hidden lg:block" /><span className="text-[#fd0000]">serious scale.</span>
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-white/65 md:text-base max-w-[40ch]">
              Nationwide reach, three decades of retail relationships and the operating strength to carry growth.
            </p>
            <div className="mt-8 hidden lg:block">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm transition-all hover:border-[#fd0000] hover:bg-[#fd0000] hover:text-white"
              >
                Partner with SMG <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Cards Scrolling Vertically */}
          <div className="lg:col-span-7 flex flex-col gap-6 lg:gap-8">
            {offers.map((offer) => {
              const Icon = offer.icon;
              return (
                <article
                  key={offer.index}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-white/15 bg-[#f6f4ef] text-ink shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-1 hover:border-white/30"
                >
                  {/* Card Details */}
                  <div className="flex flex-col justify-between bg-[#f6f4ef] p-6 text-ink md:p-8 lg:p-9">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/40">
                          {offer.index} · {offer.eyebrow}
                        </span>
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink/5 text-ink transition-colors group-hover:bg-[#fd0000] group-hover:text-white">
                          <Icon className="h-4 w-4" strokeWidth={1.5} />
                        </span>
                      </div>
                      <h3 className="mt-5 font-display text-[clamp(1.8rem,2.8vw,3rem)] font-semibold leading-[0.92] tracking-[-0.055em]">
                        {offer.title} <span className="text-[#fd0000]">{offer.accent}</span>
                      </h3>
                      <p className="mt-3 text-xs leading-relaxed text-ink/65 md:text-sm max-w-[44ch]">
                        {offer.description}
                      </p>
                    </div>
                    <div className="mt-6">
                      <Link
                        href={offer.href}
                        target={offer.href.startsWith("http") ? "_blank" : undefined}
                        rel={offer.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink transition-colors group-hover:text-[#fd0000]"
                      >
                        Explore capability <ArrowUpRight className="h-4 w-4 text-[#fd0000] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Card Stat Footer */}
                  <div className="relative overflow-hidden bg-ink p-6 text-white md:p-7 flex items-end justify-between gap-4 border-t border-white/10">
                    <div aria-hidden className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-[rgba(225,27,34,0.3)] blur-[60px]" />
                    <div className="relative z-10">
                      <div className="font-display text-3xl md:text-4xl font-semibold leading-none tracking-[-0.055em]">
                        {offer.stat}
                      </div>
                      <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60 md:text-xs">
                        {offer.statLabel}
                      </div>
                    </div>
                    <div className="relative z-10 text-right text-[10px] text-white/45 md:text-xs">
                      {offer.note}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
