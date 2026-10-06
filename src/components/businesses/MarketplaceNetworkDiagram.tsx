"use client";

import { useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { motion } from "framer-motion";
import { Boxes, Layers, MapPin, Megaphone, PackageCheck, RefreshCw, Sparkles } from "lucide-react";

export interface NetworkMarketplace {
  name: string;
  appLogo: StaticImageData;
  /** The icon is a full-bleed tile: crop it to fill its slot, unpadded. */
  appLogoFill?: boolean;
  subtitle: string;
}

/*
 * Desktop node graph: marketplaces → Demand → operations hub → Fulfillment → FCs.
 *
 * Everything is laid out on a fixed STAGE_W × STAGE_H stage in one coordinate
 * system: each node is positioned by its centre at the same point its SVG path
 * ends on, so the lines always meet the cards. The stage is then scaled as a
 * whole to fit the container, instead of letting the SVG and the cards scale
 * independently (which is what pulled them apart).
 */
const STAGE_W = 1000;
const STAGE_H = 480;
const MID_Y = STAGE_H / 2;

const DEMAND_X = 262;
const FULFILL_X = 738;
const NODE_W = 150;
const LEFT_NODE_X = 20;
const LEFT_EDGE_X = LEFT_NODE_X + NODE_W;
const RIGHT_NODE_X = STAGE_W - 20 - NODE_W;
const HUB_W = 290;

const fulfillmentNodes = [
  { title: "FBA & FBF FCs", sub: "Prime & Assured", icon: PackageCheck, y: 80 },
  { title: "4x Seller Flex", sub: "Peak-event buffer", icon: Sparkles, y: MID_Y },
  { title: "22-State APOBs", sub: "~80% Pincode SLA", icon: MapPin, y: 400 },
];

const hubRows = [
  { icon: Layers, label: "Catalog & A+ Content", tag: "Live SEO", tagClass: "bg-emerald-400/15 text-emerald-300" },
  { icon: Megaphone, label: "Performance Ads & DSP", tag: "Full-Funnel", tagClass: "bg-blue-400/15 text-blue-300" },
  { icon: Boxes, label: "Demand & Inventory", tag: "22 States", tagClass: "bg-amber-400/15 text-amber-300" },
];

/** Horizontal S-curve between two points, bending at the midpoint. */
function curve(x1: number, y1: number, x2: number, y2: number) {
  const mx = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
}

export function MarketplaceNetworkDiagram({ marketplaces }: { marketplaces: NetworkMarketplace[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setScale(Math.min(1, entry.contentRect.width / STAGE_W));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Spread the marketplace cards evenly down the stage.
  const step = (STAGE_H - 80) / Math.max(1, marketplaces.length - 1);
  const leftNodeYs = marketplaces.map((_, i) => 40 + i * step);

  return (
    <div ref={wrapRef} className="relative mx-auto mt-12 hidden max-w-6xl md:block" style={{ height: STAGE_H * scale }}>
      <div
        className="absolute left-1/2 top-0"
        style={{
          width: STAGE_W,
          height: STAGE_H,
          transform: `translateX(-50%) scale(${scale})`,
          transformOrigin: "top center",
        }}
      >
        <svg
          className="pointer-events-none absolute inset-0 overflow-visible"
          width={STAGE_W}
          height={STAGE_H}
          viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
          fill="none"
          aria-hidden="true"
        >
          {/* Marketplaces → Demand */}
          {leftNodeYs.map((y) => (
            <path key={y} d={curve(LEFT_EDGE_X, y, DEMAND_X, MID_Y)} stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" className="network-dash" />
          ))}
          {/* Demand → hub → Fulfillment (the hub card sits over the middle) */}
          <path
            d={`M ${DEMAND_X} ${MID_Y} L ${FULFILL_X} ${MID_Y}`}
            stroke="#FE0000"
            strokeOpacity="0.7"
            strokeWidth="2"
            className="network-dash"
          />
          {/* Fulfillment → FC nodes */}
          {fulfillmentNodes.map((n) => (
            <path key={n.title} d={curve(FULFILL_X, MID_Y, RIGHT_NODE_X, n.y)} stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" className="network-dash" />
          ))}

          {/* Anchor dots where each line meets a card */}
          {leftNodeYs.map((y) => (
            <circle key={y} cx={LEFT_EDGE_X} cy={y} r="3" fill="#130e0b" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" />
          ))}
          {fulfillmentNodes.map((n) => (
            <circle key={n.title} cx={RIGHT_NODE_X} cy={n.y} r="3" fill="#130e0b" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" />
          ))}
          <circle cx={STAGE_W / 2 - HUB_W / 2} cy={MID_Y} r="3.5" fill="#FE0000" />
          <circle cx={STAGE_W / 2 + HUB_W / 2} cy={MID_Y} r="3.5" fill="#FE0000" />
        </svg>

        {/* LEFT NODES: ACTIVE MARKETPLACES */}
        {marketplaces.map((m, i) => (
          <div key={m.name} className="absolute z-10 -translate-y-1/2" style={{ left: LEFT_NODE_X, top: leftNodeYs[i], width: NODE_W }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              whileHover={{ scale: 1.05, x: 3 }}
              className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-white/10 bg-[#1b1512] p-2 transition-colors hover:border-brand/50"
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white ${m.appLogoFill ? "" : "p-1"}`}
              >
                <Image
                  src={m.appLogo}
                  alt={m.name}
                  className={m.appLogoFill ? "h-full w-full object-cover" : "h-5 w-5 object-contain"}
                />
              </div>
              <div className="overflow-hidden">
                <div className="truncate text-xs font-bold leading-tight text-white">{m.name}</div>
                <div className="truncate text-[9px] font-medium text-white/50">{m.subtitle}</div>
              </div>
            </motion.div>
          </div>
        ))}

        {/* LEFT JUNCTION: DEMAND BADGE (centred on the junction point) */}
        <div className="absolute z-20 -translate-x-1/2 -translate-y-1/2" style={{ left: DEMAND_X, top: MID_Y }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/15 bg-[#241d19] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xl"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Demand</span>
          </motion.div>
        </div>

        {/* CENTER CARD: OPERATIONS HUB (centred on the stage) */}
        <div className="absolute z-20 -translate-x-1/2 -translate-y-1/2" style={{ left: STAGE_W / 2, top: MID_Y, width: HUB_W }}>
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-white/10 bg-[#1b1512] p-5 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6)]"
          >
            {/* TOP OPERATIONAL CONTROL HEADER */}
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2.5 text-xs text-white/80">
              <Sparkles className="h-4 w-4 shrink-0 text-accent animate-spin-slow" />
              <span className="truncate font-medium text-white/70">
                Shri Maa <span className="font-semibold text-white">Operations Desk</span>
              </span>
            </div>

            {/* CORE CAPABILITIES */}
            <div className="mt-5 space-y-2.5">
              {hubRows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2.5 text-[11px] font-medium text-white/80"
                >
                  <div className="flex items-center gap-2">
                    <row.icon className="h-4 w-4 shrink-0 text-accent" />
                    <span>{row.label}</span>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${row.tagClass}`}>{row.tag}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* RIGHT JUNCTION: FULFILLMENT BADGE (centred on the junction point) */}
        <div className="absolute z-20 -translate-x-1/2 -translate-y-1/2" style={{ left: FULFILL_X, top: MID_Y }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/15 bg-[#241d19] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xl"
          >
            <RefreshCw className="h-3 w-3 text-accent animate-spin-slow" />
            <span>Fulfillment</span>
          </motion.div>
        </div>

        {/* RIGHT NODES: MULTI-STATE FULFILLMENT NETWORK */}
        {fulfillmentNodes.map((fn, i) => (
          <div key={fn.title} className="absolute z-10 -translate-y-1/2" style={{ left: RIGHT_NODE_X, top: fn.y, width: NODE_W }}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ scale: 1.05, x: -3 }}
              className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-[#1b1512] p-2.5 transition-colors hover:border-brand/50"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-brand/20 bg-brand/10 p-1.5 text-accent shadow-2xs">
                <fn.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold leading-tight text-white">{fn.title}</div>
                <div className="text-[10px] font-medium text-white/50">{fn.sub}</div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
