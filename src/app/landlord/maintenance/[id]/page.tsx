import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, MessageSquare, Phone, Send, Camera, CheckCircle2, XCircle, Sparkles,
} from "lucide-react";
import { Card, CardLabel, CardTitle } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Button } from "@/components/ui/button";
import { Module } from "@/components/feedback/module";
import { DispatchAction } from "./dispatch-action";
import { getRequest, getTenant, getUnit, vendors } from "@/lib/data";
import { longDate } from "@/lib/utils";

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
                  <span className="text-gold-2 font-semibold">Recommendation:</span>{" "}
                  Door seal and drain hose are clean. Likely a faulty inlet valve or sump assembly &mdash; needs a plumber.
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
                    <dd className="mt-2 flex items-center gap-2 text-xs text-muted">
                      <Camera size={14} /> 1 photo attached &middot; click in real app
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
              <ol className="mt-3 space-y-3">
                <Activity at="May 13, 6:42 PM" body="James submitted request with description and 1 photo." />
                <Activity at="May 13, 6:43 PM" body="AI captured appliance info: Bosch SHE53C85N." />
                <Activity at="May 13, 6:48 PM" body="Tenant completed troubleshooting (2 of 3 steps passed)." />
                <Activity at="May 13, 6:52 PM" body="Escalated to landlord." />
                {r.status === "scheduled" && <Activity at="May 15, 8:14 AM" body="Vendor dispatched." />}
              </ol>
            </Card>
          </Module>
        </div>
      </div>
    </>
  );
}

function Activity({ at, body }: { at: string; body: string }) {
  return (
    <li className="flex gap-3">
      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold-2 shrink-0" />
      <div>
        <div className="text-sm text-parchment">{body}</div>
        <div className="text-[11px] text-subtle mt-0.5">{at}</div>
      </div>
    </li>
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
