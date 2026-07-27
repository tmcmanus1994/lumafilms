import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Client Films",
  robots: { index: false, follow: false },
};

/** Landing spot for the footer "Client Films" link — galleries are unlisted. */
export default function CouplesIndexPage() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-24 text-center">
      <p className="eyebrow mb-4">Client Films</p>
      <h1 className="display mb-5 max-w-[640px] text-4xl md:text-5xl">
        Your gallery has its own private link
      </h1>
      <p className="max-w-[480px] text-base leading-relaxed text-espresso">
        Check the delivery email I sent you — it has your personal gallery address. Can&rsquo;t find
        it? Email me at {site.email} and I&rsquo;ll send it again.
      </p>
    </section>
  );
}
