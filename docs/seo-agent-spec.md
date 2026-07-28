# Luma Films — SEO Agent Build Spec

An agent that watches your search performance, tells you what's happening in plain language, and eventually proposes fixes as reviewable code changes.

**Autonomy model:** the agent proposes, you dispose. Every change lands on a branch with a Vercel preview deploy. Nothing reaches production without your merge.

---

# PART 0 — HOW THIS WORKS (plain language)

Three pieces, same pattern as your Pedal Party and Central Church automations:

1. **A data pull.** A script authenticates to Google's APIs and downloads your search and traffic numbers into local files.
2. **A scheduled Claude task.** On a schedule, Claude reads those files, compares them to previous weeks, and writes you a report.
3. **An action path.** When the report recommends a change, Claude Code edits the relevant content file, opens a branch, and Vercel builds a preview for you to review.

The agent doesn't "watch" the site continuously — it wakes up on a schedule, looks at fresh data, thinks, writes, and goes back to sleep. That's all an agent is here: a scheduled thinking job with tools.

---

# PART 1 — SETUP (Travelle, one time, ~45 min)

## 1.1 Google Cloud service account
1. console.cloud.google.com → create a project named `luma-seo-agent`
2. **APIs & Services → Library** → enable **Google Search Console API** and **Google Analytics Data API**
3. **APIs & Services → Credentials → Create Credentials → Service Account**. Name it `seo-agent`. Skip the optional role steps.
4. Click the new service account → **Keys → Add Key → Create new key → JSON**. A file downloads. **This file is a password — never commit it to the repo.**
5. Copy the service account's email address (looks like `seo-agent@luma-seo-agent.iam.gserviceaccount.com`)

## 1.2 Grant it access to your data
- **Search Console:** search.google.com/search-console → Settings → Users and permissions → Add user → paste the service account email → permission **Full** (needed for the API)
- **GA4:** analytics.google.com → Admin → Property access management → Add → paste the same email → role **Viewer**

## 1.3 Store the key safely
Put the JSON file somewhere outside the repo (e.g. `~/.config/luma/seo-agent-key.json`) and add its path to a `.env` file the repo ignores. Confirm `.gitignore` covers `.env` and `*.json` keys before the first commit.

> **If any of this stalls, tell Claude Code the error.** Service-account permission issues are extremely common and usually one-line fixes.

---

# PART 2 — WHAT THE AGENT PULLS

Store each pull as a dated file in `/seo-data/` so history builds up locally and reports can compare week over week.

| Source | Data | Frequency |
|---|---|---|
| Search Console API | Queries: impressions, clicks, CTR, avg position | Weekly |
| Search Console API | Pages: same metrics, per URL | Weekly |
| Search Console API | Index coverage / errors | Weekly |
| GA4 Data API | Sessions, users, sources, landing pages | Weekly |
| GA4 Data API | Contact page views + form-submit events | Weekly |
| PageSpeed Insights API | Core Web Vitals, homepage + 2 rotating pages | Weekly |
| Repo files | Current titles, meta descriptions, internal links | On demand |

**Important lag note:** Search Console data runs 2–3 days behind. Always pull a window ending 3 days ago so numbers don't shift under you.

---

# PART 3 — THE WEEKLY DIGEST

Runs **Monday morning**. Short, scannable, ends with actions. Format:

```
LUMA SEO — WEEK OF [DATE]

THE HEADLINE
One sentence: what actually matters this week.

MOVEMENT
↑ Pages that gained position (with the query and the jump)
↓ Pages that lost position
★ New queries you appeared for this week

STRIKING DISTANCE  ← the money section
Queries ranking positions 5–20. These are one small push from
page-one traffic. Ranked by impressions, so the biggest
opportunities sit at the top.

LEAKS
Pages with high impressions but low CTR — people see you in
results and don't click. Usually a title/meta description problem.

TRAFFIC & INQUIRIES
Sessions, top landing pages, contact-page views, form submits.

HEALTH
Index errors, Core Web Vitals flags, anything broken.

THIS WEEK'S RECOMMENDATIONS (max 3)
Specific, with the exact change proposed.
```

**Why max 3 recommendations:** change discipline. If the agent alters twelve things a week, you can never tell which change caused which result. A few deliberate changes, then wait for the data. This rule is the difference between an SEO agent and a random-number generator.

---

# PART 4 — THE MONTHLY DEEP-DIVE

Runs the **1st of each month**. Everything the weekly does, plus:

**Page scorecard.** Every venue and city page listed with its target query, current position, impressions, clicks, and month-over-month change. Instantly shows which of your 15 SEO pages are working and which are dead weight.

**Competitor check.** For your core queries ("wedding videographer little rock," "wedding videographer conway ar," plus 3–4 venue queries), who ranks above you and what do they have that you don't — more pages, reviews, backlinks, better titles. Names and specifics, not vibes.

**Content gaps.** Queries you're getting impressions for that don't have a dedicated page yet. This is how you find your next venue page, city page, or blog topic — driven by real demand rather than guessing. Also flags: venues from your wedding data that don't have pages yet.

**Google Business Profile.** Views, searches, actions, review count and velocity. GBP drives the map pack, so it gets its own section.

**Quarterly-ish extras** (whenever relevant): backlink/citation check — where you're mentioned online, which wedding directories list you, whether NAP details match everywhere.

---

# PART 5 — THE ACTION PATH (how fixes happen)

When a recommendation is approved:

1. Claude Code creates a branch: `seo/YYYY-MM-DD-short-description`
2. Makes the edit in the relevant content or metadata file
3. Commits with a message stating the *reason* and *baseline*: e.g. `SEO: rewrite Conway meta description — CTR 1.2% at position 8, baseline 47 impressions/wk`
4. Opens the branch; Vercel builds a **preview URL**
5. You review the preview, then merge or reject
6. **Log the change** in `/seo-data/changelog.md` with the date and the baseline metric — this is how the agent measures its own results later

## Guardrails — what the agent may and may not touch

**MAY edit:**
- Meta titles and descriptions
- Internal linking (adding contextual links between venue/city/film pages)
- Image alt text
- Adding FAQ entries to city pages
- Structured data fields
- Sitemap priorities

**MUST NEVER edit:**
- Prices, package contents, or anything in the packages data
- Testimonial text — those are real people's words, verbatim only
- Venue insider-knowledge paragraphs — those are your firsthand experience; an agent inventing venue details is the exact failure mode that kills the site's credibility
- Anything under `/couples/` (the client portal)
- The About page's personal story
- Business facts: wedding count, years, awards, contact details

**MUST ALWAYS:**
- Work on a branch, never commit to main
- Change no more than 3 things per week
- Wait 3 weeks before re-changing something it already changed (SEO effects lag)
- Log every change with its baseline metric

---

# PART 6 — ROLLOUT PHASES

**Phase 1 — Weeks 1–3: Build + Listen.**
Set up auth, write the pull scripts, confirm data flows. The agent runs weekly in **report-only** mode. Reports will be thin — that's expected, the site just launched. Goal: prove the plumbing works and start accumulating history.

**Phase 2 — Week 4 onward: Recommend.**
Enough data exists for real comparison. The agent starts producing the striking-distance and CTR-leak sections with actual recommendations. You implement manually at first — this is how you calibrate whether its judgment is good.

**Phase 3 — Month 2 onward: Act.**
Once you trust the recommendations, turn on the branch-and-preview workflow. Agent proposes, builds the fix, you review the preview, merge.

**Phase 4 — Month 3+: Expand.**
Add competitor tracking, content-gap analysis, and GBP monitoring to the monthly. Consider adding the wedding-planner referral tracking dashboard as a separate module.

---

# PART 7 — WHAT SUCCESS LOOKS LIKE

Baseline captured today (launch day, July 27 2026): PageSpeed scores, zero Search Console history, new GA4 property, new GBP.

**Month 1:** all 15 SEO pages indexed; brand searches ("luma films arkansas") ranking #1; first venue-query impressions appearing.
**Month 3:** venue pages ranking page one for their own venue names (low competition — these should come first); city pages appearing in the top 20.
**Month 6:** "wedding videographer conway ar" and "wedding videographer little rock ar" on page one; GBP appearing in the map pack; measurable inquiry volume attributable to organic search.

**The metric that actually matters:** not rankings — **inquiries from organic search**. Track it in GA4 as form submissions from organic traffic, and cross-reference against HoneyBook lead volume. A #3 ranking that produces no inquiries is worse than a #8 ranking that produces four.

---

# PART 8 — KICKOFF PROMPT FOR CLAUDE CODE

> Read `luma-seo-agent-spec.md`. Build Phase 1: a Search Console + GA4 data pull authenticated via the service account JSON at the path in `.env`, storing dated JSON in `/seo-data/`. Then write the weekly digest generator that reads those files and outputs a markdown report in the Part 3 format. Run it once against whatever data exists so I can see the output shape. Don't build the action path yet — report-only for now.
