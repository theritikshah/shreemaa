"use client";

import { Plus, Minus } from "lucide-react";
import { useRef, useEffect, useState, useMemo } from "react";
import { geoNaturalEarth1, geoPath, geoInterpolate } from "d3-geo";
import { feature } from "topojson-client";
import type { FeatureCollection } from "geojson";
import { Counter } from "@/components/Counter";

type Office = {
  city: string;
  country: string;
  state: string;
  role: string;
  focus: string;
  coords: [number, number]; // [lng, lat]
  hq?: boolean;
};

type OfficeExt = Office & { mapGroup: string };

const OFFICES: OfficeExt[] = [
  // India - Bhopal is HQ
  { city: "Bhopal",    country: "India",     state: "Madhya Pradesh",  role: "Global Headquarters",   focus: "Group leadership, strategy and operations",         coords: [77.41, 23.26], hq: true, mapGroup: "india" },
  { city: "Gurgaon",   country: "India",     state: "Haryana",         role: "Corporate Office",      focus: "Corporate functions, partnerships and technology",  coords: [77.03, 28.46], mapGroup: "india" },
  { city: "Mumbai",    country: "India",     state: "Maharashtra",     role: "Regional Office",       focus: "West India commercial operations",                  coords: [72.88, 19.08], mapGroup: "india" },
  { city: "Hyderabad", country: "India",     state: "Telangana",       role: "Regional Office",       focus: "South India distribution and market expansion",     coords: [78.49, 17.39], mapGroup: "india" },
  { city: "Indore",    country: "India",     state: "Madhya Pradesh",  role: "Regional Office",       focus: "Central India warehousing and logistics",           coords: [75.86, 22.72], mapGroup: "india" },
  // International
  { city: "Dubai",     country: "UAE",       state: "Dubai",           role: "Regional Office",       focus: "Global trade, sourcing and re-export corridors",    coords: [55.27, 25.20], mapGroup: "dubai" },
  { city: "Singapore", country: "Singapore", state: "Singapore",       role: "Regional Office",       focus: "Trade finance and Southeast Asia distribution",     coords: [103.82, 1.35], mapGroup: "singapore" },
  { city: "New York",  country: "USA",       state: "New York",        role: "Regional Office",       focus: "Americas brand partnerships and market access",     coords: [-74.00, 40.71], mapGroup: "newyork" },
  { city: "Kampala",   country: "Uganda",    state: "Central Region",  role: "Regional Office",       focus: "East Africa distribution build-out",                coords: [32.58, 0.32], mapGroup: "kampala" },
];

// Aggregated map points (India collapses to a single marker anchored at Bhopal HQ)
const MAP_POINTS: { key: string; label: string; coords: [number, number]; offices: number[] }[] = (() => {
  const groups = new Map<string, { key: string; label: string; coords: [number, number]; offices: number[] }>();
  OFFICES.forEach((o, i) => {
    const existing = groups.get(o.mapGroup);
    if (existing) {
      existing.offices.push(i);
    } else {
      groups.set(o.mapGroup, {
        key: o.mapGroup,
        label: o.mapGroup === "india" ? "India" : o.city,
        coords: o.coords,
        offices: [i],
      });
    }
  });
  return Array.from(groups.values());
})();

const TOPO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export function AboutView() {
  const [active, setActive] = useState(0);

  return (
    <>
      {/* HERO */}
      <section className="relative bg-surface pt-40 pb-24 md:pt-48 md:pb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-ink-soft mb-10">
            <span className="h-px w-8 bg-ink/30" /> About Shri Maa Group
          </div>
          <h1 className="text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[1.02] tracking-tight font-bold max-w-[18ch]">
            Moving commerce.{" "}
            <span className="font-serif-display italic text-brand">Building markets.</span>
          </h1>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
            <div className="md:col-span-5 text-sm uppercase tracking-[0.18em] text-ink-soft">
              <div className="h-px w-full bg-ink/20 mb-4" />
              Est. 1997. Headquartered in Bhopal, with a corporate office in Gurgaon and teams connecting India with markets across Asia, Africa and the Americas.
            </div>
            <p className="md:col-span-7 text-lg md:text-2xl leading-snug text-ink/85">
              Shri Maa Group is a global commerce, distribution and trade company. For nearly three decades we have built the infrastructure, technology and networks that move products from the world&apos;s leading brands into the hands of millions of consumers.
            </p>
          </div>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="bg-ink text-white py-28 md:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 mb-20">
            <div className="md:col-span-4 text-[11px] uppercase tracking-[0.22em] text-white/50">
              <div className="h-px w-8 bg-white/40 mb-4" /> Who we are
            </div>
            <h2 className="md:col-span-8 text-3xl md:text-5xl leading-[1.1] tracking-tight font-bold max-w-[22ch]">
              An integrated commerce group <span className="font-serif-display italic text-white/70">connecting brands, markets and consumers</span> across three continents.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10">
            {[
              { n: "01", t: "Origin",    d: "Started from humble beginnings in 1997 as a single distribution business in India." },
              { n: "02", t: "Evolution", d: "Across nearly three decades we have built marketplace, distribution, trading, global trade and sustainability businesses. Each one operates at national scale." },
              { n: "03", t: "Today",     d: "An India-rooted company with nine offices across India, the Middle East, Asia Pacific, the Americas and Africa, powered by in-house technology across order management, distribution and marketplace operations." },
            ].map((b) => (
              <div key={b.n} className="bg-ink p-10 md:p-12">
                <div className="font-serif-display text-5xl text-brand">{b.n}</div>
                <div className="mt-10 text-xs uppercase tracking-[0.22em] text-white/50">{b.t}</div>
                <p className="mt-4 text-base md:text-lg text-white/80 leading-relaxed">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founding leadership: the sample profiles and generated portraits are not
          published. Restore <PeopleStories /> once approved stories and photographs
          of SMG's leadership are ready. */}

      {/* GLOBAL PRESENCE */}
      <section className="bg-surface-2 py-28 md:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 mb-16">
            <div className="md:col-span-4 text-[11px] uppercase tracking-[0.22em] text-ink-soft">
              <div className="h-px w-8 bg-ink/30 mb-4" /> Our presence
            </div>
            <h2 className="md:col-span-8 text-3xl md:text-5xl leading-[1.1] tracking-tight font-bold max-w-[22ch]">
              Nine offices. <span className="font-serif-display italic text-brand">Three continents.</span> One company.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-8 lg:sticky lg:top-28">
              <div className="relative w-full rounded-2xl bg-white border border-line overflow-hidden">
                <WorldMap points={MAP_POINTS} offices={OFFICES} active={active} onHover={setActive} />
              </div>
              {/* Footer strip */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-px bg-line border border-line rounded-xl overflow-hidden">
                {[
                  { v: "9", l: "Offices" },
                  { v: "3", l: "Continents" },
                  { v: "28+", l: "Years of operations" },
                  { v: "300M+", l: "Consumers reached" },
                ].map((s) => (
                  <div key={s.l} className="bg-white px-5 py-4">
                    <div className="font-display text-2xl font-bold tracking-tight">{s.v}</div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-ink-soft">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Office list */}
            <div className="lg:col-span-4">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-ink-soft mb-6">
                <span>Offices</span>
                <span className="tabular-nums">0{active + 1} / 0{OFFICES.length}</span>
              </div>
              <ul className="border-t border-line">
                {OFFICES.map((o, i) => {
                  const isActive = active === i;
                  return (
                    <li
                      key={o.city}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => setActive(i)}
                      className={`group relative border-b border-line py-5 cursor-pointer transition-colors ${
                        isActive ? "text-ink" : "text-ink-soft hover:text-ink"
                      }`}
                    >
                      <div
                        className={`absolute left-0 top-0 h-full w-[2px] bg-brand transition-transform origin-top ${
                          isActive ? "scale-y-100" : "scale-y-0"
                        }`}
                      />
                      <div className="pl-4 flex items-baseline justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg md:text-xl font-medium tracking-tight">{o.city}</span>
                            {o.hq && (
                              <span className="text-[9px] uppercase tracking-[0.18em] bg-brand text-white px-1.5 py-0.5 rounded">HQ</span>
                            )}
                          </div>
                          <div className="text-xs uppercase tracking-[0.18em] mt-1 opacity-70">{o.role}</div>
                          <div className={`text-[13px] mt-2 leading-snug transition-all ${isActive ? "opacity-100 max-h-10" : "opacity-0 max-h-0 overflow-hidden"}`}>
                            {o.focus}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-xs uppercase tracking-[0.18em] opacity-70">{o.country}</div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* BY THE NUMBERS */}
      <section className="bg-surface py-28 md:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 md:gap-y-24 lg:grid-cols-3 lg:gap-x-20">
            {[
              {
                v: <Counter to={300} suffix="M+" />,
                d: "Consumers reached through our distribution, marketplace and trading businesses.",
                color: "text-[#d24f34]",
              },
              {
                v: <Counter to={80} suffix="K+" />,
                d: "Active retailers connected across metro, regional and emerging markets.",
                color: "text-[#d55155]",
              },
              {
                v: <Counter prefix="₹" to={4000} suffix="Cr+" />,
                d: "Annual revenue generated across the group’s integrated commerce network.",
                color: "text-[#b48700]",
                size: "text-[clamp(2.125rem,calc(4.25vw-10px),3.875rem)]",
              },
              {
                v: <Counter to={300} suffix="K" />,
                d: "Square feet of owned warehousing and operating infrastructure.",
                color: "text-[#436ce0]",
              },
              {
                v: <Counter to={15} suffix="+" />,
                d: "Fulfilment centres supporting dependable, high-volume movement of goods.",
                color: "text-[#d24f34]",
              },
              {
                v: <>9</>,
                d: "Global offices connecting India with markets across three continents.",
                color: "text-[#3f8d68]",
              },
            ].map((s, i) => (
              <div key={i} className="max-w-sm">
                <div className={`font-display font-medium leading-[0.92] tracking-[-0.045em] ${s.size ?? "text-[clamp(2.375rem,calc(5vw-10px),4.625rem)]"} ${s.color}`}>
                  {s.v}
                </div>
                <p className="mt-7 max-w-[29ch] text-base leading-[1.45] text-ink md:text-lg">
                  {s.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section className="bg-surface py-28 md:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-10 md:mb-16 md:grid-cols-12 md:gap-16 mb-12">
            <div className="text-[11px] uppercase tracking-[0.22em] text-ink-soft md:col-span-4">
              <div className="mb-4 h-px w-8 bg-ink/30" /> What we believe
            </div>
            <h2 className="max-w-[22ch] text-3xl font-bold leading-[1.1] tracking-tight md:col-span-8 md:text-5xl">
              Long-term partnerships. <span className="font-serif-display italic text-brand">Disciplined execution.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-x-3 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { t: "Partner for decades.", d: "The strongest commercial relationships are built patiently, one layer of trust at a time.", visual: "stack" as const },
              { t: "Build the infrastructure first.", d: "Owned systems, facilities and networks create dependable growth without shortcuts.", visual: "grid" as const },
              { t: "Technology as infrastructure.", d: "Purpose-built tools keep every order, partner and marketplace moving in sync.", visual: "orbit" as const },
              { t: "Move with the market.", d: "We listen for change early, adapt the model and meet commerce wherever it goes next.", visual: "signal" as const },
            ].map((p, i) => (
              <article key={p.t} className="group border-t border-line pt-3 transition-transform duration-500 ease-out hover:-translate-y-1">
                <div className="flex aspect-[4/4.35] items-center justify-center overflow-hidden rounded-sm bg-[#efede8] transition-[background-color,box-shadow] duration-500 ease-out group-hover:bg-[#ebe8e2] group-hover:shadow-[0_18px_45px_-32px_rgba(25,22,19,0.45)] [&>svg]:transition-transform [&>svg]:duration-500 [&>svg]:ease-out group-hover:[&>svg]:scale-[1.035]">
                  <BeliefVisual type={p.visual} />
                </div>
                <div className="mt-7 flex items-center gap-2 text-xs tabular-nums text-ink-soft">
                  <span className="bg-[#efede8] px-2 py-1 text-ink">{String(i + 1).padStart(2, "0")}</span>
                  <span>/ 04</span>
                </div>
                <h3 className="mt-7 font-serif-display text-2xl leading-tight text-ink md:text-3xl">{p.t}</h3>
                <p className="mt-4 border-b border-dashed border-line pb-7 text-base leading-relaxed text-ink-soft">{p.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}

function BeliefVisual({ type }: { type: "grid" | "stack" | "orbit" | "signal" }) {
  if (type === "grid") {
    return (
      <svg viewBox="0 0 240 240" className="h-3/5 w-3/5" aria-hidden="true">
        {Array.from({ length: 24 }, (_, i) => (
          <circle
            key={i}
            cx={42 + (i % 6) * 31}
            cy={58 + Math.floor(i / 6) * 41}
            r="5"
            className="belief-dot"
          />
        ))}
        <circle cx="135" cy="99" r="5" fill="#e6533f" stroke="#e6533f" strokeWidth="1.5">
          <animate
            attributeName="r"
            values="5;7.5;5"
            keyTimes="0;0.5;1"
            keySplines="0.4 0 0.2 1;0.4 0 0.2 1"
            calcMode="spline"
            dur="2.2s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    );
  }

  if (type === "stack") {
    return (
      <svg viewBox="0 0 240 240" className="h-3/5 w-3/5" aria-hidden="true">
        <line x1="50" y1="190" x2="190" y2="190" className="belief-line" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={i}
            x="70"
            y={152 - i * 29}
            width="100"
            height="24"
            className={`belief-stack-layer ${i === 4 ? "belief-stack-accent" : ""}`}
            style={{ animationDelay: `${i * 160}ms` }}
          />
        ))}
      </svg>
    );
  }

  if (type === "orbit") {
    return (
      <svg viewBox="0 0 240 240" className="h-3/5 w-3/5" aria-hidden="true">
        <g className="belief-orbit" style={{ transformOrigin: "120px 120px" }}>
          {Array.from({ length: 24 }, (_, i) => (
            <line key={i} x1="120" y1="35" x2="120" y2="48" transform={`rotate(${i * 15} 120 120)`} className={i > 8 && i < 13 ? "belief-tick-accent" : "belief-tick"} />
          ))}
        </g>
        <line x1="101" y1="120" x2="139" y2="120" className="belief-line-dark" />
        <line x1="120" y1="101" x2="120" y2="139" className="belief-line-dark" />
      </svg>
    );
  }

  const bars = [18, 42, 68, 44, 92, 74, 48, 28, 14];
  return (
    <svg viewBox="0 0 240 240" className="h-3/5 w-3/5" aria-hidden="true">
      {bars.map((height, i) => (
        <rect
          key={i}
          x={42 + i * 18}
          y={120 - height / 2}
          width="8"
          height={height}
          className={`belief-signal ${i === 4 ? "belief-signal-accent" : ""}`}
          style={{ animationDelay: `${i * -130}ms`, transformOrigin: `${46 + i * 18}px 120px` }}
        />
      ))}
    </svg>
  );
}

// ---------- World Map ----------

type Topo = {
  type: "Topology";
  objects: { countries: unknown };
  arcs: unknown;
  transform?: unknown;
};

type DisplayPoint = {
  key: string;
  label: string;
  coords: [number, number];
  officeIdx: number;          // primary office for selection
  isIndiaCluster?: boolean;   // collapsed India
  isIndiaChild?: boolean;     // expanded India city
};

const SPLIT_ZOOM = 2.4;
const MIN_ZOOM = 1;
const MAX_ZOOM = 6;

function WorldMap({
  points,
  offices,
  active,
  onHover,
}: {
  points: typeof MAP_POINTS;
  offices: OfficeExt[];
  active: number;
  onHover: (i: number) => void;
}) {
  const WIDTH = 980;
  const HEIGHT = 520;
  const [topo, setTopo] = useState<Topo | null>(null);
  const [markerHover, setMarkerHover] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Zoom & pan
  const [zoom, setZoom] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const dragRef = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setMounted(true);
    let cancelled = false;
    fetch(TOPO_URL)
      .then((r) => r.json())
      .then((data: Topo) => { if (!cancelled) setTopo(data); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const projection = useMemo(
    () =>
      geoNaturalEarth1()
        .scale(180)
        .translate([WIDTH / 2, HEIGHT / 2 + 10]),
    []
  );

  const path = useMemo(() => geoPath(projection), [projection]);

  const countryPaths = useMemo(() => {
    if (!topo) return [];
    const fc = feature(
      topo as unknown as Parameters<typeof feature>[0],
      (topo.objects as { countries: Parameters<typeof feature>[1] }).countries
    ) as unknown as FeatureCollection;
    return fc.features.map((f, i) => ({ d: path(f) ?? "", id: i }));
  }, [topo, path]);

  // Build display points based on current zoom level
  const displayPoints: DisplayPoint[] = useMemo(() => {
    const result: DisplayPoint[] = [];
    points.forEach((pt) => {
      if (pt.key === "india" && zoom >= SPLIT_ZOOM) {
        pt.offices.forEach((oi) => {
          const o = offices[oi];
          result.push({
            key: `india-${o.city}`,
            label: o.city,
            coords: o.coords,
            officeIdx: oi,
            isIndiaChild: true,
          });
        });
      } else {
        result.push({
          key: pt.key,
          label: pt.label,
          coords: pt.coords,
          officeIdx: pt.offices[0],
          isIndiaCluster: pt.key === "india",
        });
      }
    });
    return result;
  }, [points, offices, zoom]);

  const projected = useMemo(
    () => displayPoints.map((pt) => {
      const p = projection(pt.coords);
      return p ? { x: p[0], y: p[1] } : { x: 0, y: 0 };
    }),
    [displayPoints, projection]
  );

  const activeDisplayIndex = useMemo(() => {
    // Prefer the exact office match (when India is split), else the cluster
    const exact = displayPoints.findIndex((p) => p.officeIdx === active);
    if (exact >= 0) return exact;
    const cluster = displayPoints.findIndex(
      (p) => p.isIndiaCluster && offices[active]?.mapGroup === "india"
    );
    return cluster >= 0 ? cluster : 0;
  }, [displayPoints, active, offices]);

  // Arcs always from India HQ (Bhopal) outward to international hubs
  const arcs = useMemo(() => {
    const india = points.find((p) => p.key === "india");
    if (!india) return [];
    const origin = india.coords;
    return points
      .filter((p) => p.key !== "india")
      .map((pt) => {
        const interp = geoInterpolate(origin, pt.coords);
        const steps = 48;
        const pts: [number, number][] = [];
        for (let i = 0; i <= steps; i++) {
          const c = interp(i / steps);
          const p = projection(c);
          if (p) pts.push([p[0], p[1]]);
        }
        const d = pts.map((pp, i) => `${i === 0 ? "M" : "L"}${pp[0]},${pp[1]}`).join("");
        return { d, key: pt.key };
      });
  }, [points, projection]);

  const activePoint = displayPoints[activeDisplayIndex];
  const activePos = projected[activeDisplayIndex];

  // Tooltip placement in screen coords (apply transform)
  const tooltipX = activePos ? activePos.x * zoom + tx : 0;
  const tooltipY = activePos ? activePos.y * zoom + ty : 0;
  const tooltipOnLeft = tooltipX > WIDTH * 0.7;

  const tooltipLabel = activePoint
    ? activePoint.isIndiaCluster
      ? `India · ${offices.filter((o) => o.mapGroup === "india").length} offices`
      : activePoint.isIndiaChild
      ? `${activePoint.label} · India`
      : `${activePoint.label} · ${offices[activePoint.officeIdx].country}`
    : "";

  // --- Zoom helpers ---
  const clampPan = (z: number, x: number, y: number) => {
    // Allow panning so map edges can reach viewport edges
    const maxPan = (z - 1) * Math.max(WIDTH, HEIGHT);
    const cx = Math.max(-maxPan, Math.min(maxPan, x));
    const cy = Math.max(-maxPan, Math.min(maxPan, y));
    return [cx, cy] as const;
  };

  const zoomTo = (next: number, focusSvgX = WIDTH / 2, focusSvgY = HEIGHT / 2) => {
    const z = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, next));
    // Keep the focus point stationary under the cursor
    const k = z / zoom;
    const nx = focusSvgX - (focusSvgX - tx) * k;
    const ny = focusSvgY - (focusSvgY - ty) * k;
    const [cx, cy] = clampPan(z, nx, ny);
    setZoom(z);
    setTx(cx);
    setTy(cy);
  };

  const zoomToIndia = () => {
    const india = points.find((p) => p.key === "india");
    if (!india) return;
    const p = projection(india.coords);
    if (!p) return;
    const z = 3;
    const nx = WIDTH / 2 - p[0] * z;
    const ny = HEIGHT / 2 - p[1] * z;
    const [cx, cy] = clampPan(z, nx, ny);
    setZoom(z);
    setTx(cx);
    setTy(cy);
  };

  const svgRef = useRef<SVGSVGElement>(null);
  const svgPoint = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return [WIDTH / 2, HEIGHT / 2] as const;
    const rect = svg.getBoundingClientRect();
    const sx = ((clientX - rect.left) / rect.width) * WIDTH;
    const sy = ((clientY - rect.top) / rect.height) * HEIGHT;
    return [sx, sy] as const;
  };

  if (!mounted) {
    return <div className="absolute inset-0 bg-white" />;
  }

  return (
    <div className="relative w-full select-none" style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="absolute inset-0 w-full h-full"
        style={{ cursor: isDragging ? "grabbing" : zoom > 1 ? "grab" : "default" }}
        onWheel={(e) => {
          const [sx, sy] = svgPoint(e.clientX, e.clientY);
          const delta = e.deltaY < 0 ? 1.15 : 1 / 1.15;
          zoomTo(zoom * delta, sx, sy);
        }}
        onMouseDown={(e) => {
          dragRef.current = { x: e.clientX, y: e.clientY, tx, ty };
          setIsDragging(true);
        }}
        onMouseMove={(e) => {
          if (!dragRef.current) return;
          const svg = svgRef.current;
          if (!svg) return;
          const rect = svg.getBoundingClientRect();
          const dx = ((e.clientX - dragRef.current.x) / rect.width) * WIDTH;
          const dy = ((e.clientY - dragRef.current.y) / rect.height) * HEIGHT;
          const [cx, cy] = clampPan(zoom, dragRef.current.tx + dx, dragRef.current.ty + dy);
          setTx(cx);
          setTy(cy);
        }}
        onMouseUp={() => { dragRef.current = null; setIsDragging(false); }}
        onMouseLeave={() => { dragRef.current = null; setIsDragging(false); }}
      >
        <g transform={`translate(${tx} ${ty}) scale(${zoom})`}>
          <g>
            {countryPaths.map((c) => (
              <path
                key={c.id}
                d={c.d}
                fill="oklch(0.94 0.005 75)"
                stroke="oklch(0.88 0.008 75)"
                strokeWidth={0.5 / zoom}
              />
            ))}
          </g>

          <g fill="none">
            {arcs.map((a) => (
              <path
                key={a.key}
                d={a.d}
                stroke="var(--brand)"
                strokeWidth={1 / zoom}
                strokeOpacity={0.45}
                strokeDasharray={`${3 / zoom} ${4 / zoom}`}
              >
                <animate attributeName="stroke-dashoffset" from="0" to={`${-28 / zoom}`} dur="2.5s" repeatCount="indefinite" />
              </path>
            ))}
          </g>

          {projected.map((p, i) => {
            const pt = displayPoints[i];
            const isActive = i === activeDisplayIndex;
            const baseR = (pt.isIndiaCluster ? 7 : pt.isIndiaChild ? 4 : 5) / zoom;
            const haloR = baseR + 5 / zoom;
            return (
              <g
                key={pt.key}
                onMouseEnter={() => { onHover(pt.officeIdx); setMarkerHover(true); }}
                onMouseLeave={() => setMarkerHover(false)}
                className="cursor-pointer"
              >
                <circle cx={p.x} cy={p.y} r={isActive ? haloR + 3 / zoom : haloR} fill="var(--brand)" opacity={isActive ? 0.18 : 0.12}>
                  {isActive && (
                    <>
                      <animate attributeName="r" values={`${haloR};${haloR + 11 / zoom};${haloR}`} dur="2.2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.35;0;0.35" dur="2.2s" repeatCount="indefinite" />
                    </>
                  )}
                </circle>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isActive ? baseR + 1 / zoom : baseR}
                  fill="var(--brand)"
                  stroke="white"
                  strokeWidth={1.5 / zoom}
                />
                {pt.isIndiaCluster && (
                  <circle cx={p.x} cy={p.y} r={2.5 / zoom} fill="white" />
                )}
                <circle cx={p.x} cy={p.y} r={18 / zoom} fill="transparent" />
              </g>
            );
          })}
        </g>
      </svg>

      {/* Zoom controls */}
      <div className="absolute top-3 right-3 flex flex-col gap-1 bg-white/30 backdrop-blur-md border border-white/40 rounded-lg p-0.5 shadow-sm">
        <button
          onClick={() => zoomTo(zoom * 1.5)}
          className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white/40 transition-colors"
          aria-label="Zoom in"
        >
          <Plus className="h-3 w-3 text-ink" />
        </button>
        <button
          onClick={() => zoomTo(zoom / 1.5)}
          className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white/40 transition-colors"
          aria-label="Zoom out"
        >
          <Minus className="h-3 w-3 text-ink" />
        </button>
        <div className="h-px bg-white/30" />
        <button
          onClick={zoomToIndia}
          className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white/40 transition-colors text-[9px] font-semibold text-ink tracking-wider"
          aria-label="Zoom to India"
          title="Zoom to India"
        >
          IN
        </button>
      </div>

      {/* Hint */}
      <div className="absolute bottom-2 left-3 text-[9px] uppercase tracking-[0.18em] text-ink-soft/80 bg-white/20 backdrop-blur-lg border border-white/30 px-2 py-1 rounded-md shadow-sm">
        Scroll to zoom · Drag to pan
      </div>

      {activePoint && activePos && markerHover && (
        <div
          className="absolute pointer-events-none transition-all duration-200"
          style={{
            left: `${(tooltipX / WIDTH) * 100}%`,
            top: `${(tooltipY / HEIGHT) * 100}%`,
            transform: tooltipOnLeft
              ? "translate(calc(-100% - 14px), -50%)"
              : "translate(14px, -50%)",
          }}
        >
          <div className="relative bg-ink text-white rounded-lg px-4 py-2.5 shadow-elevated whitespace-nowrap">
            <span className="text-sm font-semibold tracking-tight">{tooltipLabel}</span>
            <div
              className="absolute top-1/2 -translate-y-1/2 w-0 h-0"
              style={
                tooltipOnLeft
                  ? { right: -5, borderTop: "5px solid transparent", borderBottom: "5px solid transparent", borderLeft: "6px solid var(--ink)" }
                  : { left: -5, borderTop: "5px solid transparent", borderBottom: "5px solid transparent", borderRight: "6px solid var(--ink)" }
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
