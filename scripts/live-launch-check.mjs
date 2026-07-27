#!/usr/bin/env node
/**
 * Launch-day live health check (handoff §2.4) — run against the production
 * domain after DNS flips:
 *
 *   node scripts/live-launch-check.mjs https://lumaweddingfilms.co
 *
 * Rerun trigger: v3 (post-www-redirect-config)
 * Verifies the launch-critical SEO surface on the real URL: page availability,
 * canonicals, noindex scope, sitemap/robots, portal headers, and the www→apex
 * redirect.
 */
const base = (process.argv[2] ?? "https://lumaweddingfilms.co").replace(/\/$/, "");
const host = new URL(base).host;

let pass = 0;
let fail = 0;
const ok = (label, cond, detail = "") => {
  if (cond) {
    pass++;
    console.log(`  ✓ ${label}`);
  } else {
    fail++;
    console.error(`  ✗ ${label}${detail ? ` — ${detail}` : ""}`);
  }
};

const get = (path, opts = {}) => fetch(`${base}${path}`, { redirect: "manual", ...opts });

// Key public pages: 200, canonical, indexable
const pages = [
  "/",
  "/films",
  "/venues",
  "/packages",
  "/about",
  "/contact",
  "/venues/the-venue-at-oakdale",
  "/wedding-videographer/little-rock",
  "/films/rachel-zane-legacy-acres",
];
console.log("\nPublic pages:");
for (const p of pages) {
  const res = await get(p);
  const html = res.status === 200 ? await res.text() : "";
  ok(`${p} → 200`, res.status === 200, `got ${res.status}`);
  if (html) {
    ok(`${p} canonical`, html.includes(`rel="canonical" href="${base}${p === "/" ? "" : p}`));
    ok(`${p} indexable`, !html.includes('name="robots" content="noindex'));
  }
}

// Portal: noindex both ways, present, excluded everywhere
console.log("\nPrivate portal:");
{
  const res = await get("/couples/thompson");
  const html = res.status === 200 ? await res.text() : "";
  ok("/couples/thompson → 200", res.status === 200, `got ${res.status}`);
  ok("X-Robots-Tag noindex header", (res.headers.get("x-robots-tag") ?? "").includes("noindex"));
  ok("noindex meta tag", html.includes('name="robots" content="noindex'));
}

// Sitemap + robots
console.log("\nSitemap & robots:");
{
  const res = await get("/sitemap.xml");
  const xml = res.status === 200 ? await res.text() : "";
  const urls = (xml.match(/<loc>/g) ?? []).length;
  ok(`sitemap.xml → 200 with ${urls} URLs`, res.status === 200 && urls > 60, `got ${res.status}, ${urls} URLs`);
  ok("sitemap has zero /couples/ URLs", !xml.includes("/couples/"));
  ok("sitemap URLs use the live host", xml.includes(`https://${host.replace(/^www\./, "")}`));

  const rob = await get("/robots.txt");
  const txt = rob.status === 200 ? await rob.text() : "";
  ok("robots.txt disallows /couples/", txt.includes("Disallow: /couples/"));
  ok("robots.txt references sitemap", txt.toLowerCase().includes("sitemap:"));
}

// www → apex (or vice versa) — one primary host
console.log("\nDomain canonicalization:");
{
  const alt = host.startsWith("www.") ? host.replace(/^www\./, "") : `www.${host}`;
  try {
    const res = await fetch(`https://${alt}/`, { redirect: "manual" });
    const loc = res.headers.get("location") ?? "";
    ok(
      `${alt} redirects to ${host}`,
      [301, 302, 307, 308].includes(res.status) && loc.includes(host),
      `got ${res.status} → ${loc || "(none)"}`
    );
  } catch (e) {
    fail++;
    console.error(`  ✗ ${alt} unreachable — ${e.message}`);
  }
}

// 404 behavior
console.log("\n404:");
{
  const res = await get("/this-page-should-not-exist-xyz");
  ok("unknown path returns 404", res.status === 404, `got ${res.status}`);
}

console.log(`\n${pass} passed, ${fail} failed ${fail ? "✗" : "✓"}`);
process.exit(fail ? 1 : 0);
