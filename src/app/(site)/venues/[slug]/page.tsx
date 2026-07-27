import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ImageSlot from "@/components/ImageSlot";
import HeroVideo from "@/components/HeroVideo";
import FilmCard from "@/components/FilmCard";
import CtaSection from "@/components/CtaSection";
import JsonLd from "@/components/JsonLd";
import PageMeta from "@/components/PageMeta";
import { getCity, getVenue, getVenues, getWeddingsAtVenue, resolveFilmSlugs } from "@/lib/content";
import { venueBreadcrumbs } from "@/lib/schema";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getVenues().map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const v = getVenue(slug);
  if (!v) return {};
  return {
    title: `${v.name} Wedding Videographer`,
    description:
      v.heroSub ??
      `Wedding films at ${v.name} in ${v.city}, Arkansas. Real filming experience at this venue — the light, the layout, the sound — from Central Arkansas wedding videographer Luma Films.`,
    alternates: { canonical: `/venues/${slug}` },
    openGraph: v.heroPoster ? { images: [v.heroPoster] } : undefined,
  };
}

export default async function VenuePage({ params }: Props) {
  const { slug } = await params;
  const v = getVenue(slug);
  if (!v) notFound();

  const films = v.filmSlugs ? resolveFilmSlugs(v.filmSlugs) : getWeddingsAtVenue(v.slug);
  const city = v.citySlug ? getCity(v.citySlug) : undefined;
  const nearby = (v.nearbyVenueSlugs ?? [])
    .map((s) => getVenue(s))
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  return (
    <>
      <PageMeta page_type="venue" content_venue={v.slug} content_city={v.citySlug} />
      <JsonLd data={venueBreadcrumbs(v)} />

      {/* Hero: eyebrow "WEDDING FILMS AT" + venue name over a film frame */}
      <section className="relative flex min-h-[480px] items-center justify-center bg-ink md:min-h-[560px]">
        {v.heroVideo ? (
          <HeroVideo vimeoUrl={v.heroVideo} poster={v.heroPoster} />
        ) : (
          <ImageSlot
            src={v.heroPoster}
            alt={`Wedding film frame at ${v.name}`}
            placeholderLabel={`Film frame — ${v.name}`}
            className="absolute inset-0 !bg-ink"
          />
        )}
        <div className="absolute inset-0 bg-ink/45" aria-hidden />
        <div className="relative px-6 py-20 text-center md:px-16">
          <p className="eyebrow mb-4 !text-sand md:mb-5">Wedding Films At</p>
          <h1 className="display mx-auto mb-4 max-w-[1080px] text-[38px] text-bone md:text-[64px]">
            {v.heroTitle ?? v.name}
          </h1>
          <p className="mx-auto max-w-[760px] text-[15px] leading-relaxed text-sand md:text-lg">
            {v.heroSub ?? `${v.city}, Arkansas`}
          </p>
        </div>
      </section>

      {/* Insider knowledge — the moat */}
      <section className="px-5 py-16 md:px-16 md:py-28">
        <div className="grid gap-6 md:grid-cols-[380px_1fr] md:gap-20">
          <div data-anim>
            <p className="eyebrow mb-3">Filming at {shortName(v.name)}</p>
            <h2 className="display text-[34px] md:text-[46px]">
              {v.headline ?? `What it's like to film here`}
            </h2>
          </div>
          <div className="flex max-w-[720px] flex-col gap-6 text-base leading-relaxed text-espresso md:text-[17px]" data-anim>
            {v.insiderKnowledge.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Films shot here */}
      {films.length > 0 && (
        <section className="bg-sand px-5 py-16 md:px-16 md:py-24">
          <p className="eyebrow mb-3">The Proof</p>
          <h2 className="display mb-8 text-[34px] md:mb-12 md:text-[52px]">
            Films shot at {shortName(v.name)}
          </h2>
          <div className="grid gap-10 md:grid-cols-2 md:gap-8" data-anim-stagger>
            {films.map((w) => (
              <FilmCard key={w.slug} wedding={w} large />
            ))}
          </div>
        </section>
      )}

      {v.testimonial && (
        <section className="px-6 py-16 text-center md:px-16 md:py-28">
          <blockquote className="romantic mx-auto max-w-[920px] text-[27px] leading-snug md:text-[40px]">
            &ldquo;{v.testimonial.quote}&rdquo;
          </blockquote>
          <p className="eyebrow mt-6 md:mt-8">{v.testimonial.attribution}</p>
        </section>
      )}

      {/* Cross-links */}
      <section className="border-t hairline px-5 py-12 md:px-16 md:py-20">
        <div className="grid gap-2 md:grid-cols-3 md:gap-0">
          {city && (
            <div className="border-t hairline py-5 md:py-8 md:pr-10">
              <p className="eyebrow mb-3 text-xs">Nearest City</p>
              <Link
                href={`/wedding-videographer/${city.slug}`}
                className="display text-2xl md:text-[28px]"
              >
                {city.name} Wedding Videographer →
              </Link>
            </div>
          )}
          {nearby.length > 0 && (
            <div className="border-t hairline py-5 md:border-l hairline md:px-10 md:py-8">
              <p className="eyebrow mb-3 text-xs">Nearby Venues</p>
              <div className="flex flex-col gap-2">
                {nearby.map((n) => (
                  <Link key={n.slug} href={`/venues/${n.slug}`} className="display text-xl md:text-2xl">
                    {n.name} →
                  </Link>
                ))}
              </div>
            </div>
          )}
          <div className="border-t hairline py-5 md:border-l hairline md:py-8 md:pl-10">
            <p className="eyebrow mb-3 text-xs">Planning</p>
            <Link href="/packages" className="display text-2xl md:text-[28px]">
              Packages from $2,400 →
            </Link>
          </div>
        </div>
      </section>

      <CtaSection
        line={v.cta?.line ?? `Getting married at ${shortName(v.name)}?`}
        subline={v.cta?.subline ?? "See if your date is open."}
        trackLabel="venue_final"
        venue={v.slug}
        city={v.citySlug}
      />
    </>
  );
}

/** "The Venue at Oakdale" reads better as "Oakdale" in headings and CTAs. */
function shortName(name: string) {
  const m = name.match(/^The Venue at (.+)$/i);
  return m ? m[1] : name;
}
