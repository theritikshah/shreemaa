"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  MapPin,
  ArrowUpRight,
  Briefcase,
  Handshake,
  Users,
  CheckCircle2,
  Globe,
} from "lucide-react";

// lucide-react dropped brand/logo marks; small inline replacements kept in the same stroke style.
function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <path d="M17.5 6.5h.01" />
    </svg>
  );
}
import { z } from "zod";
import { toast } from "sonner";

const greetings = ["Hello.", "Namaste.", "Salaam.", "Vanakkam.", "Sat Sri Akaal.", "Kem Cho."];

const inquiries = [
  { id: "business", label: "Business", icon: Briefcase, desc: "Distribution, marketplace ops, trading or trade." },
  { id: "partnership", label: "Partnership", icon: Handshake, desc: "Manufacturing, brand or strategic alliances." },
  { id: "career", label: "Career", icon: Users, desc: "Roles, internships and people inquiries." },
];

const offices = [
  {
    id: "bhopal",
    city: "Bhopal",
    state: "Madhya Pradesh, IN",
    role: "Global Headquarters",
    blurb: "Group leadership, strategy and operations.",
    hours: "Mon to Sat, 10:00 to 19:00 IST",
    address: "Shri Maa Group, Bhopal, Madhya Pradesh",
    mapQuery: "Shri Maa Group, Bhopal, Madhya Pradesh, India",
    coords: "23.2599° N, 77.4126° E",
  },
  {
    id: "gurgaon",
    city: "Gurgaon",
    state: "Haryana, IN",
    role: "Corporate Office",
    blurb: "Corporate functions, partnerships and technology.",
    hours: "Mon to Sat, 10:00 to 19:00 IST",
    address: "Enkay Centre, Udyog Vihar Phase 5, Sector 19, Gurugram 122016",
    mapQuery: "Enkay centre, Udyog vihar, phase 5, Sector 19, Gurugram, Haryana 122016",
    coords: "28.4595° N, 77.0266° E",
  },
];

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  company: z.string().trim().min(2, "Please enter your company").max(120),
  email: z.string().trim().email("Enter a valid email").max(200),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, "Only digits, spaces and + - ( ) allowed"),
  message: z.string().trim().min(20, "Tell us a bit more, at least 20 characters").max(1000),
});

type FieldErrors = Partial<Record<keyof z.infer<typeof contactSchema>, string>>;

function useIstClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  return fmt.format(now);
}

export function ContactView() {
  const [greetIdx, setGreetIdx] = useState(0);
  const [type, setType] = useState("business");
  const [office, setOffice] = useState(offices[0]);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [mounted, setMounted] = useState(false);
  const time = useIstClock();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setGreetIdx((i) => (i + 1) % greetings.length), 2400);
    return () => clearInterval(t);
  }, []);

  const activeInquiry = useMemo(
    () => inquiries.find((i) => i.id === type) ?? inquiries[0],
    [type],
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = contactSchema.safeParse({
      name: fd.get("name"),
      company: fd.get("company"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      message: fd.get("message"),
    });
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FieldErrors;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      toast.error("Please fix the highlighted fields");
      return;
    }
    setErrors({});
    setSubmitted(true);
    toast.success("Message sent. We will be in touch shortly.");
  }

  return (
    <>
      {/* HERO — editorial, cycling greeting, live status rail */}
      <section className="relative bg-surface text-ink overflow-hidden pt-32 pb-20 md:pb-28">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(to right, oklch(0.17 0.01 60 / 0.05) 1px, transparent 1px)",
            backgroundSize: "calc(100% / 12) 100%",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          {/* Main headline */}
          <div className="mt-16 md:mt-24">
              <h1 className="font-display font-semibold tracking-[-0.04em] leading-[0.9] text-[18vw] sm:text-[14vw] lg:text-[11vw]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={greetings[greetIdx]}
                    initial={{ y: "0.6em", opacity: 0, rotate: 2 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: "-0.6em", opacity: 0, rotate: -2 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-block font-serif-display italic text-brand"
                  >
                    {greetings[greetIdx]}
                  </motion.span>
                </AnimatePresence>
                <br />
                <span className="text-ink">Let&apos;s talk.</span>
              </h1>

              <div className="mt-12 grid grid-cols-12 gap-6">
                <p className="col-span-12 md:col-span-7 text-base md:text-lg text-ink-soft leading-relaxed max-w-2xl">
                  Pick up the phone, drop in for a coffee, or send a note below. Whatever the shape of your idea, a real person on our team will read it and write back within one business day.
                </p>
                <div className="col-span-12 md:col-span-5 md:border-l md:border-ink/10 md:pl-6 space-y-3 text-sm">
                  <a href="mailto:contact@shrimaa.com" className="flex items-center justify-between group">
                    <span className="text-ink-soft uppercase tracking-[0.18em] text-[10px]">Email</span>
                    <span className="font-medium group-hover:text-brand transition-colors flex items-center gap-1">
                      contact@shrimaa.com <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </a>
                  <a href="tel:+912200000000" className="flex items-center justify-between group">
                    <span className="text-ink-soft uppercase tracking-[0.18em] text-[10px]">Phone</span>
                    <span className="font-medium group-hover:text-brand transition-colors flex items-center gap-1">
                      +91 22 0000 0000 <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </a>
                  <div className="flex items-center justify-between">
                    <span className="text-ink-soft uppercase tracking-[0.18em] text-[10px]">Reply</span>
                    <span className="font-medium">Within 1 business day</span>
                  </div>
                </div>
              </div>
            </div>
        </div>

        {/* Marquee */}
        <div className="mt-24 border-y border-ink/10 py-5 overflow-hidden">
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "-50%" }}
            transition={{ duration: 32, ease: "linear", repeat: Infinity }}
            className="flex whitespace-nowrap gap-12 text-[clamp(2rem,5vw,4rem)] font-display font-semibold tracking-tight"
          >
            {Array.from({ length: 2 }).map((_, copy) => (
              <div key={copy} className="flex items-center gap-12">
                {["Distribution", "Marketplace", "Global Trade", "Commerce", "Partnerships", "Careers"].map((w, i) => (
                  <span key={`${copy}-${i}`} className="flex items-center gap-12">
                    <span className={i % 2 === 0 ? "text-ink" : "text-ink/30 font-serif-display italic"}>
                      {w}
                    </span>
                    <span className="h-2 w-2 rounded-full bg-brand" />
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION 02 — Pick your conversation */}
      <section id="form" className="py-24 md:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-14">
            <h2 className="text-4xl md:text-6xl font-display font-semibold tracking-[-0.03em] leading-[1.02] max-w-3xl">
              Write to us.
            </h2>
          </div>

          <div className="grid grid-cols-12 gap-6 lg:gap-10">
            {/* Inquiry picker — column of large hoverable rows */}
            <div className="col-span-12 lg:col-span-5">
              <div className="border-t border-ink/10">
                {inquiries.map((i, idx) => {
                  const Icon = i.icon;
                  const active = type === i.id;
                  return (
                    <button
                      key={i.id}
                      onClick={() => setType(i.id)}
                      className="group w-full text-left border-b border-ink/10 py-6 flex items-start gap-6 relative"
                    >
                      <span className="text-[11px] tracking-[0.22em] uppercase text-ink-soft mt-2 tabular-nums">
                        0{idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-4">
                          <div
                            className={`text-3xl md:text-4xl font-display font-semibold tracking-tight transition-colors ${
                              active ? "text-brand" : "text-ink group-hover:text-brand"
                            }`}
                          >
                            {i.label}
                          </div>
                          <motion.span
                            animate={{ rotate: active ? 45 : 0, scale: active ? 1.1 : 1 }}
                            className={`h-9 w-9 rounded-full flex items-center justify-center transition-colors ${
                              active ? "bg-brand text-white" : "bg-ink/5 text-ink"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </motion.span>
                        </div>
                        <AnimatePresence initial={false}>
                          {active && (
                            <motion.p
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="text-ink-soft text-sm mt-3 overflow-hidden"
                            >
                              {i.desc}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-10 p-6 rounded-2xl bg-surface-2 border border-ink/5">
                <div className="text-[11px] uppercase tracking-[0.2em] text-ink-soft mb-2">
                  Prefer email?
                </div>
                <a
                  href={`mailto:contact@shrimaa.com?subject=${activeInquiry.label}%20inquiry`}
                  className="inline-flex items-center gap-2 text-lg font-medium hover:text-brand transition-colors"
                >
                  contact@shrimaa.com <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Form */}
            <div className="col-span-12 lg:col-span-7">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="rounded-3xl bg-ink text-white p-12 relative overflow-hidden"
                  >
                    <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-brand/40 blur-3xl" />
                    <CheckCircle2 className="h-10 w-10 text-brand-3 mb-6" />
                    <div className="text-4xl font-display font-semibold tracking-tight">
                      Got it. Talk soon.
                    </div>
                    <p className="mt-4 text-white/75 max-w-md">
                      Your {activeInquiry.label.toLowerCase()} note is with the right desk. Expect a reply within one business day.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-8 inline-flex items-center gap-2 bg-white text-ink px-5 py-2.5 rounded-full text-sm font-medium hover:bg-brand hover:text-white transition-colors"
                    >
                      Send another <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={handleSubmit}
                    noValidate
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FloatField label="Full name" name="name" type="text" error={errors.name} />
                      <FloatField label="Company" name="company" type="text" error={errors.company} />
                      <FloatField label="Email" name="email" type="email" error={errors.email} />
                      <FloatField label="Phone" name="phone" type="tel" error={errors.phone} />
                    </div>
                    <FloatField
                      label="Tell us a little about it"
                      name="message"
                      type="textarea"
                      error={errors.message}
                    />
                    <input type="hidden" name="type" value={type} />

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                      <div className="text-xs text-ink-soft">
                        Subject:{" "}
                        <span className="font-medium text-ink">{activeInquiry.label}</span>{" "}
                        · All fields required
                      </div>
                      <button
                        type="submit"
                        className="group relative inline-flex items-center gap-3 bg-ink text-white pl-7 pr-2 py-2.5 rounded-full text-sm font-medium overflow-hidden"
                      >
                        <span className="relative z-10">Send message</span>
                        <span className="relative z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink group-hover:bg-brand group-hover:text-white transition-colors">
                          <ArrowUpRight className="h-4 w-4" />
                        </span>
                        <span className="absolute inset-0 bg-brand translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 03 — Offices, two-card switcher with live clocks */}
      <section id="offices" className="py-24 md:py-32 bg-surface">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <h2 className="text-4xl md:text-6xl font-display font-semibold tracking-[-0.03em] leading-[1.02] max-w-3xl">
              Two doors,{" "}
              <span className="font-serif-display italic text-brand">always open</span>.
            </h2>
            <p className="md:max-w-xs text-ink-soft text-sm">
              Our headquarters sit in Bhopal. Our corporate office runs out of Gurgaon. Stop by either, with a heads-up.
            </p>
          </div>

          {/* Office tabs (city names as big toggles) */}
          <div className="flex flex-wrap gap-3 mb-8">
            {offices.map((o) => {
              const active = office.id === o.id;
              return (
                <button
                  key={o.id}
                  onClick={() => setOffice(o)}
                  className={`relative px-6 py-2.5 rounded-full text-sm font-medium transition-colors border ${
                    active
                      ? "bg-ink text-white border-ink"
                      : "bg-white text-ink border-ink/10 hover:border-ink/40"
                  }`}
                >
                  <span className="tabular-nums text-[10px] uppercase tracking-[0.22em] mr-2 opacity-60">
                    {o.id === "bhopal" ? "HQ" : "Corp"}
                  </span>
                  {o.city}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Map */}
            <div className="col-span-12 lg:col-span-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={office.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.5 }}
                  className="rounded-3xl overflow-hidden border border-ink/10 aspect-[4/3] md:aspect-[16/10] bg-white relative"
                >
                  <iframe
                    title={`SMG ${office.city} office`}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(office.mapQuery)}&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="absolute bottom-4 left-4 bg-ink/90 backdrop-blur text-white px-4 py-2 rounded-full text-[11px] uppercase tracking-[0.22em]">
                    {office.coords}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Details */}
            <div className="col-span-12 lg:col-span-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={office.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.4 }}
                  className="h-full rounded-3xl bg-white border border-ink/10 p-8 flex flex-col"
                >
                  <div className="text-[11px] uppercase tracking-[0.22em] text-brand font-medium">
                    {office.role}
                  </div>
                  <div className="mt-3 text-5xl font-display font-semibold tracking-tight">
                    {office.city}
                  </div>
                  <div className="text-ink-soft text-sm">{office.state}</div>

                  <div className="mt-8 space-y-5 text-sm">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.22em] text-ink-soft mb-1">
                        Address
                      </div>
                      <div className="text-ink flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5 text-brand flex-shrink-0" />
                        <span>{office.address}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.22em] text-ink-soft mb-1">
                        Hours
                      </div>
                      <div className="text-ink">{office.hours}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.22em] text-ink-soft mb-1">
                        Local time
                      </div>
                      <div className="font-display text-2xl tabular-nums">{mounted ? time : "--:--:--"}</div>
                    </div>
                  </div>

                  <a
                    href={`https://www.google.com/maps?q=${encodeURIComponent(office.mapQuery)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-auto pt-6 inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-brand transition-colors"
                  >
                    Get directions <ArrowUpRight className="h-4 w-4" />
                  </a>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 04 — Social / Footer CTA */}
      <section className="py-20 md:py-24 bg-ink text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 grid grid-cols-12 gap-6 items-center">
          <div className="col-span-12 lg:col-span-8">
            <div className="text-3xl md:text-5xl font-display font-semibold tracking-tight">
              Or find us where you{" "}
              <span className="font-serif-display italic text-brand">already are</span>.
            </div>
          </div>
          <div className="col-span-12 lg:col-span-3 flex lg:justify-end gap-2">
            {[
              { Icon: LinkedinIcon, href: "#", label: "LinkedIn" },
              { Icon: InstagramIcon, href: "#", label: "Instagram" },
              { Icon: Globe, href: "#", label: "Website" },
              { Icon: Mail, href: "mailto:contact@shrimaa.com", label: "Email" },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="h-12 w-12 rounded-full border border-white/15 flex items-center justify-center hover:bg-brand hover:border-brand transition-colors"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function FloatField({
  label,
  name,
  type,
  error,
}: {
  label: string;
  name: string;
  type: string;
  error?: string;
}) {
  const [focused, setFocused] = useState(false);
  const [val, setVal] = useState("");
  const float = focused || val.length > 0;
  const isTextarea = type === "textarea";

  const sharedClass = `peer w-full bg-transparent border-b ${
    error ? "border-destructive" : focused ? "border-brand" : "border-ink/20"
  } pt-6 pb-2 text-ink focus:outline-none transition-colors`;

  return (
    <div className="relative">
      <label
        className={`absolute left-0 pointer-events-none transition-all duration-200 ${
          float
            ? "top-0 text-[10px] uppercase tracking-[0.22em] text-ink-soft"
            : "top-6 text-base text-ink-soft"
        }`}
      >
        {label}
      </label>
      {isTextarea ? (
        <textarea
          name={name}
          rows={4}
          required
          aria-invalid={!!error}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => setVal(e.target.value)}
          className={sharedClass + " resize-none"}
        />
      ) : (
        <input
          name={name}
          type={type}
          required
          aria-invalid={!!error}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => setVal(e.target.value)}
          className={sharedClass}
        />
      )}
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}
