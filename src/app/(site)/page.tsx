import type { Metadata } from "next";
import Link from "next/link";
import ImageSlot from "@/components/ImageSlot";
import FilmCard from "@/components/FilmCard";
import CtaSection from "@/components/CtaSection";
import PageMeta from "@/components/PageMeta";
import { getPublicFilms, getVenues, getCities } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  // Root page uses the absolute default title from the layout (place-first for SEO)
  title: { absolute: "Central Arkansas Wedding Videographer | Luma Films" },
  description:
    "Cinematic wedding films in Central Arkansas. Modern, story-driven wedding videography for couples in Little Rock, Conway, and beyond — starting at $2,400.",
  alternates: { canonical: "/" },
};

const whyLuma = [
  {
    n: "01",
    title: "Fly-on-the-Wall Approach",
    copy: "I stay out of the way and let your day unfold. No staged moments, no directing — just the two of you, exactly as it happened.",
  },
  {
    n: "02",
    title: "Storytelling Pacing",
    copy: "Every film is edited like a short film, not a montage — built around your vows, your letters, and the moments between the moments.",
  },
  {
    n: "03",
    title: "Professional Audio",
    copy: "Discreet mics on vows, toasts, and letters. Years from now you won't just see the day — you'll hear it, clearly.",
  },
];

const packagesTeaser = [
  { name: "Rosie", price: "From $2,400", copy: "A cinematic highlight film of the full day — the essentials, beautifully told." },
  { name: "Binx", price: "From $3,200", copy: "A longer film plus your full ceremony and drone coverage — the most booked package." },
  { name: "Boujee", price: "From $4,800", copy: "The whole story — second shooter, every speech and moment, and all the raw footage." },
];

export default function HomePage() {
  const films = getPublicFilms().slice(0, 3);
  const venues = getVenues().filter((v) => v.tier <= 2).slice(0, 5);
  const cities = getCities();

  return (
    <>
      <PageMeta page_type="home" />

      {/* Hero */}
      <section className="relative flex min-h-[620px] items-center justify-center bg-ink md:min-h-[740px]">
        <ImageSlot
          src=""
          alt="Golden-hour wedding ceremony filmed by Luma Films"
          placeholderLabel="Hero film loop frame — golden-hour ceremony"
          className="absolute inset-0 !bg-ink"
        />
        <div className="absolute inset-0 bg-ink/45" aria-hidden />
        <div className="relative flex flex-col items-center px-6 py-24 text-center md:px-16">
          <p className="eyebrow mb-5 !text-sand md:mb-6">Central Arkansas Wedding Videographer</p>
          <h1 className="display mb-5 max-w-[1000px] text-[42px] text-bone md:mb-6 md:text-[82px]">
            Cinematic Wedding Films in Central Arkansas
          </h1>
          <p className="mb-8 max-w-[560px] text-base leading-relaxed text-sand md:mb-10 md:text-lg">
            Modern, story-driven films for couples in Little Rock, Conway, and beyond.
          </p>
          <div className="flex flex-col items-center gap-5 md:flex-row md:gap-8">
            <Link href="/contact" className="btn btn-light" data-track="cta_click" data-track-label="home_hero">
              Check My Date
            </Link>
            <Link href="/films" className="text-[15px] font-medium text-sand transition-colors hover:text-bone">
              See the Films →
            </Link>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <div className="eyebrow border-y hairline px-5 py-5 text-center text-[11px] leading-8 md:text-[13px]">
        Award-Winning&ensp;·&ensp;45+ Weddings Filmed&ensp;·&ensp;Central Arkansas + NWA
      </div>

      {/* Featured films */}
      <section className="px-5 py-16 md:px-16 md:pb-24 md:pt-28">
        <div className="mb-8 flex flex-col gap-4 md:mb-12 md:flex-row md:items-baseline md:justify-between">
          <div>
            <p className="eyebrow mb-3">Recent Work</p>
            <h2 className="display text-4xl md:text-[52px]">Featured Films</h2>
          </div>
          <Link href="/films" className="text-[15px] font-medium">
            View All Films →
          </Link>
        </div>
        <div className="grid gap-10 md:grid-cols-3 md:gap-7">
          {films.map((w) => (
            <FilmCard key={w.slug} wedding={w} />
          ))}
        </div>
      </section>

      {/* Why Luma */}
      <section className="bg-sand px-5 py-16 md:px-16 md:py-24">
        <p className="eyebrow mb-3">Why Luma</p>
        <h2 className="display mb-9 text-4xl md:mb-14 md:text-[52px]">Films that feel like the day did</h2>
        <div className="grid gap-9 md:grid-cols-3 md:gap-10">
          {whyLuma.map((item) => (
            <div key={item.n} className="border-t border-taupe pt-6 md:pt-8">
              <p className="eyebrow mb-4 text-xs">{item.n}</p>
              <h3 className="display mb-3 text-[26px] md:text-3xl">{item.title}</h3>
              <p className="text-[15px] leading-relaxed text-espresso md:text-base">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial spotlight */}
      <section className="px-6 py-18 text-center md:px-16 md:py-32">
        <div className="mx-auto flex max-w-[920px] flex-col items-center gap-6 md:gap-9">
          <blockquote className="romantic text-[29px] leading-snug md:text-[44px]">
            &ldquo;If you&rsquo;re reading this, your search for the right videographer ends here.&rdquo;
          </blockquote>
          <p className="eyebrow">Jamal + Katie</p>
          <Link href="/contact" className="btn" data-track="cta_click" data-track-label="home_testimonial">
            Check My Date
          </Link>
        </div>
      </section>

      {/* Packages teaser */}
      <section className="border-t hairline px-5 py-16 md:px-16 md:py-24">
        <div className="mb-8 flex flex-col gap-4 md:mb-12 md:flex-row md:items-baseline md:justify-between">
          <div>
            <p className="eyebrow mb-3">Packages</p>
            <h2 className="display text-4xl md:text-[52px]">Starting at ${site.startingPrice.toLocaleString()}</h2>
          </div>
          <Link href="/packages" className="text-[15px] font-medium">
            Compare Packages →
          </Link>
        </div>
        <div className="grid md:grid-cols-3">
          {packagesTeaser.map((p, i) => (
            <div
              key={p.name}
              className={`border-t hairline py-6 md:py-9 md:pr-10 ${i > 0 ? "md:border-r-0 md:pl-10" : ""} ${
                i < 2 ? "md:border-r hairline" : ""
              }`}
            >
              <h3 className="display mb-1 text-[26px] md:text-3xl">{p.name}</h3>
              <p className="mb-4 text-sm font-medium text-taupe">{p.price}</p>
              <p className="text-[15px] leading-relaxed text-espresso md:text-base">{p.copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Where I Film — the internal-link engine */}
      <section className="bg-sand px-5 py-16 md:px-16 md:py-24">
        <p className="eyebrow mb-3">Where I Film</p>
        <h2 className="display mb-5 text-4xl md:text-[52px]">Venues I know by heart</h2>
        <p className="mb-10 max-w-[620px] text-base leading-relaxed text-espresso md:mb-14 md:text-[17px]">
          I&rsquo;ve filmed at most of Central Arkansas&rsquo;s favorite venues — I know where the light falls at
          golden hour and where to stand for the vows.
        </p>
        <div className="grid gap-10 md:grid-cols-2 md:gap-20">
          <div>
            <p className="eyebrow border-b border-taupe pb-4">Venues</p>
            <ul className="flex flex-col">
              {venues.map((v) => (
                <li key={v.slug} className="border-b border-linen-dark">
                  <Link
                    href={`/venues/${v.slug}`}
                    className="display flex items-baseline justify-between py-4 text-[22px] md:text-[26px]"
                  >
                    {v.name}
                    <span className="eyebrow text-[11px] md:text-xs">{v.city}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/venues" className="mt-5 inline-block text-sm font-medium">
              All venues →
            </Link>
          </div>
          <div>
            <p className="eyebrow border-b border-taupe pb-4">Cities</p>
            <ul className="flex flex-col">
              {cities.map((c) => (
                <li key={c.slug} className="border-b border-linen-dark">
                  <Link
                    href={`/wedding-videographer/${c.slug}`}
                    className="display block py-4 text-[22px] md:text-[26px]"
                  >
                    {c.alsoServes?.length ? `${c.name} + ${c.alsoServes.join(" + ")}` : c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CtaSection
        line="Your date only happens once."
        subline="I only take a limited number of weddings each season."
        trackLabel="home_final"
      />
    </>
  );
}
