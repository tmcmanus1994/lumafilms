import type { Metadata } from "next";
import Link from "next/link";
import ImageSlot from "@/components/ImageSlot";
import CtaSection from "@/components/CtaSection";
import RotatingQuotes from "@/components/RotatingQuotes";
import PageMeta from "@/components/PageMeta";

export const metadata: Metadata = {
  title: "About Travelle — Central Arkansas Wedding Videographer",
  description:
    "Meet Travelle, the Conway-based wedding videographer behind Luma Films. Richmond-raised, Arkansas-made — fly-on-the-wall filming and story-driven wedding films across Central Arkansas and NWA.",
  alternates: { canonical: "/about" },
};

const facts = [
  { stat: "45+", label: "Weddings filmed across Arkansas" },
  { stat: "1", label: "Wedding per date — never two" },
  { stat: "48 hrs", label: "To your Instagram reel sneak peek" },
  { stat: "3", label: "Pets who run my house — and my packages" },
];

const pets = [
  {
    name: "Rosie",
    photo: "/images/pets/rosie-about.jpg",
    line: "Named for the intern — a corgi with a lot of opinions and zero editing experience.",
  },
  {
    name: "Binx",
    photo: "/images/pets/binx-about.jpg",
    line: "Named for the comic relief — a black cat who's never once worried about a deadline.",
  },
  {
    name: "Boujee",
    photo: "/images/pets/boujee-about.jpg",
    line: "Named for the assistant editor — she's watched every film leave this house.",
  },
];

const testimonials = [
  {
    quote:
      "He stepped up and helped out with way more than he was required to… Travelle is a fantastic videographer, but beyond that just an awesome person.",
    attribution: "Josh + Hannah",
  },
  {
    quote:
      "He was very professional and was great at instructing us how to pose. We had such a joy having him there at our wedding.",
    attribution: "Stephanie + Brandon",
  },
  {
    quote:
      "He was so easy to work with, very professional, and had some really great ideas to capture the moment. He worked well with my photographer too!",
    attribution: "Abbie + Ian",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageMeta page_type="about" />

      {/* Intro split */}
      <section className="grid border-b hairline md:grid-cols-2">
        <ImageSlot
          src="/images/about/travelle-bailey.jpg"
          alt="Travelle and Bailey, the couple behind Luma Films"
          className="order-1 h-[420px] md:order-2 md:h-auto md:min-h-[720px]"
          sizes="(min-width: 768px) 50vw, 100vw"
          priority
        />
        <div className="order-2 flex flex-col justify-center px-6 py-14 md:order-1 md:px-16 md:py-28">
          <p className="eyebrow mb-4 md:mb-5">My Story</p>
          <h1 className="display mb-5 text-[38px] md:mb-7 md:text-[66px]">
            Hi, I&rsquo;m Travelle — the person behind the camera
          </h1>
          <p className="mb-7 max-w-[520px] text-base leading-relaxed text-espresso md:mb-9 md:text-lg">
            Richmond, Virginia raised me. Arkansas gave me a degree, a wife, three pets, and 45+
            weddings behind the camera — and I still tear up in the edit.
          </p>
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-8">
            <Link href="/contact" className="btn" data-track="cta_click" data-track-label="about_hero">
              Check My Date
            </Link>
            <Link href="/films" className="text-[15px] font-medium">
              See the Films →
            </Link>
          </div>
        </div>
      </section>

      {/* How I got here */}
      <section className="px-5 py-14 md:px-16 md:py-28">
        <div className="grid gap-6 md:grid-cols-[380px_1fr] md:gap-20">
          <div>
            <p className="eyebrow mb-3">How I Got Here</p>
            <h2 className="display text-[32px] md:text-[46px]">
              It started with friends who couldn&rsquo;t afford a videographer
            </h2>
          </div>
          <div className="flex max-w-[720px] flex-col gap-5 text-base leading-relaxed text-espresso md:gap-6 md:text-[17px]">
            <p>
              I came to Central Arkansas in 2013 to study Electronic Media Production at Harding,
              and never really left. Around 2017, my friends started getting married — and I kept
              noticing the same thing: quality wedding video was priced out of reach for most of
              them. So I volunteered. I figured I&rsquo;d get experience and they&rsquo;d get their
              day on film.
            </p>
            <p>
              What I actually got was hooked. Every wedding was a new place, new people, and a new
              story to tell — and I found out that retelling someone&rsquo;s best day back to them
              is about the most rewarding thing you can do with a camera. Eight years and 45+
              weddings later, that hasn&rsquo;t worn off.
            </p>
          </div>
        </div>
      </section>

      {/* Why I do this */}
      <section className="border-t hairline px-5 py-14 md:px-16 md:py-28">
        <div className="grid gap-6 md:grid-cols-[380px_1fr] md:gap-20">
          <div>
            <p className="eyebrow mb-3">Why I Do This</p>
            <h2 className="display text-[32px] md:text-[46px]">
              The film is the only thing that brings the day back
            </h2>
          </div>
          <div className="flex max-w-[720px] flex-col gap-5 text-base leading-relaxed text-espresso md:gap-6 md:text-[17px]">
            <p>
              Wedding days move fast. The photos hold the way it looked — the film holds the way it
              felt. Your grandmother&rsquo;s laugh during the toasts, the crack in his voice at the
              vows, the song you danced to. That&rsquo;s what I&rsquo;m there for.
            </p>
            <p>
              I work fly-on-the-wall: no staging, no directing, no stopping the day to get a shot. I
              mic the vows and the toasts so you keep the words, not just the pictures. Then I edit
              your day like a short film — with pacing, with quiet, with room to feel it.
            </p>
            <p>
              I&rsquo;m based in Conway and film all over Central and Northwest Arkansas. One wedding
              per date, always — when your day is on my calendar, it has my full attention.
            </p>
          </div>
        </div>
      </section>

      {/* Facts strip */}
      <section className="bg-sand px-5 py-14 md:px-16 md:py-22">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-10">
          {facts.map((f) => (
            <div key={f.label} className="border-t border-taupe pt-5 md:pt-7">
              <p className="display mb-2 text-[38px] md:text-[48px]">{f.stat}</p>
              <p className="text-[13px] leading-normal text-espresso md:text-sm">{f.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The pets */}
      <section className="px-5 py-14 md:px-16 md:py-28">
        <div className="mb-8 flex flex-col gap-4 md:mb-12 md:flex-row md:items-baseline md:justify-between">
          <div>
            <p className="eyebrow mb-3">The Namesakes</p>
            <h2 className="display text-[32px] md:text-[52px]">Meet Rosie, Binx + Boujee</h2>
          </div>
          <Link href="/packages" className="text-[15px] font-medium">
            See the Packages →
          </Link>
        </div>
        <div className="grid gap-8 md:grid-cols-3 md:gap-7">
          {pets.map((p) => (
            <div key={p.name} className="flex flex-col gap-4">
              <ImageSlot
                src={p.photo}
                alt={`${p.name}, one of Travelle's pets`}
                className="h-[240px] md:h-[340px]"
                sizes="(min-width: 768px) 33vw, 100vw"
              />
              <div>
                <p className="display mb-1 text-2xl md:text-[28px]">{p.name}</p>
                <p className="romantic text-base leading-normal text-taupe md:text-[17px]">{p.line}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Off the clock */}
      <section className="border-t hairline px-5 py-14 md:px-16 md:py-28">
        <div className="grid gap-6 md:grid-cols-[380px_1fr] md:gap-20">
          <div>
            <p className="eyebrow mb-3">Off the Clock</p>
            <h2 className="display text-[32px] md:text-[46px]">When the camera&rsquo;s down</h2>
          </div>
          <div className="max-w-[720px] text-base leading-relaxed text-espresso md:text-[17px]">
            <p>
              I married my best friend in 2019, and together we&rsquo;ve become exactly the pet
              people we swore we&rsquo;d never be — Rosie, Binx, and Boujee run the house, and yes,
              the packages are named after them. Beyond that, it&rsquo;s basketball (die-hard Miami
              Heat, but I&rsquo;ll watch any team play anybody), documentaries, and podcasts that
              are honestly too long.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials — rotating */}
      <section className="border-t hairline px-6 py-16 text-center md:px-16 md:py-28">
        <RotatingQuotes quotes={testimonials} />
      </section>

      <CtaSection
        line="Let's tell your story right."
        subline="You've heard mine — now I'd love to hear yours."
        trackLabel="about_final"
      />
    </>
  );
}
