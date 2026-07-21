import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import VimeoFacade from "@/components/VimeoFacade";
import CtaSection from "@/components/CtaSection";
import JsonLd from "@/components/JsonLd";
import PageMeta from "@/components/PageMeta";
import FilmCard from "@/components/FilmCard";
import {
  filmSlug,
  getCity,
  getFilmBySlug,
  getPublicFilms,
  getVenue,
} from "@/lib/content";
import { filmBreadcrumbs, videoObjectSchema } from "@/lib/schema";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPublicFilms().map((w) => ({ slug: filmSlug(w) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const w = getFilmBySlug(slug);
  if (!w) return {};
  return {
    title: { absolute: `${w.couple} at ${w.venue.name} | Wedding Film by Luma Films` },
    description:
      w.story?.startsWith("PLACEHOLDER")
        ? `Watch ${w.couple}'s cinematic wedding film at ${w.venue.name}, filmed by Luma Films — Central Arkansas wedding videographer.`
        : (w.story ?? ""),
    alternates: { canonical: `/films/${slug}` },
    openGraph: { images: w.coverPhoto ? [w.coverPhoto] : undefined },
  };
}

export default async function FilmPage({ params }: Props) {
  const { slug } = await params;
  const w = getFilmBySlug(slug);
  if (!w) notFound();

  const venue = w.venue.slug ? getVenue(w.venue.slug) : undefined;
  const city = w.venue.city ? getCity(w.venue.city) : undefined;
  const more = getPublicFilms()
    .filter((f) => f.slug !== w.slug)
    .slice(0, 3);

  return (
    <>
      <PageMeta
        page_type="film"
        content_slug={slug}
        content_venue={w.venue.slug}
        content_city={w.venue.city || undefined}
      />
      {w.highlight.vimeo && <JsonLd data={videoObjectSchema(w)} />}
      <JsonLd data={filmBreadcrumbs(w)} />

      <section className="px-5 pb-8 pt-14 text-center md:px-16 md:pt-24">
        <p className="eyebrow mb-4">A Luma Films Wedding Film</p>
        <h1 className="display text-4xl md:text-[64px]">{w.couple}</h1>
        <p className="eyebrow mt-4 text-xs md:text-[13px]">
          {w.venue.name}
          {w.weddingDate ? ` · ${formatDate(w.weddingDate)}` : ""}
        </p>
      </section>

      <section className="px-5 md:px-16">
        <VimeoFacade
          vimeoUrl={w.highlight.vimeo}
          title={w.highlight.title ?? `${w.couple} at ${w.venue.name}`}
          poster={w.coverPhoto}
          venue={w.venue.name}
          className="aspect-video w-full"
        />
      </section>

      {w.story && (
        <section className="px-6 py-14 md:px-16 md:py-24">
          <div className="mx-auto max-w-[720px]">
            <p className="eyebrow mb-4">Their Story</p>
            <p className="text-[17px] leading-relaxed text-espresso">{w.story}</p>
          </div>
        </section>
      )}

      {w.testimonial && (
        <section className="border-t hairline px-6 py-14 text-center md:px-16 md:py-24">
          <blockquote className="romantic mx-auto max-w-[920px] text-[27px] leading-snug md:text-[40px]">
            &ldquo;{w.testimonial.quote}&rdquo;
          </blockquote>
          {w.testimonial.attribution && (
            <p className="eyebrow mt-6">{w.testimonial.attribution}</p>
          )}
        </section>
      )}

      {/* Cross-links: film → venue → city (the internal-link engine) */}
      {(venue || city) && (
        <section className="border-t hairline px-5 py-12 md:px-16 md:py-20">
          <div className="grid gap-6 md:grid-cols-2">
            {venue && (
              <div className="border-t hairline pt-6 md:pt-8">
                <p className="eyebrow mb-3 text-xs">The Venue</p>
                <Link href={`/venues/${venue.slug}`} className="display text-2xl md:text-[28px]">
                  Wedding Films at {venue.name} →
                </Link>
              </div>
            )}
            {city && (
              <div className="border-t hairline pt-6 md:pt-8">
                <p className="eyebrow mb-3 text-xs">The Area</p>
                <Link
                  href={`/wedding-videographer/${city.slug}`}
                  className="display text-2xl md:text-[28px]"
                >
                  {city.name} Wedding Videographer →
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {more.length > 0 && (
        <section className="bg-sand px-5 py-16 md:px-16 md:py-24">
          <h2 className="display mb-8 text-3xl md:mb-12 md:text-[44px]">More films</h2>
          <div className="grid gap-10 md:grid-cols-3 md:gap-7">
            {more.map((f) => (
              <FilmCard key={f.slug} wedding={f} />
            ))}
          </div>
        </section>
      )}

      <CtaSection
        line={`Getting married at ${w.venue.name}?`}
        subline="One wedding per date — see if yours is open."
        trackLabel="film_final"
      />
    </>
  );
}

function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
