import type { Metadata } from "next";
import localFont from "next/font/local";
import Analytics from "@/components/Analytics";
import AnimProvider from "@/components/AnimProvider";
import { site } from "@/lib/site";
import "./globals.css";

// Self-hosted (latin subsets) — no third-party font requests, better CWV
//
// Upright and italic are declared as two families on purpose. next/font
// preloads every face in a call, so keeping all four Cormorant faces together
// put 48KB of italics into the <head> preload queue of every page — ahead of
// the hero poster, which is the LCP element. The homepage never renders an
// italic. Italic now loads on demand, only on the pages that use .romantic.
const cormorant = localFont({
  src: [
    { path: "../fonts/cormorant-garamond-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/cormorant-garamond-latin-500-normal.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-cormorant",
  display: "swap",
});

const cormorantItalic = localFont({
  src: [
    { path: "../fonts/cormorant-garamond-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "../fonts/cormorant-garamond-latin-500-italic.woff2", weight: "500", style: "italic" },
  ],
  variable: "--font-cormorant-italic",
  display: "swap",
  preload: false,
});

const inter = localFont({
  src: [
    { path: "../fonts/inter-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/inter-latin-500-normal.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Central Arkansas Wedding Videographer | Luma Films",
    template: "%s | Luma Films",
  },
  description: site.description,
  openGraph: {
    siteName: site.name,
    locale: "en_US",
    type: "website",
    images: ["/images/brand/og-default.jpg"],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${cormorantItalic.variable} ${inter.variable}`}>
      <body>
        {/* Scroll sentinels for IntersectionObserver-driven chrome (no scroll listeners) */}
        <div id="top-sentinel" aria-hidden className="pointer-events-none absolute top-0 h-2 w-px" />
        <div id="hero-sentinel" aria-hidden className="pointer-events-none absolute top-0 h-[90vh] w-px" />
        {children}
        <Analytics />
        <AnimProvider />
      </body>
    </html>
  );
}
