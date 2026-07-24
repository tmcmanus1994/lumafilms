"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { nav } from "@/lib/site";
import Logo from "./Logo";
import CheckMyDate from "./CheckMyDate";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Hairline + solid background appear once the page scrolls (IO on a top
  // sentinel — no scroll listeners, per the motion spec).
  useEffect(() => {
    const sentinel = document.getElementById("top-sentinel");
    if (!sentinel) return;
    const io = new IntersectionObserver(([e]) => setScrolled(!e.isIntersecting));
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
        scrolled || open ? "hairline bg-bone/95 backdrop-blur-sm" : "border-transparent bg-bone"
      }`}
    >
      <div className="flex items-center justify-between px-5 py-4 md:px-16 md:py-6">
        <Link href="/" aria-label="Luma Films — home">
          <Logo variant="dark" />
        </Link>

        {/* Desktop: quiet text links + single filled CTA */}
        <nav className="hidden items-center gap-9 text-sm font-medium md:flex" aria-label="Main">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link text-ink">
              {item.label}
            </Link>
          ))}
          <CheckMyDate className="btn btn-fill px-6 py-3 text-sm" trackLabel="nav" />
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="flex w-6 flex-col gap-[5px] py-3 md:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`h-px bg-ink transition-transform ${open ? "translate-y-[3px] rotate-45" : ""}`} />
          <span className={`h-px bg-ink transition-transform ${open ? "-translate-y-[3px] -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <nav className="border-t hairline px-5 pb-8 pt-4 md:hidden" aria-label="Mobile">
          <ul className="flex flex-col">
            {nav.map((item) => (
              <li key={item.href} className="border-b hairline">
                <Link
                  href={item.href}
                  className="display block py-4 text-2xl text-ink"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <CheckMyDate
            className="btn btn-fill mt-6 block"
            trackLabel="mobile_menu"
            onNavigate={() => setOpen(false)}
          />
        </nav>
      )}
    </header>
  );
}
