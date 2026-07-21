# Luma Films — Design Brief (for Claude Design)

**Project:** Homepage + venue page mockups for the Luma Films rebuild (wedding videography, Central Arkansas)
**Positioning:** Revival, not rebrand. Elegant, warm, cinematic. Quiet luxury — the films are the star; the site is the frame.
**Reference:** Existing logo is a white/ink calligraphy script wordmark ("Luma Films") — keep it, use as-is. Script appears ONLY in the logo, nowhere else.

---

## Direction: "Warm Monochrome Revival"

Monochrome restraint, but warmed to match golden-hour, film-graded wedding footage. Never pure #000 on #FFF.

### Color tokens

| Token | Hex | Use |
|---|---|---|
| `bone` | #FAF6EF | Page background |
| `sand` | #EDE6D9 | Alternate section background, subtle fills |
| `linen` | #E8DFD3 | Hairline rules, borders, dividers |
| `taupe` | #8A7B65 | Muted text, captions, eyebrows |
| `espresso` | #4A3F35 | Secondary text |
| `ink` | #1C1917 | Primary text, dark sections, footer |

- Dark sections (hero overlay, footer): `ink` background, `bone` text
- No additional accent color. Buttons and links are `ink` (or `bone` on dark)
- Photography and film stills provide all the color

### Typography

| Role | Font | Treatment |
|---|---|---|
| Display / H1–H2 | Cormorant Garamond 500 | Large (56–88px desktop H1), line-height ~1.1, slight negative tracking |
| Romantic accents | Cormorant Garamond 400 *italic* | Testimonial pull-quotes, select emotional lines only |
| Body | Inter 400 | 16–18px, line-height 1.6–1.7, `espresso` or `ink` |
| Eyebrows / labels | Inter 500 | 12–13px, UPPERCASE, letter-spacing 0.12–0.18em, `taupe` |
| Buttons | Inter 500 | 14–15px, sentence case or small caps |

Signature pairing: uppercase Inter eyebrow above a big Cormorant headline (e.g., "THE VENUE AT OAKDALE" → "Wedding Films at Oakdale").

### Style rules

- Film frames and photos: full-bleed or large, never small thumbnails in tight grids
- Generous whitespace between sections — the site breathes like a film edit
- Hairline rules (`linen`, 1px) instead of boxes, cards, or shadows
- No drop shadows, no gradients, no rounded-corner card UI; corners square or barely rounded (≤4px)
- Buttons: minimal — 1px `ink` border, transparent fill, `ink` text; invert on dark sections; subtle fill on hover
- Video embeds: thumbnail facade with a delicate play affordance, player loads on click
- Motion (later, in build): slow fades and gentle parallax only — nothing bouncy

---

## Pages to mock (priority order)

### 1. Homepage

Nav: Films · Venues · Packages · About · Contact (+ small "Client Login/Films" link to portal ok in footer)

Sections, in order:
1. **Hero** — full-bleed muted film loop with `ink` overlay (~35–45%). Eyebrow: "CENTRAL ARKANSAS WEDDING VIDEOGRAPHER". H1: "Cinematic Wedding Films in Central Arkansas". Subline: "Modern, story-driven films for couples in Little Rock, Conway, and beyond." Primary CTA button: "Check My Date". Secondary text link: "See the Films →"
2. **Trust bar** — single line, `taupe`, hairline rules above/below: "Award-Winning · 45+ Weddings Filmed · Central Arkansas + NWA"
3. **Featured films** — 3 large stills with couple + venue labels ("Laken + Robert — Hedge Farm"), each a link. "View All Films" link beneath
4. **Why Luma** — exactly three value props: Fly-on-the-Wall Approach · Storytelling Pacing · Professional Audio. Short copy each
5. **Testimonial spotlight** — Cormorant italic pull-quote, large: "…your search for the right videographer ends here." — Jamal + Katie. CTA beneath
6. **Packages teaser** — three tiers at a glance, "Starting at $1,799", link to Packages
7. **Where I Film** — link strip: venues (The Venue at Oakdale, Legacy Acres, Grandeur House, …) and cities (Little Rock, Conway, North Little Rock, Benton, Hot Springs, Fayetteville). This is the internal-link engine — style it as an inviting index, not a footer dump
8. **Final CTA** — `ink` section, Cormorant line ("Your date only happens once."), "Check My Date" button

### 2. Venue page (mock with The Venue at Oakdale)

1. Eyebrow "WEDDING FILMS AT" + H1 "The Venue at Oakdale" over a real film frame
2. **Insider knowledge block** — editorial paragraph(s): what it's like to film there (light, ceremony spots, audio). Written in first person, expert but warm
3. **Films shot here** — large embeds, couple names
4. Testimonial from a couple married there
5. Cross-links: nearest city page, nearby venues, packages
6. CTA: "Getting married at Oakdale? Check my date."

(Location pages reuse this skeleton with an FAQ block before the CTA.)

---

## Copy voice

Warm, confident, personal, never salesy. First person ("I film…"), sentence-level warmth, no wedding-industry clichés ("capture your special day" is banned). Place names appear naturally and often — SEO through genuine specificity, not keyword stuffing.

## What NOT to do

- No script/calligraphy fonts outside the logo
- No pure black/white — always the warm tokens
- No color accents, badges, or gradients
- No tight thumbnail grids — the work displays big
- No stock photography — every image is a Luma film frame
