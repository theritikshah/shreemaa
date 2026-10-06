"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import logo from "@/assets/SMG-Logo-optimized (1).svg";

type SubItem = { to?: string; href?: string; title: string; desc: string };

const businesses: SubItem[] = [
  { to: "/businesses/marketplace-operations", title: "Marketplace Operations", desc: "Amazon, Flipkart & beyond" },
  { to: "/businesses/distribution-network", title: "Distribution Network", desc: "80,000+ retailers nationwide" },
  { to: "/businesses/global-trade", title: "Global Trade · Rio World", desc: "Cross-border commerce" },
  { href: "https://www.oyugreen.com", title: "Sustainability · OYU Green", desc: "Carbon & climate" },
];

const workWithUs: SubItem[] = [
  { to: "/careers", title: "Life at SMG", desc: "The people, and how we work" },
  { to: "/jobs", title: "Open roles", desc: "Current openings, every team" },
];

// `matchAny` marks the item active across a set of unrelated paths — Work with
// us spans both /careers and /jobs, which no single prefix covers.
const nav: {
  to: string;
  label: string;
  match?: string;
  matchAny?: string[];
  menu?: SubItem[];
  menuWidth?: string;
}[] = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  {
    to: "/businesses/marketplace-operations",
    label: "Businesses",
    match: "/businesses",
    menu: businesses,
    menuWidth: "w-[420px]",
  },
  {
    to: "/careers",
    label: "Work with us",
    matchAny: ["/careers", "/jobs"],
    menu: workWithUs,
    menuWidth: "w-[320px]",
  },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState<{ left: number; width: number; opacity: number }>({ left: 0, width: 0, opacity: 0 });

  // Active item index
  const activeIdx = nav.findIndex((n) =>
    n.matchAny
      ? n.matchAny.some((p) => path === p || path.startsWith(`${p}/`))
      : n.match
        ? path.startsWith(n.match)
        : path === n.to,
  );

  const setPillTo = (el: HTMLElement | null) => {
    if (!el || !navRef.current) return;
    const parent = navRef.current.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setPill({ left: r.left - parent.left, width: r.width, opacity: 1 });
  };

  // On mount + path change → snap to active
  useEffect(() => {
    const el = navRef.current?.querySelector<HTMLElement>(`[data-idx="${activeIdx}"]`);
    if (el) setPillTo(el);
    else setPill((p) => ({ ...p, opacity: 0 }));
  }, [activeIdx, path]);

  return (
    <header className="fixed top-0 inset-x-0 z-50 pt-4 px-4 pointer-events-none">
      <div className="mx-auto max-w-6xl flex items-center justify-between gap-4 pointer-events-auto">
        {/* Logo capsule */}
        <Link
          href="/"
          className="flex items-center gap-2.5 pl-2 pr-4 py-2 rounded-full bg-white/85 backdrop-blur-xl border border-line/80 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.18)] transition-shadow"
        >
          <Image src={logo} alt="SMG" className="h-7 w-7 rounded-full" priority />
          <div className="flex flex-col leading-none">
            <span className="text-[12px] font-semibold tracking-tight text-ink">SHRI MAA GROUP</span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-ink-soft mt-0.5">Est. 1997</span>
          </div>
        </Link>

        {/* Center nav capsule with hover-following pill */}
        <nav
          ref={navRef}
          onMouseLeave={() => {
            const el = navRef.current?.querySelector<HTMLElement>(`[data-idx="${activeIdx}"]`);
            if (el) setPillTo(el);
            else setPill((p) => ({ ...p, opacity: 0 }));
          }}
          className="hidden lg:flex isolate relative items-center gap-1 px-2 py-1.5 rounded-full bg-white/85 backdrop-blur-xl border border-line/80 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)]"
        >
          {/* Hover/active pill */}
          <span
            aria-hidden
            className="absolute top-1.5 bottom-1.5 rounded-full bg-ink transition-all duration-[420ms] ease-[cubic-bezier(0.32,0.72,0,1)] pointer-events-none"
            style={{ left: pill.left, width: pill.width, opacity: pill.opacity }}
          />
          {nav.map((n, i) => {
            return (
              <div
                key={n.to}
                className="relative"
                onMouseEnter={(e) => {
                  setPillTo(e.currentTarget.firstChild as HTMLElement);
                  if (n.menu) setOpenMenu(i);
                }}
                onMouseLeave={() => n.menu && setOpenMenu((cur) => (cur === i ? null : cur))}
              >
                <Link
                  href={n.to}
                  data-idx={i}
                  className="relative z-10 inline-flex items-center rounded-full px-4 py-2 text-[13px] font-medium text-white mix-blend-difference"
                >
                  {n.label}
                </Link>
                {n.menu && openMenu === i && (
                  <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50 ${n.menuWidth ?? "w-[420px]"}`}>
                    <div className="bg-white border border-line rounded-2xl shadow-elevated p-2 grid gap-0.5 animate-in fade-in slide-in-from-top-2 duration-200">
                      {n.menu.map((b) => {
                        const key = b.to || b.href;
                        const content = (
                          <>
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand" />
                            <div className="flex-1">
                              <div className="text-sm font-semibold text-ink group-hover:text-accent transition-colors">{b.title}</div>
                              <div className="text-[11px] text-ink-soft mt-0.5">{b.desc}</div>
                            </div>
                            <ArrowUpRight className="h-3.5 w-3.5 text-ink/30 group-hover:text-accent transition-colors" />
                          </>
                        );
                        if (b.href) {
                          return (
                            <a
                              key={key}
                              href={b.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-2 transition-colors group"
                            >
                              {content}
                            </a>
                          );
                        }
                        return (
                          <Link
                            key={key}
                            href={b.to!}
                            className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-2 transition-colors group"
                          >
                            {content}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* CTA capsule */}
        <div className="hidden lg:block">
          <Link
            href="/contact"
            className="group inline-flex items-center gap-1.5 pl-5 pr-2 py-2 rounded-full bg-ink text-white text-[13px] font-medium hover:bg-ink/85 transition-colors shadow-[0_8px_30px_-12px_rgba(0,0,0,0.3)]"
          >
            Partner with us
            <span className="ml-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-ink group-hover:bg-brand group-hover:text-white transition-colors">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>

        {/* Mobile */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden p-2.5 rounded-full bg-white/90 backdrop-blur-xl border border-line text-ink"
          aria-label="Menu"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden mx-auto max-w-6xl mt-2 bg-white border border-line rounded-2xl shadow-elevated p-4 pointer-events-auto">
          {nav.map((n) => (
            <Link key={n.to} href={n.to} onClick={() => setOpen(false)} className="block py-2.5 text-sm font-medium text-ink">
              {n.label}
            </Link>
          ))}
          {/* One section per nav item that has a submenu, so any future menu
              shows up here without another hardcoded block. */}
          {nav
            .filter((n) => n.menu)
            .map((n) => (
              <div key={n.label} className="mt-3 pt-3 border-t border-line">
                <div className="text-[10px] uppercase tracking-wider text-ink-soft mb-2">{n.label}</div>
                {n.menu!.map((b) => {
                  const key = b.to || b.href;
                  if (b.href) {
                    return (
                      <a key={key} href={b.href} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className="block py-1.5 text-sm text-ink/80">
                        {b.title}
                      </a>
                    );
                  }
                  return (
                    <Link key={key} href={b.to!} onClick={() => setOpen(false)} className="block py-1.5 text-sm text-ink/80">
                      {b.title}
                    </Link>
                  );
                })}
              </div>
            ))}
        </div>
      )}
    </header>
  );
}
