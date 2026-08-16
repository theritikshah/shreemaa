import type { Metadata } from "next";
import { HomeView } from "@/components/home/HomeView";

export const metadata: Metadata = {
  title: "Shri Maa Group · The Launchpad for Global Brands",
  description:
    "A global commerce, distribution and trade network reaching 300M+ consumers across 80,000+ retailers and 15+ fulfillment centers.",
  openGraph: {
    title: "Shri Maa Group · The Launchpad for Global Brands",
    description: "Helping brands scale across e-commerce, sales, distribution and global trade.",
  },
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return <HomeView />;
}
