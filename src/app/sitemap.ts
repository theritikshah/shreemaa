import type { MetadataRoute } from "next";

const BASE_URL = "https://www.shrimaa.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/about",
    "/careers",
    "/jobs",
    "/contact",
    "/businesses/marketplace-operations",
    "/businesses/distribution-network",
    "/businesses/global-trade",
  ];

  return paths.map((path) => ({
    url: `${BASE_URL}${path}`,
    changeFrequency: "weekly",
    lastModified: new Date(),
  }));
}
