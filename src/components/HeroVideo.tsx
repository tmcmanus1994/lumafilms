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
export default function HeroVideo({ vimeoUrl }: { vimeoUrl: string }) {
  const [showVideo, setShowVideo] = useState(false);
  const id = idFrom(vimeoUrl);

  useEffect(() => {
    if (!id) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setShowVideo(true);
  }, [id]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-ink" aria-hidden>
      {id && (
        <Image
          src={`https://vumbnail.com/${id}.jpg`}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}
      {showVideo && id && (
        <iframe
          src={`https://player.vimeo.com/video/${id}?background=1&autoplay=1&loop=1&muted=1&quality=1080p`}
          title="Luma Films wedding film reel"
          allow="autoplay; fullscreen"
          tabIndex={-1}
          // Cover the container regardless of its aspect ratio
          className="pointer-events-none absolute left-1/2 top-1/2 aspect-video h-full min-h-full w-auto min-w-full -translate-x-1/2 -translate-y-1/2"
        />
      )}
    </div>
  );
}
