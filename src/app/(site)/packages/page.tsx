import type { Metadata } from "next";
import Link from "next/link";
import ImageSlot from "@/components/ImageSlot";
import CtaSection from "@/components/CtaSection";
import JsonLd from "@/components/JsonLd";
import PageMeta from "@/components/PageMeta";
import { faqPageSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Wedding Videography Packages & Pricing — From $2,400",
  description:
    "Wedding film packages from Luma Films: Rosie $2,400, Binx $3,200, Boujee $4,800. Every package includes 4K filming, licensed music, and your Instagram reel within 48 hours. Central Arkansas + NWA.",
  alternates: { canonical: "/packages" },
};

type Pkg = {
  name: string;
  tagline: string;
  petLine: string;
  price: string;
  features: string[];
  featured?: boolean;
};

const packages: Pkg[] = [
  {
    name: "Rosie",
    tagline: "Cute + Short",
    petLine: "Named for the intern — a corgi with a lot of opinions and zero editing experience.",
    price: "$2,400",
    features: [
      "Your 3–5 minute cinematic film — the story of your day, edited to be watched a hundred times",
      "6 hours of coverage, filmed in 4K",
      "Your Instagram reel, delivered within 48 hours",
      "Licensed music and the real sound of your day woven in",
      "Delivered in your private Luma gallery — yours forever",
    ],
  },
  {
    name: "Binx",
    tagline: "Simple + Fun",
    petLine: "Named for the comic relief — a black cat who's never once worried about a deadline.",
    price: "$3,200",
    featured: true,
    features: [
      "Everything in Rosie, plus:",
      "Your 5–7 minute cinematic film",
      "8 hours of coverage",
      "Your full ceremony — every word, every vow, clean multi-camera audio",
      "Drone coverage of you and your venue",
    ],
  },
  {
    name: "Boujee",
    tagline: "The Whole Story",
    petLine: "Named for the assistant editor — she's watched every film leave this house.",
    price: "$4,800",
    features: [
      "Everything in Binx, plus:",
      "Your 7–9 minute cinematic film",
      "10 hours of coverage",
      "Second shooter — nothing gets missed",
      "Every speech and moment — toasts, first dance, shoe game, all of it",
      "Engagement film session before the big day",
      "All raw footage — every second we filmed",
    ],
  },
];

const addons = [
  { name: "Second Shooter", note: "a second set of eyes on everything", price: "$500" },
  { name: "Every Speech & Moment", note: "toasts, first dance, traditions, all captured with clean audio", price: "$450" },
  { name: "Full Ceremony", tag: "(Rosie only)", note: "every word, multi-camera", price: "$350" },
  { name: "Raw Footage", note: "every second we filmed, unedited", price: "$500" },
  { name: "Rehearsal Dinner Film", note: "the night before, the speeches, the nerves", price: "$750" },
  { name: "Engagement Film Session", note: "", price: "$250" },
  { name: "Engraved USB Keepsake", note: "your film in your hands", price: "$100" },
];

const faqs = [
  {
    question: "How does booking work?",
    answer:
      "A retainer holds your date, and the rest splits into a payment plan — fully paid before the wedding. Once the retainer is in, the date is yours.",
  },
  {
    question: "Do you only take one wedding per date?",
    answer: "Yes. One wedding, one couple, my full attention. When your date is booked, it's off the calendar.",
  },
  {
    question: "When will we get our film?",
    answer:
      "Your Instagram reel lands within 48 hours. Your full film arrives by a guaranteed delivery date written into your contract.",
  },
  {
    question: "What if our venue is far away?",
    answer:
      "Anywhere within 50 miles of Little Rock is included. Beyond that, travel adds $1 per mile — no hidden fees, no surprises.",
  },
  {
    question: "What if our day runs long?",
    answer: "I don't pack up mid-toast. Extra hours are available at a simple hourly rate we agree on up front.",
  },
  {
    question: "Can we choose the music?",
    answer:
      "We pick it together. I work from licensed catalogs so your film can live online forever — tell me the feeling you want and I'll bring options.",
  },
  {
    question: "Do we really get the raw footage?",
    answer: "With Boujee, yes — every second, unedited. On Rosie or Binx it's a $500 add-on.",
  },
];

function PackageCard({ pkg }: { pkg: Pkg }) {
  const rule = pkg.featured ? "border-linen-dark" : "hairline";
  return (
    <div
      className={`relative flex flex-col p-6 pt-9 md:p-9 md:pt-11 ${
        pkg.featured ? "border border-ink bg-sand md:pt-14" : "border hairline"
      }`}
    >
      {pkg.featured && (
        <span className="eyebrow absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-ink px-4 py-1.5 text-[11px] !text-bone">
          Most Booked
        </span>
      )}
      <ImageSlot
        src={`/images/pets/${pkg.name.toLowerCase()}-package.jpg`}
        alt={`${pkg.name} the pet`}
        className="h-[92px] w-[92px] rounded-full md:h-[108px] md:w-[108px]"
        sizes="108px"
        objectPosition={pkg.name === "Boujee" ? "65% 50%" : undefined}
      />
      <h2 className="display mb-1 mt-6 text-[32px] md:text-[38px]">{pkg.name}</h2>
      <p className="eyebrow mb-3 text-xs">{pkg.tagline}</p>
      <p className="romantic mb-5 text-base leading-normal text-taupe md:text-[17px]">{pkg.petLine}</p>
      <p className="display mb-6 text-[38px] md:text-[44px]">{pkg.price}</p>
      <ul className={`flex flex-col border-t ${rule}`}>
        {pkg.features.map((f, i) => (
          <li
            key={i}
            className={`border-b ${rule} py-3.5 text-[15px] leading-normal ${
              f.endsWith("plus:") ? "font-medium text-ink" : "text-espresso"
            }`}
          >
            {f}
          </li>
        ))}
      </ul>
      <Link
        href="/contact"
        className={`btn mt-7 ${pkg.featured ? "btn-fill" : ""}`}
        data-track="cta_click"
        data-track-label={`package_${pkg.name.toLowerCase()}`}
      >
        Check My Date
      </Link>
    </div>
  );
}

export default function PackagesPage() {
  return (
    <>
      <PageMeta page_type="packages" />
      <JsonLd data={faqPageSchema(faqs)} />

      {/* Header — one clean H1 */}
      <section className="px-6 pb-10 pt-14 text-center md:px-16 md:pb-16 md:pt-24">
        <p className="eyebrow mb-4">Wedding Film Packages</p>
        <h1 className="display mx-auto mb-5 max-w-[900px] text-4xl md:text-[64px]">
          Packages Named After the Pets Who Run My House
        </h1>
        <p className="mx-auto max-w-[640px] text-[15px] leading-relaxed text-espresso md:text-[17px]">
          Every package includes 4K filming, licensed music, your Instagram reel within 48 hours,
          and lifetime access in your private Luma gallery.
        </p>
      </section>

      {/* Cards — desktop: Binx elevated center; mobile: Binx → Boujee → Rosie */}
      <section className="px-5 pb-16 md:px-16 md:pb-28">
        <div className="flex flex-col gap-6 md:grid md:grid-cols-3 md:items-end md:gap-7">
          <div className="order-3 md:order-1">
            <PackageCard pkg={packages[0]} />
          </div>
          <div className="order-1 md:order-2">
            <PackageCard pkg={packages[1]} />
          </div>
          <div className="order-2 md:order-3">
            <PackageCard pkg={packages[2]} />
          </div>
        </div>
      </section>

      {/* Make It Yours */}
      <section className="bg-sand px-5 py-16 md:px-16 md:py-24">
        <div className="mx-auto max-w-[820px]">
          <p className="eyebrow mb-3 text-center">Make It Yours</p>
          <h2 className="display mb-10 text-center text-[32px] md:mb-12 md:text-[48px]">
            Build on any package
          </h2>
          <ul className="flex flex-col">
            {addons.map((a) => (
              <li
                key={a.name}
                className="flex items-baseline justify-between gap-4 border-t border-linen-dark py-4 last:border-b md:gap-8 md:py-5"
              >
                <p className="text-[14px] leading-normal md:text-base">
                  <span className="font-medium">{a.name}</span>
                  {a.tag && <span className="eyebrow ml-1.5 text-[11px]">{a.tag}</span>}
                  {a.note && <span className="hidden text-espresso md:inline"> — {a.note}</span>}
                </p>
                <p className="display whitespace-nowrap text-[21px] md:text-2xl">{a.price}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-center text-[13px] text-taupe">
            Venues beyond 50 miles of Little Rock add $1 per mile.
          </p>
        </div>
      </section>

      {/* Trust lines */}
      <section className="border-y hairline px-6 py-10 text-center md:px-16 md:py-14">
        <div className="mx-auto flex max-w-[720px] flex-col gap-3.5 md:gap-4">
          <p className="display text-[19px] font-normal leading-normal md:text-2xl">
            Reserve your date with a retainer — split the rest into payments, fully paid before
            your wedding.
          </p>
          <p className="display text-[19px] font-normal leading-normal md:text-2xl">
            Your sneak peek within 48 hours. Your full film by a guaranteed date, in writing.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 py-16 md:px-16 md:py-24">
        <div className="grid gap-8 md:grid-cols-[380px_1fr] md:gap-20">
          <div>
            <p className="eyebrow mb-3">Questions</p>
            <h2 className="display text-[34px] md:text-[46px]">Before you ask</h2>
          </div>
          <div className="flex max-w-[720px] flex-col">
            {faqs.map((f) => (
              <div key={f.question} className="border-t hairline py-5 last:border-b md:py-7">
                <h3 className="display mb-2.5 text-[22px] md:text-[26px]">{f.question}</h3>
                <p className="text-[15px] leading-relaxed text-espresso md:text-base">{f.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaSection line="Named after my pets. Approved by my pets." trackLabel="packages_final" />
    </>
  );
}
