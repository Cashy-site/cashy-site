"use client";

import { useState } from "react";
import { Leaderboard } from "@/components/arcade/leaderboard";
import pages from "@/content/pages.json";
import { cn } from "@/lib/utils";

const { leaderboards, games } = pages.arcade;

/** Every game's leaderboard in one place at the bottom of the Arcade: pick a game, see its podium and top 10. */
export function ArcadeLeaderboards() {
  const [selected, setSelected] = useState(games[0].id);
  const game = games.find((g) => g.id === selected) ?? games[0];

  return (
    <section aria-labelledby="arcade-leaderboards" className="mx-auto mt-16 w-full max-w-[1200px] md:mt-24">
      <h2 id="arcade-leaderboards" className="neon-word text-[clamp(2.75rem,8vw,6rem)]">
        {leaderboards.title}
      </h2>
      <p className="mt-4 max-w-xl text-lg text-paper">{leaderboards.line}</p>

      <div role="group" aria-label={leaderboards.pick} className="mt-6 flex flex-wrap gap-2">
        {games.map((g) => (
          <button
            key={g.id}
            type="button"
            aria-pressed={selected === g.id}
            onClick={() => setSelected(g.id)}
            className={cn(
              "h-11 rounded-full border-2 px-5 font-display text-base font-semibold transition-colors duration-150",
              selected === g.id ? "border-blue bg-blue text-paper" : "border-paper/30 text-paper hover:border-blue hover:bg-blue focus-visible:border-blue focus-visible:bg-blue",
            )}
          >
            {g.title}
          </button>
        ))}
      </div>

      <Leaderboard key={game.id} game={game.leaderboardId} boards={game.boards} prizes={game.prizes} title={game.title} />
    </section>
  );
}
