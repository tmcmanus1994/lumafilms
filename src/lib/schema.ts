import { site, absoluteUrl } from "./site";
import type { City, Venue, Wedding } from "./content";
import { filmImage, filmSlug, vimeoId } from "./content";

/*
 * JSON-LD builders. Every public page carries LocalBusiness (site-wide, in the
 * root layout); film pages add VideoObject, location pages add FAQPage.
 */

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${site.url}/#business`,
    name: site.name,
    description: site.description,
    url: site.url,
    email: site.email,
    priceRange: site.priceRange,
    image: absoluteUrl("/images/brand/og-default.jpg"),
    address: {
      "@type": "PostalAddress",
      addressLocality: site.baseCity,
      addressRegion: site.baseRegion,
      addressCountry: "US",
    },
    areaServed: site.serviceAreas.map((name) => ({ "@type": "City", name })),
    sameAs: [site.instagram],
    knowsAbout: ["Wedding videography", "Wedding films", "Cinematography"],
  };
}

export function videoObjectSchema(w: Wedding) {
  const id = vimeoId(w.highlight.vimeo);
  // `story` is "" on almost every wedding, and ?? only catches null/undefined —
  // so || is what actually falls through to the generated sentence.
  const description =
    w.story || `${w.couple}'s wedding film at ${w.venue.name}, filmed by Luma Films.`;
  // filmImage() is the canonical still (highlight poster first, then cover
  // photo). Reading coverPhoto alone sent Google to Vimeo's auto-generated
  // frame for every wedding whose still lives on the highlight instead.
  const image = filmImage(w);
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: w.highlight.title ?? `${w.couple} at ${w.venue.name} — Wedding Film`,
    description,
    thumbnailUrl: image
      ? absoluteUrl(image)
      : id
        ? `https://vumbnail.com/${id}.jpg`
        : undefined,
    uploadDate: w.weddingDate || undefined,
    embedUrl: id ? `https://player.vimeo.com/video/${id}` : w.highlight.vimeo,
    contentUrl: w.highlight.vimeo,
    publisher: { "@id": `${site.url}/#business` },
  };
}

export function faqPageSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function venueBreadcrumbs(v: Venue) {
  return breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Venues", path: "/venues" },
    { name: v.name, path: `/venues/${v.slug}` },
  ]);
}

export function cityBreadcrumbs(c: City) {
  return breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: `${c.name} Wedding Videographer`, path: `/wedding-videographer/${c.slug}` },
  ]);
}

export function filmBreadcrumbs(w: Wedding) {
  return breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Films", path: "/films" },
    { name: `${w.couple} at ${w.venue.name}`, path: `/films/${filmSlug(w)}` },
  ]);
}
