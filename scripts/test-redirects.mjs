#!/usr/bin/env node
/**
 * Launch-handoff §1.3: assert every legacy URL 301/308s to the right place.
 *
 * Usage:
 *   node scripts/test-redirects.mjs                          # local (http://127.0.0.1:3000)
 *   node scripts/test-redirects.mjs https://lumaweddingfilms.co   # after DNS flips
 *
 * Reads the wedding slugs from content/weddings so the list can never drift
 * from the redirects next.config generates from the same directory.
 */
import fs from "node:fs";
import path from "node:path";

const base = (process.argv[2] ?? "http://127.0.0.1:3000").replace(/\/$/, "");

const weddingSlugs = fs
  .readdirSync(path.join(process.cwd(), "content", "weddings"))
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.replace(/\.json$/, ""));

const cases = [
  ...weddingSlugs.map((slug) => [`/${slug}`, `/couples/${slug}`]),
  ["/their-story", "/films"],
  ["/our-story", "/about"],
  ["/my-story", "/about"],
];

let pass = 0;
let fail = 0;

for (const [from, to] of cases) {
  try {
    const res = await fetch(`${base}${from}`, { redirect: "manual" });
    const loc = res.headers.get("location") ?? "";
    const locPath = loc.startsWith("http") ? new URL(loc).pathname : loc;
    const permanent = res.status === 301 || res.status === 308;
    if (permanent && locPath === to) {
      pass++;
    } else {
      fail++;
      console.error(`FAIL ${from} → got ${res.status} ${locPath || "(no location)"} (want 301/308 → ${to})`);
    }
  } catch (err) {
    fail++;
    console.error(`FAIL ${from} → ${err.message}`);
  }
}

console.log(`\n${pass}/${cases.length} redirects correct${fail ? ` — ${fail} FAILED` : " ✓"}`);
process.exit(fail ? 1 : 0);
