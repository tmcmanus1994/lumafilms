import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import VimeoFacade from "@/components/VimeoFacade";
import PageMeta from "@/components/PageMeta";
import { filmImage, getWedding, getWeddings } from "@/lib/content";
import { site } from "@/lib/site";
import PasscodeGate, { verifyPasscode } from "./passcode";
import PortalExtras from "./PortalExtras";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getWeddings().map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const w = getWedding(slug);
  if (!w) return {};
  const image = filmImage(w);
  return {
    title: `${w.couple} — Your Films`,
    // Still noindex, but couples text these links to family — so the preview
    // should show a frame from their own film, not the site's default card.
    robots: { index: false, follow: false },
    openGraph: {
      title: `${w.couple} — Your Wedding Films`,
      description: `${w.couple}'s wedding films from ${w.venue.name}, by Luma Films.`,
      images: image ? [image] : undefined,
    },
  };
}

export default async function PortalPage({ params }: Props) {
  const { slug } = await params;
  const w = getWedding(slug);
  if (!w) notFound();

  // Optional passcode (off by default — couples share these links with family)
  if (w.passcode) {
    const jar = await cookies();
    const unlocked = jar.get(`luma_gallery_${w.slug}`)?.value === "ok";
    if (!unlocked) {
      return <PasscodeGate slug={w.slug} couple={w.couple} action={verifyPasscode} />;
    }
  }

  const extras = [
    ...(w.ceremony?.vimeo || w.ceremony?.download
      ? [{ label: "Full Ceremony", ...w.ceremony }]
      : []),
    ...(w.extras ?? []).filter((e) => e.vimeo || e.download),
    ...(w.instagramReel?.vimeo || w.instagramReel?.download
      ? [{ label: "Instagram Reel", ...w.instagramReel }]
      : []),
  ];

  return (
    <>
      <PageMeta page_type="portal" content_slug={w.slug} />

      {/* Hero */}
      <section className="bg-ink px-6 py-18 text-center md:px-16 md:py-28">
        <div className="flex flex-col items-center gap-4 md:gap-5">
          <p className="eyebrow text-[11px] md:text-[13px]">Your Films Are Ready</p>
          <h1 className="display text-[44px] text-bone md:text-[76px]">{w.couple}</h1>
          <p className="eyebrow text-[11px] !text-sand/80 md:text-[13px]">
            {w.venue.name}
            {w.weddingDate ? ` · ${formatDate(w.weddingDate)}` : ""}
          </p>
          <p className="romantic mt-2 max-w-[640px] text-[19px] leading-normal text-sand md:mt-3 md:text-2xl">
            Thank you for letting me be part of your day. Everything below is yours — forever.
            Share it with everyone you love.
          </p>
        </div>
      </section>

      {/* Highlight film */}
      <section className="px-5 py-14 md:px-16 md:py-24">
        <div className="mb-6 flex flex-col gap-4 md:mb-9 md:flex-row md:items-baseline md:justify-between">
          <div>
            <p className="eyebrow mb-3">The Film</p>
            <h2 className="display text-[32px] md:text-[48px]">Your Highlight Film</h2>
          </div>
          {w.highlight.download && (
            <a href={w.highlight.download} className="btn hidden md:inline-block" download>
              Download in 4K ↓
            </a>
          )}
        </div>
        <VimeoFacade
          vimeoUrl={w.highlight.vimeo}
          title={w.highlight.title ?? `${w.couple} — Highlight Film`}
          poster={filmImage(w)}
          venue={w.venue.name}
          className="mx-auto aspect-video w-full max-w-[min(100%,calc((100vh-400px)*1.7778))]"
        />
        {w.highlight.download && (
          <a href={w.highlight.download} className="btn btn-fill mt-5 block md:hidden" download>
            Download in 4K ↓
          </a>
        )}
      </section>

      {/* Everything else */}
      {extras.length > 0 && (
        <section className="bg-sand px-5 py-14 md:px-16 md:py-24">
          <p className="eyebrow mb-3">Every Moment</p>
          <h2 className="display mb-8 text-[32px] md:mb-12 md:text-[48px]">The rest of your day</h2>
          <PortalExtras items={extras} couple={w.couple} />
          {w.rawFootageFolder && (
            <a href={w.rawFootageFolder} target="_blank" rel="noopener" className="btn mt-8 inline-block">
              Your Raw Footage Folder →
            </a>
          )}
          <p className="mt-7 text-[13px] text-taupe">
            Download links are private and refresh automatically — save your files somewhere safe,
            and email me anytime if you need them again.
          </p>
        </section>
      )}

      {/* Note from Travelle */}
      <section className="px-6 py-16 text-center md:px-16 md:py-28">
        <div className="mx-auto flex max-w-[760px] flex-col items-center gap-6 md:gap-7">
          {w.portalNote && (
            <>
              <blockquote className="romantic text-2xl leading-normal md:text-4xl">
                &ldquo;{w.portalNote}&rdquo;
              </blockquote>
              <p className="eyebrow">— Travelle</p>
            </>
          )}
          <div className="mt-2 flex flex-col items-center gap-4 md:flex-row md:gap-8">
            <a
              href={site.reviewUrl}
              target="_blank"
              rel="noopener"
              className="btn px-8 py-3.5 text-sm"
            >
              Leave a Review
            </a>
            <a href="/contact" className="text-sm font-medium">
              Know someone getting married? →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00`)
    .toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    .toUpperCase();
}
