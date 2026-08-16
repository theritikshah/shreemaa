import type { Metadata } from "next";
import { CareersView } from "@/components/careers/CareersView";
import life7 from "@/assets/life-7.jpeg";

export const metadata: Metadata = {
  title: { absolute: "Work with SMG · Life at Shri Maa Group" },
  description: "Meet the people behind Shri Maa Group. The everyday culture, the festivals, the wins — life at SMG.",
  openGraph: {
    title: "Work with SMG",
    description: "Life, people and culture at Shri Maa Group.",
    images: [{ url: life7.src }],
  },
  alternates: {
    canonical: "/careers",
  },
};

export default function CareersPage() {
  return <CareersView />;
}
