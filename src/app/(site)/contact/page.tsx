import type { Metadata } from "next";
import ImageSlot from "@/components/ImageSlot";
import PageMeta from "@/components/PageMeta";
import HoneyBookForm from "./HoneyBookForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Check My Date — Arkansas Wedding Videographer Availability",
  description:
    "See if your wedding date is open. Tell Luma Films the basics and get the full pricing brochure — packages from $2,400 — plus your date's availability within one business day.",
  alternates: { canonical: "/contact" },
};

const steps = [
  {
    n: "01",
    title: "The brochure lands in your inbox",
    copy: "Within one business day you'll have the full brochure — films, packages, pricing — and whether your date is open.",
  },
  {
    n: "02",
    title: "We talk — call, video, or coffee",
    copy: "A short, easy conversation about your day and your venue. You'll know quickly whether I'm your person.",
  },
  {
    n: "03",
    title: "A retainer holds your date",
    copy: "Once it's in, the date is yours — one wedding per date, always. The rest splits into easy payments.",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageMeta page_type="contact" />

      {/* Split: form left, photo right (photo on top for mobile) */}
      <section className="grid border-b hairline md:grid-cols-2">
        <ImageSlot
          src="/images/contact/travelle.jpg"
          alt="Travelle, the videographer behind Luma Films"
          className="order-1 h-[300px] md:order-2 md:h-auto md:min-h-[860px]"
          sizes="(min-width: 768px) 50vw, 100vw"
          priority
        />
        <div className="order-2 px-6 py-14 md:order-1 md:py-24 md:pl-16 md:pr-22">
          <p className="eyebrow mb-4">Check My Date</p>
          <h1 className="display mb-5 text-4xl md:text-[58px]">Let&rsquo;s see if your date is open</h1>
          <p className="mb-9 max-w-[480px] text-[15px] leading-relaxed text-espresso md:mb-12 md:text-[17px]">
            Tell me the basics and I&rsquo;ll send you my full brochure of films and packages —
            starting at ${site.startingPrice.toLocaleString()} — along with your date&rsquo;s
            availability.
          </p>
          <HoneyBookForm />
          <p className="mt-7 text-[13px] leading-relaxed text-taupe">
            No spam, no pressure — just your availability and the brochure. I reply within one
            business day.
          </p>
        </div>
      </section>

      {/* What happens next */}
      <section className="px-5 py-16 md:px-16 md:py-24">
        <p className="eyebrow mb-3">What Happens Next</p>
        <h2 className="display mb-9 text-[32px] md:mb-14 md:text-[48px]">Three steps, no pressure</h2>
        <div className="grid gap-8 md:grid-cols-3 md:gap-10">
          {steps.map((s) => (
            <div key={s.n} className="border-t border-taupe pt-5 md:pt-8">
              <p className="eyebrow mb-3 text-xs md:mb-4">{s.n}</p>
              <h3 className="display mb-3 text-2xl md:text-[28px]">{s.title}</h3>
              <p className="text-[15px] leading-relaxed text-espresso md:text-base">{s.copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reassurance strip */}
      <div className="eyebrow border-y hairline px-5 py-4 text-center text-[11px] leading-8 md:py-5 md:text-[13px]">
        Packages from ${site.startingPrice.toLocaleString()}&ensp;·&ensp;One Wedding Per
        Date&ensp;·&ensp;Reply Within One Business Day
      </div>

      {/* Say hi */}
      <section className="bg-ink px-6 py-18 text-center md:px-16 md:py-28">
        <p className="romantic mb-4 text-3xl leading-tight text-bone md:text-[46px]">
          Prefer to just say hi?
        </p>
        <p className="text-[15px] leading-loose text-sand/75 md:text-base">
          {site.email} · {site.instagramHandle}
        </p>
      </section>
    </>
  );
}
