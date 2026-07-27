# Luma Films — Motion & CTA Spec (for Claude Code)

Two systems: sitewide animation and the Check My Date interaction. SEO is the priority — every rule below exists so motion never costs a ranking. Read alongside the design brief (motion must feel like the brand: slow, warm, quiet — nothing bouncy).

---

## 1. Animation system

### Non-negotiable rules (these ARE the SEO protection)

1. **Animate only `transform` and `opacity`.** Never animate layout properties (width, height, top, margin, padding). Transform/opacity run on the GPU compositor and cannot cause layout shift or jank.
2. **Zero Cumulative Layout Shift.** Every animated element occupies its final space before animating. Entrances are opacity + small translateY (12–24px) within already-reserved space — nothing pushes content around.
3. **Content is never hidden from crawlers or no-JS users.** Default CSS state = fully visible. JS adds a `js-anim` class on load; only then do elements get their pre-animation state, then animate in via IntersectionObserver. If JS fails or a crawler renders without it, the page is simply… visible. (Never ship `opacity: 0` as the default stylesheet state.)
4. **Respect `prefers-reduced-motion: reduce`** — all animation collapses to simple opacity or nothing.
5. **No animation libraries.** CSS transitions + one small IntersectionObserver utility. No GSAP/Framer Motion/Lottie — nothing added to the JS bundle for motion. (Revisit only if a specific effect truly demands it.)
6. **Hero video protects LCP:** `poster` image (optimized, priority-loaded) is the LCP element; video lazy-loads and fades in over the poster after load. Video never blocks first paint.
7. **Scroll effects use IntersectionObserver only** — no scroll event listeners, no scroll-jacking, no parallax that repositions content (a subtle background-image transform is the ceiling).
8. Animations trigger **once** (no re-animating on scroll-up), durations 400–700ms, easing `cubic-bezier(0.22, 1, 0.36, 1)` (gentle decel), stagger siblings by 80–120ms with a 3–4 item stagger cap.

### The motion menu (implement exactly these, nothing more)

- **Page load (hero):** eyebrow → H1 → subline → CTAs fade-up in a 100ms stagger; hero video fades in over its poster when ready
- **Scroll into view:** sections fade-up once (single utility class + observer); film/venue cards in a grid stagger
- **Images:** subtle scale-settle on reveal (1.04 → 1.0) — the "cinematic" touch, never on LCP images
- **Hover (desktop only):** film cards scale 1.02 with play affordance fading in; buttons invert fill (ink ↔ bone) over 200ms; nav links get a hairline underline animating width via `transform: scaleX`
- **Sticky elements:** desktop nav gains background + hairline on scroll (background/opacity only); mobile bottom CTA bar slides up (translateY) after the hero leaves viewport
- **Accordion FAQs:** height via `grid-template-rows: 0fr → 1fr` trick or max-height on the inner wrapper — content inside fades; chevron rotates
- **NOT in scope:** page transitions, cursor effects, marquees, text-splitting/letter animations, parallax hero, scroll-jacked storytelling. The films are the show; the site stays still enough to let them play.

### Verification (Claude Code must run these before calling it done)

- Lighthouse: CLS = 0, LCP unchanged vs. pre-animation build, no new long tasks
- Disable JS → every page fully readable, all content visible
- Emulate `prefers-reduced-motion` → no movement
- Throttled mid-tier mobile: scroll the homepage — no dropped-frame jank

---

## 2. Check My Date — interaction architecture

### Decision for launch

All "Check My Date" CTAs route to **`/contact`** (real, indexable page) — fast, reliable, zero risk to the HoneyBook pipeline. The modal upgrade below ships in the workflow-rebuild phase, not the site launch. Do not block launch on form plumbing.

### Build it swappable (this is the important part)

- **One `<CheckMyDate />` component used by every CTA sitewide** (nav, mobile bar, section closers, package cards, venue/film pages). It renders the button; a single config flag switches behavior: `link` (→ /contact) now, `modal` later. Changing the entire site's CTA behavior must be a one-line change.
- Each instance passes context props it already knows: `venue`, `city`, `package`. In link mode these ride along as URL params (`/contact?venue=oakdale`); in modal mode they prefill the form. Context capture is built on day one even though it's only fully used later — an inquiry that arrives saying "Oakdale · Binx" is worth real money to follow-up speed.
- **`/contact` page hosts the form in a swappable slot.** Launch fills the slot with the HoneyBook embed (lazy-loaded below the H1/step content so the third-party script never affects LCP; reserve the iframe's height to prevent CLS). The custom native form replaces the slot contents in phase two — page, URL, and SEO untouched.

### Phase two (workflow rebuild) — the modal, specced now so nothing gets built wrong

- Clicking any CTA opens a lightweight overlay (desktop: centered dialog; mobile: bottom sheet) with ONE input: "What's your date?" — autofocused. On entry, the remaining fields appear (names, venue [prefilled if launched from a venue page], email, phone). Proper `<dialog>`/focus-trap accessibility, ESC/backdrop close, no third-party iframe inside the modal — native form only.
- Submits to a site API route → forwards into the HoneyBook pipeline. **Open question to resolve at that phase (verify, don't assume): whether HoneyBook can ingest inquiries via Zapier action, lead-form email address, or API** — if none work cleanly, the route emails the inquiry AND logs it, and HoneyBook entry stays manual-but-30-seconds until the workflow rebuild solves it properly.
- `/contact` keeps the full native form for direct traffic and as the no-JS fallback. Confirmation state = the "what happens next" three steps, plus the same steps in the auto-reply email.
- Measure before/after: form starts, completions, and inquiry-to-reply time. The modal earns its keep with data or gets reverted — the component flag makes reverting free.

### Why not the modal at launch

The current form is a HoneyBook iframe: it can't be prefilled, can't do the date-first step, and loads third-party script — putting it inside a modal gives the worst of both. The modal only makes sense with the native form, and the native form belongs to the workflow rebuild where its HoneyBook ingestion gets solved properly. Sequencing, not compromise.
