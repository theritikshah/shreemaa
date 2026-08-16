import type { Metadata } from "next";
import { DistributionView } from "@/components/businesses/DistributionView";

export const metadata: Metadata = {
  title: "Distribution Network",
  description:
    "Delivering brands to 80,000+ retailers across India through 600+ distribution partners and a national field force.",
  openGraph: {
    title: "Distribution Network · SMG",
    description: "India's most trusted distribution network for consumer brands.",
  },
  alternates: {
    canonical: "/businesses/distribution-network",
  },
};

export default function DistributionNetworkPage() {
  return <DistributionView />;
}
