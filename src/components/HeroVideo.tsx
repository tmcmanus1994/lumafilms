"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

function idFrom(url: string) {
  return url.match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1];
}

/**
 * Full-bleed muted looping Vimeo background for the homepage hero.
 * The poster frame paints immediately (LCP); the player iframe loads after
 * mount so it never blocks first render. Respects prefers-reduced-motion by
 * keeping the still frame.
 */
export default function HeroVideo({ vimeoUrl, poster }: { vimeoUrl: string; poster?: string }) {
  const [showVideo, setShowVideo] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const id = idFrom(vimeoUrl);
  const posterSrc = poster ?? (id ? `https://vumbnail.com/${id}.jpg` : undefined);

  useEffect(() => {
    if (!id) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Mobile gets the poster only — the background player would compete with
    // the LCP image for bandwidth on throttled connections.
    if (!window.matchMedia("(min-width: 768px)").matches) return;
    // Desktop: wait for the full page load so the poster wins LCP first.
    const arm = () => setShowVideo(true);
    if (document.readyState === "complete") {
      arm();
      return;
    }
    window.addEventListener("load", arm, { once: true });
    return () => window.removeEventListener("load", arm);
  }, [id]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-ink [container-type:size]" aria-hidden>
      {posterSrc && (
        <Image src={posterSrc} alt="" fill priority sizes="100vw" className="object-cover" />
      )}
      {showVideo && id && (
        <iframe
          src={`https://player.vimeo.com/video/${id}?background=1&autoplay=1&loop=1&muted=1&quality=1080p&dnt=1`}
          title="Luma Films wedding film reel"
          allow="autoplay; fullscreen"
          tabIndex={-1}
          onLoad={() => setLoaded(true)}
          // Cover: always at least full banner width AND height, 16:9 preserved,
          // center-cropped. Fades in over the poster once ready (LCP = poster).
          className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[max(100cqw,177.78cqh)] h-[max(100cqh,56.25cqw)] transition-opacity duration-700 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}
