import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const runtime = "nodejs";

type FeedbackPayload = {
  user_id?: string;
  page_route: string;
  module_id?: string | null;
  module_label?: string | null;
  body: string;
  user_agent?: string | null;
  metadata?: Record<string, unknown>;
};

export async function POST(req: Request) {
  let payload: FeedbackPayload;
  try {
    payload = (await req.json()) as FeedbackPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!payload?.body || !payload.page_route) {
    return NextResponse.json({ ok: false, error: "Missing body or page_route" }, { status: 400 });
  }

  const supabase = getSupabase();
  if (!supabase) {
    // Soft-fail: log to server console so Greg's clickthrough still works.
    console.warn("[feedback] Supabase not configured; logging payload only:", payload);
    return NextResponse.json({ ok: true, persisted: false });
  }

  const { error } = await supabase.from("feedback").insert({
    user_id:      payload.user_id ?? "anonymous",
    page_route:   payload.page_route,
    module_id:    payload.module_id ?? null,
    module_label: payload.module_label ?? null,
    body:         payload.body,
    user_agent:   payload.user_agent ?? null,
    metadata:     payload.metadata ?? {},
  });

  if (error) {
    console.error("[feedback] insert failed", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, persisted: true });
}

export async function GET() {
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ ok: true, persisted: false, items: [] });

  const { data, error } = await supabase
    .from("feedback")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, persisted: true, items: data });
}
