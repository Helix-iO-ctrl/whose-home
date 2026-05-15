import Link from "next/link";
import { Wrench, CheckCircle2, Plus, Sparkles, Clock } from "lucide-react";
import { PageHeader, SectionHead } from "@/components/ui/section";
import { Card, CardLabel } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Button } from "@/components/ui/button";
import { Module } from "@/components/feedback/module";
import { requests, getUnit } from "@/lib/data";
import { relativeTime } from "@/lib/utils";

export default function TenantMaintenancePage() {
  const mine = requests.filter((r) => r.submittedBy === "t-james");

  return (
    <>
      <PageHeader
        eyebrow="Maintenance"
        title="Your requests"
        subtitle="Submit an issue, walk through model-specific troubleshooting, and track every step."
        actions={
          <Link href="/tenant/maintenance/new">
            <Button variant="primary"><Plus size={14} /> New request</Button>
          </Link>
        }
      />

      <Module id="tenant.maintenance.active" label="Active requests">
        <Card>
          <SectionHead title="Active requests" />
          {mine.length === 0 ? (
            <p className="text-sm text-muted">Nothing open right now. Nice.</p>
          ) : (
            <ul className="divide-y divide-line">
              {mine.map((r) => {
                const u = getUnit(r.unitId);
                const tone =
                  r.status === "scheduled" ? "success" :
                  r.status === "needs-vendor" ? "gold" :
                  r.status === "in-progress" ? "info" :
                  "neutral";
                const Icon = r.status === "scheduled" ? CheckCircle2 : Wrench;
                return (
                  <li key={r.id} className="py-3 first:pt-0 last:pb-0 flex items-start gap-3">
                    <span className="h-10 w-10 shrink-0 rounded-lg bg-spruce border border-line text-gold-2 flex items-center justify-center">
                      <Icon size={16} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-parchment text-sm">{r.title}</span>
                        <Chip tone={tone as never}>{labelFor(r.status)}</Chip>
                      </div>
                      <div className="text-xs text-muted mt-1">
                        Submitted {relativeTime(r.submittedAt)}
                        {r.scheduledFor && <> &middot; Vendor arriving in 4 days</>}
                      </div>
                      {r.status === "scheduled" && (
                        <div className="mt-2 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-gold-2">
                          <Clock size={12} /> Tue, May 19 · 2–4 PM window
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </Module>

      <Module id="tenant.maintenance.cta" label="Submit new request" className="mt-5">
        <Card className="border-dashed border-line-2">
          <div className="flex items-start gap-3">
            <span className="h-10 w-10 rounded-lg bg-forest text-gold-2 flex items-center justify-center">
              <Sparkles size={16} />
            </span>
            <div className="flex-1">
              <CardLabel>AI maintenance triage</CardLabel>
              <p className="text-sm text-parchment mt-1">
                Describe the issue and we'll walk you through model-specific fixes <em className="italic-accent not-italic">before</em> calling a vendor.
                Most leaks, beeps, and stuck doors fix themselves in three steps.
              </p>
            </div>
            <Link href="/tenant/maintenance/new">
              <Button variant="primary" size="md">Start</Button>
            </Link>
          </div>
        </Card>
      </Module>
    </>
  );
}

function labelFor(status: string) {
  switch (status) {
    case "needs-vendor": return "Needs vendor";
    case "scheduled":    return "Scheduled";
    case "in-progress":  return "In progress";
    case "triaging":     return "Triaging";
    case "new":          return "New";
    case "resolved":     return "Resolved";
    default:             return status;
  }
}
