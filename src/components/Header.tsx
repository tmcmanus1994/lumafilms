"use client";

import Link from "next/link";
import { useState } from "react";
import { nav } from "@/lib/site";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b hairline bg-bone/95 backdrop-blur-sm">
      <div className="flex items-center justify-between px-5 py-4 md:px-16 md:py-6">
        <Link
          href="/"
          className="romantic text-2xl font-medium text-ink md:text-3xl"
          aria-label="Luma Films — home"
        >
          Luma Films
        </Link>

        {/* Desktop: quiet text links + single filled CTA */}
        <nav className="hidden items-center gap-9 text-sm font-medium md:flex" aria-label="Main">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-ink transition-colors hover:text-taupe">
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="btn btn-fill px-6 py-3 text-sm"
            data-track="cta_click"
            data-track-label="nav"
          >
            Check My Date
          </Link>
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
          <Link
            href="/contact"
            className="btn btn-fill mt-6 block"
            data-track="cta_click"
            data-track-label="mobile_menu"
            onClick={() => setOpen(false)}
          >
            Check My Date
          </Link>
        </nav>
      )}
    </header>
  );
}
