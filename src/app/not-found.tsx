import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-24 text-center">
      <p className="eyebrow mb-4">404</p>
      <h1 className="display mb-5 max-w-[640px] text-4xl md:text-5xl">
        This page didn&rsquo;t make the final cut
      </h1>
      <p className="mb-8 max-w-[440px] text-base leading-relaxed text-espresso">
        The link may have moved during the site rebuild. The films, though, are right where they
        should be.
      </p>
      <div className="flex flex-col items-center gap-4 md:flex-row md:gap-8">
        <Link href="/films" className="btn">
          See the Films
        </Link>
        <Link href="/venues" className="text-[15px] font-medium">
          Browse Venues →
        </Link>
        <Link href="/contact" className="text-[15px] font-medium">
          Check My Date →
        </Link>
      </div>
    </section>
  );
}
