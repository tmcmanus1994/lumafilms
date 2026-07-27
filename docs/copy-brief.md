# Luma Films — Copywriting Session Brief

You are helping Travelle, a Little Rock wedding videographer, write copy for the venue
and location pages of lumaweddingfilms.co. This file tells you everything about the
site, the voice, the pages that need copy, and — critically — the **exact format** to
return finished copy in, so it can be dropped into the site's content system without
rework.

## How to run this session

Work **one page at a time**. For each page, interview Travelle first — the value of
these pages is his real, first-person filming knowledge, which only he has. Good
questions per venue: Where does the ceremony happen and where does the light fall late
afternoon? Where do you stand for vows? What's tricky about the audio there? What's one
specific moment you remember filming there? Then shape his answers into copy. Never
invent venue details he didn't give you — a made-up detail about a real venue is worse
than a thin page.

When a page's copy is agreed, add it to the output file (format below). At the end of
the session, return one markdown file containing every page you completed.

## Voice

Warm, confident, personal, never salesy. First person ("I film…"). Sentence-level
warmth, no wedding-industry clichés — **"capture your special day" is banned**, as are
"tie the knot," "big day" (sparingly ok), and anything that sounds like a brochure.
Place names appear naturally and often — SEO through genuine specificity, never keyword
stuffing. Reference copy that nails the voice (already live on the site):

> "Oakdale sits five minutes from my front door, and I've filmed weddings here in both
> spring and fall. That matters more than it sounds: I know exactly where the light
> falls through the ceremony trees at 5pm, which corner of the reception barn stays
> warm on camera after sunset, and where to stand for the vows so you never see me in a
> single frame."

## Hard facts — never contradict these

- Travelle is **based in Little Rock** (raised in Richmond, VA; came to Arkansas in 2013,
  Harding University, Electronic Media Production)
- **100+ weddings filmed · 10+ years of experience**
- Awards: The Knot Best of Weddings, WeddingWire Couples' Choice
- Packages: Rosie **$2,400** · Binx **$3,200** (most booked) · Boujee **$4,800** —
  "starting at $2,400"
- Every package: 4K filming, licensed music, Instagram reel within 48 hours
- Travel: included within 50 miles of Little Rock, then $1/mile — no hidden fees
- One wedding per date, always. Retainer holds the date; payment plans
- Full film delivered by a guaranteed date, in writing
- Instagram: @luma_weddingfilms · Email: trav.mcmanus@gmail.com
- Pets/packages namesakes: Rosie (corgi), Binx (black cat), Boujee (cat)

## What each page type is for (SEO intent)

**Venue pages** target searches like "{venue} wedding video / videographer / wedding."
A couple searching these has already booked that venue — the page must prove Travelle
knows the property better than any videographer they could hire. The insider-knowledge
block is the whole moat: light, layout, ceremony spots, audio realities, timeline tips.
2–4 short paragraphs. The page automatically shows films from that venue, a
testimonial, and cross-links — you only write the headline + insider block (+
testimonial if Travelle supplies a real quote).

**Location (city) pages** target "wedding videographer {city} ar." The intro must read
like it was written by someone who actually films there — venues, neighborhoods, light,
logistics — 2–3 short paragraphs. Each page also carries an FAQ block (rendered as
FAQPage schema for Google). Three standard FAQs already exist on every city page
(travel fees, booking timeline, film delivery). You may sharpen those answers and add
1–2 city-specific FAQs — real questions couples in that market actually ask.

**One rule for both:** never thin, never duplicated. If two pages could swap copy and
still read fine, the copy failed.

## The pages

### Venue pages (8 live)

| # | Slug | Venue | City | Films on the page | Status |
|---|---|---|---|---|---|
| 1 | `the-venue-at-oakdale` | The Venue at Oakdale | Sherwood | Arrie + Henry · Brittney + Randy | **Has real copy** — review only. Note: copy says "five minutes from my front door," written when the site said Conway. Verify it still holds from Little Rock, and that a venue testimonial gets a real quote (currently placeholder) |
| 2 | `legacy-acres` | Legacy Acres | Conway | Rachel + Zane · Savannah + Cam | Placeholder — needs full insider block + testimonial (from Rachel + Zane or Savannah + Cam if available) |
| 3 | `angelos-garden` | Angelo's Garden | Conway | Caitlyn + KeeAundree | Placeholder — needs everything |
| 4 | `grandeur-house` | Grandeur House | Little Rock | Kelsey + Logan | Placeholder — needs everything |
| 5 | `capital-hotel` | Capital Hotel | Little Rock | Paige + Austin | Placeholder — needs everything. Historic downtown hotel — indoor light + logistics knowledge is the differentiator |
| 6 | `loft-1023` | Loft 1023 | Little Rock | Sydnie + Will | Placeholder — needs everything |
| 7 | `garvan-woodland-gardens` | Garvan Woodland Gardens | Hot Springs | *none — wishlist venue* | Placeholder. Special case: Travelle hasn't filmed here yet. Editorial angle — what makes it beautiful on camera (Anthony Chapel!), honest that he'd love to film there. **No fake portfolio claims** |
| 8 | `crystal-bridges` | Crystal Bridges | Bentonville | Caylee + Jacob · Hannah + Dylan | Placeholder — needs everything. Doubles as his NWA-range proof |

### Location pages (6 live)

| # | Slug | Page | Target query | Status |
|---|---|---|---|---|
| 1 | `little-rock` | Little Rock | wedding videographer little rock ar | Draft intro exists — home-market page, deserves the strongest copy. Venues to name-drop: Grandeur House, Capital Hotel, Loft 1023, Chenal Country Club, Albert Pike, Cathedral of St Andrew |
| 2 | `conway` | Conway | wedding videographer conway ar | Draft intro exists. Venues: Legacy Acres, Angelo's Garden (+ Oakdale nearby) |
| 3 | `north-little-rock` | North Little Rock | wedding videographer north little rock | Thin draft — needs local texture (Argenta, riverfront) |
| 4 | `benton-bryant` | Benton + Bryant (one page, both cities in copy) | wedding videographer benton ar / bryant ar | Thin draft |
| 5 | `hot-springs` | Hot Springs | wedding videographer hot springs ar | Thin draft — lakes, Ouachitas, Garvan/Anthony Chapel angle |
| 6 | `fayetteville` | Fayetteville / NWA | wedding videographer fayetteville ar / nwa | Thin draft — mention Crystal Bridges, NWA venues, honest travel framing |

## Return format — follow exactly

Return **one markdown file**. For every completed page, use these block structures with
the exact heading syntax and slugs shown. Plain text only inside blocks (no bold, no
links, no lists) — paragraphs separated by blank lines. Don't include pages you didn't
finish; don't rename or reorder headings within a block.

For a **venue page**:

```markdown
## venue: legacy-acres

### headline
One short line for the insider section heading, e.g. "I know this venue by heart"

### insider-knowledge
First paragraph of first-person filming knowledge.

Second paragraph.

Optional third/fourth paragraph.

### testimonial-quote
One or two sentences, verbatim from a real couple. Omit this section and the next if no real quote exists.

### testimonial-attribution
Rachel + Zane · Legacy Acres
```

For a **location page**:

```markdown
## city: conway

### intro
First intro paragraph.

Second paragraph.

Optional third.

### faq: How far in advance should we book?
Answer as one paragraph, plain text.

### faq: A new city-specific question?
Its answer.
```

FAQ notes: any `### faq:` blocks you return **replace that city's entire FAQ list**, so
always include the standard three (travel fees / booking timeline / film delivery) with
your improved answers, plus any new city-specific ones. Keep answers consistent with
the Hard Facts section.

That's it. The finished file comes back to Claude Code, which parses it and updates the
site — so format discipline matters more than usual. When in doubt, match the examples
above exactly.
