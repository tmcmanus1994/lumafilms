/*
 * First-party event taxonomy — the contract between the site and the future
 * SEO/engagement insight agent (rebuild plan §8 phase 7). Every event lands in
 * GA4 with consistent names and params so the agent can query the GA4 Data API
 * without guessing. Full documentation: docs/ANALYTICS.md.
 */

export type LumaEvent =
  | "cta_click" // any "Check My Date" or primary CTA. params: cta_location
  | "form_start" // first interaction with the contact form
  | "form_date_entered" // date-first step completed (the key funnel moment)
  | "form_submit" // lead submitted. params: has_venue, lead_source_page
  | "video_play" // Vimeo facade clicked. params: video_title, video_venue
  | "scroll_depth" // params: percent (25 | 50 | 75 | 90)
  | "outbound_click" // params: link_url
  | "portal_view"; // private gallery opened (excluded from SEO reporting)

export type PageContext = {
  page_type:
    | "home"
    | "films_index"
    | "film"
    | "venues_index"
    | "venue"
    | "city"
    | "packages"
    | "about"
    | "contact"
    | "portal";
  content_city?: string;
  content_venue?: string;
  content_slug?: string;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __lumaPage?: PageContext;
  }
}

export function track(event: LumaEvent, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", event, { ...window.__lumaPage, ...params });
}
