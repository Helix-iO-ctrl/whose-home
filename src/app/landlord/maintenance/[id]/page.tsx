import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, MessageSquare, Phone, Camera, CheckCircle2, XCircle, Sparkles,
} from "lucide-react";
import { Card, CardLabel, CardTitle } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Button } from "@/components/ui/button";
import { StubButton } from "@/components/ui/stub-button";
import { Module } from "@/components/feedback/module";
import { DispatchAction } from "./dispatch-action";
import { ActivityFeed, type ActivityEvent } from "./activity-feed";
import { getRequest, getTenant, getUnit, vendors } from "@/lib/data";
import type { MaintenanceRequest } from "@/lib/data";
import { longDate, shortDate } from "@/lib/utils";

export default function RequestDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const r = getRequest(id);
  if (!r) return notFound();

  const u = getUnit(r.unitId);
  const tenant = getTenant(r.submittedBy);
  const matchingVendors = vendors.filter((v) =>
    v.active &&
    ((r.category === "appliance" || r.category === "plumbing") ? v.trade === "Plumbing"
      : r.category === "hvac"       ? v.trade === "HVAC"
      : r.category === "electrical" ? v.trade === "Electrical"
      : true),
  );

  const activities = buildActivityFeed(r);
  const recommendation = buildRecommendation(r);

  return (
    <>
      <Link
        href="/landlord/maintenance"
        className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-parchment mb-5"
      >
        <ArrowLeft size={14} /> Back to triage queue
      </Link>

      <header className="mb-6">
        <div className="overline mb-2">
          {u?.property.name} &middot; {u?.unit.label}
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold leading-tight">
          {r.title}<span className="italic-accent">.</span>
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Chip tone="gold">{labelFor(r.status)}</Chip>
          {r.appliance && <Chip tone="info">{r.appliance.make} {r.appliance.model}</Chip>}
          <span className="text-xs text-muted">Submitted {longDate(r.submittedAt)}</span>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <Module id={`landlord.request.${r.id}.summary`} label="Tenant summary">
            <Card>
              <CardLabel>Tenant summary</CardLabel>
              <p className="mt-2 text-sm text-parchment leading-relaxed">"{r.description}"</p>
              {tenant && (
                <div className="mt-4 flex items-center gap-2 text-xs text-muted">
                  <Phone size={12} /> {tenant.name} &middot; {tenant.phone}
                </div>
              )}
            </Card>
          </Module>

          {r.troubleshooting && (
            <Module id={`landlord.request.${r.id}.triage`} label="AI triage results">
              <Card>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={14} className="text-gold-2" />
                  <CardLabel className="!mb-0">AI triage &mdash; tenant completed</CardLabel>
                </div>
                <ul className="divide-y divide-line">
                  {r.troubleshooting.map((step, i) => (
                    <li key={i} className="py-2.5 flex items-start gap-3 first:pt-0 last:pb-0">
                      {step.passed
                        ? <CheckCircle2 size={16} className="text-moss mt-0.5 shrink-0" />
                        : <XCircle      size={16} className="text-danger mt-0.5 shrink-0" />}
                      <span className="text-sm text-parchment">{step.step}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 rounded-lg bg-forest/30 border border-line p-3 text-xs text-parchment leading-relaxed">
                  <span className="text-gold-2 font-semibold">Recommendation:</span> {recommendation}
                </div>
              </Card>
            </Module>
          )}

          {r.appliance && (
            <Module id={`landlord.request.${r.id}.appliance`} label="Appliance info">
              <Card>
                <CardLabel>Appliance info (auto-captured)</CardLabel>
                <dl className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-spruce/60 border border-line p-3">
                    <dt className="overline">Make</dt>
                    <dd className="text-sm font-semibold text-parchment mt-1">{r.appliance.make}</dd>
                  </div>
                  <div className="rounded-lg bg-spruce/60 border border-line p-3">
                    <dt className="overline">Model</dt>
                    <dd className="text-sm font-semibold text-parchment mt-1">{r.appliance.model}</dd>
                  </div>
                  <div className="rounded-lg bg-spruce/60 border border-line p-3 col-span-2">
                    <dt className="overline">Tenant photo</dt>
                    <dd className="mt-2 flex items-center justify-between gap-2 text-xs text-muted">
                      <span className="flex items-center gap-1.5"><Camera size={14} /> 1 photo attached</span>
                      <StubButton
                        variant="ghost"
                        size="sm"
                        toast="Photo opened in lightbox (demo)"
                        tone="info"
                      >
                        View
                      </StubButton>
                    </dd>
                  </div>
                </dl>
              </Card>
            </Module>
          )}
        </div>

        <div className="space-y-5">
          <Module id={`landlord.request.${r.id}.actions`} label="Dispatch & actions">
            <Card>
              <CardLabel>Next step</CardLabel>
              <CardTitle className="mt-1">Dispatch a vendor</CardTitle>
              <p className="text-xs text-muted mt-1.5">
                Sends a pre-formatted work order via SMS or email with all context attached.
              </p>
              <div className="mt-4 space-y-2">
                <DispatchAction
                  requestId={r.id}
                  vendors={matchingVendors}
                  alreadyScheduled={r.status === "scheduled"}
                />
                <Link href="/landlord/messages" className="block">
                  <Button variant="outline" className="w-full">
                    <MessageSquare size={14} /> Message tenant
                  </Button>
                </Link>
              </div>
            </Card>
          </Module>

          <Module id={`landlord.request.${r.id}.history`} label="Activity">
            <Card>
              <CardLabel>Activity</CardLabel>
              <ActivityFeed events={activities} troubleshooting={r.troubleshooting ?? null} />
            </Card>
          </Module>
        </div>
      </div>
    </>
  );
}

// ───────────────────────── helpers ─────────────────────────

function buildActivityFeed(r: MaintenanceRequest): ActivityEvent[] {
  const submitted = new Date(r.submittedAt);
  const aiCaptured = new Date(submitted.getTime() + 60_000);
  const triageDone = new Date(submitted.getTime() + 6 * 60_000);
  const escalated  = new Date(submitted.getTime() + 10 * 60_000);

  const events: ActivityEvent[] = [
    {
      kind: "submitted",
      tone: "info",
      title: "Tenant submitted request",
      detail: "1 photo attached",
      at: formatAt(submitted),
    },
  ];

  if (r.appliance) {
    events.push({
      kind: "ai-capture",
      tone: "info",
      title: `AI captured appliance info`,
      detail: `${r.appliance.make} ${r.appliance.model}`,
      at: formatAt(aiCaptured),
    });
  }

  if (r.troubleshooting) {
    const passed = r.troubleshooting.filter((s) => s.passed).length;
    events.push({
      kind: "triage-complete",
      tone: r.troubleshooting.some((s) => !s.passed) ? "warning" : "success",
      title: "Tenant completed troubleshooting",
      detail: `${passed} of ${r.troubleshooting.length} steps passed`,
      at: formatAt(triageDone),
      expandable: true,
    });
  }

  if (["needs-vendor", "scheduled", "in-progress"].includes(r.status)) {
    events.push({
      kind: "escalated",
      tone: "critical",
      title: "Escalated to landlord",
      detail: "Self-fix steps did not resolve the issue.",
      at: formatAt(escalated),
      tag: "Needs you",
    });
  }

  if (r.status === "scheduled" && r.scheduledFor) {
    const dispatched = new Date(r.scheduledFor); dispatched.setDate(dispatched.getDate() - 1);
    events.push({
      kind: "dispatched",
      tone: "success",
      title: "Vendor dispatched",
      detail: `Arriving ${shortDate(r.scheduledFor)}, 2–4 PM window`,
      at: formatAt(dispatched),
    });
  }

  return events;
}

function buildRecommendation(r: MaintenanceRequest): string {
  switch (r.category) {
    case "appliance":
    case "plumbing":
      return "Tenant ruled out the obvious causes. Likely a faulty internal part — needs a plumber on-site.";
    case "hvac":
      return "Filter and thermostat ruled out. Probably a refrigerant or compressor issue — HVAC tech required.";
    case "electrical":
      return "Tenant tried bulb and battery swaps. Suggests a wiring or motor fault — electrician on-site.";
    default:
      return "Tenant exhausted the self-service path — vendor visit recommended.";
  }
}

function formatAt(d: Date): string {
  return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
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
