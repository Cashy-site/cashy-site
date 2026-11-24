"use client";

import { useSyncExternalStore } from "react";
import site from "@/content/site.json";

const DAY = 86_400_000;

/** A clock that ticks once a second. The server renders 0, so the first paint is a placeholder, not a wrong time. */
function useSecond() {
  return useSyncExternalStore(
    (onChange) => {
      const timer = window.setInterval(onChange, 1000);
      return () => window.clearInterval(timer);
    },
    () => Math.floor(Date.now() / 1000),
    () => 0,
  );
}

/** The next time the daily payout runs, as a timestamp: today at site.paydayUtc (UTC), or tomorrow's if that has passed. */
function nextPayday(now: number) {
  const [h, m] = site.paydayUtc.split(":").map(Number);
  const d = new Date(now);
  let t = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), h, m);
  if (t <= now) t += DAY;
  return t;
}

const two = (n: number) => String(n).padStart(2, "0");

/**
 * "Stock rewards": a live countdown to the next daily NVDA payout, in the visitor's own time zone.
 * TODO: show the amount that will be paid out once there is a Payday feed (paydayDataUrl).
 */
export function PayoutCountdown({ className }: { className?: string }) {
  const second = useSecond();
  const ready = second > 0;
  const now = second * 1000;
  const next = ready ? nextPayday(now) : 0;
  const left = ready ? Math.max(0, Math.round((next - now) / 1000)) : 0;
  const clock = ready ? `${two(Math.floor(left / 3600))}:${two(Math.floor((left % 3600) / 60))}:${two(left % 60)}` : "--:--:--";
  const when = ready ? new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(next)) : " ";

  return (
    <section aria-labelledby="payout-title" className={className}>
      <div className="rounded-2xl border border-t-4 border-paper/10 border-t-green bg-night/70 p-5 md:p-6">
        <div className="flex items-center gap-4">
          <span aria-hidden className="grid size-12 shrink-0 place-items-center rounded-xl bg-green font-display text-lg font-extrabold text-ink shadow-[0_0_24px_rgb(169_221_140_/_0.45)]">
            N
          </span>
          <div>
            <h2 id="payout-title" className="font-display text-xl font-bold text-paper md:text-2xl">
              Stock rewards
            </h2>
            <p className="text-sm text-mist md:text-base">Holders earn NVDA stock daily</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-paper/15 pt-5">
          <div>
            <p className="text-mist">Next payday in</p>
            <p className="mt-1 text-sm text-mist/80" suppressHydrationWarning>
              {when}
            </p>
          </div>
          {/* role="timer" keeps it from being read out every second */}
          <p role="timer" aria-label="Time until the next payday" className="rounded-full border-2 border-dashed border-paper/40 px-5 py-2 font-mono text-2xl font-bold text-paper tabular-nums md:text-3xl">
            {clock}
          </p>
        </div>
        <p className="mt-4 text-sm text-mist">Rewards go out once a day, and can take a little while to arrive.</p>
      </div>
    </section>
  );
}
