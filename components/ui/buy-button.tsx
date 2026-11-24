import site from "@/content/site.json";
import { cn } from "@/lib/utils";

export function BuyButton({ className, label = site.buyLabel }: { className?: string; label?: string }) {
  return (
    <a href={site.buyUrl} target="_blank" rel="noopener noreferrer" className={cn("btn-buy", className)}>
      {label}
    </a>
  );
}
