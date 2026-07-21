"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * Loads GA4 and wires the sitewide behavioral events the insight agent
 * consumes: delegated CTA clicks (any element with data-track), scroll depth,
 * and outbound clicks. Page-level context is set by <PageMeta>.
 */
export default function Analytics() {
  const pathname = usePathname();

  // SPA page views with page context attached
  useEffect(() => {
    if (!window.gtag) return;
    window.gtag("event", "page_view", {
      page_path: pathname,
      ...window.__lumaPage,
    });
  }, [pathname]);

  useEffect(() => {
    // Delegated click tracking: <a data-track="cta_click" data-track-label="hero">
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-track]");
      if (el) {
        track(el.dataset.track as never, {
          cta_location: el.dataset.trackLabel,
          link_text: el.textContent?.trim().slice(0, 60),
        });
        return;
      }
      const link = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[href^='http']");
      if (link && !link.href.startsWith(window.location.origin)) {
        track("outbound_click", { link_url: link.href });
      }
    };

    // Scroll depth at 25/50/75/90 — fired once per page view
    const fired = new Set<number>();
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const pct = (window.scrollY / scrollable) * 100;
      for (const threshold of [25, 50, 75, 90]) {
        if (pct >= threshold && !fired.has(threshold)) {
          fired.add(threshold);
          track("scroll_depth", { percent: threshold });
        }
      }
    };

    document.addEventListener("click", onClick);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}', { send_page_view: false });`}
      </Script>
    </>
  );
}
