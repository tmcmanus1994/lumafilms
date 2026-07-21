import type { Metadata } from "next";
import FilmCard from "@/components/FilmCard";
import CtaSection from "@/components/CtaSection";
import PageMeta from "@/components/PageMeta";
import { getPublicFilms } from "@/lib/content";

export const metadata: Metadata = {
  title: "Wedding Films — Real Arkansas Weddings",
  description:
    "Watch real wedding films from Central and Northwest Arkansas — cinematic, story-driven highlight films at venues like The Venue at Oakdale, Legacy Acres, and Grandeur House.",
  alternates: { canonical: "/films" },
};

export default function FilmsPage() {
  const films = getPublicFilms();

  return (
    <>
      <PageMeta page_type="films_index" />
      <section className="px-5 pb-6 pt-14 md:px-16 md:pt-24">
        <p className="eyebrow mb-4">The Films</p>
        <h1 className="display max-w-[800px] text-4xl md:text-[64px]">
          Real weddings, told the way they felt
        </h1>
        <p className="mt-5 max-w-[620px] text-base leading-relaxed text-espresso md:text-[17px]">
          Every film below is a real couple and a real Arkansas wedding day — no staging, no
          stock. Find your venue, or just press play.
        </p>
      </section>
      <section className="px-5 py-12 md:px-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-3 md:gap-x-7 md:gap-y-16">
          {films.map((w) => (
            <FilmCard key={w.slug} wedding={w} />
          ))}
        </div>
      </section>
      <CtaSection
        line="Want a film like these?"
        subline="One wedding per date — see if yours is open."
        trackLabel="films_index_final"
      />
    </>
  );
}
