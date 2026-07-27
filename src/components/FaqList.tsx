"use client";

import { useState } from "react";

export type Faq = { question: string; answer: string };

/**
 * Accordion FAQ (spec: grid-template-rows 0fr → 1fr, chevron rotate).
 * Answers stay in the DOM at all times — FAQPage schema and crawlers see
 * everything; the accordion is purely presentational.
 */
export default function FaqList({ faqs, tone = "light" }: { faqs: Faq[]; tone?: "light" | "sand" }) {
  const [open, setOpen] = useState(0);
  const rule = tone === "sand" ? "border-linen-dark" : "hairline";

  return (
    <div className="flex max-w-[720px] flex-col">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.question} data-open={isOpen} className={`faq-item border-t ${rule} last:border-b`}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? -1 : i)}
              className="flex w-full cursor-pointer items-baseline justify-between gap-6 py-5 text-left md:py-6"
            >
              <h3 className="display text-[22px] md:text-[26px]">{f.question}</h3>
              <span className="faq-chevron display shrink-0 text-2xl text-taupe" aria-hidden>
                +
              </span>
            </button>
            <div className="faq-body">
              <div>
                <p className="pb-5 text-[15px] leading-relaxed text-espresso md:pb-7 md:text-base">
                  {f.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
