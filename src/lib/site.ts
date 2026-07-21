export const site = {
  name: "Luma Films",
  legalName: "Luma Films",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://lumaweddingfilms.co",
  email: "hello@lumaweddingfilms.co",
  instagram: "https://www.instagram.com/lumaweddingfilms",
  instagramHandle: "@lumaweddingfilms",
  baseCity: "Conway",
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
