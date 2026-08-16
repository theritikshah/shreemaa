import type { Metadata } from "next";
import { AboutView } from "@/components/about/AboutView";

export const metadata: Metadata = {
  title: "About",
  description:
    "Shri Maa Group is a global commerce, distribution and trade company, building the infrastructure, technology and networks that move products from the world's leading brands to millions of consumers.",
  openGraph: {
    title: "About · Shri Maa Group",
    description: "A global commerce company built over nearly three decades, connecting brands, markets and consumers across continents.",
  },
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return <AboutView />;
}
