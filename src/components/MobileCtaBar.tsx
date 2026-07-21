"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Sticky bottom "Check My Date" bar on mobile. Appears only after scrolling
 * past the hero (thumb-zone placement, never covering the hero film).
 * Hidden on /contact (the form IS the CTA) and /couples (private galleries).
 */
export default function MobileCtaBar() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname.startsWith("/contact") || pathname.startsWith("/couples")) return null;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 border-t hairline bg-bone p-3 transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <Link
        href="/contact"
        className="btn btn-fill block w-full"
        data-track="cta_click"
        data-track-label="mobile_sticky_bar"
      >
        Check My Date
      </Link>
    </div>
  );
}
