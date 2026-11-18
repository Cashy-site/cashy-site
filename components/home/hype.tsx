import { BuyButton } from "@/components/ui/buy-button";
import { FollowLink } from "@/components/ui/follow-link";

type HypeProps = {
  eyebrow: string;
  title: string;
  lede: string;
  story: string[];
  points: { title: string; text: string }[];
};

export function Hype({ eyebrow, title, lede, story, points }: HypeProps) {
  return (
    <section className="bg-black px-4 py-24 md:px-8 md:py-32">
      <div className="mx-auto w-full max-w-[1500px]">
        <p className="inline-block rounded-full bg-paper px-3.5 py-1.5 font-display text-sm font-bold tracking-[0.2em] text-blue uppercase">{eyebrow}</p>
        <h2 className="neon-word mt-5 text-[clamp(3rem,9vw,8rem)] text-balance">{title}</h2>
        <p className="mt-8 max-w-2xl text-lg text-mist md:text-xl">{lede}</p>
        {story.map((paragraph) => (
          <p key={paragraph} className="mt-5 max-w-2xl text-lg text-mist md:text-xl">
            {paragraph}
          </p>
        ))}

        <ul className="mt-14 grid gap-5 md:grid-cols-3">
          {points.map((point) => (
            <li key={point.title} className="rounded-2xl border border-t-4 border-paper/10 border-t-blue bg-night/60 p-6 md:p-8">
              <h3 className="font-display text-2xl font-bold text-paper md:text-3xl">{point.title}</h3>
              <p className="mt-3 text-lg text-mist">{point.text}</p>
            </li>
          ))}
        </ul>

        <div className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-4">
          <BuyButton className="h-14 px-8 text-xl" />
          <FollowLink className="h-14 px-7 text-lg" />
        </div>
      </div>
    </section>
  );
}
