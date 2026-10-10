import type { MetadataRoute } from "next";
import { projects } from "@/data/portfolio";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.SITE_URL;
  return base
    ? ["", ...projects.map((p) => `/work/${p.slug}`)].map((path) => ({
        url: `${base}${path}/`,
      }))
    : [];
}
