import fs from "node:fs";
import path from "node:path";

/** Minimal .env loader — real env vars always win over the file. */
export function loadEnv() {
  const file = path.join(process.cwd(), ".env");
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}

export function config() {
  loadEnv();
  return {
    keyFile: process.env.SEO_AGENT_KEY_FILE || process.env.GOOGLE_APPLICATION_CREDENTIALS,
    ga4PropertyId: process.env.GA4_PROPERTY_ID,
    // Domain property, per the Search Console setup in the launch handoff
    scSite: process.env.SC_SITE || "sc-domain:lumaweddingfilms.co",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://lumaweddingfilms.co",
  };
}
