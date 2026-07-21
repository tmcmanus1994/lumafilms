#!/usr/bin/env node
/**
 * Framer CMS → file-based CMS migration.
 *
 * Usage:  node scripts/migrate-csv.mjs path/to/couple.csv
 *
 * Parses the Framer "couple" collection export (48 flat columns) and writes one
 * content/weddings/[slug].json per row, collapsing the fixed speech/bonus
 * columns into the flexible `extras` array. Venue names are extracted from the
 * highlight title ("Laken + Robert // Hedge Farm" → "Hedge Farm").
 *
 * After running, do the manual pass (rebuild plan §5): fill venue.city,
 * venue.slug, weddingDate, and set public/story for couples going on /films.
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

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const text = fs.readFileSync(csvPath, "utf8");
const [header, ...rows] = parseCsv(text);
const idx = Object.fromEntries(header.map((h, i) => [norm(h), i]));

// Fuzzy column lookup — Framer exports vary in exact header names
function col(row, ...candidates) {
  for (const c of candidates) {
    const key = Object.keys(idx).find((k) => k.includes(norm(c)));
    if (key !== undefined) {
      const v = row[idx[key]]?.trim();
      if (v) return v;
    }
  }
  return "";
}

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const outDir = path.join(process.cwd(), "content", "weddings");
fs.mkdirSync(outDir, { recursive: true });

let written = 0;
let skipped = 0;

for (const row of rows) {
  const slug = col(row, "slug") || slugify(col(row, "last name", "name", "couple"));
  if (!slug) continue;

  const highlightTitle = col(row, "highlight title", "title");
  const venueFromTitle = highlightTitle.includes("//")
    ? highlightTitle.split("//").pop().trim()
    : "";

  // Fixed speech/bonus columns → flexible extras array
  const extraLabels = [
    "Best Man Speech",
    "Maid of Honor Speech",
    "Father of the Bride Speech",
    "Mother of the Bride Speech",
    "Father of the Groom Speech",
    "Toasts",
    "First Look",
    "First Dance",
    "Bonus Video 1",
    "Bonus Video 2",
    "Bonus Video 3",
    "Bonus Video 4",
  ];
  const extras = extraLabels
    .map((label) => ({
      label,
      vimeo: col(row, `${label} vimeo`, `${label} link`, label),
      download: col(row, `${label} download`),
    }))
    .filter((e) => e.vimeo || e.download);

  const wedding = {
    couple: col(row, "couple", "names", "display name"),
    lastName: col(row, "last name"),
    weddingDate: "",
    venue: { name: venueFromTitle, slug: venueFromTitle ? slugify(venueFromTitle) : "", city: "" },
    coverPhoto: col(row, "cover photo", "cover image", "image"),
    coverPhotoAlt: "",
    public: false,
    passcode: null,
    story: "",
    highlight: {
      title: highlightTitle,
      vimeo: col(row, "highlight vimeo", "highlight link", "highlight"),
      download: col(row, "highlight download", "4k download", "download"),
    },
    ceremony: {
      vimeo: col(row, "ceremony vimeo", "ceremony link", "ceremony"),
      download: col(row, "ceremony download"),
    },
    instagramReel: {
      vimeo: col(row, "instagram reel vimeo", "reel vimeo", "instagram reel"),
      download: col(row, "instagram reel download", "reel download"),
    },
    rawFootageFolder: col(row, "raw footage") || null,
    extras,
  };

  const file = path.join(outDir, `${slug}.json`);
  if (fs.existsSync(file) && !force) {
    skipped++;
    continue;
  }
  fs.writeFileSync(file, JSON.stringify(wedding, null, 2) + "\n");
  written++;
}

console.log(`Wrote ${written} wedding file(s), skipped ${skipped} existing (use --force to overwrite).`);
console.log("Next: manual pass for venue.city / venue.slug / weddingDate / public / story.");
