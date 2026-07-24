"use client";

import Image from "next/image";
import { useState } from "react";
import { track } from "@/lib/analytics";

export type PortalItem = { label: string; vimeo?: string; download?: string };

function vimeoId(url?: string) {
  return url?.match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1];
}

/**
 * "The rest of your day" list. Watch opens the video inline within the row —
 * at a smaller scale than the highlight film — instead of sending couples
 * off to Vimeo. One video open at a time.
 */
export default function PortalExtras({ items, couple }: { items: PortalItem[]; couple: string }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="flex flex-col">
      {items.map((item, i) => {
        const id = vimeoId(item.vimeo);
        const isOpen = openIdx === i;
        return (
          <div key={`${item.label}-${i}`} className="border-t border-linen-dark py-7 last:border-b">
            <div
              className={
                isOpen
                  ? "flex flex-col gap-4 md:flex-row md:items-baseline md:justify-between md:gap-10"
                  : "flex flex-col gap-4 md:grid md:grid-cols-[280px_1fr_auto] md:items-center md:gap-10"
              }
            >
              {/* Thumbnail collapses while the inline player is open */}
              {!isOpen && (
                <div className="relative h-[190px] overflow-hidden bg-sand md:h-[158px]">
                  {id ? (
                    <Image
                      src={`https://vumbnail.com/${id}.jpg`}
                      alt={`${item.label} — ${couple}`}
                      fill
                      sizes="(min-width: 768px) 280px, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="eyebrow text-taupe-light">{item.label}</span>
                    </span>
                  )}
                </div>
              )}
              <h3 className="display text-2xl md:text-3xl">{item.label}</h3>
              <div className="flex gap-3 md:gap-4">
                {id && (
                  <button
                    type="button"
                    onClick={() => {
                      if (!isOpen) track("video_play", { video_title: `${couple} — ${item.label}` });
                      setOpenIdx(isOpen ? null : i);
                    }}
                    className={`btn flex-1 cursor-pointer whitespace-nowrap px-6 py-3 text-sm md:flex-none ${
                      isOpen ? "btn-fill" : ""
                    }`}
                  >
                    {isOpen ? "Close" : "Watch"}
                  </button>
                )}
                {item.download && (
                  <a
                    href={item.download}
                    download
                    className="btn flex-1 whitespace-nowrap px-6 py-3 text-sm md:flex-none"
                  >
                    Download ↓
                  </a>
                )}
              </div>
            </div>
            {isOpen && id && (
              <div className="mt-6 w-full bg-ink md:w-1/2">
                <div className="aspect-video w-full">
                  <iframe
                    src={`https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0&portrait=0`}
                    title={`${item.label} — ${couple}`}
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
