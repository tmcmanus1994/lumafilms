import Link from "next/link";
import { nav, site } from "@/lib/site";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-bone/15 bg-ink px-5 py-8 text-bone md:px-16">
      <div className="flex flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
        <Link href="/" aria-label="Luma Films — home">
          <Logo variant="light" size="sm" />
        </Link>
        <nav
          className="flex flex-wrap justify-center gap-5 text-[13px] md:gap-7"
          aria-label="Footer"
        >
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-sand transition-colors hover:text-bone">
              {item.label}
            </Link>
          ))}
          <Link href="/couples" className="text-taupe transition-colors hover:text-bone">
            Client Films
          </Link>
        </nav>
        <div className="text-xs text-taupe">
          © {new Date().getFullYear()} {site.name} · Central Arkansas
        </div>
      </div>
    </footer>
  );
}
