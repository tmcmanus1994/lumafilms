import type { Metadata } from "next";
import Link from "next/link";
import ImageSlot from "@/components/ImageSlot";
import CtaSection from "@/components/CtaSection";
import PageMeta from "@/components/PageMeta";

export const metadata: Metadata = {
  title: "About Travelle — Central Arkansas Wedding Videographer",
  description:
    "Meet Travelle, the Conway-based wedding videographer behind Luma Films. 45+ weddings filmed across Little Rock, Conway, and Northwest Arkansas — fly-on-the-wall filming, story-driven editing.",
  alternates: { canonical: "/about" },
};

const facts = [
  { stat: "45+", label: "Weddings filmed across Arkansas" },
  { stat: "1", label: "Wedding per date — never two" },
  { stat: "48 hrs", label: "To your Instagram reel sneak peek" },
  { stat: "3", label: "Pets who run my house — and my packages" },
];

const pets = [
  { name: "Rosie", line: "PLACEHOLDER — pet story, one warm sentence." },
  { name: "Binx", line: "The black cat who supervises every edit." },
  { name: "Boujee", line: "PLACEHOLDER — pet story, one warm sentence." },
];

export default function AboutPage() {
  return (
    <>
      <PageMeta page_type="about" />

      {/* Intro split */}
      <section className="grid border-b hairline md:grid-cols-2">
        <ImageSlot
          src=""
          alt="Travelle, wedding videographer, on location with camera"
          placeholderLabel="Portrait — Travelle with camera, on location"
          className="order-1 h-[420px] md:order-2 md:h-auto md:min-h-[720px]"
        />
        <div className="order-2 flex flex-col justify-center px-6 py-14 md:order-1 md:px-16 md:py-28">
          <p className="eyebrow mb-4 md:mb-5">My Story</p>
          <h1 className="display mb-5 text-[38px] md:mb-7 md:text-[66px]">
            Hi, I&rsquo;m Travelle — the person behind the camera
          </h1>
          <p className="mb-7 max-w-[520px] text-base leading-relaxed text-espresso md:mb-9 md:text-lg">
            Central Arkansas wedding videographer, based in Conway. I&rsquo;ve filmed 45+ weddings
            across Little Rock, Conway, and Northwest Arkansas — and I still tear up in the edit.
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

      {/* Why I do this */}
      <section className="px-5 py-14 md:px-16 md:py-28">
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
                src=""
                alt={`${p.name}, one of Travelle's pets`}
                placeholderLabel={`${p.name} photo`}
                className="h-[240px] md:h-[340px]"
              />
              <div>
                <p className="display mb-1 text-2xl md:text-[28px]">{p.name}</p>
                <p className="romantic text-base leading-normal text-taupe md:text-[17px]">{p.line}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <section className="border-t hairline px-6 py-16 text-center md:px-16 md:py-28">
        <blockquote className="romantic mx-auto max-w-[920px] text-[26px] leading-snug md:text-[40px]">
          &ldquo;He felt like a guest who happened to have a camera — and then the film made us
          cry.&rdquo;
        </blockquote>
        <p className="eyebrow mt-6">Kasey + Brady · Legacy Acres</p>
      </section>

      <CtaSection
        line="Let's tell your story right."
        subline="One wedding per date — see if yours is open."
        trackLabel="about_final"
      />
    </>
  );
}
