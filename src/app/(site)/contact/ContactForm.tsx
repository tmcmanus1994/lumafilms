"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";

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

const inputClass =
  "border-0 border-b border-[#C9BDA8] bg-transparent px-0 py-2.5 font-body text-base text-ink outline-none placeholder:text-taupe-light focus:border-ink";

/**
 * Date-first interaction (rebuild plan §11): the wedding-date field leads and
 * autofocuses; the remaining fields reveal once a date is entered. Post-submit,
 * the three "what happens next" steps become the confirmation state.
 */
export default function ContactForm() {
  const [dateEntered, setDateEntered] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const started = useRef(false);
  const dateRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dateRef.current?.focus({ preventScroll: true });
  }, []);

  const onFirstInteraction = () => {
    if (!started.current) {
      started.current = true;
      track("form_start");
    }
  };

  if (status === "sent") {
    return (
      <div>
        <p className="eyebrow mb-4">You&rsquo;re on my list</p>
        <h2 className="display mb-3 text-3xl md:text-4xl">Got it — here&rsquo;s what happens next</h2>
        <div className="mt-8 flex flex-col gap-8">
          {steps.map((s) => (
            <div key={s.n} className="border-t border-taupe pt-5">
              <p className="eyebrow mb-3 text-xs">{s.n}</p>
              <h3 className="display mb-2 text-2xl">{s.title}</h3>
              <p className="text-[15px] leading-relaxed text-espresso">{s.copy}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <form
      className="flex max-w-[520px] flex-col gap-6 md:gap-7"
      onSubmit={async (e) => {
        e.preventDefault();
        setStatus("sending");
        const form = e.currentTarget;
        const data = Object.fromEntries(new FormData(form).entries());
        try {
          const res = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          if (!res.ok) throw new Error(`Request failed: ${res.status}`);
          track("form_submit", {
            has_venue: Boolean((data.venue as string)?.trim()),
            lead_source_page: document.referrer || undefined,
          });
          setStatus("sent");
        } catch {
          setStatus("error");
        }
      }}
    >
      {/* Date leads — the single-step opener */}
      <div className="flex flex-col gap-2.5">
        <label htmlFor="date" className="eyebrow text-xs">
          Wedding Date
        </label>
        <input
          ref={dateRef}
          id="date"
          name="date"
          type="text"
          required
          placeholder="10 / 17 / 2026"
          autoComplete="off"
          className={inputClass}
          onFocus={onFirstInteraction}
          onChange={(e) => {
            if (!dateEntered && e.target.value.trim().length >= 4) {
              setDateEntered(true);
              track("form_date_entered");
            }
          }}
        />
        {!dateEntered && (
          <p className="text-[13px] text-taupe">Start with your date — the rest takes 30 seconds.</p>
        )}
      </div>

      <div
        className={`flex flex-col gap-6 transition-opacity duration-500 md:gap-7 ${
          dateEntered ? "opacity-100" : "pointer-events-none h-0 overflow-hidden opacity-0 md:h-auto md:pointer-events-auto md:opacity-60"
        }`}
        aria-hidden={!dateEntered ? true : undefined}
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-2.5">
            <label htmlFor="names" className="eyebrow text-xs">
              Your Names
            </label>
            <input
              id="names"
              name="names"
              type="text"
              required={dateEntered}
              placeholder="Jordan + Riley"
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <label htmlFor="venue" className="eyebrow text-xs">
              Venue <span className="normal-case tracking-normal text-taupe-light">(or &ldquo;still deciding&rdquo;)</span>
            </label>
            <input id="venue" name="venue" type="text" placeholder="The Venue at Oakdale" className={inputClass} />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-2.5">
            <label htmlFor="email" className="eyebrow text-xs">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required={dateEntered}
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <label htmlFor="phone" className="eyebrow text-xs">
              Phone
            </label>
            <input id="phone" name="phone" type="tel" placeholder="(501) 555-0134" className={inputClass} />
          </div>
        </div>

        <button type="submit" className="btn btn-fill mt-2 cursor-pointer" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Check My Date"}
        </button>
        <p className="text-[13px] leading-relaxed text-taupe">
          You&rsquo;ll get my availability and the full pricing brochure within 24 hours.
        </p>
        {status === "error" && (
          <p className="text-[13px] text-espresso">
            Something went wrong sending that — email me directly at hello@lumaweddingfilms.co and
            I&rsquo;ll get right back to you.
          </p>
        )}
      </div>
    </form>
  );
}
