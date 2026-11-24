"use client";

import { useState } from "react";
import site from "@/content/site.json";
import { cn } from "@/lib/utils";

/** The official contract address, with a Copy button and a BaseScan link. */
export function ContractAddress({ className }: { className?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.contractAddress);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* No clipboard (old browser, blocked): the address is selectable text, so people can still copy it by hand. */
    }
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-2", className)}>
      <code className="rounded-lg bg-night/80 px-3 py-2 font-mono text-[13px] break-all text-paper select-all sm:text-base">{site.contractAddress}</code>
      <button type="button" onClick={copy} className="btn-outline h-10 px-4 text-sm" aria-label="Copy the contract address">
        <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
      </button>
      <a href={site.basescanUrl} target="_blank" rel="noopener noreferrer" className="text-link text-sm">
        BaseScan
      </a>
    </div>
  );
}
