"use client";

import { useEffect } from "react";
import type { PageContext } from "@/lib/analytics";
import { track } from "@/lib/analytics";

/** Rendered once per page: attaches content dimensions to every event. */
export default function PageMeta(ctx: PageContext) {
  useEffect(() => {
    window.__lumaPage = ctx;
    if (ctx.page_type === "portal") track("portal_view");
    return () => {
      window.__lumaPage = undefined;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.page_type, ctx.content_city, ctx.content_venue, ctx.content_slug]);

  return null;
}
