import type { Metadata } from "next";
import PageMeta from "@/components/PageMeta";
import SchedulerEmbed from "./SchedulerEmbed";
import { site } from "@/lib/site";

/**
 * Post-inquiry page. The HoneyBook contact form redirects here after submit
 * (set in HoneyBook: contact form → Settings → "Send people to this URL after
 * the confirmation page"). The scheduler is on the page so a couple can book
 * the intro call before they leave the site.
 */
export const metadata: Metadata = {
  title: "Got Your Inquiry — Grab a Time to Talk",
  description: "Your inquiry is in. Book a 20-minute call with Luma Films now and skip the email back-and-forth.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/contact/thanks" },
};

const next = [
  {
    n: "01",
    title: "Check your inbox",
    copy: "The brochure, a film to watch, and whether your date is open as of today are on their way right now.",
  },
  {
    n: "02",
    title: "Grab 20 minutes",
    copy: "Pick a time below. It is mostly me asking about your day, then I tell you plainly whether I am the right fit.",
  },
  {
    n: "03",
    title: "A retainer holds your date",
    copy: "One wedding per date, always. Once the retainer is in, the date is yours and the rest splits into payments.",
  },
];

export default function ContactThanksPage() {
  return (
    <>
      <PageMeta page_type="contact_thanks" />

      <section className="border-b hairline px-6 py-14 md:px-16 md:py-24">
        <div className="mx-auto max-w-[960px]">
          <p className="eyebrow mb-4">Inquiry Received</p>
          <h1 className="display mb-5 text-4xl md:text-[58px]">Got it. Want to skip the back and forth?</h1>
          <p className="mb-10 max-w-[560px] text-[15px] leading-relaxed text-espresso md:mb-14 md:text-[17px]">
            Your inquiry just landed. If you already know you want to talk, grab a time right here and we
            will skip the email tag. If not, everything you need is on its way to your inbox.
          </p>
          <SchedulerEmbed />
        </div>
      </section>

      <section className="px-5 py-16 md:px-16 md:py-24">
        <p className="eyebrow mb-3">What Happens Next</p>
        <h2 className="display mb-9 text-[32px] md:mb-14 md:text-[48px]">Three steps</h2>
        <div className="grid gap-8 md:grid-cols-3 md:gap-10" data-anim-stagger>
          {next.map((s) => (
            <div key={s.n} className="border-t border-taupe pt-5 md:pt-8">
              <p className="eyebrow mb-3 text-xs md:mb-4">{s.n}</p>
              <h3 className="display mb-3 text-2xl md:text-[28px]">{s.title}</h3>
              <p className="text-[15px] leading-relaxed text-espresso md:text-base">{s.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="eyebrow border-y hairline px-5 py-4 text-center text-[11px] leading-8 md:py-5 md:text-[13px]">
        One Wedding Per Date&ensp;·&ensp;Guaranteed Delivery Date&ensp;·&ensp;Travel Included Within 50 Miles
      </div>

      <section className="bg-ink px-6 py-18 text-center md:px-16 md:py-28">
        <p className="romantic mb-4 text-3xl leading-tight text-bone md:text-[46px]">Rather just text?</p>
        <p className="text-[15px] leading-loose text-sand/75 md:text-base">
          <a
            href={`mailto:${site.email}`}
            className="underline decoration-sand/40 underline-offset-4 transition-colors hover:text-bone hover:decoration-bone"
          >
            {site.email}
          </a>{" "}
          ·{" "}
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener"
            className="underline decoration-sand/40 underline-offset-4 transition-colors hover:text-bone hover:decoration-bone"
          >
            {site.instagramHandle}
          </a>
        </p>
      </section>
    </>
  );
}
