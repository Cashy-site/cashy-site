import { cn } from "@/lib/utils";

// The same little pixel Cashy as the Arcade previews: green note head with shades, Base-blue tee.
const ROWS = ["GGGGGGG", "GKKGKKG", "GGGGGGG", ".BBBBB.", "BBBWBBB", ".BBBBB.", ".W...W."];
const COLOUR: Record<string, string> = { G: "#a9dd8c", K: "#05070d", B: "#4d4dff", W: "#ffffff" };

/** A tiny Cashy hopping on the stop the roadmap is at now. Transform only; still for reduced motion. */
export function JumpingCashy({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <span aria-hidden className={cn("pointer-events-none block h-7 w-7", className)} style={style}>
      <span className="jumping-cashy-shadow absolute inset-x-0.5 -bottom-0.5 h-1 rounded-full bg-black/60" />
      <svg viewBox="0 0 7 7" shapeRendering="crispEdges" className="jumping-cashy absolute inset-0 size-full">
        {ROWS.flatMap((row, y) =>
          [...row].map((ch, x) => (ch === "." ? null : <rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" fill={COLOUR[ch]} />)),
        )}
      </svg>
    </span>
  );
}
