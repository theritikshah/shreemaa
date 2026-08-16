import type { Metadata } from "next";
import { CommerceTradingView } from "@/components/businesses/CommerceTradingView";

export const metadata: Metadata = {
  title: "Commerce Trading",
  description:
    "Large-scale trading of smartphones, consumer electronics and technology products, backed by 100+ manufacturer relationships and deep supply chain expertise.",
  openGraph: {
    title: "Commerce Trading · SMG",
    description: "Powering India's electronics supply chain.",
  },
  alternates: {
    canonical: "/businesses/commerce-trading",
  },
};

export default function CommerceTradingPage() {
  return <CommerceTradingView />;
}
