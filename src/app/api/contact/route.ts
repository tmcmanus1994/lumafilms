import { NextResponse } from "next/server";

/*
 * Lead intake. Phase 6 wires this to HoneyBook (rebuild plan §11): either the
 * HoneyBook email-parse address or a Zapier webhook, so automations fire the
 * instant email with brochure + scheduler link.
 *
 * Configure one of:
 *   LEAD_WEBHOOK_URL  — POSTs the lead as JSON (Zapier / Make / HoneyBook parser)
 * Until configured, submissions are logged (visible in Vercel function logs)
 * so no lead is ever silently dropped during setup.
 */

type Lead = {
  date?: string;
  names?: string;
  venue?: string;
  email?: string;
  phone?: string;
};

export async function POST(req: Request) {
  let lead: Lead;
  try {
    lead = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!lead.date?.trim() || !lead.names?.trim() || !lead.email?.trim()) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const payload = {
    source: "lumaweddingfilms.co",
    submittedAt: new Date().toISOString(),
    weddingDate: lead.date.trim(),
    names: lead.names.trim(),
    venue: lead.venue?.trim() || "Still deciding",
    email: lead.email.trim(),
    phone: lead.phone?.trim() || "",
  };

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error("[lead] webhook delivery failed", res.status, payload);
      return NextResponse.json({ error: "Delivery failed" }, { status: 502 });
    }
  } else {
    console.log("[lead] LEAD_WEBHOOK_URL not set — logging lead:", JSON.stringify(payload));
  }

  return NextResponse.json({ ok: true });
}
