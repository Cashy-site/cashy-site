import type { Metadata } from "next";
import Link from "next/link";
import { ComingSoon } from "@/components/coming-soon";
import { PayoutCountdown } from "@/components/printer/payout-countdown";
import { PrinterScene } from "@/components/printer/printer-scene";
import { BuyButton } from "@/components/ui/buy-button";
import { ContractAddress } from "@/components/ui/contract-address";
import { FollowLink } from "@/components/ui/follow-link";
import pages from "@/content/pages.json";

const { title, description, line, coming, mascot, comingTitle, sceneAlt } = pages.printer;

export const metadata: Metadata = { title, description };

export default function PrinterPage() {
  return (
    <ComingSoon
      title={title}
      heading={comingTitle}
      line={line}
      coming={coming}
      mascot={mascot}
      art={<PrinterScene alt={sceneAlt} />}
      extra={<PayoutCountdown className="mt-8 max-w-md" />}
      actions={
        <>
          <BuyButton className="h-12 px-6 text-lg" />
          <FollowLink className="h-12 px-6 text-lg" />
          <Link href="/" className="text-link text-lg">
            Back to the city
          </Link>
          <div className="w-full">
            <p className="mb-2 text-sm font-semibold text-paper">Official address</p>
            <ContractAddress />
          </div>
        </>
      }
    />
  );
}
