import Link from "next/link";

type Props = {
  line: string;
  subline?: string;
  trackLabel: string;
};

/** Ink-background closing CTA — every SEO entry point ends here, never a dead end. */
export default function CtaSection({ line, subline, trackLabel }: Props) {
  return (
    <section className="bg-ink px-6 py-20 text-center md:px-16 md:py-32">
      <div className="flex flex-col items-center gap-5 md:gap-7">
        <p className="romantic text-[2.1rem] leading-tight text-bone md:text-5xl">{line}</p>
        {subline && <p className="text-[15px] leading-relaxed text-sand/75 md:text-base">{subline}</p>}
        <Link
          href="/contact"
          className="btn btn-light mt-2"
          data-track="cta_click"
          data-track-label={trackLabel}
        >
          Check My Date
        </Link>
      </div>
    </section>
  );
}
