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
export default function HeroVideo({
  vimeoUrl,
  poster,
  fit = "cover",
}: {
  vimeoUrl: string;
  poster?: string;
  /** "cover": crop a 16:9 source to fill any container. "fill": the video's
   *  aspect matches the container exactly — stretch the iframe edge-to-edge. */
  fit?: "cover" | "fill";
}) {
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
          // Fades in over the poster once ready (LCP = poster). Cover mode keeps
          // a 16:9 source center-cropped at full-bleed; fill mode assumes the
          // video matches the container's aspect ratio.
          className={`pointer-events-none absolute transition-opacity duration-700 ${
            fit === "cover"
              ? "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[max(100cqw,177.78cqh)] h-[max(100cqh,56.25cqw)]"
              : "inset-0 h-full w-full"
          } ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </div>
  );
}
