import type { Metadata } from "next";
import Link from "next/link";
import CtaSection from "@/components/CtaSection";
import PageMeta from "@/components/PageMeta";
import { getVenues, getWeddingsAtVenue } from "@/lib/content";

export const metadata: Metadata = {
  title: "Arkansas Wedding Venues We Love — Filmed by Luma",
  description:
    "Wedding venues across Central and Northwest Arkansas where Luma Films has filmed — The Venue at Oakdale, Legacy Acres, Grandeur House, and more. Real filming knowledge of every property.",
  alternates: { canonical: "/venues" },
};

export default function VenuesPage() {
  const venues = getVenues();

  return (
    <>
      <PageMeta page_type="venues_index" />
      <section className="px-5 pb-6 pt-14 md:px-16 md:pt-24">
        <p className="eyebrow mb-4">Venues We Love</p>
        <h1 className="display max-w-[860px] text-4xl md:text-[64px]">
          Arkansas wedding venues I know by heart
        </h1>
        <p className="mt-5 max-w-[620px] text-base leading-relaxed text-espresso md:text-[17px]">
          I&rsquo;ve filmed at most of the venues couples in Central Arkansas fall in love with.
          Each page below is real filming knowledge — where the light falls, where I stand for
          vows, how the room sounds — plus the films to prove it.
        </p>
      </section>
      <section className="px-5 py-12 md:px-16 md:py-20">
        <ul className="flex flex-col">
          {venues.map((v) => {
            const filmCount = getWeddingsAtVenue(v.slug).length;
            return (
              <li key={v.slug} className="border-b hairline first:border-t">
                <Link
                  href={`/venues/${v.slug}`}
                  className="display flex items-baseline justify-between gap-4 py-5 text-[24px] md:py-6 md:text-[32px]"
                >
                  {v.name}
                  <span className="eyebrow shrink-0 text-[11px] md:text-xs">
                    {filmCount > 0 ? `${filmCount} film${filmCount > 1 ? "s" : ""} · ` : ""}
                    {v.city}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
      <CtaSection
        line="Don't see your venue?"
        subline="I scout every new venue before the wedding day — tell me where you're getting married."
        trackLabel="venues_index_final"
      />
    </>
  );
}
