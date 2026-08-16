"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { geoMercator, geoPath } from "d3-geo";
import type { FeatureCollection, Feature, Geometry } from "geojson";
import { Plus, Minus, RotateCcw } from "lucide-react";

// India per official boundaries (includes PoK / Aksai Chin). Datameet composite.
const INDIA_GEOJSON_URL =
  "https://cdn.jsdelivr.net/gh/datameet/maps@master/Country/india-composite.geojson";

type Loc = {
  city: string;
  state: string;
  coords: [number, number]; // [lng, lat]
  fcs: { code: string; type: string }[];
};

const LOCATIONS: Loc[] = [
  { city: "Guwahati", state: "Assam", coords: [91.74, 26.14], fcs: [
    { code: "GAX1", type: "IXD" }, { code: "SGAC", type: "H&B" },
  ]},
  { city: "Patna", state: "Bihar", coords: [85.13, 25.59], fcs: [
    { code: "PAX1", type: "IXD" }, { code: "SPAB", type: "H&B" },
  ]},
  { city: "Delhi", state: "Delhi", coords: [77.24, 28.61], fcs: [
    { code: "DEX3", type: "FC" }, { code: "PNQ2", type: "FC" },
    { code: "DEX8", type: "FC" }, { code: "DED1", type: "FC" },
  ]},
  { city: "Ahmedabad", state: "Gujarat", coords: [72.57, 23.02], fcs: [
    { code: "SAME", type: "H&B" },
  ]},
  { city: "Gurgaon", state: "Haryana", coords: [77.03, 28.46], fcs: [
    { code: "DED3", type: "IXD" }, { code: "DEL4", type: "FC" },
    { code: "DEL5", type: "FC" }, { code: "DED4", type: "FC" },
    { code: "DED5", type: "IXD" }, { code: "SDEG", type: "H&B" },
    { code: "HBX1", type: "H&B IXD" },
  ]},
  { city: "Bengaluru", state: "Karnataka", coords: [77.59, 13.0], fcs: [
    { code: "BLR4", type: "IXD" }, { code: "BLR7", type: "FC" },
    { code: "BLR8", type: "FC" },
  ]},
  { city: "Hubli", state: "Karnataka", coords: [75.12, 15.36], fcs: [
    { code: "SBLB", type: "H&B" },
  ]},
  { city: "Kolar", state: "Karnataka", coords: [78.13, 13.13], fcs: [
    { code: "BLX1", type: "H&B" },
  ]},
  { city: "Bhiwandi", state: "Maharashtra", coords: [73.06, 19.30], fcs: [
    { code: "BOM5", type: "FC" }, { code: "BOM7", type: "FC" },
    { code: "ISK3", type: "IXD" }, { code: "SBOB", type: "H&B" },
  ]},
  { city: "Pune", state: "Maharashtra", coords: [73.85, 18.52], fcs: [
    { code: "PNQ3", type: "FC" }, { code: "SPUN", type: "H&B" },
  ]},
  { city: "Bhopal", state: "Madhya Pradesh", coords: [77.41, 23.26], fcs: [
    { code: "SBHF", type: "H&B" },
  ]},
  { city: "Indore", state: "Madhya Pradesh", coords: [75.86, 22.72], fcs: [
    { code: "IDX2", type: "FC" },
  ]},
  { city: "Ludhiana", state: "Punjab", coords: [75.85, 30.90], fcs: [
    { code: "ATX1", type: "FC" },
  ]},
  { city: "Rajpura", state: "Punjab", coords: [76.59, 30.48], fcs: [
    { code: "LDX1", type: "FC" }, { code: "SATF", type: "H&B" },
  ]},
  { city: "Jaipur", state: "Rajasthan", coords: [75.79, 26.91], fcs: [
    { code: "JPX1", type: "FC" }, { code: "JPX2", type: "FC" },
  ]},
  { city: "Hyderabad", state: "Telangana", coords: [78.49, 17.39], fcs: [
    { code: "HYD3", type: "FC" }, { code: "HYD8", type: "FC" },
    { code: "SHTX", type: "H&B" }, { code: "SHTI", type: "H&B" },
  ]},
  { city: "Coimbatore", state: "Tamil Nadu", coords: [76.96, 11.01], fcs: [
    { code: "SCJF", type: "H&B" },
  ]},
  { city: "Chennai", state: "Tamil Nadu", coords: [80.09, 13.14], fcs: [
    { code: "SMAB", type: "H&B" },
  ]},
  { city: "Kolkata", state: "West Bengal", coords: [88.31, 22.59], fcs: [
    { code: "SCCE", type: "H&B" }, { code: "CCX1", type: "FC" },
    { code: "CCX2", type: "FC" },
  ]},
  { city: "Lucknow", state: "Uttar Pradesh", coords: [80.95, 26.85], fcs: [
    { code: "SLKF", type: "H&B" },
  ]},
  { city: "Vijayawada", state: "Andhra Pradesh", coords: [80.65, 16.51], fcs: [
    { code: "SVTZ", type: "H&B" },
  ]},
];

const WIDTH = 520;
const HEIGHT = 580;
const MIN_ZOOM = 1;
const MAX_ZOOM = 6;

export function IndiaFCMap() {
  const [india, setIndia] = useState<Feature<Geometry> | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  const [zoom, setZoom] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const dragRef = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    setMounted(true);
    let cancel = false;
    fetch(INDIA_GEOJSON_URL)
      .then((r) => r.json())
      .then((d: FeatureCollection | Feature) => {
        if (cancel) return;
        if ((d as FeatureCollection).type === "FeatureCollection") {
          const fc = d as FeatureCollection;
          setIndia(fc.features[0] as Feature<Geometry>);
        } else {
          setIndia(d as Feature<Geometry>);
        }
      })
      .catch(() => {});
    return () => { cancel = true; };
  }, []);

  const { indiaPath, projection } = useMemo(() => {
    if (!india) return { indiaPath: "", projection: null as ReturnType<typeof geoMercator> | null };
    const proj = geoMercator().fitExtent([[16, 16], [WIDTH - 16, HEIGHT - 16]], india);
    const path = geoPath(proj);
    return { indiaPath: path(india) ?? "", projection: proj };
  }, [india]);

  const points = useMemo(() => {
    if (!projection) return [] as { x: number; y: number; loc: Loc }[];
    return LOCATIONS.map((loc) => {
      const p = projection(loc.coords);
      return { x: p?.[0] ?? 0, y: p?.[1] ?? 0, loc };
    });
  }, [projection]);

  const clampPan = (z: number, x: number, y: number) => {
    const maxPan = (z - 1) * Math.max(WIDTH, HEIGHT);
    return [
      Math.max(-maxPan, Math.min(maxPan, x)),
      Math.max(-maxPan, Math.min(maxPan, y)),
    ] as const;
  };

  const svgPoint = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return [WIDTH / 2, HEIGHT / 2] as const;
    const rect = svg.getBoundingClientRect();
    return [
      ((clientX - rect.left) / rect.width) * WIDTH,
      ((clientY - rect.top) / rect.height) * HEIGHT,
    ] as const;
  };

  const zoomTo = (next: number, fx = WIDTH / 2, fy = HEIGHT / 2) => {
    const z = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, next));
    const k = z / zoom;
    const nx = fx - (fx - tx) * k;
    const ny = fy - (fy - ty) * k;
    const [cx, cy] = clampPan(z, nx, ny);
    setZoom(z); setTx(cx); setTy(cy);
  };

  const reset = () => { setZoom(1); setTx(0); setTy(0); };

  return (
    <div className="relative w-full max-w-[520px] mx-auto select-none" style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}>
      {mounted && (
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
          onMouseDown={(e) => { dragRef.current = { x: e.clientX, y: e.clientY, tx, ty }; setIsDragging(true); }}
          onMouseMove={(e) => {
            if (!dragRef.current) return;
            const svg = svgRef.current;
            if (!svg) return;
            const rect = svg.getBoundingClientRect();
            const dx = ((e.clientX - dragRef.current.x) / rect.width) * WIDTH;
            const dy = ((e.clientY - dragRef.current.y) / rect.height) * HEIGHT;
            const [cx, cy] = clampPan(zoom, dragRef.current.tx + dx, dragRef.current.ty + dy);
            setTx(cx); setTy(cy);
          }}
          onMouseUp={() => { dragRef.current = null; setIsDragging(false); }}
          onMouseLeave={() => { dragRef.current = null; setIsDragging(false); setHover(null); }}
        >
          <defs>
            <radialGradient id="fc-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
            </radialGradient>
          </defs>

          <g transform={`translate(${tx} ${ty}) scale(${zoom})`}>
            {indiaPath && (
              <path
                d={indiaPath}
                fill="oklch(0.96 0.005 75)"
                stroke="oklch(0.82 0.01 75)"
                strokeWidth={0.8 / zoom}
              />
            )}

            {points.map((p, i) => {
              const r = (3.5 + Math.min(p.loc.fcs.length, 6) * 0.8) / zoom;
              const isHover = hover === i;
              return (
                <g
                  key={p.loc.city}
                  onMouseEnter={() => setHover(i)}
                  className="cursor-pointer"
                >
                  <circle cx={p.x} cy={p.y} r={(r + 7)} fill="url(#fc-glow)" />
                  <circle cx={p.x} cy={p.y} r={r + 2 / zoom} fill="var(--brand)" opacity={isHover ? 0.18 : 0.08}>
                    <animate attributeName="r" values={`${r + 1 / zoom};${r + 5 / zoom};${r + 1 / zoom}`} dur="2.6s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.14;0;0.14" dur="2.6s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={p.x} cy={p.y} r={r} fill="var(--brand)" stroke="white" strokeWidth={1 / zoom} />
                  <circle cx={p.x} cy={p.y} r={r * 0.35} fill="white" />
                  <circle cx={p.x} cy={p.y} r={(14 / zoom)} fill="transparent" />
                </g>
              );
            })}
          </g>
        </svg>
      )}

      {/* Zoom controls */}
      <div className="absolute top-3 right-3 flex flex-col gap-1 bg-white/70 backdrop-blur-md border border-line rounded-lg p-0.5 shadow-sm">
        <button onClick={() => zoomTo(zoom * 1.5)} className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white transition" aria-label="Zoom in">
          <Plus className="h-3 w-3 text-ink" />
        </button>
        <button onClick={() => zoomTo(zoom / 1.5)} className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white transition" aria-label="Zoom out">
          <Minus className="h-3 w-3 text-ink" />
        </button>
        <div className="h-px bg-line" />
        <button onClick={reset} className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white transition" aria-label="Reset">
          <RotateCcw className="h-3 w-3 text-ink" />
        </button>
      </div>

      {/* Tooltip */}
      {hover !== null && points[hover] && (() => {
        const p = points[hover];
        const sx = p.x * zoom + tx;
        const sy = p.y * zoom + ty;
        const leftPct = (sx / WIDTH) * 100;
        const topPct = (sy / HEIGHT) * 100;
        const onLeft = leftPct > 65;
        return (
          <div
            className="absolute z-10 pointer-events-none"
            style={{
              left: `${leftPct}%`,
              top: `${topPct}%`,
              transform: `translate(${onLeft ? "-105%" : "5%"}, -50%)`,
            }}
          >
            <div className="rounded-xl bg-ink text-white px-4 py-3 shadow-xl border border-white/10 min-w-[200px]">
              <div className="text-[11px] uppercase tracking-[0.18em] text-white/60">{p.loc.state}</div>
              <div className="text-sm font-semibold mt-0.5">{p.loc.city}</div>
              <div className="mt-2 flex flex-wrap gap-1">
                {p.loc.fcs.map((fc) => (
                  <span key={fc.code} className="text-[10px] bg-white/15 px-1.5 py-0.5 rounded">
                    {fc.code}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      })()}


      <div className="absolute bottom-3 right-3 text-[9px] uppercase tracking-[0.18em] text-ink-soft/70 bg-white/70 backdrop-blur border border-line px-2 py-1 rounded-md">
        Scroll · Drag
      </div>
    </div>
  );
}
