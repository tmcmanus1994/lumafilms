import fs from "node:fs";
import path from "node:path";

/*
 * File-based CMS. One JSON file per record:
 *   content/weddings/[slug].json  → private portal page + (optionally) public film page
 *   content/venues/[slug].json    → venue SEO page
 *   content/cities/[slug].json    → location SEO page
 *
 * All reads happen at build time (static generation), so adding a wedding is:
 * drop a file, commit, deploy.
 */

export type VideoAsset = {
  vimeo?: string;
  download?: string;
  /** Local still shown before the player loads (portal + film pages). */
  poster?: string;
};

export type WeddingExtra = VideoAsset & { label: string };

export type Wedding = {
  slug: string;
  couple: string;
  lastName?: string;
  weddingDate?: string;
  venue: { name: string; slug?: string; city?: string };
  coverPhoto?: string;
  coverPhotoAlt?: string;
  /** Overrides the venue name on film cards / film-page eyebrow (display only). */
  cardLabel?: string;
  /** Generate a public /films page for this wedding? Couples can opt out. */
  public: boolean;
  /** Optional portal passcode — most galleries stay open by design. */
  passcode?: string | null;
  /** 2–3 sentence couple story shown on the public film page. */
  story?: string;
  /** Marks placeholder content that still needs Travelle's real copy/media. */
  draft?: boolean;
  /** 1–3: position in the homepage Featured Films section. */
  featured?: number;
  /** 1–9: position on the curated /films index (all public films still get pages). */
  showcase?: number;
  /** Wedding slugs shown as "More films" on this film's page, in order. */
  related?: string[];
  filmSlug?: string;
  highlight: VideoAsset & { title?: string };
  ceremony?: VideoAsset;
  instagramReel?: VideoAsset;
  rawFootageFolder?: string | null;
  extras?: WeddingExtra[];
  portalNote?: string;
  testimonial?: { quote: string; attribution?: string };
};

export type Venue = {
  slug: string;
  name: string;
  city: string;
  citySlug?: string;
  region?: string;
  /** 1 = home turf, 4 = wishlist (no film yet — editorial angle, no fake claims) */
  tier: 1 | 2 | 3 | 4;
  /** Muted looping Vimeo background for the page hero (falls back to a still). */
  heroVideo?: string;
  /** Local poster shown before/behind the hero video (avoids a black flash). */
  heroPoster?: string;
  /** Position on the /venues index — Travelle's curated order. */
  order?: number;
  /** Hero H1 override (venue name + tagline). Falls back to the venue name. */
  heroTitle?: string;
  /** Hero subline. Falls back to "{city}, Arkansas". Also used as meta description. */
  heroSub?: string;
  headline?: string;
  /** The moat: first-person filming knowledge — light, layout, audio. */
  insiderKnowledge: string[];
  /** Curated films for this page, in order. Falls back to all films at the venue. */
  filmSlugs?: string[];
  cta?: { line: string; subline?: string };
  nearbyVenueSlugs?: string[];
  testimonial?: { quote: string; attribution: string };
  draft?: boolean;
};

export type CityFAQ = { question: string; answer: string };

export type City = {
  slug: string;
  name: string;
  /** Extra city names folded into this page's copy (e.g. Bryant on the Benton page). */
  alsoServes?: string[];
  region?: string;
  /** Display order — by market value, never alphabetical. */
  order?: number;
  intro: string[];
  faqs: CityFAQ[];
  /** Curated films for this page, in order. Falls back to films whose venue is in this city. */
  filmSlugs?: string[];
  draft?: boolean;
};

const contentDir = (kind: string) => path.join(process.cwd(), "content", kind);

function readAll<T>(kind: string): T[] {
  const dir = contentDir(kind);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const raw = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
      return { slug: f.replace(/\.json$/, ""), ...raw } as T;
    });
}

export function getWeddings(): Wedding[] {
  return readAll<Wedding>("weddings").sort((a, b) =>
    (b.weddingDate ?? "").localeCompare(a.weddingDate ?? "")
  );
}

export function getWedding(slug: string): Wedding | undefined {
  return getWeddings().find((w) => w.slug === slug);
}

/** Public film pages use a venue-rich slug (e.g. laken-robert-hedge-farm). */
export function filmSlug(w: Wedding): string {
  if (w.filmSlug) return w.filmSlug;
  const couple = w.couple
    .toLowerCase()
    .replace(/\s*\+\s*/g, "-")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  const venue = (w.venue.slug || w.venue.name || "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return venue ? `${couple}-${venue}` : couple;
}

export function getPublicFilms(): Wedding[] {
  return getWeddings().filter((w) => w.public);
}

export function getFilmBySlug(slug: string): Wedding | undefined {
  return getPublicFilms().find((w) => filmSlug(w) === slug);
}

/** The three homepage films, in Travelle's chosen order. */
export function getFeaturedFilms(): Wedding[] {
  return getPublicFilms()
    .filter((w) => w.featured)
    .sort((a, b) => a.featured! - b.featured!);
}

/** The curated films-index selection (every public film still gets its own page). */
export function getShowcaseFilms(): Wedding[] {
  return getPublicFilms()
    .filter((w) => w.showcase)
    .sort((a, b) => a.showcase! - b.showcase!);
}

/**
 * "More films" for a film page: the curated `related` list when set, otherwise
 * curated films only (never the long tail of unlisted film pages).
 */
export function getRelatedFilms(w: Wedding): Wedding[] {
  const all = getPublicFilms();
  if (w.related?.length) {
    return w.related
      .map((slug) => all.find((f) => f.slug === slug))
      .filter((f): f is Wedding => Boolean(f));
  }
  const curated = [...getFeaturedFilms(), ...getShowcaseFilms()];
  const seen = new Set<string>();
  return curated
    .filter((f) => f.slug !== w.slug && !seen.has(f.slug) && (seen.add(f.slug), true))
    .slice(0, 3);
}

export function getVenues(): Venue[] {
  return readAll<Venue>("venues")
    .filter((v) => !v.draft)
    .sort(
      (a, b) =>
        (a.order ?? 99) - (b.order ?? 99) || a.tier - b.tier || a.name.localeCompare(b.name)
    );
}

export function getVenue(slug: string): Venue | undefined {
  return getVenues().find((v) => v.slug === slug);
}

export function getWeddingsAtVenue(venueSlug: string): Wedding[] {
  return getPublicFilms().filter((w) => w.venue.slug === venueSlug);
}

/** Resolve an ordered slug list to public weddings, dropping unknowns. */
export function resolveFilmSlugs(slugs: string[]): Wedding[] {
  const all = getPublicFilms();
  return slugs
    .map((slug) => all.find((w) => w.slug === slug))
    .filter((w): w is Wedding => Boolean(w));
}

export function getCities(): City[] {
  return readAll<City>("cities")
    .filter((c) => !c.draft)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

export function getCity(slug: string): City | undefined {
  return getCities().find((c) => c.slug === slug);
}

export function getWeddingsInCity(citySlug: string): Wedding[] {
  return getPublicFilms().filter((w) => w.venue.city === citySlug);
}

export function getVenuesInCity(citySlug: string): Venue[] {
  return getVenues().filter((v) => v.citySlug === citySlug);
}

/** Vimeo numeric ID from any vimeo.com URL form. */
export function vimeoId(url?: string): string | undefined {
  if (!url) return undefined;
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m?.[1];
}
