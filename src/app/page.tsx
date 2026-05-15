import Link from "next/link";
import { Building2, User, ArrowRight, Sparkles, Inbox } from "lucide-react";
import { OwlMark } from "@/components/owl-mark";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 lg:px-10 py-5 flex items-center justify-between">
        <OwlMark size={36} withWordmark withTagline />
        <Link
          href="/feedback"
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted hover:text-gold-2 transition-colors"
        >
          <Inbox size={14} /> Feedback inbox
        </Link>
      </header>

      <main className="flex-1 flex items-center px-6 lg:px-10">
        <div className="max-w-5xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="overline mb-4">Whose Home &middot; Prototype</div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[64px] font-bold leading-[1.05] tracking-tight">
              Whose home? <span className="italic-accent">Yours.</span>
              <br />
              Managed by us.
            </h1>
            <p className="text-base text-muted mt-5 max-w-md leading-relaxed">
              A two-sided property platform for the small operator. Triage maintenance with AI,
              dispatch vendors with one tap, and give your tenants an experience that feels like
              the big platforms — without the big-platform overhead.
            </p>

            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-line-2 bg-pine/60 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-widest text-gold-2">
              <Sparkles size={13} /> Click-through prototype
            </div>
          </div>

          <div className="grid gap-3">
            <Link
              href="/landlord/dashboard"
              className="group rounded-2xl border border-line-2 bg-pine/70 hover:bg-pine-2 p-6 transition-colors flex items-center gap-5"
            >
              <span className="h-12 w-12 rounded-xl bg-forest text-gold-2 flex items-center justify-center">
                <Building2 size={22} strokeWidth={2.25} />
              </span>
              <div className="flex-1">
                <div className="overline mb-1">Role A</div>
                <div className="font-display text-xl font-bold text-parchment">Landlord / PM workspace</div>
                <div className="text-sm text-muted mt-1">Greg's view — portfolio, triage, dispatch.</div>
              </div>
              <ArrowRight size={18} className="text-muted group-hover:text-gold-2 transition-colors" />
            </Link>

            <Link
              href="/tenant/home"
              className="group rounded-2xl border border-line-2 bg-pine/70 hover:bg-pine-2 p-6 transition-colors flex items-center gap-5"
            >
              <span className="h-12 w-12 rounded-xl bg-forest text-gold-2 flex items-center justify-center">
                <User size={22} strokeWidth={2.25} />
              </span>
              <div className="flex-1">
                <div className="overline mb-1">Role B</div>
                <div className="font-display text-xl font-bold text-parchment">Tenant portal</div>
                <div className="text-sm text-muted mt-1">James's view — pay rent, request maintenance.</div>
              </div>
              <ArrowRight size={18} className="text-muted group-hover:text-gold-2 transition-colors" />
            </Link>
          </div>
        </div>
      </main>

      <footer className="px-6 lg:px-10 py-6 text-[11px] text-subtle uppercase tracking-widest">
        v0.1 &middot; Built for Greg &middot; Click any module to leave inline feedback
      </footer>
    </div>
  );
}
