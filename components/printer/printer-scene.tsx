"use client";

import { useEffect, useRef } from "react";
import { Chip, Note } from "@/components/home/hero-cashy";
import { asset, cn } from "@/lib/utils";

// The NVDA Tower from Base City, redrawn flat: four stepped blocks with Cashy-green glow bands,
// a white strip and a vertical NVDA sign, crowned with a chip whose core glows.
const GREEN = "#a9dd8c";
const NAVY = "#0a1040";
const PALE = "#c7c7ff";
const CX = 210;
const GROUND = 480;

// [width, height] of each block from the bottom up (Base City's proportions: 3.2, 2.8, 2.4, 2.0 wide).
const BLOCKS: [number, number][] = [
  [83, 108],
  [73, 90],
  [62, 72],
  [52, 58],
];

/** Where each block sits, worked out once from the sizes above. */
const STACK = (() => {
  let y = GROUND - 18; // the base slab is 18 tall
  return BLOCKS.map(([w, h]) => {
    y -= h;
    return { w, h, top: y };
  });
})();
const CROWN_Y = STACK[STACK.length - 1].top - 13; // top of the neck, under the chip

/** Pretend-random but fixed, so server and browser draw the same windows. */
const windows = (() => {
  const out: { x: number; y: number; delay: number; flicker: boolean }[] = [];
  let seed = 8453;
  const next = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
  for (const { w, h, top } of STACK) {
    const cols = Math.floor((w - 12) / 11);
    const rows = Math.floor((h - 12) / 14);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const roll = next();
        if (roll < 0.34) continue; // dark window
        out.push({
          x: CX - (cols * 11 - 4) / 2 + c * 11,
          y: top + 9 + r * 14,
          delay: Math.round(next() * 40) / 10,
          flicker: roll > 0.8,
        });
      }
    }
  }
  return out;
})();

const FALLING = [
  { kind: "chip", x: -30, dx: -40, delay: 0, tilt: -30 },
  { kind: "note", x: 12, dx: 22, delay: 1.3, tilt: 40 },
  { kind: "chip", x: 40, dx: 60, delay: 2.6, tilt: 25 },
  { kind: "note", x: -8, dx: -20, delay: 3.9, tilt: -45 },
  { kind: "note", x: 28, dx: 36, delay: 5.2, tilt: 30 },
  { kind: "chip", x: -44, dx: -64, delay: 6.5, tilt: -20 },
] as const;

/**
 * The Printer page's picture: the NVDA Tower lit up at night, Cashy at its foot looking over it,
 * and payday items drifting down from the chip. CSS only, paused off-screen, still for reduced motion.
 */
export function PrinterScene({ alt, className }: { alt: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => el.classList.toggle("is-paused", !entry.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} role="img" aria-label={alt} className={cn("printer-scene is-paused relative isolate mx-auto w-full max-w-[460px]", className)} style={{ aspectRatio: "420 / 520" }}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[-10%] -z-10 blur-3xl"
        style={{ background: "radial-gradient(ellipse at 50% 55%, rgb(0 0 255 / 0.5), rgb(0 0 255 / 0.14) 50%, transparent 72%)" }}
      />

      <svg viewBox="0 0 420 520" className="absolute inset-0 size-full" aria-hidden>
        {/* the quiet city behind: dark blocks with a few lit windows */}
        {[
          [14, 330, 56, 150],
          [78, 380, 44, 100],
          [302, 360, 50, 120],
          [358, 316, 52, 164],
        ].map(([x, y, w, h]) => (
          <g key={x} opacity="0.9">
            <rect x={x} y={y} width={w} height={h} fill="#0b1330" />
            {Array.from({ length: Math.floor(h / 26) }, (_, r) => (
              <rect key={r} x={x + 8 + ((r * 17) % (w - 22))} y={y + 10 + r * 22} width="5" height="7" fill="#1c2f7a" />
            ))}
          </g>
        ))}

        {/* the ground */}
        <rect x="0" y={GROUND} width="420" height="40" fill="#05070d" />
        <path d={`M0 ${GROUND + 1.5}H420`} stroke="#0000ff" strokeWidth="3" />

        {/* the tower */}
        <rect x={CX - 49.5} y={GROUND - 18} width="99" height="18" fill={NAVY} stroke="#1c2f7a" strokeWidth="1.5" />
        {STACK.map(({ w, h, top }, i) => (
          <g key={i}>
            <rect x={CX - w / 2} y={top} width={w} height={h} fill={NAVY} stroke="#2a43a8" strokeWidth="1.5" />
            {/* the green glow band round the top of each block, with a wider soft one under it */}
            <rect x={CX - w / 2 - 7} y={top - 5} width={w + 14} height="10" rx="3" fill={GREEN} opacity="0.18" className="printer-band" style={{ animationDelay: `${i * 0.5}s` }} />
            <rect x={CX - w / 2 - 4} y={top - 2.5} width={w + 8} height="5" rx="1.5" fill={GREEN} className="printer-band" style={{ animationDelay: `${i * 0.5}s` }} />
          </g>
        ))}
        {windows.map((win, i) => (
          <rect key={i} x={win.x} y={win.y} width="7" height="9" fill={PALE} opacity="0.95" className={win.flicker ? "printer-win" : undefined} style={win.flicker ? { animationDelay: `${win.delay}s` } : undefined} />
        ))}

        {/* the white strip down the middle of the lowest block, and the NVDA sign on the second */}
        <rect x={CX - 7} y={STACK[0].top} width="14" height={STACK[0].h} fill="#f2f4f8" opacity="0.92" />
        <rect x={CX - 14} y={STACK[1].top + 8} width="28" height="74" rx="3" fill="#000033" stroke={GREEN} strokeWidth="2" />
        {["N", "V", "D", "A"].map((ch, i) => (
          <text key={ch} x={CX} y={STACK[1].top + 25 + i * 17} textAnchor="middle" fontSize="16" fontWeight="800" fill={GREEN} fontFamily="system-ui, sans-serif">
            {ch}
          </text>
        ))}

        {/* the crown: a neck, then a chip seen from above at an angle, circuit traces and a glowing core */}
        <rect x={CX - 17} y={CROWN_Y} width="34" height="13" fill="#080d38" stroke="#1c2f7a" strokeWidth="1.5" />
        <polygon points={`${CX - 62},${CROWN_Y - 4} ${CX},${CROWN_Y + 14} ${CX},${CROWN_Y + 24} ${CX - 62},${CROWN_Y + 6}`} fill="#05071f" stroke={GREEN} strokeWidth="1.5" />
        <polygon points={`${CX + 62},${CROWN_Y - 4} ${CX},${CROWN_Y + 14} ${CX},${CROWN_Y + 24} ${CX + 62},${CROWN_Y + 6}`} fill="#080d38" stroke={GREEN} strokeWidth="1.5" />
        <polygon points={`${CX},${CROWN_Y - 22} ${CX + 62},${CROWN_Y - 4} ${CX},${CROWN_Y + 14} ${CX - 62},${CROWN_Y - 4}`} fill="#080d38" stroke={GREEN} strokeWidth="1.5" />
        <g stroke={GREEN} strokeWidth="1.2" fill="none" opacity="0.9">
          {[-36, -24, -12, 12, 24, 36].map((o) => (
            <path key={o} d={`M${CX + o} ${CROWN_Y - 4 + Math.abs(o) * 0.0 - 9 + o * 0.28}L${CX + o * 0.35} ${CROWN_Y - 4 + o * 0.1}`} />
          ))}
        </g>
        <polygon points={`${CX},${CROWN_Y - 14} ${CX + 20},${CROWN_Y - 4} ${CX},${CROWN_Y + 6} ${CX - 20},${CROWN_Y - 4}`} fill="#eaffdc" className="printer-core" />
        <ellipse cx={CX} cy={CROWN_Y - 6} rx="58" ry="30" fill="#c9f5ae" opacity="0.16" className="printer-halo" />
      </svg>

      {/* payday: certificates and chips drifting down from the crown */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {FALLING.map((f, i) => (
          <span key={i} className="printer-fall absolute left-1/2" style={{ top: `${((CROWN_Y - 6) / 520) * 100}%`, "--x": `${f.x}px`, "--dx": `${f.dx}px`, "--tilt": `${f.tilt}deg`, animationDelay: `${f.delay}s` } as React.CSSProperties}>
            {f.kind === "note" ? <Note /> : <Chip label="NVDA" />}
          </span>
        ))}
      </div>

      {/* Cashy at the foot of the tower, looking over it */}
      <div aria-hidden className="printer-cashy absolute bottom-[1%] left-[4%] w-[33%]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/art/cashy-standing.webp")} alt="" width={670} height={983} loading="lazy" decoding="async" className="h-auto w-full" />
      </div>
    </div>
  );
}
