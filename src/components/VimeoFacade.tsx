"use client";

import Image from "next/image";
import { useState } from "react";
import { track } from "@/lib/analytics";

type Props = {
  vimeoUrl?: string;
  title: string;
  /** Optional local poster; falls back to Vimeo's thumbnail, then a sand block. */
  poster?: string;
  venue?: string;
  className?: string;
};

function idFrom(url?: string) {
  return url?.match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1];
}

/**
 * Facade pattern for Core Web Vitals: a poster frame with a play affordance;
 * the Vimeo player iframe only loads on click. Fires video_play for the
 * engagement agent.
 */
export default function VimeoFacade({ vimeoUrl, title, poster, venue, className = "" }: Props) {
  const [playing, setPlaying] = useState(false);
  const id = idFrom(vimeoUrl);
  const posterSrc = poster ?? (id ? `https://vumbnail.com/${id}.jpg` : undefined);

  if (playing && id) {
    return (
      <div className={`relative bg-ink ${className}`}>
        <iframe
          src={`https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0&portrait=0&dnt=1`}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        if (!id) return;
        track("video_play", { video_title: title, video_venue: venue });
        setPlaying(true);
      }}
      className={`group relative block w-full cursor-pointer overflow-hidden bg-ink text-left ${className}`}
      aria-label={`Play: ${title}`}
    >
      {posterSrc ? (
        <Image
          src={posterSrc}
          alt={`Film still — ${title}`}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover opacity-90 transition-opacity group-hover:opacity-100"
        />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center bg-sand">
          <span className="eyebrow text-taupe-light">Film still — {title}</span>
        </span>
      )}
      <span
        className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full border border-bone text-xs text-bone transition-colors group-hover:bg-bone group-hover:text-ink md:h-13 md:w-13"
        aria-hidden
      >
        ▶
      </span>
    </button>
  );
}
