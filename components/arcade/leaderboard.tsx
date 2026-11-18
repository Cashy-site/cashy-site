"use client";

import { useEffect, useState } from "react";
import pages from "@/content/pages.json";
import site from "@/content/site.json";
import { cn } from "@/lib/utils";

type Board = { id: string; label: string; unit: string };
type Entry = { rank: number; name: string; named: boolean; value: number; tag: string };
type Period = "week" | "all";
type State = { key: string; status: "loading" | "ready" | "offline"; top: Entry[]; weekEnds?: number };

const copy = pages.arcade.leaderboard;
const REFRESH_MS = 60_000;

function resetsIn(weekEnds: number) {
  const ms = Math.max(0, weekEnds - Date.now());
  const days = Math.floor(ms / 86_400_000);
  const hours = Math.floor((ms % 86_400_000) / 3_600_000);
  return days > 0 ? `${days}d ${hours}h` : `${hours}h ${Math.floor((ms % 3_600_000) / 60_000)}m`;
}

const toggle = (on: boolean) =>
  cn(
    "h-10 rounded-full border-2 px-4 font-display text-sm font-semibold transition-colors duration-150 md:text-base",
    on ? "border-blue bg-blue text-paper" : "border-paper/30 text-paper hover:border-blue hover:bg-blue focus-visible:border-blue focus-visible:bg-blue",
  );

// #1 in Cashy green, #2 and #3 in the two Base tints.
const MEDAL = ["bg-green text-ink", "bg-blue-pale text-ink", "bg-blue-mid text-paper"];

/** The live top 10 for one game, from the Cashy leaderboard API. Shown under the game on its page. */
export function Leaderboard({ game, boards, prizes, title = copy.title }: { game: string; boards: Board[]; prizes: string; title?: string }) {
  const [board, setBoard] = useState(boards[0].id);
  const [period, setPeriod] = useState<Period>("week");
  const key = `${board}|${period}`;
  const [loaded, setLoaded] = useState<State>({ key: "", status: "loading", top: [] });
  // Until the board for the current tabs arrives, show "loading" rather than the previous board.
  const state: State = loaded.key === key ? loaded : { key, status: "loading", top: [] };
  const unit = boards.find((b) => b.id === board)?.unit ?? "";

  useEffect(() => {
    let live = true;
    const load = async () => {
      try {
        const res = await fetch(`${site.leaderboardApi}/v1/board?game=${game}&board=${board}&period=${period}&limit=10`, { credentials: "omit" });
        if (!res.ok) throw new Error(String(res.status));
        const data = await res.json();
        if (live) setLoaded({ key: `${board}|${period}`, status: "ready", top: data.top, weekEnds: data.weekEnds });
      } catch {
        // Keep showing the last good board if a refresh fails.
        if (live) setLoaded((s) => (s.key === `${board}|${period}` && s.top.length ? s : { key: `${board}|${period}`, status: "offline", top: [] }));
      }
    };
    load();
    const timer = window.setInterval(() => document.visibilityState === "visible" && load(), REFRESH_MS);
    return () => {
      live = false;
      window.clearInterval(timer);
    };
  }, [game, board, period]);

  const podium = state.top.slice(0, 3);
  const rest = state.top.slice(3);

  return (
    <section aria-labelledby={`${game}-leaderboard`} className="mt-6 grid items-start gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
      <div className="rounded-2xl border-[3px] border-blue bg-ink/85 p-5 shadow-[0_4px_36px_rgb(0_0_255_/_0.35)] md:p-7">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <h2 id={`${game}-leaderboard`} className="neon-word text-[clamp(2.25rem,5vw,3.25rem)]">
            {title}
          </h2>
          <p className="text-sm text-mist">
            {period === "week" && state.weekEnds ? `${copy.resetsIn} ${resetsIn(state.weekEnds)} · ` : ""}
            {copy.resets}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {boards.length > 1 &&
            boards.map((b) => (
              <button key={b.id} type="button" aria-pressed={board === b.id} onClick={() => setBoard(b.id)} className={toggle(board === b.id)}>
                {b.label}
              </button>
            ))}
          <span className={cn("flex gap-2", boards.length > 1 && "sm:ml-auto")}>
            {(["week", "all"] as const).map((p) => (
              <button key={p} type="button" aria-pressed={period === p} onClick={() => setPeriod(p)} className={toggle(period === p)}>
                {p === "week" ? copy.week : copy.all}
              </button>
            ))}
          </span>
        </div>

        <div aria-live="polite" className="mt-6">
          {state.status === "loading" && <p className="py-10 text-center text-mist">{copy.loading}</p>}
          {state.status === "offline" && <p className="py-10 text-center text-mist">{copy.offline}</p>}
          {state.status === "ready" && state.top.length === 0 && <p className="py-10 text-center text-mist">{copy.empty}</p>}

          {state.status === "ready" && podium.length > 0 && (
            <ol className="grid grid-cols-3 items-end gap-2 md:gap-4">
              {/* Podium order on screen: 2nd, 1st, 3rd. The list order stays 1, 2, 3 for screen readers. */}
              {podium.map((e) => (
                <li
                  key={e.tag}
                  className={cn(
                    "flex min-w-0 flex-col items-center rounded-xl border border-paper/10 bg-night/70 px-2 pt-4 text-center",
                    e.rank === 1 ? "order-2 border-green/60 pb-7 md:pb-9" : e.rank === 2 ? "order-1 pb-4 md:pb-5" : "order-3 pb-3",
                  )}
                >
                  <span className={cn("grid size-9 place-items-center rounded-full font-display text-base font-extrabold md:size-11 md:text-lg", MEDAL[e.rank - 1])}>{e.rank}</span>
                  <span className={cn("mt-2 w-full truncate font-display font-bold text-paper md:text-lg", !e.named && "text-mist")}>{e.name}</span>
                  <span className="font-display text-xl font-extrabold text-paper md:text-3xl">{e.value.toLocaleString("en-GB")}</span>
                  <span className="text-xs text-mist">{unit}</span>
                  <span className="mt-1 font-mono text-xs text-mist/80">#{e.tag}</span>
                </li>
              ))}
            </ol>
          )}

          {state.status === "ready" && rest.length > 0 && (
            <ol start={4} className="mt-4 divide-y divide-paper/10 rounded-xl border border-paper/10">
              {rest.map((e) => (
                <li key={e.tag} className="flex items-center gap-3 px-4 py-2.5">
                  <span className="w-6 text-right font-display font-bold text-mist">{e.rank}</span>
                  <span className={cn("min-w-0 flex-1 truncate font-display font-semibold text-paper", !e.named && "text-mist")}>{e.name}</span>
                  <span className="hidden font-mono text-xs text-mist/80 sm:inline">#{e.tag}</span>
                  <span className="font-display font-bold text-paper">{e.value.toLocaleString("en-GB")}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
        <p className="mt-4 text-sm text-mist">{copy.anonNote}</p>
      </div>

      <aside className="rounded-2xl border border-t-4 border-paper/10 border-t-green bg-night/60 p-5 md:p-7">
        <h3 className="font-display text-2xl font-bold text-paper">{copy.prizesTitle}</h3>
        <ol className="mt-4 flex flex-col gap-3">
          {copy.howTo.map((step, i) => (
            <li key={step} className="flex gap-3 text-mist">
              <span aria-hidden className="font-display text-2xl leading-none font-bold text-green">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{step.replace("{prizes}", prizes)}</span>
            </li>
          ))}
        </ol>
        <p className="mt-5 rounded-xl bg-blue/15 px-4 py-3 text-sm text-paper">{copy.safety}</p>
      </aside>
    </section>
  );
}
