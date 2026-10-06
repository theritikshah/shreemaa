"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, Mail } from "lucide-react";
import { toast } from "sonner";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ink";

// LinkedIn, Instagram and the website link are held back until their official
// URLs exist; dead links are worse than none.
const socials = [{ Icon: Mail, label: "Email", href: "mailto:contact@shrimaa.com" }];

const columns: { title: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  {
    title: "Businesses",
    links: [
      { label: "Marketplace", href: "/businesses/marketplace-operations" },
      { label: "Distribution", href: "/businesses/distribution-network" },
      { label: "Global Trade", href: "/businesses/global-trade" },
      { label: "Sustainability", href: "https://www.oyugreen.com", external: true },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Work with us", href: "/careers" },
      { label: "Open roles", href: "/jobs" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export function SiteFooter() {
  const pathname = usePathname();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const isContactPage = pathname === "/contact";

  function handleNewsletterSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNewsletterEmail("");
    toast.success("You are on the list. Watch your inbox.");
  }

  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <div className="h-px w-full bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_0%,var(--brand)_35%,var(--brand-3)_62%,rgba(255,255,255,0.06)_100%)]" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[180px] -right-[120px] h-[560px] max-h-[80vw] w-[560px] max-w-[80vw] rounded-full bg-[rgba(225,27,34,0.22)] blur-[150px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-[200px] -left-[100px] h-[520px] max-h-[80vw] w-[520px] max-w-[80vw] rounded-full bg-[rgba(255,122,69,0.14)] blur-[160px]"
      />

      <div className="relative mx-auto max-w-[1280px] px-[clamp(20px,3vw,40px)] pt-[clamp(56px,6vw,88px)]">
        {/* Band 1 — Contact CTA / contact-page newsletter */}
        <div className="flex flex-wrap items-end gap-[clamp(28px,4vw,48px)] border-b border-white/10 pb-[clamp(40px,5vw,64px)]">
          {isContactPage ? (
            <>
              <div className="min-w-0 flex-[1_1_440px]">
                <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">
                  Stay in the loop
                </div>
                <h2 className="mt-[clamp(14px,2vw,20px)] text-pretty font-display text-[clamp(30px,4.2vw,56px)] font-semibold leading-[1.04] tracking-[-0.03em]">
                  Commerce moves fast.{" "}
                  <span className="font-serif-display italic text-accent">Stay ahead of it.</span>
                </h2>
              </div>
              <div className="min-w-0 flex-[1_1_360px]">
                <p className="max-w-[460px] text-pretty text-[15px] leading-[1.7] text-white/65">
                  A considered briefing on marketplaces, distribution and global trade—delivered
                  when there is something worth sharing.
                </p>
                <form onSubmit={handleNewsletterSubmit} className="mt-6 flex max-w-[500px] gap-2" aria-label="Newsletter signup">
                  <label htmlFor="footer-newsletter-email" className="sr-only">Work email</label>
                  <input
                    id="footer-newsletter-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={newsletterEmail}
                    onChange={(event) => setNewsletterEmail(event.target.value)}
                    placeholder="Work email"
                    className={`min-w-0 flex-1 rounded-full border border-white/15 bg-white/[0.07] px-5 py-3.5 text-sm text-white placeholder:text-white/40 transition-colors focus:border-white/40 ${focusRing}`}
                  />
                  <button
                    type="submit"
                    className={`group inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-3.5 text-sm font-semibold text-ink transition-transform duration-200 hover:translate-x-[2px] ${focusRing}`}
                  >
                    Subscribe <ArrowUpRight className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <>
              <div className="min-w-0 flex-[1_1_440px]">
                <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">
                  Start a conversation
                </div>
                <h2 className="mt-[clamp(14px,2vw,20px)] text-pretty font-display text-[clamp(30px,4.2vw,56px)] font-semibold leading-[1.04] tracking-[-0.03em]">
                  Let&apos;s put your brand in front of{" "}
                  <span className="font-serif-display italic text-accent">300 million people.</span>
                </h2>
              </div>
              <div className="flex min-w-0 flex-[1_1_330px] flex-col items-start gap-5">
                <p className="max-w-[420px] text-pretty text-[15px] leading-[1.7] text-white/65">
                  Tell us the category, the market and the goal. A real person on our team reads every
                  note and replies within one business day.
                </p>
                <Link
                  href="/contact"
                  className={`group inline-flex items-center gap-3 whitespace-nowrap rounded-full bg-white py-2 pl-[26px] pr-2 text-[15px] font-semibold text-ink motion-safe:transition-transform motion-safe:duration-200 motion-safe:hover:translate-x-[3px] ${focusRing}`}
                >
                  Get in touch
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-white">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Band 2 — Contact + link columns */}
        <div className="flex flex-wrap gap-[clamp(32px,4vw,48px)] py-[clamp(40px,5vw,56px)]">
          <div className="min-w-0 flex-[1_1_230px]">
            <div className="mb-[18px] text-[10px] uppercase tracking-[0.22em] text-white/45">
              Headquarters
            </div>
            <p className="text-sm leading-[1.7] text-white/80">
              Bhopal, Madhya Pradesh
              <br />
              India
            </p>
            <a
              href="mailto:contact@shrimaa.com"
              className={`mt-4 inline-flex items-center gap-1.5 text-sm text-white/80 transition-colors duration-200 hover:text-white ${focusRing}`}
            >
              contact@shrimaa.com <ArrowUpRight className="h-[13px] w-[13px] shrink-0" />
            </a>
            <div className="mt-7 flex flex-wrap gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className={`flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.14] text-white/75 transition-colors duration-200 hover:border-white/40 hover:text-white ${focusRing}`}
                >
                  <s.Icon className="h-[15px] w-[15px]" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid min-w-0 flex-[2_1_480px] grid-cols-[repeat(auto-fit,minmax(148px,1fr))] gap-[clamp(24px,3vw,40px)]">
            {columns.map((col) => (
              <div key={col.title} className="min-w-0">
                <div className="mb-[18px] text-[10px] uppercase tracking-[0.22em] text-white/45">
                  {col.title}
                </div>
                <ul className="m-0 flex list-none flex-col gap-[11px] p-0">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      {l.external ? (
                        <a
                          href={l.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-sm text-white/80 transition-colors duration-200 hover:text-white ${focusRing}`}
                        >
                          {l.label}
                        </a>
                      ) : (
                        <Link
                          href={l.href}
                          className={`text-sm text-white/80 transition-colors duration-200 hover:text-white ${focusRing}`}
                        >
                          {l.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Band 3 — Legal bar */}
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-white/10 py-5">
          <p className="text-xs text-white/45">© {new Date().getFullYear()} Shri Maa Group. All rights reserved.</p>
        </div>
      </div>

      {/* Wordmark */}
      <div className="relative overflow-hidden px-[clamp(20px,3vw,40px)]">
        <div className="text-[clamp(36px,12.2vw,160px)] h-[0.7em] overflow-hidden">
          <div
            aria-hidden
            className="select-none whitespace-nowrap text-center font-display font-bold leading-none tracking-[-0.05em] text-white/[0.055]"
          >
            SHRI MAA GROUP
          </div>
        </div>
      </div>
    </footer>
  );
}
