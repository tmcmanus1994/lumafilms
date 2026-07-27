# Luma Films — Launch Day Handoff (Framer → Vercel)

Two lanes: **CLAUDE CODE** tasks (paste this file into the repo and point Claude Code at Part 1) and **TRAVELLE** tasks (dashboards and accounts only you can touch). Do them in order — the sequence matters.

---

# PART 1 — CLAUDE CODE: PRE-LAUNCH BUILD CHECKLIST

Every item below must be verified in the codebase BEFORE the domain flips. Tell Claude Code: "Work through Part 1 of the launch handoff and confirm each item."

## 1.1 Metadata system (the SEO core)
- [ ] Every page has a unique `<title>` and meta description via the Next.js Metadata API — templates per §6 of the rebuild plan (`{Venue} Wedding Videographer | Luma Films`, etc.)
- [ ] `metadataBase` is set to `https://lumaweddingfilms.co` so all relative OG/canonical URLs resolve correctly
- [ ] Canonical URL on every page (self-referencing)
- [ ] Open Graph + Twitter card tags with a real image per page (film stills for venue/film pages; a branded default OG image for everything else)
- [ ] Favicon + apple-touch-icon present

## 1.2 Sitemap & robots
- [ ] `app/sitemap.ts` generates sitemap.xml dynamically from the wedding/venue/city data files — includes all public pages, EXCLUDES `/couples/*`
- [ ] `app/robots.ts`: allow all, `Disallow: /couples/`, and reference the sitemap URL
- [ ] `/couples/[slug]` pages send `noindex, nofollow` via metadata robots — verify in rendered HTML, not just code
- [ ] Confirm NOTHING ELSE is noindexed. A stray sitewide noindex is the #1 launch killer. Grep the build output.

## 1.3 Redirects (cannot-break items)
All 301 (permanent) in `next.config`:
- [ ] All 45 legacy portal slugs: `/:coupleSlug` → `/couples/:coupleSlug` — generated from the couples data, NOT hand-typed. (Implementation note: since these are root-level slugs, use an explicit generated list, not a wildcard — a wildcard would swallow real pages.)
- [ ] `/their-story` → `/films` · `/my-story` and `/our-story` → `/about` · any other legacy Framer paths from the old site's page list
- [ ] `www.lumaweddingfilms.co` → `lumaweddingfilms.co` (or vice versa — pick ONE primary; Vercel handles this when you set the primary domain, just confirm it's configured)
- [ ] Write a test script that curls every legacy URL and asserts a 301 to the right destination — run it against the production domain after launch

## 1.4 Structured data
- [ ] `LocalBusiness` (or `VideoBusiness`-adjacent) JSON-LD site-wide: name Luma Films, Little Rock AR, service areas (LR, Conway, NLR, Sherwood, Benton, Bryant, Hot Springs, Fayetteville, Bentonville), URL, social profiles
- [ ] `VideoObject` on every public film page (name, thumbnail, embed URL, description)
- [ ] `FAQPage` on the six city pages (the FAQ blocks already written)
- [ ] Validate all three with Google's Rich Results Test after launch

## 1.5 Performance (Core Web Vitals = local ranking factor)
- [ ] All images through `next/image` with correct `sizes`; hero poster image priority-loaded
- [ ] Vimeo embeds use the facade pattern (thumbnail first, player on click) — no third-party player JS on initial load
- [ ] Fonts via `next/font` (Cormorant Garamond + Inter subsetted, `display: swap`)
- [ ] HoneyBook embed on /contact lazy-loads below the fold with reserved height (zero CLS)
- [ ] Run `next build` clean: no errors, no unexpectedly dynamic routes — venue/city/film pages should be statically generated
- [ ] Lighthouse on homepage, one venue page, one city page: CLS = 0, LCP < 2.5s target

## 1.6 Odds and ends
- [ ] Custom 404 page (branded, links to Films / Venues / Contact)
- [ ] GA4 tag present and firing (his existing property)
- [ ] `/contact` form = the embedded HoneyBook lead form (per the funnel spec) — submit a test through it on the production URL after launch

---

# PART 2 — TRAVELLE: THE DOMAIN MOVE (step by step)

**Goal:** `lumaweddingfilms.co` stops pointing at Framer and starts pointing at Vercel, with near-zero downtime. The old Framer site stays live until the moment DNS flips, so don't delete anything in Framer until the end.

## 2.1 Find out where your domain actually lives
Log into wherever you originally bought `lumaweddingfilms.co` (GoDaddy, Namecheap, Google Domains→Squarespace, or possibly Framer itself). This is your **registrar** — it's where DNS gets edited.
- **If you bought it through a normal registrar:** perfect, continue to 2.2.
- **If you bought it through Framer:** you can still just edit its DNS records inside Framer's domain settings to point at Vercel (no transfer needed today). Transferring the registration out of Framer to a registrar like Cloudflare or Namecheap is a nice cleanup for later, not a launch blocker.

## 2.2 Add the domain in Vercel
1. Vercel dashboard → your project → **Settings → Domains**
2. Add `lumaweddingfilms.co` AND `www.lumaweddingfilms.co`
3. Set `lumaweddingfilms.co` as the **primary** (Vercel will auto-redirect www to it)
4. Vercel now shows you the exact DNS records it wants — typically an **A record** for the apex domain and a **CNAME** for www. **Use the exact values Vercel displays** (don't copy values from a tutorial — they can differ).

## 2.3 Update DNS at your registrar
1. Open your registrar's DNS management for the domain
2. **Delete** the existing A/CNAME records that point to Framer (they'll reference Framer's IPs/hostnames)
3. **Add** the A record and CNAME exactly as Vercel showed you
4. **Do NOT touch** any MX or TXT records (those are email and verification — unrelated to the website)
5. Save. Propagation usually takes minutes, occasionally a few hours.

## 2.4 Verify
- Vercel's Domains page will flip to "Valid Configuration" with a certificate issued (SSL is automatic — nothing to do)
- Visit `https://lumaweddingfilms.co` in a private window → new site
- Visit `https://www.lumaweddingfilms.co` → should redirect to the apex
- Run Claude Code's redirect test script against the live domain → all 45 portal URLs + legacy paths pass
- **Text one past couple** and ask them to try their old bookmarked portal link — the real-world test that matters

## 2.5 Decommission Framer (only after 2.4 passes)
- Remove the custom domain from the Framer site settings, then unpublish/downgrade the Framer site
- Keep the Framer project file around for reference; it costs nothing unpublished

---

# PART 3 — TRAVELLE: POST-LAUNCH SEO SETUP (same day)

## 3.1 Google Search Console (the big one)
1. Go to search.google.com/search-console → Add property → choose **Domain** property → enter `lumaweddingfilms.co`
2. Google gives you a **TXT record** → add it at your registrar's DNS (same place as 2.3) → click Verify
3. Once verified: **Sitemaps** (left menu) → submit `https://lumaweddingfilms.co/sitemap.xml`
4. **URL Inspection** → paste your homepage URL → "Request Indexing." Repeat for: /films, /venues, /packages, the Little Rock page, the Conway page, and your top 3 venue pages. This queues Google to crawl the new site fast.
5. Over the next 2 weeks, check **Pages** (indexing report) — you want venue/city pages moving to "Indexed," and zero surprises in "Excluded by noindex" (only /couples/* belongs there — and since they're blocked, they mostly just won't appear at all)

## 3.2 The rest (15 minutes total)
- **Bing Webmaster Tools:** bing.com/webmasters → "Import from Google Search Console" → done. Free coverage of Bing/DuckDuckGo/Copilot.
- **GA4:** confirm real-time traffic shows when you visit the site
- **Vercel Analytics + Speed Insights:** toggle on in the Vercel dashboard (free tier fine) — this is your Core Web Vitals monitoring with zero setup
- **PageSpeed Insights:** run pagespeed.web.dev on the homepage and one venue page; screenshot the scores as your launch baseline

## 3.3 Expectations (so you don't panic)
- Days 1–7: pages get indexed, brand searches ("luma films arkansas") find you
- Weeks 2–6: venue pages start appearing for venue searches (low competition = faster)
- Months 2–4: city page rankings build; this is where the monitoring agent project picks up
- Redirects preserve most of the equity from the old URLs; a temporary wobble in the first weeks is normal

---

# PART 4 — GOOGLE BUSINESS PROFILE (yes, now — here's why and how)

Including this in launch was the right call to make: **GBP is the single biggest local-SEO lever you have** — the map pack above the organic results for "wedding videographer little rock" IS Google Business Profile. Losing it during the rebrand is a real part of why rankings died, and launch day is the perfect rebuild moment because Google cross-checks your profile against your website, and the new site finally agrees with the Luma Films identity everywhere.

## 4.1 First: try to recover the old one (30 minutes, worth it)
Before creating anything new, check whether the McManus Media profile still exists:
1. Search Google Maps for "McManus Media" / your old address area, and log into business.google.com with every Google account you might have used
2. If the profile exists but you lost access → "Own this business? / Request access" flow
3. If it was **suspended** during the rename → there's a reinstatement request form in the GBP help center
4. **Why bother:** an existing profile can be RENAMED to Luma Films and **keeps all its reviews** — and review count/history is a real ranking factor. Recovered-and-renamed beats fresh, every time.

**If it's truly gone (deleted, or unrecoverable):** fresh start below. Genuinely fine — you'll rebuild reviews fast with the delivery-email review link.

## 4.2 Creating the new profile (if recovery fails)
1. business.google.com → Add business → name: **Luma Films** (exactly as the website says — never "Luma Films LLC | Wedding Videographer Little Rock," keyword-stuffed names get suspended)
2. Category: the most specific available — look for **"Wedding videographer"**; if not offered, "Videographer" primary + wedding-related secondary
3. **Service-area business:** when it asks if customers visit your location, say NO (you work from home). Hide the address, then list service areas: Little Rock, North Little Rock, Sherwood, Conway, Benton, Bryant, Hot Springs, Fayetteville, Bentonville
4. Website: `https://lumaweddingfilms.co` · Phone: your business number (must match what the site shows, if the site shows one)
5. Verification: Google will pick the method — often video verification for service-area businesses (a short screen-recorded walkthrough proving the business is real: gear, branding, etc.). Just follow the flow; it can take a few days.

## 4.3 After it's live (the part most people skip)
- **Photos:** 10+ real ones — you filming, film stills, behind-the-scenes at recognizable venues. Profiles with photos get dramatically more clicks.
- **Services:** add each collection (Rosie/Binx/Boujee) with descriptions and "from" pricing
- **Description:** 750 chars, natural — who you are, Central Arkansas + NWA, 100+ weddings, the guarantee
- **Reviews — the flywheel:** get your GBP review link (profile → "Ask for reviews" → copy link) and **swap it into Email 14 and Email 15** in the HoneyBook sequence as the [REVIEW LINK]. Every delivered wedding now feeds the profile automatically. Also personally text the link to your 5–10 happiest past couples this week — "would mean the world" — to seed the new profile.
- **Consistency check (NAP):** business name, service area, and phone must match between GBP, the website footer, and the LocalBusiness structured data from Part 1.4. Tell Claude Code the final NAP details so the JSON-LD matches exactly.
- Post a photo or film clip to the profile every couple of weeks for the first few months — activity signals help a new profile establish

---

# LAUNCH-DAY RUN ORDER (the short version)

1. Claude Code completes Part 1 → production deploy on Vercel (still on the vercel.app URL)
2. You click through the vercel.app deployment — pages, films, contact form test
3. Add domain in Vercel (2.2) → flip DNS (2.3) → verify + redirect tests (2.4)
4. Decommission Framer (2.5)
5. Search Console + sitemap + indexing requests (3.1), then 3.2
6. GBP recovery attempt → recover-and-rename or create new (Part 4)
7. Swap the GBP review link into HoneyBook Emails 14–15
8. Screenshot your PageSpeed scores, pour something celebratory — the site is live
