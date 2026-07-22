"use client";

import { useEffect, useState } from "react";

export type Quote = { quote: string; attribution: string };

/**
 * Testimonial spotlight that cross-dissolves between quotes every 4 seconds.
 * Static (first quote only) when prefers-reduced-motion is set. All quotes
 * stay in the DOM, absolutely stacked, so the section height never jumps
 * and crawlers see every testimonial.
 */
export default function RotatingQuotes({
  quotes,
  light = false,
}: {
  quotes: Quote[];
  light?: boolean;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (quotes.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setActive((i) => (i + 1) % quotes.length), 4000);
    return () => clearInterval(t);
  }, [quotes.length]);

  return (
    <div className="relative mx-auto grid max-w-[920px]">
      {quotes.map((q, i) => (
        <figure
          key={q.attribution}
          className={`col-start-1 row-start-1 flex flex-col items-center gap-6 transition-opacity duration-1000 md:gap-9 ${
            i === active ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          aria-hidden={i !== active}
        >
          <blockquote
            className={`romantic text-[26px] leading-snug md:text-[40px] ${light ? "text-bone" : "text-ink"}`}
          >
            &ldquo;{q.quote}&rdquo;
          </blockquote>
          <figcaption className="eyebrow">{q.attribution}</figcaption>
        </figure>
      ))}
    </div>
  );
}
