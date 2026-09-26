"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { DEFAULT_PALETTE } from "@/components/command-hero/config";
import { ArrowDownRight } from "lucide-react";
import type { GlobeLocation } from "./globe/createGlobe";
import "./globe/globe.css";

export function CommerceGlobe({ locations }: { locations: GlobeLocation[] }) {
  const section = useRef<HTMLElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const markers = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const root = section.current;
    const mount = host.current;
    if (!root || !mount) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    const abort = new AbortController();
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        try {
          const { createGlobe } = await import("./globe/createGlobe");
          if (disposed) return;
          const scene = await createGlobe(mount, locations, markers.current, abort.signal);
          if (disposed) {
            scene.dispose();
            return;
          }
          cleanup = scene.dispose;
          setStatus(scene.fallback ? "fallback" : "ready");
        } catch {
          if (!disposed) setStatus("error");
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(root);
    return () => {
      disposed = true;
      abort.abort();
      observer.disconnect();
      cleanup?.();
    };
  }, [locations]);

  const selected = locations[active];
  return (
    <section
      ref={section}
      id="about-connected-world"
      className="commerce-globe"
      style={{
        background: `linear-gradient(135deg, ${DEFAULT_PALETTE.gradient[0]} 0%, ${DEFAULT_PALETTE.gradient[1]} 50%, ${DEFAULT_PALETTE.gradient[2]} 100%)`,
        "--globe-text": DEFAULT_PALETTE.text,
        "--globe-muted": DEFAULT_PALETTE.mutedText,
        "--globe-glow": `radial-gradient(${DEFAULT_PALETTE.glowRadius * 170}% ${DEFAULT_PALETTE.glowRadius * 170}% at ${(DEFAULT_PALETTE.glowCentre[0] / 2 + 0.5) * 100}% ${(0.5 - DEFAULT_PALETTE.glowCentre[1]) * 100}%, ${DEFAULT_PALETTE.glow} 0%, transparent 70%)`,
        "--globe-glow-opacity": DEFAULT_PALETTE.glowOpacity,
      } as CSSProperties}
      aria-labelledby="commerce-globe-title"
    >
      <div className="commerce-globe__heading">
        <span className="commerce-globe__eyebrow">
          <span /> Connected by commerce
        </span>
        <h2 id="commerce-globe-title">
          A world of possibility.
          <br />
          <em>One connected network.</em>
        </h2>
        <p>
          From our roots in India to markets around the world, we bring brands, people and
          possibilities closer.
        </p>
      </div>
      <div className="commerce-globe__visual">
        <div className="commerce-globe__crosshair commerce-globe__crosshair--h" />
        <div className="commerce-globe__crosshair commerce-globe__crosshair--v" />
        <span className="commerce-globe__axis">23° N / 77° E</span>
        <div
          ref={host}
          className="commerce-globe__canvas"
          role="img"
          aria-label="Interactive particle globe showing Shri Maa Group's office network"
        />
        {status === "error" && (
          <img
            className="commerce-globe__fallback"
            src="/globe/fallback.svg"
            alt="Globe showing our connected world"
          />
        )}
        {status === "loading" && (
          <div className="commerce-globe__loading" role="status">
            Connecting our world<span>—</span>
          </div>
        )}
        {status === "ready" && (
          <div className="commerce-globe__markers">
            {locations.map((location, index) => (
              <button
                key={location.city}
                ref={(element) => {
                  markers.current[index] = element;
                }}
                className={`commerce-globe__marker ${active === index ? "is-active" : ""}`}
                onClick={() => setActive(index)}
                aria-label={`${location.city}, ${location.country}`}
                aria-pressed={active === index}
                type="button"
              >
                <span aria-hidden="true">+</span>
                <span className="commerce-globe__marker-label">{location.city}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="commerce-globe__footer">
        <div className="commerce-globe__office" aria-live="polite">
          <span className="commerce-globe__eyebrow">
            Our network / {String(active + 1).padStart(2, "0")}
          </span>
          <h3>
            {selected.city} <span>{selected.country}</span>
          </h3>
          <p>{selected.role}</p>
        </div>
        <div className="commerce-globe__locations" aria-label="Explore office locations">
          {locations.map((location, index) => (
            <button
              type="button"
              key={location.city}
              aria-pressed={index === active}
              onClick={() => setActive(index)}
            >
              {location.city}
            </button>
          ))}
        </div>
        <a href="#about-global-presence" className="commerce-globe__link">
          Discover our presence <ArrowDownRight size={18} />
        </a>
      </div>
    </section>
  );
}
