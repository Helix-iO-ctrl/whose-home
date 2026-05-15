import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

/**
 * Returns a Supabase client if env vars are set; otherwise returns null.
 * The app degrades gracefully — feedback is logged to the console when
 * Supabase isn't configured, so the prototype still works without it.
 */
export function getSupabase(): SupabaseClient | null {
  if (typeof window === "undefined") {
    // Server: only construct when called server-side intentionally.
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    return createClient(url, key, { auth: { persistSession: false } });
  }
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  _client = createClient(url, key, { auth: { persistSession: false } });
  return _client;
}

export type FeedbackRow = {
  id: string;
  created_at: string;
  user_id: string;
  page_route: string;
  module_id: string | null;
  module_label: string | null;
  body: string;
  user_agent: string | null;
  metadata: Record<string, unknown> | null;
};
