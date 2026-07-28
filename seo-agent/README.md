# Luma SEO Agent — Phase 1 (report-only)

Watches search performance and writes a weekly plain-language digest.
Full spec: `docs/seo-agent-spec.md`. Zero npm dependencies — plain Node +
Google's REST APIs.

## How it runs

- **Scheduled:** `.github/workflows/seo-agent.yml` runs every Monday morning,
  pulls the data, generates the digest, and commits both to the repo. Read the
  report in `seo-data/reports/` (or from the Actions run summary).
- **On demand:** Actions tab → "SEO agent — weekly pull + digest" → Run workflow.
- **Locally:** `npm run seo:pull` then `npm run seo:digest`.
- **Preview without credentials:** `node seo-agent/pull.mjs --sample` then
  `npm run seo:digest` — synthetic data, clearly labeled SAMPLE.

## One-time setup (Travelle — spec Part 1, ~45 min)

1. Create the Google Cloud project + service account and download its JSON key
   (spec §1.1). **The key is a password. Never commit it.**
2. Grant the service-account email access (spec §1.2):
   - Search Console → Settings → Users and permissions → Add → **Full**
   - GA4 → Admin → Property access management → Add → **Viewer**
3. Add two GitHub repo secrets (Settings → Secrets and variables → Actions):
   - `SEO_AGENT_KEY_JSON` — paste the entire contents of the key file
   - `GA4_PROPERTY_ID` — GA4 → Admin → Property details → the numeric Property ID
4. Run the workflow once by hand from the Actions tab to confirm data flows.

For local runs, `.env` at the repo root:

```
SEO_AGENT_KEY_FILE=/absolute/path/outside/repo/seo-agent-key.json
GA4_PROPERTY_ID=123456789
```

## Data layout

- `seo-data/pulls/YYYY-MM-DD.json` — one file per weekly pull (7-day window
  ending 3 days back, because Search Console data lags). History accumulates
  here; the digest compares the newest pull to the prior week's.
- `seo-data/reports/YYYY-MM-DD-weekly.md` — the digest, spec Part 3 format.
- `seo-data/changelog.md` — every approved SEO change with its baseline metric
  (used from Phase 3 onward to measure whether changes worked).

## Phases (spec Part 6)

- **Phase 1 (now):** report-only. Recommendations appear in the digest but
  nothing is ever changed automatically.
- **Phase 2 (week 4+):** recommendations get real teeth as history accumulates.
- **Phase 3 (month 2+):** the action path — approved recommendations become
  branches with Vercel previews. Guardrails in spec Part 5 apply: never touch
  prices, testimonials, insider-knowledge copy, the portal, or business facts;
  max 3 changes/week; 3-week cooldown per item; every change logged with its
  baseline.
