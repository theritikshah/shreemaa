"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { DEFAULT_PALETTE } from "@/components/command-hero/config";
import { resolveGlobeConfig, type GlobeConfig } from "@/components/particle-globe/config";
import type { GlobeProjector, GlobeSceneController } from "@/components/particle-globe/globeScene";
import "./globe/globe.css";

export type GlobeLocation = {
  city: string;
  country: string;
  role: string;
  focus?: string;
  /** [lng, lat] */
  coords: [number, number];
  hq?: boolean;
};

/**
 * The Global Trade particle globe, with the offices marked in brand red and
 * the HQ as its pulsing hub.
 */
function globeConfig(locations: GlobeLocation[]): GlobeConfig {
  const hub = Math.max(0, locations.findIndex((location) => location.hq));
  const points = locations.map((location, index) => ({
    id: String(index),
    lat: location.coords[1],
    lng: location.coords[0],
    label: location.city,
    hub: index === hub,
  }));
  return resolveGlobeConfig({
    background: "transparent",
    interaction: "drag",
    accentColor: "#fe0000",
    locations: points,
    connections: [],
    focusLongitude: locations[hub]?.coords[0] ?? 77,
    pointer: { enabled: false },
    // Centred in its column.
    layout: {
      desktop: { x: 0.5, y: 0.5, heightFraction: 0.84, widthFraction: 0.88, maxDiameter: 700 },
      mobile: { x: 0.5, y: 0.5, heightFraction: 0.78, widthFraction: 0.9, maxDiameter: 520 },
    },
    mobileBreakpoint: 600,
  });
}

export function CommerceGlobe({ locations }: { locations: GlobeLocation[] }) {
  const section = useRef<HTMLElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const markerLayer = useRef<HTMLDivElement>(null);
  const markers = useRef<(HTMLButtonElement | null)[]>([]);
  const globe = useRef<GlobeSceneController | null>(null);
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const root = section.current;
    const mount = host.current;
    if (!root || !mount) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    const config = globeConfig(locations);
    let drawn = false;
    // Markers track the globe each frame, and stay hidden until the continents form.
    const onFrame = (project: GlobeProjector, progress: number) => {
      if (!drawn) {
        drawn = true;
        setStatus("ready");
      }
      if (markerLayer.current) markerLayer.current.style.opacity = String(progress);
      locations.forEach((location, index) => {
        const element = markers.current[index];
        if (!element) return;
        const point = project(location.coords[1], location.coords[0], 1.02);
        const shown = progress >= 1 && point.facing > 0.13;
        element.style.visibility = shown ? "visible" : "hidden";
        element.tabIndex = shown ? 0 : -1;
        element.style.transform = `translate(${point.x}px,${point.y}px) translate(-50%,-50%)`;
      });
    };
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        try {
          const { createGlobeScene } = await import("@/components/particle-globe/globeScene");
          if (disposed) return;
          const scene = createGlobeScene({
            mount,
            container: mount,
            config,
            onFrame,
            onUnavailable: () => {
              if (!disposed) setStatus("error");
            },
          });
          if (!scene) {
            setStatus("error");
            return;
          }
          globe.current = scene;
          cleanup = scene.dispose;
        } catch {
          if (!disposed) setStatus("error");
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(root);
    return () => {
      disposed = true;
      observer.disconnect();
      globe.current = null;
      cleanup?.();
    };
  }, [locations]);

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
      <div className="commerce-globe__body">
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
            <div ref={markerLayer} className="commerce-globe__markers">
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
        <div className="commerce-globe__offices">
          <div className="commerce-globe__offices-head">
            <span>Offices</span>
            <span>
              {String(active + 1).padStart(2, "0")} / {String(locations.length).padStart(2, "0")}
            </span>
          </div>
          <ul>
            {locations.map((location, index) => (
              <li key={location.city}>
                <button
                  type="button"
                  className={active === index ? "is-active" : ""}
                  aria-pressed={active === index}
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  onClick={() => {
                    setActive(index);
                    globe.current?.focus(location.coords[1], location.coords[0]);
                  }}
                >
                  <span className="commerce-globe__office-main">
                    <span className="commerce-globe__office-city">
                      {location.city}
                      {location.hq && <span className="commerce-globe__office-hq">HQ</span>}
                    </span>
                    <span className="commerce-globe__office-role">{location.role}</span>
                    {location.focus && <span className="commerce-globe__office-focus">{location.focus}</span>}
                  </span>
                  <span className="commerce-globe__office-country">{location.country}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
