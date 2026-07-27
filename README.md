# Luma Films — lumaweddingfilms.co

SEO-driven Next.js rebuild of the Luma Films wedding videography site.
Design system: "Warm Monochrome Revival" (see `design-reference/` for the
approved mockups — visual source of truth).

## Stack

- Next.js (App Router, static generation) + TypeScript + Tailwind CSS v4
- File-based CMS in `content/` — no database
- Vercel hosting · GA4 analytics (see `docs/ANALYTICS.md`)

## Commands

```bash
npm run dev       # local dev
npm run build     # production build (also regenerates sitemap + redirects)
npm run migrate   # node scripts/migrate-csv.mjs path/to/couple.csv
```

## Content model

| Directory | Generates | Notes |
|---|---|---|
| `content/weddings/*.json` | `/couples/[slug]` (private) + `/films/[film-slug]` (public) | One file → two pages. `public: false` opts out of the film page. `draft` never applies here; `passcode` optionally locks the portal. |
| `content/venues/*.json` | `/venues/[slug]` | `draft: true` keeps a venue out of the build + sitemap until real copy lands. |
| `content/cities/*.json` | `/wedding-videographer/[slug]` | Same `draft` behavior. |

### Add a wedding

1. Create `content/weddings/<lastname>.json` (copy `thompson.json` as a template).
2. Drop the cover image at `public/images/weddings/<lastname>.jpg` and set `coverPhoto`.
3. Commit + push. The build generates the portal page, the film page (if
   `public: true`), the redirect from the legacy root slug, and the sitemap entry.

### Placeholders

Copy marked `PLACEHOLDER` and empty `coverPhoto`/image slots render styled
placeholder blocks — replace them with real copy/imagery before launch.
Search the repo for `PLACEHOLDER` to find everything outstanding.

## SEO layer

- Unique title/description per page (templates in each route's `generateMetadata`)
- JSON-LD: `LocalBusiness` sitewide, `VideoObject` on film pages, `FAQPage` on
  city + packages pages, `BreadcrumbList` on SEO pages
- `sitemap.xml` + `robots.txt` auto-generated; `/couples/*` excluded and noindexed
  (robots meta **and** `X-Robots-Tag` header)
- 301 redirects: every wedding file's legacy root slug (`/thompson` →
  `/couples/thompson`) is generated automatically in `next.config.ts`, plus
  `/their-story` → `/films` and `/our-story` → `/about`
- Performance: static generation, `next/font` subsetting, `next/image`,
  Vimeo facade (player loads on click)

## Launch checklist (Phase 6)

- [ ] Set `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `LEAD_WEBHOOK_URL` in Vercel
- [ ] Replace all `PLACEHOLDER` copy + image slots
- [ ] Run the CSV migration; manual venue/city/date backfill pass
- [ ] DNS cutover → verify Search Console property → submit sitemap
- [ ] Test all 45 portal redirects
- [ ] Wire `LEAD_WEBHOOK_URL` to HoneyBook/Zapier; confirm brochure automation fires
- [ ] Google Business Profile audit (service areas ↔ location pages)
