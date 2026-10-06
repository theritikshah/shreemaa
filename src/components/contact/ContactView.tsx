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
} from "lucide-react";
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

export function ContactView() {
  const [greetIdx, setGreetIdx] = useState(0);
  const [type, setType] = useState("business");
  const [office, setOffice] = useState(offices[0]);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

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
                    className="inline-block font-serif-display italic text-accent"
                  >
                    {greetings[greetIdx]}
                  </motion.span>
                </AnimatePresence>
                <br />
                <span className="text-ink">Let&apos;s talk.</span>
              </h1>

              <div className="mt-12 grid grid-cols-12 gap-6">
                <p className="col-span-12 md:col-span-7 text-base md:text-lg text-ink-soft leading-relaxed max-w-2xl">
                  A brand looking to grow? A distributor ready for a new category? A buyer looking for reliable supply? Tell us what you need and the right SMG team will be in touch.
                </p>
                <div className="col-span-12 md:col-span-5 md:border-l md:border-ink/10 md:pl-6 space-y-3 text-sm">
                  <a href="mailto:contact@shrimaa.com" className="flex items-center justify-between group">
                    <span className="text-ink-soft uppercase tracking-[0.18em] text-[10px]">Email</span>
                    <span className="font-medium group-hover:text-accent transition-colors flex items-center gap-1">
                      contact@shrimaa.com <ArrowUpRight className="h-3.5 w-3.5" />
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
            className="flex w-max whitespace-nowrap gap-12 text-[clamp(2rem,5vw,4rem)] font-display font-semibold tracking-tight"
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
            <h2 className="max-w-3xl font-display text-4xl font-semibold leading-[1.02] tracking-[-0.03em] md:text-6xl">
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
                      className="group relative flex w-full items-start gap-6 border-b border-ink/10 py-6 text-left"
                    >
                      <span className="mt-2 text-[11px] tabular-nums uppercase tracking-[0.22em] text-ink-soft">
                        0{idx + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-4">
                          <div className={`font-display text-3xl font-semibold tracking-tight transition-colors md:text-4xl ${active ? "text-brand" : "text-ink group-hover:text-brand"}`}>
                            {i.label}
                          </div>
                          <motion.span
                            animate={{ rotate: active ? 45 : 0, scale: active ? 1.1 : 1 }}
                            className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${active ? "bg-brand text-white" : "bg-ink/5 text-ink"}`}
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
                              className="mt-3 overflow-hidden text-sm text-ink-soft"
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

              <div className="mt-10 rounded-2xl border border-ink/5 bg-surface-2 p-6">
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
                    <CheckCircle2 className="h-10 w-10 text-accent mb-6" />
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

      {/* SECTION 03 — Offices as two distinct doors */}
      <section id="offices" className="bg-surface py-24 md:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid items-end gap-6 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-8">
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-brand">
                Find us in India
              </div>
              <h2 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.02] tracking-[-0.03em] md:text-6xl">
                Two doors, <span className="font-serif-display italic text-brand">always open</span>.
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-ink-soft md:col-span-4 md:max-w-sm">
              Strategy and operations in Bhopal. Partnerships and corporate teams in Gurgaon.
              Choose a door to see where to find us.
            </p>
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-2">
            {offices.map((location, index) => {
              const isActive = office.id === location.id;
              return (
                <button
                  key={location.id}
                  type="button"
                  onClick={() => setOffice(location)}
                  aria-pressed={isActive}
                  className={`group relative min-h-[310px] overflow-hidden rounded-[28px] border p-7 text-left transition-all duration-300 md:p-9 ${
                    isActive
                      ? "border-ink bg-ink text-white shadow-[0_24px_60px_-36px_rgba(20,18,16,0.65)]"
                      : "border-ink/10 bg-white text-ink hover:border-ink/30"
                  }`}
                >
                  <div
                    aria-hidden
                    className={`absolute -right-20 -top-24 h-64 w-64 rounded-full blur-3xl transition-opacity ${
                      isActive ? "bg-brand/30 opacity-100" : "bg-brand/10 opacity-0 group-hover:opacity-100"
                    }`}
                  />

                  <div className="relative flex h-full flex-col">
                    <div className="flex items-center justify-between gap-5">
                      <div className={`text-[10px] font-semibold uppercase tracking-[0.22em] ${isActive ? "text-white/50" : "text-ink-soft"}`}>
                        0{index + 1} · {location.role}
                      </div>
                      <div className={`flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] ${isActive ? "text-white/60" : "text-ink-soft"}`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Mon–Sat
                      </div>
                    </div>

                    <div className="mt-9">
                      <div className="font-display text-5xl font-semibold tracking-[-0.04em] md:text-6xl">
                        {location.city}
                      </div>
                      <div className={`mt-1 text-sm ${isActive ? "text-white/55" : "text-ink-soft"}`}>
                        {location.state}
                      </div>
                    </div>

                    <div className="mt-auto grid grid-cols-[1fr_auto] items-end gap-6 pt-10">
                      <div>
                        <div className={`flex max-w-md items-start gap-2 text-sm ${isActive ? "text-white/75" : "text-ink/75"}`}>
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                          <span>{location.address}</span>
                        </div>
                        <div className={`mt-4 text-xs ${isActive ? "text-white/45" : "text-ink-soft"}`}>
                          <span>{location.hours}</span>
                        </div>
                      </div>
                      <span className={`grid h-11 w-11 place-items-center rounded-full transition-colors ${isActive ? "bg-white text-ink" : "bg-ink text-white group-hover:bg-brand"}`}>
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={office.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="relative mt-5 h-[280px] overflow-hidden rounded-[28px] border border-ink/10 bg-white md:h-[360px]"
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
              <div className="absolute inset-x-4 bottom-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-ink/90 px-4 py-3 text-white backdrop-blur md:inset-x-auto md:left-4 md:min-w-[420px]">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/50">Selected office</div>
                  <div className="mt-0.5 text-sm font-medium">{office.city} · {office.coords}</div>
                </div>
                <a
                  href={`https://www.google.com/maps?q=${encodeURIComponent(office.mapQuery)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold hover:text-brand"
                >
                  Directions <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* SECTION 04 — Compact social handoff */}
      <section className="border-b border-white/10 bg-ink py-9 text-white md:py-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-6 lg:px-10">
          <div className="flex min-w-0 items-baseline gap-3">
            <div className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">
              Connect
            </div>
            <div className="text-lg font-medium tracking-tight text-white/80 md:text-xl">
              Or find us where you{" "}
              <span className="font-serif-display italic text-accent">already are</span>.
            </div>
          </div>
          <div className="flex gap-2">
            {[
              { Icon: Mail, href: "mailto:contact@shrimaa.com", label: "Email" },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-brand hover:bg-brand hover:text-white"
              >
                <Icon className="h-3.5 w-3.5" />
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
