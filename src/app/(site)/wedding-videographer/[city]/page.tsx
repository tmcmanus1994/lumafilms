import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import FilmCard from "@/components/FilmCard";
import CtaSection from "@/components/CtaSection";
import JsonLd from "@/components/JsonLd";
import PageMeta from "@/components/PageMeta";
import {
  getCities,
  getCity,
  getVenuesInCity,
  getWeddingsInCity,
} from "@/lib/content";
import { cityBreadcrumbs, faqPageSchema } from "@/lib/schema";
import { site } from "@/lib/site";

type Props = { params: Promise<{ city: string }> };

export function generateStaticParams() {
  return getCities().map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const c = getCity(city);
  if (!c) return {};
  const names = c.alsoServes?.length ? `${c.name} + ${c.alsoServes.join(" + ")}` : c.name;
  return {
    title: `${c.name} Wedding Videographer`,
    description: `Cinematic wedding videographer serving ${names}, Arkansas. Story-driven wedding films, professional audio, packages from $${site.startingPrice.toLocaleString()}. Check your date with Luma Films.`,
    alternates: { canonical: `/wedding-videographer/${city}` },
  };
}

export default async function CityPage({ params }: Props) {
  const { city } = await params;
  const c = getCity(city);
  if (!c) notFound();

  const films = getWeddingsInCity(c.slug);
  const venues = getVenuesInCity(c.slug);

  return (
    <>
      <PageMeta page_type="city" content_city={c.slug} />
      <JsonLd data={[faqPageSchema(c.faqs), cityBreadcrumbs(c)]} />

      <section className="px-5 pb-6 pt-14 md:px-16 md:pt-24">
        <p className="eyebrow mb-4">Luma Films · {c.region ?? "Central Arkansas"}</p>
        <h1 className="display max-w-[860px] text-4xl md:text-[64px]">
          {c.name} Wedding Videographer
        </h1>
        <div className="mt-6 flex max-w-[680px] flex-col gap-5 text-base leading-relaxed text-espresso md:text-[17px]">
          {c.intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="mt-9 flex flex-col items-start gap-5 md:flex-row md:items-center md:gap-8">
          <Link href="/contact" className="btn" data-track="cta_click" data-track-label="city_hero">
            Check My Date
          </Link>
          <Link href="/films" className="text-[15px] font-medium">
            See the Films →
          </Link>
        </div>
      </section>

      {films.length > 0 && (
        <section className="mt-14 bg-sand px-5 py-16 md:mt-24 md:px-16 md:py-24">
          <p className="eyebrow mb-3">Filmed Near {c.name}</p>
          <h2 className="display mb-8 text-[34px] md:mb-12 md:text-[52px]">
            Weddings I&rsquo;ve filmed here
          </h2>
          <div className="grid gap-10 md:grid-cols-3 md:gap-7">
            {films.slice(0, 3).map((w) => (
              <FilmCard key={w.slug} wedding={w} />
            ))}
          </div>
        </section>
      )}

      {venues.length > 0 && (
        <section className="border-t hairline px-5 py-14 md:px-16 md:py-24">
          <p className="eyebrow mb-3">Where Couples Marry in {c.name}</p>
          <h2 className="display mb-8 text-[34px] md:mb-10 md:text-[44px]">Venues I&rsquo;ve filmed</h2>
          <ul className="flex flex-col">
            {venues.map((v) => (
              <li key={v.slug} className="border-b hairline first:border-t">
                <Link
                  href={`/venues/${v.slug}`}
                  className="display block py-4 text-[22px] md:py-5 md:text-[28px]"
                >
                  Wedding Films at {v.name} →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Packages summary */}
      <section className="border-t hairline px-5 py-14 md:px-16 md:py-24">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="eyebrow mb-3">Packages</p>
            <h2 className="display text-[34px] md:text-[44px]">
              Wedding films from ${site.startingPrice.toLocaleString()}
            </h2>
            <p className="mt-4 max-w-[560px] text-base leading-relaxed text-espresso">
              Every package includes 4K filming, licensed music, and your Instagram reel within
              48 hours. {c.name} is well within my filming range.
            </p>
          </div>
          <Link href="/packages" className="btn" data-track="cta_click" data-track-label="city_packages">
            Compare Packages
          </Link>
        </div>
      </section>

      {/* FAQ → FAQPage schema */}
      <section className="bg-sand px-5 py-16 md:px-16 md:py-24">
        <div className="grid gap-8 md:grid-cols-[380px_1fr] md:gap-20">
          <div>
            <p className="eyebrow mb-3">Questions</p>
            <h2 className="display text-[34px] md:text-[46px]">
              Booking a videographer in {c.name}
            </h2>
          </div>
          <div className="flex max-w-[720px] flex-col">
            {c.faqs.map((f) => (
              <div key={f.question} className="border-t border-linen-dark py-6 last:border-b md:py-7">
                <h3 className="display mb-3 text-[22px] md:text-[26px]">{f.question}</h3>
                <p className="text-[15px] leading-relaxed text-espresso md:text-base">{f.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaSection
        line={`Getting married in ${c.name}?`}
        subline="One wedding per date — see if yours is open."
        trackLabel="city_final"
      />
    </>
  );
}
