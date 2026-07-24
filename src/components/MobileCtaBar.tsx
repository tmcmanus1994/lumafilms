"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import CheckMyDate from "./CheckMyDate";

/**
 * Sticky bottom "Check My Date" bar on mobile. Slides up (translateY) once
 * the hero-height sentinel leaves the viewport — IntersectionObserver only,
 * no scroll listeners (motion spec). Hidden on /contact (the form IS the
 * CTA); the portal has its own layout without this bar.
 */
export default function MobileCtaBar() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const sentinel = document.getElementById("hero-sentinel");
    if (!sentinel) return;
    const io = new IntersectionObserver(([e]) => setVisible(!e.isIntersecting));
    io.observe(sentinel);
    return () => io.disconnect();
  }, [pathname]);

  if (pathname.startsWith("/contact")) return null;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 border-t hairline bg-bone p-3 transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <CheckMyDate className="btn btn-fill block w-full" trackLabel="mobile_sticky_bar" />
    </div>
  );
}
