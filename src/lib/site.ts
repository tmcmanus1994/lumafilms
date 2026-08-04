export const site = {
  name: "Luma Films",
  legalName: "Luma Films",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://lumaweddingfilms.co",
  email: "trav.mcmanus@gmail.com",
  instagram: "https://www.instagram.com/luma_weddingfilms",
  instagramHandle: "@luma_weddingfilms",
  /** Google Business Profile review link — feeds the map-pack ranking flywheel. */
  reviewUrl: "https://g.page/r/CTMJYEBNZYSTEBM/review",
  /** Muted looping hero background film (Vimeo). */
  heroVideo: "https://vimeo.com/855240627",
  /** Self-hosted LCP poster behind the hero video. Swap the file to change it. */
  heroPoster: "/images/brand/hero-poster.jpg",
  baseCity: "Little Rock",
  baseRegion: "AR",
  description:
    "Cinematic wedding films in Central Arkansas. Modern, story-driven wedding videography for couples in Little Rock, Conway, and beyond.",
  startingPrice: 2400,
  priceRange: "$2,400 – $4,800",
  serviceAreas: [
    "Little Rock",
    "Conway",
    "North Little Rock",
    "Benton",
    "Bryant",
    "Hot Springs",
    "Sherwood",
    "Fayetteville",
    "Bentonville",
  ],
} as const;

/**
 * Sitewide CTA behavior (motion-cta-spec §2): "link" routes every Check My
 * Date to /contact; "modal" (phase two, workflow rebuild) opens the date-first
 * overlay. Flipping this one value changes every CTA on the site.
 */
export const ctaMode: "link" | "modal" = "link";

/** Home "Where I Film" venue strip — curated for city coverage, in this order. */
export const homeVenueSlugs = [
  "the-venue-at-oakdale",
  "angelos-garden",
  "grandeur-house",
  "capital-hotel",
  "garvan-woodland-gardens",
  "crystal-bridges",
] as const;

export const nav = [
  { label: "Films", href: "/films" },
  { label: "Venues", href: "/venues" },
  { label: "Packages", href: "/packages" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export function absoluteUrl(path: string) {
  return `${site.url}${path}`;
}
