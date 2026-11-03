"use client";

import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";
import { site } from "@/lib/site";

const SUBMIT_KEY = "luma_form_submit_tracked";

/**
 * HoneyBook scheduler embedded as an iframe (HoneyBook's supported method:
 * 100% width, 800px+ height). Fires `form_submit` once per session on mount,
 * since the HoneyBook contact form iframe hides its own submit event.
 */
export default function SchedulerEmbed() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      if (!sessionStorage.getItem(SUBMIT_KEY)) {
        sessionStorage.setItem(SUBMIT_KEY, "1");
        track("form_submit", { lead_source_page: document.referrer || "direct" });
      }
    } catch {
      track("form_submit");
    }
  }, []);

  return (
    <div className="w-full">
      <div className="relative w-full overflow-hidden border hairline bg-bone" style={{ minHeight: 820 }}>
        {!loaded && (
          <p className="absolute inset-x-0 top-24 text-center text-[13px] text-taupe">Loading the calendar…</p>
        )}
        <iframe
          src={site.schedulerUrl}
          title="Book a 20-minute call with Luma Films"
          className="relative block h-[820px] w-full"
          loading="lazy"
          onLoad={() => setLoaded(true)}
          allow="payment"
        />
      </div>
      <p className="mt-4 text-[13px] leading-relaxed text-taupe">
        Calendar not showing?{" "}
        <a
          href={site.schedulerUrl}
          target="_blank"
          rel="noopener"
          className="underline underline-offset-4"
          data-track="outbound_click"
          data-track-label="scheduler_fallback"
        >
          Open it in a new tab
        </a>
        .
      </p>
    </div>
  );
}
