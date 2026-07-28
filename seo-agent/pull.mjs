#!/usr/bin/env node
/**
 * SEO agent — weekly data pull (spec Part 2).
 *
 *   node seo-agent/pull.mjs            # real pull (needs service-account key)
 *   node seo-agent/pull.mjs --sample   # synthetic data to preview report shape
 *
 * Pulls a 7-day window ending 3 days ago (Search Console data lags 2–3 days)
 * and writes one dated JSON to seo-data/pulls/. History accumulates in the
 * repo so the digest can compare week over week.
 */
import fs from "node:fs";
import path from "node:path";
import { config } from "./lib/env.mjs";
import { getAccessToken } from "./lib/google-auth.mjs";

const SAMPLE = process.argv.includes("--sample");
const cfg = config();
const outDir = path.join(process.cwd(), "seo-data", "pulls");
fs.mkdirSync(outDir, { recursive: true });

const iso = (d) => d.toISOString().slice(0, 10);
const daysAgo = (n) => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d;
};
// Window: 7 days ending 3 days ago (GSC lag)
const end = iso(daysAgo(3));
const start = iso(daysAgo(9));

// Pages PSI rotates through (homepage always; two others by week number)
const PSI_ROTATION = [
  "/venues/the-venue-at-oakdale",
  "/wedding-videographer/little-rock",
  "/venues/legacy-acres",
  "/wedding-videographer/conway",
  "/packages",
  "/films",
];

const errors = [];

async function gscQuery(token, body) {
  const res = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(cfg.scSite)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ startDate: start, endDate: end, rowLimit: 250, ...body }),
    }
  );
  if (!res.ok) throw new Error(`GSC ${res.status}: ${await res.text()}`);
  return (await res.json()).rows ?? [];
}

async function ga4Report(token, body) {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${cfg.ga4PropertyId}:runReport`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ dateRanges: [{ startDate: start, endDate: end }], ...body }),
    }
  );
  if (!res.ok) throw new Error(`GA4 ${res.status}: ${await res.text()}`);
  return await res.json();
}

async function psi(pagePath) {
  const url = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  url.searchParams.set("url", `${cfg.siteUrl}${pagePath}`);
  url.searchParams.set("category", "performance");
  url.searchParams.set("strategy", "mobile");
  const res = await fetch(url);
  if (!res.ok) throw new Error(`PSI ${res.status} for ${pagePath}`);
  const j = await res.json();
  const a = j.lighthouseResult?.audits ?? {};
  return {
    page: pagePath,
    performance: Math.round((j.lighthouseResult?.categories?.performance?.score ?? 0) * 100),
    lcp: a["largest-contentful-paint"]?.displayValue,
    cls: a["cumulative-layout-shift"]?.displayValue,
    tbt: a["total-blocking-time"]?.displayValue,
  };
}

function ga4Rows(report, map) {
  return (report.rows ?? []).map((r) => map(r.dimensionValues ?? [], r.metricValues ?? []));
}

async function realPull() {
  if (!cfg.keyFile || !fs.existsSync(cfg.keyFile)) {
    console.error(
      "No service-account key found. Set SEO_AGENT_KEY_FILE in .env (see seo-agent/README.md, spec Part 1)."
    );
    process.exit(1);
  }
  if (!cfg.ga4PropertyId) {
    console.error("Set GA4_PROPERTY_ID in .env (GA4 → Admin → Property details → Property ID).");
    process.exit(1);
  }

  const token = await getAccessToken(cfg.keyFile, [
    "https://www.googleapis.com/auth/webmasters.readonly",
    "https://www.googleapis.com/auth/analytics.readonly",
  ]);

  const data = { queries: [], pages: [], queryPages: [], sitemaps: [], ga4: {}, psi: [] };

  const grab = async (label, fn, assign) => {
    try {
      assign(await fn());
    } catch (e) {
      errors.push(`${label}: ${e.message.slice(0, 300)}`);
    }
  };

  await grab("gsc-queries", () => gscQuery(token, { dimensions: ["query"] }), (v) => (data.queries = v));
  await grab("gsc-pages", () => gscQuery(token, { dimensions: ["page"] }), (v) => (data.pages = v));
  await grab("gsc-query-pages", () => gscQuery(token, { dimensions: ["query", "page"] }), (v) => (data.queryPages = v));
  await grab(
    "gsc-sitemaps",
    async () => {
      const res = await fetch(
        `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(cfg.scSite)}/sitemaps`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
      return (await res.json()).sitemap ?? [];
    },
    (v) => (data.sitemaps = v)
  );

  await grab(
    "ga4-channels",
    () =>
      ga4Report(token, {
        dimensions: [{ name: "sessionDefaultChannelGroup" }],
        metrics: [{ name: "sessions" }, { name: "totalUsers" }],
      }),
    (r) => (data.ga4.channels = ga4Rows(r, (d, m) => ({ channel: d[0]?.value, sessions: +m[0]?.value, users: +m[1]?.value })))
  );
  await grab(
    "ga4-landing",
    () =>
      ga4Report(token, {
        dimensions: [{ name: "landingPagePlusQueryString" }],
        metrics: [{ name: "sessions" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: 20,
      }),
    (r) => (data.ga4.landing = ga4Rows(r, (d, m) => ({ page: d[0]?.value, sessions: +m[0]?.value })))
  );
  await grab(
    "ga4-events",
    () =>
      ga4Report(token, {
        dimensions: [{ name: "eventName" }],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: {
          filter: {
            fieldName: "eventName",
            inListFilter: {
              values: ["cta_click", "form_start", "form_submit", "video_play", "scroll_depth", "portal_view"],
            },
          },
        },
      }),
    (r) => (data.ga4.events = ga4Rows(r, (d, m) => ({ event: d[0]?.value, count: +m[0]?.value })))
  );
  await grab(
    "ga4-contact",
    () =>
      ga4Report(token, {
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }],
        dimensionFilter: {
          filter: { fieldName: "pagePath", stringFilter: { matchType: "BEGINS_WITH", value: "/contact" } },
        },
      }),
    (r) => (data.ga4.contactViews = ga4Rows(r, (d, m) => ({ page: d[0]?.value, views: +m[0]?.value })))
  );

  // PSI: homepage + 2 rotating pages
  const week = Math.floor(Date.now() / (7 * 864e5));
  const rotating = [PSI_ROTATION[week % PSI_ROTATION.length], PSI_ROTATION[(week + 1) % PSI_ROTATION.length]];
  for (const p of ["/", ...rotating]) {
    await grab(`psi-${p}`, () => psi(p), (v) => data.psi.push(v));
  }

  return data;
}

function samplePull() {
  const q = (query, imp, clicks, pos) => ({ keys: [query], impressions: imp, clicks, ctr: clicks / imp, position: pos });
  const p = (page, imp, clicks, pos) => ({ keys: [`${cfg.siteUrl}${page}`], impressions: imp, clicks, ctr: clicks / imp, position: pos });
  return {
    sample: true,
    queries: [
      q("luma films", 88, 41, 1.2),
      q("luma films arkansas", 34, 19, 1.1),
      q("wedding videographer little rock", 210, 3, 14.6),
      q("the venue at oakdale wedding", 96, 5, 7.8),
      q("legacy acres wedding video", 61, 4, 6.2),
      q("anthony chapel wedding videographer", 74, 1, 18.9),
      q("wedding videographer conway ar", 122, 2, 17.3),
      q("crystal bridges wedding", 158, 2, 22.4),
      q("stonebrook meadows wedding", 41, 3, 5.9),
      q("capital hotel little rock wedding", 55, 1, 11.2),
    ],
    pages: [
      p("/", 130, 52, 2.1),
      p("/venues/the-venue-at-oakdale", 118, 6, 7.9),
      p("/wedding-videographer/little-rock", 195, 3, 14.9),
      p("/venues/legacy-acres", 66, 4, 6.4),
      p("/wedding-videographer/conway", 101, 2, 17.5),
      p("/venues/garvan-woodland-gardens", 70, 1, 19.1),
    ],
    queryPages: [
      { keys: ["wedding videographer little rock", `${cfg.siteUrl}/wedding-videographer/little-rock`], impressions: 190, clicks: 3, ctr: 0.016, position: 14.6 },
      { keys: ["the venue at oakdale wedding", `${cfg.siteUrl}/venues/the-venue-at-oakdale`], impressions: 92, clicks: 5, ctr: 0.054, position: 7.8 },
      { keys: ["anthony chapel wedding videographer", `${cfg.siteUrl}/venues/garvan-woodland-gardens`], impressions: 70, clicks: 1, ctr: 0.014, position: 18.9 },
      { keys: ["wedding videographer conway ar", `${cfg.siteUrl}/wedding-videographer/conway`], impressions: 118, clicks: 2, ctr: 0.017, position: 17.3 },
    ],
    sitemaps: [{ path: `${cfg.siteUrl}/sitemap.xml`, lastSubmitted: end, isPending: false, warnings: "0", errors: "0" }],
    ga4: {
      channels: [
        { channel: "Organic Search", sessions: 84, users: 71 },
        { channel: "Direct", sessions: 52, users: 40 },
        { channel: "Organic Social", sessions: 31, users: 29 },
        { channel: "Referral", sessions: 9, users: 8 },
      ],
      landing: [
        { page: "/", sessions: 92 },
        { page: "/venues/the-venue-at-oakdale", sessions: 21 },
        { page: "/films", sessions: 18 },
        { page: "/wedding-videographer/little-rock", sessions: 12 },
        { page: "/packages", sessions: 11 },
      ],
      events: [
        { event: "cta_click", count: 38 },
        { event: "video_play", count: 64 },
        { event: "scroll_depth", count: 412 },
        { event: "form_start", count: 9 },
      ],
      contactViews: [{ page: "/contact", views: 26 }],
    },
    psi: [
      { page: "/", performance: 88, lcp: "3.6 s", cls: "0", tbt: "140 ms" },
      { page: "/venues/the-venue-at-oakdale", performance: 90, lcp: "2.9 s", cls: "0", tbt: "110 ms" },
      { page: "/wedding-videographer/little-rock", performance: 94, lcp: "2.1 s", cls: "0", tbt: "90 ms" },
    ],
  };
}

const data = SAMPLE ? samplePull() : await realPull();
const out = {
  pulledAt: new Date().toISOString(),
  window: { start, end },
  site: cfg.scSite,
  ...data,
  errors,
};
const file = path.join(outDir, `${end}${SAMPLE ? "-SAMPLE" : ""}.json`);
fs.writeFileSync(file, JSON.stringify(out, null, 2) + "\n");
console.log(`Wrote ${path.relative(process.cwd(), file)} (window ${start} → ${end})${SAMPLE ? " [SAMPLE DATA]" : ""}`);
if (errors.length) {
  console.error(`\n${errors.length} source(s) failed:`);
  for (const e of errors) console.error("  -", e);
}
