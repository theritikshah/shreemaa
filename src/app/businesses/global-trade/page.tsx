import type { Metadata } from "next";
import { GlobalTradeView } from "@/components/businesses/GlobalTradeView";
import hero from "@/assets/infra-electronics.jpg";

export const metadata: Metadata = {
  title: "Rio World · Global Trade",
  description:
    "Rio World exports smartphones and consumer electronics to global markets — reliable, competitive and on time.",
  openGraph: {
    title: "Rio World · Global Trade · SMG",
    description: "Smartphone and electronics exports, done right.",
    images: [{ url: hero.src }],
  },
  twitter: {
    images: [hero.src],
  },
  alternates: {
    canonical: "/businesses/global-trade",
  },
};

export default function GlobalTradePage() {
  return <GlobalTradeView />;
}
