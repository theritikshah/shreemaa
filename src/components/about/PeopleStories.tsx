"use client";
import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
// Placeholder profiles: replace these names, roles, stories and portraits with
// approved founder content when it is available.
const PEOPLE_STORIES = [
  {
    name: "Aarav Mehta",
    role: "Founder & Group Chairman",
    image: "https://api.dicebear.com/10.x/notionists/svg?seed=Aarav%20Mehta&backgroundColor=eee8df",
    headline: "From one market to a nationwide network.",
    story:
      "What began as a small distribution operation grew through patient relationship-building, close attention to retailers and an instinct for where commerce was heading next. Aarav's journey represents the entrepreneurial foundation behind SMG: stay close to the market, earn trust over time and build the infrastructure before chasing scale.",
  },
  {
    name: "Meera Shah",
    role: "Co-founder & Director",
    image: "https://api.dicebear.com/10.x/notionists/svg?seed=Meera%20Shah&backgroundColor=f1e5e5",
    headline: "Relationships first. Growth followed.",
    story:
      "Meera helped turn long-standing manufacturer and retailer relationships into an operating system for growth. Her story is one of disciplined execution—bringing people, processes and partners together so that every new category could scale without losing the responsiveness of a family-built business.",
  },
  {
    name: "Kabir Malhotra",
    role: "Co-founder & Managing Director",
    image: "https://api.dicebear.com/10.x/notionists/svg?seed=Kabir%20Malhotra&backgroundColor=e5e9e3",
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

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="flex flex-col gap-4 lg:col-span-3">
              <div className="relative aspect-[4/4.15] overflow-hidden rounded-[24px] border border-line bg-surface-2">
                <Image
                  key={story.image}
                  fill
                  sizes="(min-width: 1024px) 25vw, 100vw"
                  src={story.image}
                  alt={`Generated portrait of ${story.name}`}
                  unoptimized
                  className="object-cover transition-opacity duration-500"
                />
                <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[9px] uppercase tracking-[0.18em] text-ink backdrop-blur">
                  Generated profile
                </div>
              </div>

              <div className="flex min-h-[220px] flex-col justify-between rounded-[24px] bg-ink p-7 text-white md:p-8">
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                  Founding leadership · {String(activeStory + 1).padStart(2, "0")}
                </div>
                <div>
                  <div className="font-display text-3xl font-semibold leading-[1.04] tracking-[-0.035em] md:text-4xl">
                    {story.name}
                  </div>
                  <div className="mt-4 text-sm leading-relaxed text-white/60">{story.role}</div>
                </div>
              </div>
            </div>

            <div className="flex min-h-[580px] flex-col rounded-[24px] border border-line bg-surface-2 p-7 sm:p-10 md:p-12 lg:col-span-9 lg:p-14">
              <div className="flex items-center justify-between gap-5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-soft">
                  Shri Maa Group
                </div>
                <div className="text-xs tabular-nums text-ink-soft">
                  {String(activeStory + 1).padStart(2, "0")} / {String(PEOPLE_STORIES.length).padStart(2, "0")}
                </div>
              </div>

              <div className="mt-12 md:mt-16">
                <h3 className="max-w-[22ch] font-display text-3xl font-medium leading-[1.08] tracking-[-0.04em] md:text-5xl">
                  {story.headline}
                </h3>
                <p className="mt-7 max-w-3xl text-base leading-relaxed text-ink-soft md:text-lg">
                  {story.story}
                </p>
              </div>

              <div className="mt-auto flex flex-wrap items-end justify-between gap-6 border-t border-line pt-7">
                <div>
                  <div className="font-display text-5xl font-medium tracking-[-0.05em] text-ink md:text-6xl">
                    {String(activeStory + 1).padStart(2, "0")}
                  </div>
                  <div className="mt-2 text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                    A story behind the group
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="mr-3 flex items-center gap-2" aria-label="Select a people story">
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
                  <button
                    type="button"
                    onClick={() => setActiveStory((i) => (i - 1 + PEOPLE_STORIES.length) % PEOPLE_STORIES.length)}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-line transition-colors hover:bg-ink hover:text-white"
                    aria-label="Previous story"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStory((i) => (i + 1) % PEOPLE_STORIES.length)}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-white transition-colors hover:bg-brand"
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
