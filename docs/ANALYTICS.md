# Analytics & the SEO Insight Agent

The site is instrumented so a monitoring agent (rebuild plan §8, Phase 7) can pull
clean, structured engagement data without any guesswork. This document is the
contract that agent codes against.

## Setup

Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` (the existing GA4 property's `G-XXXXXXX` id)
in Vercel env vars. Without it, the site runs with analytics silently disabled —
safe for previews.

## Event taxonomy

Every event is defined in `src/lib/analytics.ts` and fired through one `track()`
helper. All events automatically carry the current page context:

| Param | Values |
|---|---|
| `page_type` | `home`, `films_index`, `film`, `venues_index`, `venue`, `city`, `packages`, `about`, `contact`, `portal` |
| `content_city` | city slug (e.g. `conway`) when the page is tied to a location |
| `content_venue` | venue slug (e.g. `the-venue-at-oakdale`) when tied to a venue |
| `content_slug` | film/wedding slug on film + portal pages |

Events:

| Event | Fired when | Extra params |
|---|---|---|
| `page_view` | every navigation (SPA-aware) | `page_path` |
| `cta_click` | any "Check My Date" / primary CTA | `cta_location` (`home_hero`, `nav`, `mobile_sticky_bar`, `package_binx`, `venue_final`, …), `link_text` |
| `form_start` | first interaction with the contact form | — |
| `form_date_entered` | wedding date typed (the key funnel step) | — |
| `form_submit` | lead submitted successfully | `has_venue`, `lead_source_page` |
| `video_play` | a Vimeo facade is clicked | `video_title`, `video_venue` |
| `scroll_depth` | 25 / 50 / 75 / 90 % of a page | `percent` |
| `outbound_click` | any external link | `link_url` |
| `portal_view` | private gallery opened | — |

**GA4 setup note:** register `page_type`, `content_city`, `content_venue`,
`cta_location`, and `percent` as custom dimensions in the GA4 property so they
are queryable via the Data API.

## The conversion funnel the agent should watch

```
page_view (page_type=city|venue|film)   ← SEO entry
  → video_play                          ← engagement
  → cta_click                           ← intent
  → form_start → form_date_entered → form_submit   ← conversion
```

Because every event carries `content_city`/`content_venue`, the agent can answer
questions like "which venue pages produce leads" or "do couples from the Conway
page watch films before converting" with a single GA4 Data API query.

## Data sources for the Phase-7 agent

1. **GA4 Data API** — the events above (`runReport` grouped by `page_type`,
   `content_venue`, `content_city`).
2. **Search Console API** — impressions/clicks/position per URL; the URL
   structure (`/venues/[slug]`, `/wedding-videographer/[city]`) maps 1:1 to
   content files, so ranking movement can be attributed to specific pages.
3. **Content directory** — `content/` is the ground truth for what exists;
   the agent can diff GSC queries against published pages to propose new venue
   or city pages.
4. **Leads** — `/api/contact` posts to `LEAD_WEBHOOK_URL`; keep date + venue in
   standard fields (HoneyBook/Zapier constraint from rebuild plan §11).

## Portal exclusion

`portal_view` and any event with `page_type=portal` must be excluded from SEO
reporting — private galleries are noindex and their traffic says nothing about
acquisition.
