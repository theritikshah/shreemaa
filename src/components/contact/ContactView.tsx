"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";

const greetings = ["Hello.", "Namaste.", "Salaam.", "Vanakkam.", "Sat Sri Akaal.", "Kem Cho."];

const inquiries = [
  { id: "business", label: "Business", desc: "Distribution, marketplace ops, trading or trade." },
  { id: "partnership", label: "Partnership", desc: "Manufacturing, brand or strategic alliances." },
  { id: "career", label: "Career", desc: "Roles, internships and people inquiries." },
];

type Office = {
  city: string;
  country: string;
  role: string;
  focus: string;
  mapQuery: string;
  address?: string;
  hours?: string;
  hq?: boolean;
};

const OFFICES: Office[] = [
  { city: "Bhopal",    country: "India",     role: "Global Headquarters", focus: "Group leadership, strategy and operations",        mapQuery: "Shri Maa Group, Bhopal, Madhya Pradesh, India", address: "Shri Maa Group, Bhopal, Madhya Pradesh", hours: "Mon to Sat, 10:00 to 19:00 IST", hq: true },
  { city: "Gurgaon",   country: "India",     role: "Corporate Office",    focus: "Corporate functions, partnerships and technology", mapQuery: "Enkay centre, Udyog vihar, phase 5, Sector 19, Gurugram, Haryana 122016", address: "Enkay Centre, Udyog Vihar Phase 5, Sector 19, Gurugram 122016", hours: "Mon to Sat, 10:00 to 19:00 IST" },
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
            {/* Office addresses */}
            <div className="col-span-12 lg:col-span-5">
              <div className="border-t border-ink/10">
                {OFFICES.filter((o) => o.address).map((o) => (
                  <a
                    key={o.city}
                    href={`https://www.google.com/maps?q=${encodeURIComponent(o.mapQuery)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="group block border-b border-ink/10 py-6"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="font-display text-3xl font-semibold tracking-tight text-accent md:text-4xl">
                        {o.city}
                      </div>
                      <ArrowUpRight className="h-5 w-5 text-ink-soft transition-colors group-hover:text-accent" />
                    </div>
                    <p className="mt-2 text-sm text-ink-soft">{o.address}</p>
                  </a>
                ))}
              </div>

              <div className="mt-8 space-y-1 text-sm">
                <a
                  href="mailto:contact@shrimaa.com"
                  className="text-lg font-medium hover:text-accent transition-colors"
                >
                  contact@shrimaa.com
                </a>
                <p className="text-ink-soft">{OFFICES[0].hours}</p>
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
                    <FloatSelect
                      label="Subject"
                      name="type"
                      value={type}
                      onChange={setType}
                      options={inquiries.map((i) => ({ value: i.id, label: i.label }))}
                    />
                    <FloatField
                      label="Tell us a little about it"
                      name="message"
                      type="textarea"
                      error={errors.message}
                    />
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

function FloatSelect({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative">
      <label
        htmlFor={`contact-${name}`}
        className="absolute left-0 top-0 pointer-events-none text-[10px] uppercase tracking-[0.22em] text-ink-soft"
      >
        {label}
      </label>
      <select
        id={`contact-${name}`}
        name={name}
        value={value}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full appearance-none bg-transparent border-b ${
          focused ? "border-brand" : "border-ink/20"
        } pt-6 pb-2 pr-8 text-ink focus:outline-none transition-colors cursor-pointer`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-0 bottom-3 h-4 w-4 text-ink-soft" />
    </div>
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
