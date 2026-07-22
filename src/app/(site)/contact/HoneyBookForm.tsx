"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";

const HB_PID = "5d2aa817e987ed0f9168e292";

declare global {
  interface Window {
    _HB_?: { pid?: string };
  }
}

/**
 * Embedded HoneyBook contact form — leads flow straight into HoneyBook so the
 * brochure + scheduler automations fire. The widget renders inside the
 * placement div; we fire form_start on first interaction with it (the widget
 * is an iframe, so per-field funnel events aren't observable from here).
 */
export default function HoneyBookForm() {
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window._HB_ = window._HB_ || {};
    window._HB_.pid = HB_PID;
    const s = document.createElement("script");
    s.type = "text/javascript";
    s.async = true;
    s.src =
      "https://widget.honeybook.com/assets_users_production/websiteplacements/placement-controller.min.js";
    document.body.appendChild(s);
    return () => {
      s.remove();
    };
  }, []);

  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;
    let started = false;
    const onInteract = () => {
      if (!started) {
        started = true;
        track("form_start");
      }
    };
    el.addEventListener("pointerdown", onInteract);
    return () => el.removeEventListener("pointerdown", onInteract);
  }, []);

  return (
    // Width cap: the widget centers its form inside its own iframe, which we
    // can't style — constraining the wrapper to the form's width pins it left.
    <div ref={wrapper} className="min-h-[420px] max-w-[480px]">
      <div className={`hb-p-${HB_PID}-8`} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        height={1}
        width={1}
        style={{ display: "none" }}
        src={`https://www.honeybook.com/p.png?pid=${HB_PID}`}
        alt=""
      />
    </div>
  );
}
