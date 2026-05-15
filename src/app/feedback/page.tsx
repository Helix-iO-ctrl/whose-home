import Link from "next/link";
import {
  ArrowLeft, Inbox, MessageSquareQuote, Database, AlertCircle, CheckCircle2, RefreshCw,
} from "lucide-react";
import { OwlMark } from "@/components/owl-mark";
import { Card, CardLabel, CardTitle } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { getSupabase, type FeedbackRow } from "@/lib/supabase";
import { longDate, relativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function loadFeedback(): Promise<{
  configured: boolean;
  items: FeedbackRow[];
  error?: string;
}> {
  const supabase = getSupabase();
  if (!supabase) return { configured: false, items: [] };

  const { data, error } = await supabase
    .from("feedback")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    return { configured: true, items: [], error: error.message };
  }
  return { configured: true, items: (data ?? []) as FeedbackRow[] };
}

export default async function FeedbackInboxPage() {
  const { configured, items, error } = await loadFeedback();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 lg:px-10 py-5 flex items-center justify-between border-b border-line">
        <Link href="/" className="flex items-center gap-3">
          <OwlMark size={28} withWordmark />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-parchment"
        >
          <ArrowLeft size={14} /> Back to app
        </Link>
      </header>

      <main className="flex-1 px-6 lg:px-10 py-10 max-w-4xl w-full mx-auto">
        <div className="mb-6">
          <div className="overline mb-2">Internal · prototype only</div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold leading-tight">
            Feedback <span className="italic-accent">inbox.</span>
          </h1>
          <p className="text-sm text-muted mt-2 max-w-xl">
            Everything Greg (or anyone using the prototype) submits via the floating button or the
            in-module feedback dots. Newest first.
          </p>
        </div>

        {!configured && (
          <Card className="border-gold-2/40 mb-6">
            <div className="flex items-start gap-3">
              <span className="h-9 w-9 shrink-0 rounded-lg bg-gold/15 text-gold-2 flex items-center justify-center">
                <Database size={16} />
              </span>
              <div>
                <CardLabel>Supabase not configured</CardLabel>
                <CardTitle className="mt-1">Feedback is being logged to the server console.</CardTitle>
                <p className="text-sm text-muted mt-2 leading-relaxed">
                  Set <code className="text-gold-2">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
                  <code className="text-gold-2">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, then run the migration
                  in <code className="text-gold-2">supabase/migrations/20260515000000_feedback.sql</code> to
                  start persisting feedback here.
                </p>
              </div>
            </div>
          </Card>
        )}

        {configured && error && (
          <Card className="border-danger/40 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-danger shrink-0 mt-0.5" size={18} />
              <div>
                <CardLabel>Supabase error</CardLabel>
                <CardTitle className="mt-1">{error}</CardTitle>
                <p className="text-sm text-muted mt-2">
                  Most likely the <code>feedback</code> table doesn't exist yet. Run the migration
                  in your Supabase SQL editor.
                </p>
              </div>
            </div>
          </Card>
        )}

        {configured && !error && items.length === 0 && (
          <Card>
            <div className="text-center py-10">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-pine-2 text-gold-2">
                <Inbox size={20} />
              </span>
              <CardTitle className="mt-4">No feedback yet.</CardTitle>
              <p className="text-sm text-muted mt-2">
                Click the floating "Send feedback" button anywhere in the app to test the flow.
              </p>
            </div>
          </Card>
        )}

        <ul className="space-y-3">
          {items.map((f) => (
            <li key={f.id}>
              <Card>
                <div className="flex items-start gap-3">
                  <span className="h-9 w-9 shrink-0 rounded-lg bg-spruce border border-line text-gold-2 flex items-center justify-center">
                    <MessageSquareQuote size={15} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Chip tone="info">{f.user_id}</Chip>
                      {f.module_label && <Chip tone="gold">{f.module_label}</Chip>}
                      <code className="text-[11px] font-mono text-subtle">{f.page_route}</code>
                      <span className="text-[11px] text-subtle ml-auto">
                        {relativeTime(f.created_at)} &middot; {longDate(f.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-parchment mt-2.5 leading-relaxed whitespace-pre-wrap">
                      {f.body}
                    </p>
                    {f.module_id && (
                      <div className="mt-2 text-[11px] text-subtle font-mono">
                        module: {f.module_id}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>

        {configured && !error && items.length > 0 && (
          <div className="mt-6 flex items-center gap-2 text-xs text-muted">
            <CheckCircle2 size={13} className="text-moss" /> Showing {items.length} most recent.
            <Link href="/feedback" className="ml-auto inline-flex items-center gap-1 text-gold-2 hover:text-gold">
              <RefreshCw size={12} /> Refresh
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
