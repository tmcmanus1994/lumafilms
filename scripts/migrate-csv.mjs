#!/usr/bin/env node
/**
 * Framer CMS → file-based CMS migration.
 *
 * Usage:  node scripts/migrate-csv.mjs path/to/couple.csv [--force]
 *
 * Column mapping is exact to the Framer "couple" collection export (July 2026).
 * Fixed speech/bonus columns collapse into the flexible `extras` array; venue
 * names are extracted from the highlight title ("Laken + Robert // Hedge Farm")
 * and mapped to venue-page slugs + cities where known.
 *
 * Existing files are never overwritten unless --force is passed.
 */
import fs from "node:fs";
import path from "node:path";

const [, , csvPath, ...flags] = process.argv;
const force = flags.includes("--force");

if (!csvPath) {
  console.error("Usage: node scripts/migrate-csv.mjs path/to/couple.csv [--force]");
  process.exit(1);
}

// Minimal CSV parser handling quoted fields with commas/newlines
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.some((f) => f !== "")) rows.push(row);
      row = [];
    } else {
      field += ch;
    }
  }
  if (field !== "" || row.length) {
    row.push(field);
    if (row.some((f) => f !== "")) rows.push(row);
  }
  return rows;
}

/** Parsed venue name (lowercased) → { slug, city } for content/venues linkage. */
const VENUE_MAP = {
  "hedge farm": { slug: "hedge-farm" },
  "stone chapel at mattlane farm": { slug: "stone-chapel-at-mattlane-farm" },
  "barn at the springs": { slug: "barn-at-the-springs" },
  "the cordelle": { slug: "the-cordelle" },
  "crystal bridges": { slug: "crystal-bridges", city: "bentonville" },
  "the venue at oakdale": { slug: "the-venue-at-oakdale", city: "conway" },
  "the venue at stonebrook meadows": { slug: "stonebrook-meadows" },
  "mildred b. cooper memorial chapel": { slug: "mildred-b-cooper-memorial-chapel", city: "bentonville" },
  "albert pike memorial temple": { slug: "albert-pike-memorial-temple", city: "little-rock" },
  "bella terra estate": { slug: "bella-terra-estate" },
  "legacy acres": { slug: "legacy-acres", city: "conway" },
  "mccoy's little red barn": { slug: "mccoys-little-red-barn" },
  "hudson springs": { slug: "hudson-springs" },
  "hudson spring": { slug: "hudson-springs" },
  "loft 1023": { slug: "loft-1023" },
  "osage house": { slug: "osage-house" },
  "the barn at fawn hollow": { slug: "barn-at-fawn-hollow" },
  "the barn at greers ferry lake": { slug: "barn-at-greers-ferry-lake" },
  "cathedral of st andrew": { slug: "cathedral-of-st-andrew", city: "little-rock" },
  "capital hotel": { slug: "capital-hotel", city: "little-rock" },
  // Typos in the source data, mapped to the intended venues:
  "angelos gardan": { slug: "angelos-garden", name: "Angelo's Garden" },
  "chenal county club": { slug: "chenal-country-club", city: "little-rock", name: "Chenal Country Club" },
  "dove hollow estate": { slug: "dove-hollow-estate" },
  "dove hollow estates": { slug: "dove-hollow-estate", name: "Dove Hollow Estate" },
  "kindred barn": { slug: "kindred-barn" },
  "grandeur house": { slug: "grandeur-house", city: "little-rock" },
};

/** Rows that should not get a public film page without review. */
const PRIVATE_ONLY = new Set([
  "burks", // highlight title is "Your Raw Footage" — no venue, portal-only delivery
  "sample", // Framer template demo row — verify before publishing
]);

const text = fs.readFileSync(csvPath, "utf8");
const [header, ...rows] = parseCsv(text);
const idx = Object.fromEntries(header.map((h, i) => [h.trim(), i]));
const need = (name) => {
  if (!(name in idx)) {
    console.error(`Missing expected column: "${name}"`);
    process.exit(1);
  }
  return name;
};

const outDir = path.join(process.cwd(), "content", "weddings");
fs.mkdirSync(outDir, { recursive: true });

let written = 0;
let skipped = 0;
const report = [];

for (const row of rows) {
  const get = (name) => (row[idx[need(name)]] ?? "").trim();

  const slug = get("Slug");
  if (!slug) continue;

  const highlightTitle = get("Couple Highlight Video Title");
  const rawVenue = highlightTitle.includes("//")
    ? highlightTitle.split("//").pop().trim()
    : "";
  const mapped = VENUE_MAP[rawVenue.toLowerCase()] ?? {};

  const extras = [];
  const addExtra = (label, vimeo, download) => {
    if (!vimeo && !download) return;
    // Source data occasionally duplicates a bonus row — keep the first
    if (extras.some((e) => e.label === label && e.vimeo === vimeo)) return;
    extras.push({ label, vimeo, download });
  };

  addExtra("First Look", get("First Look"), get("First Look Download"));
  addExtra("First Look with Dad", get("First Look with Dad"), get("First Look w/ Dad Download"));
  addExtra("Best Man Speech", get("Best Man Speech"), get("Best Man Speech Download"));
  addExtra("Maid of Honor Speech", get("Maid of Honor Speech"), get("Maid of Honor Speech Download"));
  for (const n of [1, 2, 3]) {
    const label = get(`Additional Speech Title #${n}`).replace(/^.*\/\/\s*/, "") || `Speech #${n}`;
    addExtra(label, get(`Additional Speech Title #${n} Video`), get(`Additional Speech #${n} Download`));
  }
  for (const n of [1, 2, 3, 4, 5]) {
    const label = get(`Bonus Video #${n}`) || `Bonus Video #${n}`;
    addExtra(label, get(`Bonus Video #${n} Video`), get(`Bonus Video #${n} Download`));
  }

  const wedding = {
    couple: get("Couple's First Name"),
    lastName: get("Couple's Last Name").trim(),
    weddingDate: "",
    venue: {
      name: mapped.name ?? rawVenue,
      slug: mapped.slug ?? "",
      city: mapped.city ?? "",
    },
    coverPhoto: get("Cover Photo"),
    coverPhotoAlt: get("Cover Photo:alt"),
    public: !PRIVATE_ONLY.has(slug) && Boolean(rawVenue),
    passcode: null,
    story: "",
    highlight: {
      title: highlightTitle,
      vimeo: get("Highlight Video"),
      download: get("Highlight Video Download"),
    },
    ceremony: {
      vimeo: get("Ceremony Video") || get("Ceremony Video (YT)"),
      download: get("Ceremony Video Download"),
    },
    instagramReel: {
      vimeo: get("Instagram Reel"),
      download: get("Instagram Reel Download"),
    },
    rawFootageFolder: get("Raw Footage Folder") || null,
    extras,
  };

  report.push({
    slug,
    couple: wedding.couple,
    venue: rawVenue || "(none)",
    venuePage: mapped.slug ?? "",
    public: wedding.public,
  });

  const file = path.join(outDir, `${slug}.json`);
  if (fs.existsSync(file) && !force) {
    skipped++;
    continue;
  }
  fs.writeFileSync(file, JSON.stringify(wedding, null, 2) + "\n");
  written++;
}

console.log(`Wrote ${written} wedding file(s), skipped ${skipped} existing (use --force to overwrite).`);
console.table(report);
console.log("Next: manual pass for weddingDate, story, and any venue marked (none).");
