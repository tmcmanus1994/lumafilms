import type { NextConfig } from "next";
import fs from "node:fs";
import path from "node:path";

// Every wedding file at content/weddings/[slug].json had a Framer-era portal URL
// at the root level (e.g. /thompson). Redirect them all to /couples/[slug] so the
// 45 couples' bookmarked links keep working after the migration.
function portalRedirects() {
  const dir = path.join(process.cwd(), "content", "weddings");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""))
    .map((slug) => ({
      source: `/${slug}`,
      destination: `/couples/${slug}`,
      permanent: true,
    }));
}

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Legacy Framer page paths
      { source: "/their-story", destination: "/films", permanent: true },
      { source: "/our-story", destination: "/about", permanent: true },
      { source: "/my-story", destination: "/about", permanent: true },
      ...portalRedirects(),
    ];
  },
  async headers() {
    return [
      {
        // Belt-and-suspenders on top of the robots meta tag: private galleries
        // must never be indexed.
        source: "/couples/:slug*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "i.vimeocdn.com" },
      { protocol: "https", hostname: "vumbnail.com" },
    ],
  },
};

export default nextConfig;
