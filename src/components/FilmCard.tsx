import Link from "next/link";
import ImageSlot from "./ImageSlot";
import type { Wedding } from "@/lib/content";
import { filmSlug } from "@/lib/content";

export default function FilmCard({ wedding, large = false }: { wedding: Wedding; large?: boolean }) {
  return (
    <Link href={`/films/${filmSlug(wedding)}`} className="group flex flex-col gap-4">
      <div
        className="relative overflow-hidden transition-transform duration-300 ease-out md:group-hover:scale-[1.02]"
        data-anim-img
      >
        <ImageSlot
          src={wedding.coverPhoto || wedding.highlight.poster}
          alt={wedding.coverPhotoAlt || `Film still — ${wedding.couple} at ${wedding.venue.name}`}
          className="aspect-video w-full"
          sizes={large ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 33vw, 100vw"}
        />
        <span
          className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full border border-bone text-xs text-bone transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100"
          aria-hidden
        >
          ▶
        </span>
      </div>
      <div>
        <div className="display mb-1 text-2xl text-ink md:text-[27px]">{wedding.couple}</div>
        <div className="eyebrow text-xs">{wedding.cardLabel ?? wedding.venue.name}</div>
      </div>
    </Link>
  );
}
