"use client";
import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import life1 from "@/assets/life-1.jpeg";
import life2 from "@/assets/life-2.jpeg";
import life3 from "@/assets/life-3.jpeg";
// Placeholder profiles: replace these names, roles, stories and portraits with
// approved founder content when it is available.
const PEOPLE_STORIES = [
  {
    name: "Aarav Mehta",
    role: "Founder & Group Chairman",
    image: life1.src,
    headline: "From one market to a nationwide network.",
    story:
      "What began as a small distribution operation grew through patient relationship-building, close attention to retailers and an instinct for where commerce was heading next. Aarav's journey represents the entrepreneurial foundation behind SMG: stay close to the market, earn trust over time and build the infrastructure before chasing scale.",
  },
  {
    name: "Meera Shah",
    role: "Co-founder & Director",
    image: life2.src,
    headline: "Relationships first. Growth followed.",
    story:
      "Meera helped turn long-standing manufacturer and retailer relationships into an operating system for growth. Her story is one of disciplined execution—bringing people, processes and partners together so that every new category could scale without losing the responsiveness of a family-built business.",
  },
  {
    name: "Kabir Malhotra",
    role: "Co-founder & Managing Director",
    image: life3.src,
    headline: "Rebuilding the business for every new era.",
    story:
      "From traditional distribution to marketplaces and cross-border trade, Kabir's focus has been adaptation. By combining on-ground commercial experience with technology and new operating models, he helped extend SMG's reach while keeping the group anchored in practical, measurable outcomes for its partners.",
  },
];


export function PeopleStories() {
  const [activeStory, setActiveStory] = useState(0);
  const story = PEOPLE_STORIES[activeStory];
  return (
      <section id="our-people" className="bg-surface py-28 md:py-36 overflow-hidden scroll-mt-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-end mb-14 md:mb-20">
            <div className="md:col-span-8">
              <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-ink-soft mb-6">
                <span className="h-px w-8 bg-ink/30" /> Founding leadership
              </div>
              <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[0.92] tracking-tight font-bold">
                Our people.
                <br />
                <span className="font-serif-display italic text-brand">Their journeys.</span>
              </h2>
            </div>
            <p className="md:col-span-4 text-base md:text-lg text-ink-soft leading-relaxed">
              Every business is shaped by the people who build it. These are the stories, decisions and convictions behind SMG&apos;s journey.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 border border-line bg-white rounded-3xl overflow-hidden min-h-[560px]">
            <div className="lg:col-span-5 relative min-h-[420px] lg:min-h-full bg-surface-2 overflow-hidden">
              <Image
                key={story.image} fill sizes="(min-width: 1024px) 42vw, 100vw"
                src={story.image}
                alt={`Placeholder portrait for ${story.name}`}
                className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-transparent to-transparent" />
              <div className="absolute left-6 top-6 rounded-full bg-white/90 backdrop-blur px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-ink">
                Placeholder profile
              </div>
              <div className="absolute bottom-7 left-7 right-7 text-white">
                <div className="text-2xl md:text-3xl font-semibold tracking-tight">{story.name}</div>
                <div className="mt-2 text-xs uppercase tracking-[0.2em] text-white/70">{story.role}</div>
              </div>
            </div>

            <div className="lg:col-span-7 p-8 sm:p-12 md:p-16 flex flex-col justify-between">
              <div>
                <div className="font-serif-display text-7xl md:text-8xl leading-none text-brand/20">“</div>
                <h3 className="-mt-5 text-3xl md:text-5xl font-bold tracking-tight leading-[1.08] max-w-[15ch]">
                  {story.headline}
                </h3>
                <p className="mt-7 text-base md:text-lg leading-relaxed text-ink-soft max-w-2xl">
                  {story.story}
                </p>
              </div>

              <div className="mt-12 pt-7 border-t border-line flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-2" aria-label="Select a people story">
                  {PEOPLE_STORIES.map((person, i) => (
                    <button
                      key={person.name}
                      type="button"
                      onClick={() => setActiveStory(i)}
                      aria-label={`Show ${person.name}'s story`}
                      aria-current={i === activeStory ? "true" : undefined}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === activeStory ? "w-10 bg-brand" : "w-4 bg-ink/15 hover:bg-ink/35"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <span className="mr-2 text-xs uppercase tracking-[0.18em] text-ink-soft tabular-nums">
                    {String(activeStory + 1).padStart(2, "0")} / {String(PEOPLE_STORIES.length).padStart(2, "0")}
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveStory((i) => (i - 1 + PEOPLE_STORIES.length) % PEOPLE_STORIES.length)}
                    className="h-11 w-11 rounded-full border border-line flex items-center justify-center hover:bg-ink hover:text-white transition-colors"
                    aria-label="Previous story"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStory((i) => (i + 1) % PEOPLE_STORIES.length)}
                    className="h-11 w-11 rounded-full bg-ink text-white flex items-center justify-center hover:bg-brand transition-colors"
                    aria-label="Next story"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


  );
}
