import Link from "next/link";
import { ArrowRight, Wrench, Building2, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { PageHeader, SectionHead } from "@/components/ui/section";
import { Stat } from "@/components/ui/stat";
import { Card, CardLabel, CardSubtitle, CardTitle } from "@/components/ui/card";
import { Chip, Dot } from "@/components/ui/chip";
import { Button } from "@/components/ui/button";
import { Module } from "@/components/feedback/module";
import {
  properties, payments, requests, getTenant, getUnit, totalUnits,
  totalCollected, totalOutstanding, openRequests,
} from "@/lib/data";
import { currency, longDate, relativeTime } from "@/lib/utils";

export default function LandlordDashboardPage() {
  const collected = totalCollected();
  const outstanding = totalOutstanding();
  const open = openRequests();
  const units = totalUnits();
  const occupiedUnits = properties.flatMap((p) => p.units).filter((u) => u.tenantId).length;

  const queue = requests.filter((r) => r.status !== "resolved").slice(0, 4);

  return (
    <>
      <PageHeader
        eyebrow="Landlord workspace"
        title={<>Good afternoon, <span className="italic-accent">Greg.</span></>}
        subtitle={<>You have {open} open requests across {units} units. May rent is {Math.round((collected / (collected + outstanding)) * 100)}% in.</>}
        actions={
          <Link href="/landlord/maintenance">
            <Button variant="primary" size="md">Triage queue <ArrowRight size={14} /></Button>
          </Link>
        }
      />

      <Module id="landlord.dashboard.stats" label="Stats row">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <Stat label="Total units"      value={units} hint={`${occupiedUnits} occupied`} />
          <Stat label="Collected · May"  value={currency(collected)} tone="success" hint="6 of 6 expected" />
          <Stat label="Outstanding"      value={currency(outstanding)} tone="danger"  hint="1 late tenant" />
          <Stat label="Open requests"    value={open} tone="gold" hint="2 need attention" />
        </div>
      </Module>

      <div className="grid lg:grid-cols-3 gap-6">
        <Module id="landlord.dashboard.maintenance-queue" label="Maintenance queue" className="lg:col-span-2">
          <Card>
            <SectionHead title="Maintenance queue" action={
              <Link href="/landlord/maintenance" className="text-xs text-gold-2 hover:text-gold transition-colors">View all &rarr;</Link>
            } />
            <ul className="divide-y divide-line">
              {queue.map((r) => {
                const u = getUnit(r.unitId);
                const tenant = getTenant(r.submittedBy);
                const tone =
                  r.status === "needs-vendor" ? "gold" :
                  r.status === "scheduled"    ? "success" :
                  r.status === "new"          ? "info" :
                  "neutral";
                const Icon =
                  r.status === "needs-vendor" ? AlertTriangle :
                  r.status === "scheduled"    ? CheckCircle2 :
                  Wrench;
                return (
                  <li key={r.id} className="py-3 first:pt-0 last:pb-0">
                    <Link
                      href={`/landlord/maintenance/${r.id}`}
                      className="flex items-start gap-3 hover:bg-pine-2 -mx-3 px-3 py-2 rounded-lg transition-colors"
                    >
                      <span className="h-9 w-9 mt-0.5 shrink-0 rounded-lg bg-spruce border border-line flex items-center justify-center text-gold-2">
                        <Icon size={16} />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-parchment text-sm">{r.title}</span>
                          <Chip tone={tone as never}>{labelFor(r.status)}</Chip>
                        </span>
                        <span className="block text-xs text-muted mt-1">
                          {u?.property.name} &middot; {u?.unit.label}
                          {tenant && <> &middot; {tenant.name}</>}
                          <> &middot; {relativeTime(r.submittedAt)}</>
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Card>
        </Module>

        <Module id="landlord.dashboard.properties-glance" label="Properties at a glance">
          <Card>
            <SectionHead title="Properties at a glance" action={
              <Link href="/landlord/properties" className="text-xs text-gold-2 hover:text-gold transition-colors">All &rarr;</Link>
            } />
            <ul className="space-y-3">
              {properties.map((p) => {
                const occupied = p.units.filter((u) => u.tenantId).length;
                const late = p.units.some((u) => u.status === "late");
                return (
                  <li key={p.id} className="flex items-start gap-3">
                    <span className="h-8 w-8 mt-0.5 shrink-0 rounded-lg bg-forest/40 border border-line text-gold-2 flex items-center justify-center">
                      <Building2 size={14} />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="text-sm font-semibold text-parchment block truncate">{p.name}</span>
                      <span className="text-xs text-muted">
                        {occupied}/{p.units.length} units occupied
                      </span>
                    </span>
                    {late && <Chip tone="danger">Late</Chip>}
                  </li>
                );
              })}
            </ul>
          </Card>
        </Module>
      </div>

      <Module id="landlord.dashboard.recent-payments" label="Recent payments" className="mt-6">
        <Card>
          <SectionHead title="Recent payments · May" action={
            <Link href="/landlord/payments" className="text-xs text-gold-2 hover:text-gold transition-colors">All payments &rarr;</Link>
          } />
          <ul className="divide-y divide-line">
            {payments.slice(0, 4).map((p) => {
              const tenant = getTenant(p.tenantId);
              const u = getUnit(p.unitId);
              const isLate = p.status === "late";
              return (
                <li key={p.id} className="py-3 first:pt-0 last:pb-0 flex items-center gap-3">
                  <Clock size={14} className="text-subtle shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-parchment truncate">
                      {tenant?.name ?? "—"}
                    </div>
                    <div className="text-xs text-muted">
                      {u?.property.name} &middot; {u?.unit.label} &middot; {longDate(p.date)} &middot; {p.method}
                    </div>
                  </div>
                  <div className={isLate ? "text-danger font-semibold tabular text-sm" : "text-moss font-semibold tabular text-sm"}>
                    {isLate ? `${currency(p.amount)} · due` : `+${currency(p.amount)}`}
                  </div>
                  {isLate ? <Chip tone="danger"><Dot className="bg-danger" /> Late</Chip> : <Chip tone="success"><Dot className="bg-moss" /> Received</Chip>}
                </li>
              );
            })}
          </ul>
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
