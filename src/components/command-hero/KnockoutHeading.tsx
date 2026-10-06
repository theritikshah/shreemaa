import { useId, useImperativeHandle, useRef, type Ref } from "react";
import type { KnockoutLayout, KnockoutLayoutKey } from "./knockoutPaths";
import type { KnockoutFrame } from "./timeline";

export type { KnockoutLayoutKey };

export interface KnockoutHandle {
  /**
   * Writes one frame. `zoom` < 0 hides the overlay (before the transition);
   * `covered` swaps the overlay for the solid background it matches.
   */
  apply(state: { layout: KnockoutLayoutKey; frame: KnockoutFrame | null; titleOpacity: number; covered: boolean }): void;
}

interface KnockoutHeadingProps {
  layouts: Record<KnockoutLayoutKey, KnockoutLayout>;
  overlayColor: string;
  textColor: string;
  handleRef: Ref<KnockoutHandle>;
}

const KEYS: KnockoutLayoutKey[] = ["desktop", "mobile"];

/**
 * The oversized text-cutout transition.
 *
 * Overlay: a dark rect masked by an SVG luminance mask — white keeps the
 * overlay, black letter outlines cut holes through it, so the particle scene
 * shows only through the letters. Title: the same outlines, filled solid,
 * fading in on top. Both share one transform per frame, so they can never
 * drift apart.
 *
 * Decorative: the heading is announced once by a real <h2> elsewhere.
 */
export function KnockoutHeading({ layouts, overlayColor, textColor, handleRef }: KnockoutHeadingProps) {
  // useId output contains ":" characters, which are awkward in url(#…).
  const maskId = `command-knockout-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const overlayRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const maskGroups = useRef<Partial<Record<KnockoutLayoutKey, SVGGElement | null>>>({});
  const titleGroups = useRef<Partial<Record<KnockoutLayoutKey, SVGGElement | null>>>({});

  useImperativeHandle(
    handleRef,
    () => ({
      apply({ layout, frame, titleOpacity, covered }) {
        const overlay = overlayRef.current;
        const end = endRef.current;
        const title = titleRef.current;
        if (!overlay || !end || !title) return;

        const transform = frame ? `translate(${frame.x.toFixed(3)} ${frame.y.toFixed(3)}) scale(${frame.scale.toFixed(5)})` : "";
        for (const key of KEYS) {
          const active = key === layout;
          for (const group of [maskGroups.current[key], titleGroups.current[key]]) {
            if (!group) continue;
            group.style.display = active ? "" : "none";
            if (active && transform) group.setAttribute("transform", transform);
          }
        }

        overlay.style.visibility = frame && !covered ? "visible" : "hidden";
        // A solid layer that darkens the scene seen through the letters as
        // the heading fills in, then stands in for the overlay once covered.
        end.style.opacity = frame ? String(covered ? 1 : titleOpacity) : "0";
        title.style.opacity = frame ? String(titleOpacity) : "0";
      },
    }),
    [],
  );

  return (
    <>
      <div ref={endRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 opacity-0" style={{ backgroundColor: overlayColor }} />
      <div ref={overlayRef} aria-hidden="true" className="pointer-events-none invisible absolute inset-0 z-30">
        <svg className="block size-full" focusable="false">
          <defs>
            <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
              <rect width="100%" height="100%" fill="white" />
              {KEYS.map((key) => (
                <g key={key} ref={(el) => { maskGroups.current[key] = el; }} style={{ display: "none" }}>
                  <path d={layouts[key].d} fill="black" />
                </g>
              ))}
            </mask>
          </defs>
          <rect width="100%" height="100%" fill={overlayColor} mask={`url(#${maskId})`} />
        </svg>
      </div>
      <div ref={titleRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-40 opacity-0">
        <svg className="block size-full" focusable="false">
          {KEYS.map((key) => (
            <g key={key} ref={(el) => { titleGroups.current[key] = el; }} style={{ display: "none" }}>
              <path d={layouts[key].d} fill={textColor} />
            </g>
          ))}
        </svg>
      </div>
    </>
  );
}
