import type { Metadata } from "next";
import localFont from "next/font/local";
import Analytics from "@/components/Analytics";
import AnimProvider from "@/components/AnimProvider";
import { site } from "@/lib/site";
import "./globals.css";

// Self-hosted (latin subsets) — no third-party font requests, better CWV
const cormorant = localFont({
  src: [
    { path: "../fonts/cormorant-garamond-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/cormorant-garamond-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "../fonts/cormorant-garamond-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/cormorant-garamond-latin-500-italic.woff2", weight: "500", style: "italic" },
  ],
  variable: "--font-cormorant",
  display: "swap",
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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
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
