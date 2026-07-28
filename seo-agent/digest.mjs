#!/usr/bin/env node
/**
 * SEO agent — weekly digest generator (spec Part 3). Report-only (Phase 1).
 *
 *   node seo-agent/digest.mjs          # digest the newest pull vs the prior week
 *
 * Reads seo-data/pulls/, compares the latest pull to the most recent one at
 * least 6 days older, writes seo-data/reports/<date>-weekly.md, prints it.
 */
import fs from "node:fs";
import path from "node:path";

const pullsDir = path.join(process.cwd(), "seo-data", "pulls");
const reportsDir = path.join(process.cwd(), "seo-data", "reports");
fs.mkdirSync(reportsDir, { recursive: true });

let pulls = fs
  .readdirSync(pullsDir)
  .filter((f) => f.endsWith(".json"))
  .sort();
// Sample pulls are output-shape previews only — never mix them with real
// data. Use them solely when no real pull exists yet.
const realPulls = pulls.filter((f) => !f.includes("-SAMPLE"));
if (realPulls.length) pulls = realPulls;
if (!pulls.length) {
  console.error("No pulls found — run `node seo-agent/pull.mjs` first.");
  process.exit(1);
}
const load = (f) => JSON.parse(fs.readFileSync(path.join(pullsDir, f), "utf8"));
const current = load(pulls[pulls.length - 1]);
const prevFile = [...pulls]
  .reverse()
  .find((f) => {
    const p = load(f);
    return new Date(current.window.end) - new Date(p.window.end) >= 6 * 864e5;
  });
const previous = prevFile ? load(prevFile) : null;

const key = (row) => row.keys[0];
const pathOf = (url) => {
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
};
const pct = (n) => `${(n * 100).toFixed(1)}%`;
const posStr = (n) => n.toFixed(1);
const qmap = (rows) => new Map((rows ?? []).map((r) => [key(r), r]));

const curQ = qmap(current.queries);
const prevQ = previous ? qmap(previous.queries) : new Map();

// --- Movement (needs a previous week) ---
const gained = [];
const lost = [];
const fresh = [];
for (const [q, row] of curQ) {
  const before = prevQ.get(q);
  if (!before) {
    if (row.impressions >= 5) fresh.push(row);
    continue;
  }
  const delta = before.position - row.position; // positive = improved
  if (row.impressions >= 5 && Math.abs(delta) >= 1) {
    (delta > 0 ? gained : lost).push({ ...row, delta });
  }
}
gained.sort((a, b) => b.delta - a.delta);
lost.sort((a, b) => a.delta - b.delta);
fresh.sort((a, b) => b.impressions - a.impressions);

// --- Striking distance: positions 5–20 by impressions ---
const pageFor = (q) => {
  const match = (current.queryPages ?? []).find((r) => r.keys[0] === q);
  return match ? pathOf(match.keys[1]) : null;
};
const striking = [...curQ.values()]
  .filter((r) => r.position >= 5 && r.position <= 20)
  .sort((a, b) => b.impressions - a.impressions)
  .slice(0, 10);

// --- Leaks: seen a lot, clicked a little ---
const leaks = [...curQ.values()]
  .filter((r) => r.impressions >= 20 && r.ctr < 0.02 && r.position <= 20)
  .sort((a, b) => b.impressions - a.impressions)
  .slice(0, 5);

// --- Traffic ---
const ga4 = current.ga4 ?? {};
const totalSessions = (ga4.channels ?? []).reduce((s, c) => s + c.sessions, 0);
const organic = (ga4.channels ?? []).find((c) => c.channel === "Organic Search")?.sessions ?? 0;
const prevSessions = previous ? (previous.ga4?.channels ?? []).reduce((s, c) => s + c.sessions, 0) : null;
const events = new Map((ga4.events ?? []).map((e) => [e.event, e.count]));
const contactViews = (ga4.contactViews ?? []).reduce((s, c) => s + c.views, 0);

// --- Health ---
const health = [];
for (const s of current.sitemaps ?? []) {
  if (+s.errors > 0) health.push(`Sitemap errors: ${s.errors} (${s.path})`);
  if (+s.warnings > 0) health.push(`Sitemap warnings: ${s.warnings} (${s.path})`);
}
for (const p of current.psi ?? []) {
  if (p.performance < 80) health.push(`PageSpeed ${p.page}: performance ${p.performance} (LCP ${p.lcp})`);
  if (p.cls && parseFloat(p.cls) > 0.1) health.push(`CLS regression on ${p.page}: ${p.cls}`);
}
for (const e of current.errors ?? []) health.push(`Data pull failure — ${e}`);

// --- Recommendations (max 3, report-only in Phase 1) ---
const recs = [];
for (const leak of leaks.slice(0, 2)) {
  const page = pageFor(key(leak));
  recs.push(
    `Rewrite the title/meta description ${page ? `on \`${page}\` ` : ""}for "${key(leak)}" — ` +
      `${leak.impressions} impressions at position ${posStr(leak.position)} but only ${pct(leak.ctr)} CTR. ` +
      `Baseline: ${leak.clicks} clicks/wk.`
  );
}
for (const s of striking) {
  if (recs.length >= 3) break;
  const page = pageFor(key(s));
  if (leaks.some((l) => key(l) === key(s))) continue;
  recs.push(
    `Push "${key(s)}" (position ${posStr(s.position)}, ${s.impressions} impressions/wk${page ? `, lands on \`${page}\`` : ""}) — ` +
      `add 2–3 internal links to that page from related film/venue pages.`
  );
}

// --- Headline ---
let headline;
if (!previous) {
  headline = `First full data week on record: ${curQ.size} queries, ${totalSessions} sessions — the baseline every future week gets measured against.`;
} else if (gained.length && gained[0].delta >= 3) {
  const g = gained[0];
  headline = `"${key(g)}" jumped ${g.delta.toFixed(1)} positions to ${posStr(g.position)} — the week's biggest win.`;
} else if (striking.length) {
  const s = striking[0];
  headline = `Biggest opportunity: "${key(s)}" sits at position ${posStr(s.position)} with ${s.impressions} impressions — one push from page one.`;
} else {
  headline = `Steady week: ${totalSessions} sessions, ${curQ.size} ranking queries, no major movement.`;
}

// --- Render ---
const L = [];
const section = (title) => L.push("", `## ${title}`, "");
L.push(`# LUMA SEO — WEEK OF ${current.window.end}`);
L.push("");
L.push(`*Window ${current.window.start} → ${current.window.end}${previous ? ` · compared to ${previous.window.start} → ${previous.window.end}` : " · no prior week yet"}${current.sample ? " · **SAMPLE DATA — output-shape preview only**" : ""}*`);

section("The Headline");
L.push(headline);

section("Movement");
if (!previous) {
  L.push("*First week of data — movement tracking starts next week.*");
} else {
  for (const g of gained.slice(0, 5)) L.push(`- ↑ "${key(g)}" improved ${g.delta.toFixed(1)} → position ${posStr(g.position)} (${g.impressions} impressions)`);
  for (const l of lost.slice(0, 5)) L.push(`- ↓ "${key(l)}" dropped ${Math.abs(l.delta).toFixed(1)} → position ${posStr(l.position)} (${l.impressions} impressions)`);
  if (!gained.length && !lost.length) L.push("*No position changes ≥1 among established queries.*");
}
for (const n of fresh.slice(0, 5)) L.push(`- ★ New: "${key(n)}" at position ${posStr(n.position)} (${n.impressions} impressions)`);

section("Striking Distance");
if (striking.length) {
  L.push("| Query | Position | Impressions | Clicks | Page |");
  L.push("|---|---|---|---|---|");
  for (const s of striking) L.push(`| ${key(s)} | ${posStr(s.position)} | ${s.impressions} | ${s.clicks} | ${pageFor(key(s)) ?? "—"} |`);
} else {
  L.push("*Nothing in positions 5–20 yet.*");
}

section("Leaks");
if (leaks.length) {
  for (const l of leaks) L.push(`- "${key(l)}" — ${l.impressions} impressions, ${pct(l.ctr)} CTR at position ${posStr(l.position)}${pageFor(key(l)) ? ` (\`${pageFor(key(l))}\`)` : ""}`);
} else {
  L.push("*No high-impression / low-CTR queries this week.*");
}

section("Traffic & Inquiries");
L.push(`- Sessions: **${totalSessions}**${prevSessions !== null ? ` (prev week ${prevSessions})` : ""} — ${organic} from organic search`);
L.push(`- Top landing pages: ${(ga4.landing ?? []).slice(0, 5).map((l) => `\`${l.page}\` (${l.sessions})`).join(" · ") || "—"}`);
L.push(`- Contact page views: **${contactViews}** · form starts: **${events.get("form_start") ?? 0}** · CTA clicks: **${events.get("cta_click") ?? 0}** · film plays: **${events.get("video_play") ?? 0}**`);

section("Health");
if (health.length) for (const h of health) L.push(`- ⚠ ${h}`);
else L.push("*All clear — sitemap clean, Core Web Vitals within targets, all data sources pulled.*");

section("This Week's Recommendations (report-only)");
if (recs.length) {
  recs.slice(0, 3).forEach((r, i) => L.push(`${i + 1}. ${r}`));
  L.push("", "*Phase 1: nothing is changed automatically — these are for your review. The branch-and-preview action path arrives in Phase 3.*");
} else {
  L.push("*Not enough signal yet — recommendations begin once a few weeks of data accumulate (spec Phase 2).*");
}

const report = L.join("\n") + "\n";
const outFile = path.join(reportsDir, `${current.window.end}-weekly${current.sample ? "-SAMPLE" : ""}.md`);
fs.writeFileSync(outFile, report);
console.log(report);
console.error(`\nSaved to ${path.relative(process.cwd(), outFile)}`);
