import Link from "next/link";
import { ctaMode } from "@/lib/site";

type Props = {
  /** Context the CTA already knows — rides along as URL params (link mode) and prefills the form (modal mode, phase two). */
  venue?: string;
  city?: string;
  pkg?: string;
  label?: string;
  className?: string;
  trackLabel: string;
  onNavigate?: () => void;
};

/**
 * THE sitewide CTA (spec: docs/motion-cta-spec §2). Every "Check My Date"
 * button renders through this component; `ctaMode` in lib/site.ts switches
 * the whole site between link (→ /contact) and the phase-two modal in one
 * line. Context props are captured from day one.
 */
export default function CheckMyDate({
  venue,
  city,
  pkg,
  label = "Check My Date",
  className = "btn",
  trackLabel,
  onNavigate,
}: Props) {
  // Modal mode ships in the workflow-rebuild phase; until then everything links.
  void ctaMode;

  const params = new URLSearchParams();
  if (venue) params.set("venue", venue);
  if (city) params.set("city", city);
  if (pkg) params.set("package", pkg);
  const qs = params.toString();

  return (
    <Link
      href={qs ? `/contact?${qs}` : "/contact"}
      className={className}
      data-track="cta_click"
      data-track-label={trackLabel}
      onClick={onNavigate}
    >
      {label}
    </Link>
  );
}
