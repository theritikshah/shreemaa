import type { Metadata } from "next";
import { MarketplaceView } from "@/components/businesses/MarketplaceView";

export const metadata: Metadata = {
  title: "Marketplace Operations",
  description:
    "End-to-end seller operations across Amazon, Flipkart, Blinkit, JioMart, Solv and Swiggy — catalog, ads, fulfillment and customer experience under one roof.",
  openGraph: {
    title: "Marketplace Operations · SMG",
    description: "Scale across India's leading marketplaces with a partner that owns the full stack.",
  },
  alternates: {
    canonical: "/businesses/marketplace-operations",
  },
};

export default function MarketplaceOperationsPage() {
  return <MarketplaceView />;
}
