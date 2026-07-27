"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Arms the motion system (spec: docs/motion-cta-spec).
 * - Adds `js-anim` to <html>; without it every element is fully visible,
 *   so crawlers and no-JS visitors never see hidden content.
 * - One IntersectionObserver reveals [data-anim] / [data-anim-stagger]
 *   elements once (no re-animation on scroll-up), re-scanning after each
 *   client-side navigation. No scroll listeners anywhere.
 */
export default function AnimProvider() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.add("js-anim");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    document
      .querySelectorAll("[data-anim]:not(.in), [data-anim-stagger]:not(.in)")
      .forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
