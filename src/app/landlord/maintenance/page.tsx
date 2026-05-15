import Link from "next/link";
import { Wrench, AlertTriangle, CheckCircle2, Clock, Filter } from "lucide-react";
import { PageHeader, SectionHead } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { StubButton } from "@/components/ui/stub-button";
import { Module } from "@/components/feedback/module";
import { requests, getTenant, getUnit } from "@/lib/data";
import { relativeTime } from "@/lib/utils";

const STATUS_GROUPS: { title: string; statuses: string[] }[] = [
  { title: "Needs your attention",  statuses: ["needs-vendor", "new"] },
  { title: "In progress",            statuses: ["triaging", "in-progress", "scheduled"] },
];

export default function MaintenancePage() {
  return (
    <>
      <PageHeader
        eyebrow="Maintenance"
        title="Triage queue"
        subtitle="AI captures the make, model, and tenant troubleshooting before it ever reaches you. You decide who gets dispatched."
        actions={
          <StubButton
            variant="outline"
            size="md"
            toast="Filter coming soon — by unit, status, age, vendor."
            tone="info"
          >
            <Filter size={14} /> Filter
          </StubButton>
        }
      />

      <div className="space-y-6">
        {STATUS_GROUPS.map((group) => {
          const items = requests.filter((r) => group.statuses.includes(r.status));
          if (items.length === 0) return null;
          return (
            <Module key={group.title} id={`landlord.maintenance.${group.title}`} label={group.title}>
              <Card>
                <SectionHead title={group.title} />
                <ul className="divide-y divide-line">
                  {items.map((r) => {
                    const u = getUnit(r.unitId);
                    const tenant = getTenant(r.submittedBy);
                    const Icon =
                      r.status === "needs-vendor" ? AlertTriangle :
                      r.status === "scheduled"    ? CheckCircle2 :
                      r.status === "in-progress"  ? Clock :
                      Wrench;
                    const tone =
                      r.status === "needs-vendor" ? "gold" :
                      r.status === "scheduled"    ? "success" :
                      r.status === "in-progress"  ? "info" :
                      "neutral";
                    return (
                      <li key={r.id} className="py-3 first:pt-0 last:pb-0">
                        <Link
                          href={`/landlord/maintenance/${r.id}`}
                          className="flex items-start gap-3 -mx-3 px-3 py-2 rounded-lg hover:bg-pine-2 transition-colors"
                        >
                          <span className="h-10 w-10 shrink-0 rounded-lg bg-spruce border border-line text-gold-2 flex items-center justify-center">
                            <Icon size={18} />
                          </span>
                          <span className="flex-1 min-w-0">
                            <span className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-semibold text-parchment">{r.title}</span>
                              <Chip tone={tone as never}>{labelFor(r.status)}</Chip>
                              {r.appliance && <Chip tone="neutral">{r.appliance.make} {r.appliance.model}</Chip>}
                            </span>
                            <span className="block text-xs text-muted mt-1">
                              {u?.property.name} &middot; {u?.unit.label}
                              {tenant && <> &middot; {tenant.name}</>}
                              <> &middot; {relativeTime(r.submittedAt)}</>
                            </span>
                            <span className="block text-xs text-subtle mt-1.5 line-clamp-1">
                              "{r.description}"
                            </span>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </Card>
            </Module>
          );
        })}
      </div>
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
