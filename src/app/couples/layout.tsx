import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/** Minimal chrome for private galleries — no marketing nav, no CTAs. */
export default function CouplesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="flex items-center justify-between border-b hairline px-5 py-4 md:px-16 md:py-6">
        <Link href="/" className="romantic text-2xl font-medium text-ink md:text-3xl">
          Luma Films
        </Link>
        <p className="eyebrow text-[10px] md:text-xs">Private Gallery</p>
      </header>
      <main>{children}</main>
      <footer className="flex flex-col items-center gap-3 bg-ink px-5 py-7 text-center md:flex-row md:justify-between md:px-16 md:py-8 md:text-left">
        <p className="romantic text-xl text-bone">Luma Films</p>
        <p className="text-[13px] text-sand">Questions? {site.email}</p>
        <p className="text-xs text-taupe">This gallery is private — just for you two.</p>
      </footer>
    </>
  );
}
