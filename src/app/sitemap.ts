import type { MetadataRoute } from "next";
import { filmSlug, getCities, getPublicFilms, getVenues } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

/**
 * Auto-generated from the content directory. Private portal routes
 * (/couples/*) are deliberately excluded — they are noindex.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const statics = ["/", "/films", "/venues", "/packages", "/about", "/contact"].map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.8,
  }));

  const films = getPublicFilms().map((w) => ({
    url: absoluteUrl(`/films/${filmSlug(w)}`),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  const venues = getVenues().map((v) => ({
    url: absoluteUrl(`/venues/${v.slug}`),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const cities = getCities().map((c) => ({
    url: absoluteUrl(`/wedding-videographer/${c.slug}`),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  return [...statics, ...venues, ...cities, ...films];
}
