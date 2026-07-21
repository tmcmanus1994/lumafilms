# Luma Films — Site Rebuild & SEO Project Brief

**Project:** Rebuild lumaweddingfilms.co as a custom Next.js site
**Goals (in priority order):** 1) Rank for local wedding videography searches, 2) Win venue-level searches near home base, 3) Convert visitors into booked clients at a high rate
**Stack:** Next.js (App Router) · file-based CMS · Vercel hosting · Google Analytics (existing property)
**Secondary function:** Private client portal for final video delivery (45 existing couples, migrating from Framer CMS)

---

## 1. Current State Audit (from Framer export, July 2026)

- 5 public pages: Home, Their Story, My Story, Packages, Contact
- **Every page shares the identical title tag and meta description** — the single biggest SEO problem
- No location pages, no venue pages, no individual film pages
- 45 client portal pages at root-level slugs (`/thompson`, `/kunkel`, etc.) — currently indexable, should not be
- Strong existing assets: detailed written testimonials (Jamal + Katie, Kasey + Brady, Josh + Hannah), 45 real weddings with venue names in titles, packages starting at $1,799
- Contact page = brochure request form (lead magnet pattern — keep this)

---

## 2. Site Architecture

### Public pages

```
/                                       Home
/films                                  Film gallery (public portfolio)
/films/[slug]                           Individual film pages (venue-rich slugs)
/venues                                 Venue index ("Venues We Love")
/venues/[slug]                          Individual venue pages
/wedding-videographer/[city]            Location pages
/packages                               Packages & pricing
/about                                  My Story
/contact                                Contact / brochure request
```

### Private (noindex, excluded from sitemap.xml)

```
/couples/[slug]                         Client delivery portal
```

**Portal privacy decision:** Hidden URL + `noindex` robots meta + excluded from sitemap. No passcode by default (couples share links with family; passcodes create support friction). Support an optional `passcode` field per wedding file for couples who request it. Vimeo download links are signed/expiring, which limits exposure on their own.

**URL migration note:** Framer portal URLs are root-level (`/thompson`). New portal lives at `/couples/thompson`. **301 redirect every existing slug** — 45 couples have these links bookmarked. Redirect map generated from the CSV slug column. Also redirect `/their-story` → `/films`, `/our-story` → `/about`.

### Dual-output principle

One wedding data file generates **two pages**:
1. `/couples/[slug]` — private portal (all videos + downloads, warm thank-you framing)
2. `/films/[film-slug]` — public film page (highlight video only, venue story, SEO metadata, links to venue + location pages)

A wedding can opt out of the public page (`public: false`) if a couple prefers.

---

## 3. Location Pages (Priority Order)

### Core market — Central Arkansas
| Priority | Page | Target query pattern |
|---|---|---|
| 1 | Little Rock | wedding videographer little rock ar |
| 1 | Conway | wedding videographer conway ar |
| 2 | North Little Rock | wedding videographer north little rock |
| 2 | Benton / Bryant (one page, both cities in copy) | wedding videographer benton ar / bryant ar |
| 2 | Hot Springs | wedding videographer hot springs ar |
| 3 | Sherwood | wedding videographer sherwood ar |

### Secondary market — Northwest Arkansas
| Priority | Page | Target query pattern |
|---|---|---|
| 2 | Fayetteville | wedding videographer fayetteville ar / NWA |
| 3 | Bentonville | wedding videographer bentonville ar |
| 3 | Rogers / Springdale (fold into Bentonville or Fayetteville copy initially) | — |

**Location page content formula (never thin/duplicate):**
- H1: "{City} Wedding Videographer"
- Unique intro paragraph with genuine local knowledge (venues, neighborhoods, light, logistics)
- Embedded films actually shot in/near that city (pulled from wedding data by city field)
- Venues served in that area, linking to venue pages
- Testimonial(s) from couples in that area where possible
- Packages summary + CTA
- FAQ block (travel fees, booking timeline, etc.) → FAQPage schema

---

## 4. Venue Pages (Priority Order)

### Tier 1 — Favorites / home turf (build first, richest content)
| Venue | Films on hand | Notes |
|---|---|---|
| The Venue at Oakdale | 2 (+Oakdale RVA to verify) | 5 minutes from home — "I know this venue cold" angle |
| Legacy Acres | 2 | Favorite venue |
| Grandeur House | 1 | Favorite venue, Little Rock market |

### Tier 2 — Repeat venues with proof
Stonebrook Meadows (2), Dove Hollow Estate (2), Hudson Springs (2), Crystal Bridges (2, NWA)

### Tier 3 — Strong singles
Hedge Farm, The Cordelle, Capital Hotel (Little Rock), Osage House (NWA), Barn at the Springs (NWA), Stone Chapel at MattLane Farm, Bella Terra Estate, Kindred Barn, Mildred B. Cooper Memorial Chapel (NWA), Barn at Fawn Hollow, McCoy's Little Red Barn, Loft 1023, Barn at Greers Ferry Lake, Angelo's Garden, Chenal Country Club, Albert Pike Memorial Temple, Cathedral of St Andrew

### Tier 4 — Wishlist venues (no film yet)
Travelle to research and supply. Page pattern: "Filming at {Venue}" editorial angle — what makes it beautiful on camera — honest that it's a venue we'd love to shoot, no fake portfolio claims.

**Venue page content formula:**
- H1: "{Venue} Wedding Videographer" or "Wedding Films at {Venue}"
- What it's like to film there (light, layout, ceremony spots, audio considerations — real videographer knowledge, this is the moat)
- Every film shot there, embedded
- Location context + link to nearest city page
- CTA + link to packages
- Target queries: "{venue} wedding video", "{venue} wedding videographer", "{venue} wedding"

---

## 5. File-Based CMS Schema

Framer's 48 flat columns collapse into a clean structure. One file per wedding at `content/weddings/[slug].json` (or `.yaml`).

```yaml
slug: thompson
couple: "Laken + Robert"
lastName: "Thompson"
weddingDate: ""            # backfill when known — enables sorting + schema
venue:
  name: "Hedge Farm"
  slug: "hedge-farm"        # links wedding → venue page
  city: ""                  # links wedding → location page
coverPhoto: "/images/weddings/thompson.jpg"
coverPhotoAlt: ""
public: true                # generate public film page?
passcode: null              # optional portal passcode
story: ""                   # 2–3 sentence couple story for public film page
highlight:
  title: "Laken + Robert // Hedge Farm"
  vimeo: "https://vimeo.com/1201954365"
  download: "https://..."
ceremony:
  vimeo: ""
  download: ""
rawFootageFolder: null      # URL when applicable
extras:                     # replaces 30+ fixed columns with a flexible array
  - label: "Best Man Speech"
    vimeo: ""
    download: ""
  - label: "Vow Exchange"
    vimeo: ""
    download: ""
instagramReel:
  vimeo: ""
  download: ""
```

**Migration:** Script parses `couple.csv` → generates all 45 files, mapping speech/bonus columns into the `extras` array and extracting venue names from highlight titles. Manual pass afterward to fill `venue.city` and `weddingDate` (Claude Code can assist with venue → city mapping).

**Add-a-wedding workflow:** Tell Claude Code "add the {Name} wedding" with Vimeo links → it creates the file, downloads/places the cover image, and the build generates portal + film pages. One commit, done.

**Field usage reality check (from CSV):** ceremony 34/45, speeches ~20/45, bonus videos taper fast (8→1), first look 4/45, raw footage folder 4/45. The `extras` array handles all of this without empty columns.

---

## 6. SEO Technical Layer

- **Unique title + meta description on every page** (template-driven, per-page overrides)
  - Film: `{Couple} at {Venue} | Wedding Film by Luma Films`
  - Venue: `{Venue} Wedding Videographer | Luma Films`
  - City: `{City} Wedding Videographer | Luma Films`
- **Structured data:**
  - `LocalBusiness` (site-wide) — service area: all target cities
  - `VideoObject` on every public film page (thumbnail, name, description, Vimeo embed URL)
  - `FAQPage` on location pages
  - `Review`/`AggregateRating` if testimonials can be tied to review platform ratings (verify compliance before adding)
- **sitemap.xml** auto-generated, portal routes excluded; **robots** noindex on `/couples/*`
- **Redirects:** 45 portal slugs + legacy page paths (see §2)
- **Performance:** next/image, lazy-loaded Vimeo embeds (facade pattern — thumbnail first, load player on click), font subsetting. Core Web Vitals matter for local rankings.
- **Google Business Profile:** ensure site links, service areas, and categories align with location pages (outside the codebase but part of launch checklist)
- **Search Console:** verify property, submit sitemap at launch

---

## 7. Conversion Layer (booking rate)

- Primary CTA everywhere: **"Check My Date"** or "Request a Quote" (date-availability framing beats generic contact)
- Hero: film reel playing muted + one clear value line + primary CTA above the fold
- Keep the brochure lead magnet ("Fill this form to get a brochure of services — starting at $1,799") — price anchoring on the form is working in your favor, keep transparent pricing
- Testimonials: you have long, detailed ones — excerpt the strongest lines near CTAs, full versions on a testimonials section; attribute with couple names + venue
- Every film page and venue page ends with a CTA block (these are the SEO entry points — don't let them dead-end)
- Contact form: minimum fields (names, date, venue, email/phone) — every extra field costs leads
- FAQ/objection handling on packages page: booking timeline, travel, delivery time, raw footage policy

---

## 8. Build Phases (Claude Code)

1. **Scaffold** — Next.js App Router project, design system (to be defined in design session), layout, nav, footer
2. **CMS + migration** — schema above, CSV migration script, 45 wedding files generated, venue/city backfill
3. **Core pages** — Home, Films, film pages, portal pages, Packages, About, Contact
4. **SEO pages** — venue pages (Tier 1 → 2 → 3), location pages (priority order in §3)
5. **Technical SEO** — metadata system, schema, sitemap, redirects, performance pass
6. **Launch** — DNS cutover, Search Console, GA verification, redirect testing (all 45 portal URLs)
7. **Monitoring agent** (separate project, post-launch) — GA4 API + Search Console API pulls on schedule, plain-language insight reports, ranking movement alerts

---

## 9. Open Items

- [ ] Design direction session (aesthetic, typography, color — before Phase 1 build)
- [ ] Travelle: wishlist venue list for Tier 4 pages
- [ ] Travelle: confirm package names/pricing carry over as-is (Rosie / Binx / etc.)
- [ ] Venue → city mapping pass for all 45 weddings
- [ ] Wedding dates backfill (enables sorting, schema, "recent work" sections)
- [ ] Cover photos: 18/45 missing — pull frames from highlight films during migration
- [ ] Google Business Profile audit at launch


---

## 10. Resolved Decisions (Design Session, July 21)

- **Design direction:** "Warm Monochrome Revival" — full spec in `luma-films-design-brief.md` (companion file). Cormorant Garamond + Inter, bone/sand/taupe/espresso/ink palette, no pure black/white, script confined to logo.
- **Hero H1:** "Cinematic Wedding Films in Central Arkansas" (place-first for SEO); subline "Modern, story-driven films for couples in Little Rock, Conway, and beyond."
- **Nav:** Films · Venues · Packages · About · Contact (replaces Their Story / My Story)
- **Primary CTA sitewide:** "Check My Date" (replaces Request a Quote)
- **Homepage sections (8):** Hero → Trust bar → Featured films (3) → Why Luma (3 props) → Testimonial spotlight → Packages teaser → Where I Film link strip → Final CTA
- **SEO page template (venue/location/film):** Headline matching search → insider knowledge block → films shot there → testimonial → cross-links → CTA. Location pages add FAQ block (FAQPage schema).
- **Contact page:** photo + "what happens next" 3 steps + $1,799 anchor + minimal fields (names, date, venue, email, phone)
- **Packages page:** single clean H1 (fix duplicate H1 spam), keep package personality (Rosie/Binx pending Travelle's confirmation), comparison layout + objection FAQ
- **Workflow:** Claude Design mocks homepage + Oakdale venue page from the design brief → approved mockups + both briefs go to Claude Code for the build
