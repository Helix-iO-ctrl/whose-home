import Link from "next/link";
import {
  Wrench, FileText, MessageSquare, CalendarClock, ArrowRight, CheckCircle2, Sparkles, CreditCard,
} from "lucide-react";
import { PageHeader, SectionHead } from "@/components/ui/section";
import { Card, CardLabel } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Button } from "@/components/ui/button";
import { Module } from "@/components/feedback/module";
import { getTenant, getUnit, leases, requests } from "@/lib/data";
import { currency, longDate } from "@/lib/utils";

export default function TenantHomePage() {
  // James is the prototype tenant
  const tenant = getTenant("t-james")!;
  const u = getUnit(tenant.unitId)!;
  const lease = leases.find((l) => l.tenantId === tenant.id)!;
  const myRequest = requests.find((r) => r.submittedBy === tenant.id);

  return (
    <>
      <PageHeader
        eyebrow={`${u.property.name} · ${u.unit.label}`}
        title={<>Welcome home, <span className="italic-accent">James.</span></>}
        subtitle="Pay rent, request maintenance, talk to your property manager — all in one place."
      />

      <Module id="tenant.home.rent-card" label="May rent card">
        <Card className="bg-gradient-to-br from-forest to-pine !border-line-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="overline">May rent</div>
              <div className="mt-2 font-display text-4xl font-bold text-parchment tabular">{currency(lease.monthlyRent)}</div>
              <div className="mt-1.5 flex items-center gap-2 text-sm text-muted">
                Due {longDate("2026-05-01")} &middot; <Chip tone="success"><CheckCircle2 size={11} /> Paid</Chip>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="primary" size="md">View receipt</Button>
              <Button variant="outline" size="sm"><CreditCard size={13} /> Autopay on</Button>
            </div>
          </div>
        </Card>
      </Module>

      <Module id="tenant.home.quick-actions" label="Quick actions" className="mt-6">
        <SectionHead title="Quick actions" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <ActionTile
            href="/tenant/maintenance"
            icon={Wrench}
            label="Report issue"
            hint={myRequest ? "1 active request" : "No active requests"}
          />
          <ActionTile
            href="/tenant/documents"
            icon={FileText}
            label="My lease"
            hint={`Ends ${longDate(lease.endDate)}`}
          />
          <ActionTile
            href="/tenant/messages"
            icon={MessageSquare}
            label="Message Greg"
            hint="No unread messages"
          />
          <ActionTile
            href="/tenant/documents"
            icon={CalendarClock}
            label="Renewal"
            hint="Due in 5 months"
          />
        </div>
      </Module>

      <Module id="tenant.home.activity" label="Recent activity" className="mt-6">
        <Card>
          <SectionHead title="Recent activity" />
          <ol className="space-y-4">
            <Activity
              icon={Sparkles}
              title="Vendor scheduled for dishwasher leak"
              meta="Today · Dave's Plumbing arriving Tue, May 19 between 2-4pm"
              tone="gold"
            />
            <Activity
              icon={CheckCircle2}
              title="Rent payment confirmed"
              meta="May 1 · $1,350 via Card"
              tone="success"
            />
            <Activity
              icon={FileText}
              title="Lease renewal completed"
              meta="Jan 15 · Signed digitally"
              tone="info"
            />
          </ol>
        </Card>
      </Module>
    </>
  );
}

function ActionTile({
  href, icon: Icon, label, hint,
}: { href: string; icon: typeof Wrench; label: string; hint: string }) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-line bg-pine/70 hover:bg-pine-2 p-4 transition-colors flex flex-col gap-2"
    >
      <span className="h-9 w-9 rounded-lg bg-spruce border border-line flex items-center justify-center text-gold-2">
        <Icon size={16} />
      </span>
      <div>
        <div className="text-sm font-semibold text-parchment">{label}</div>
        <div className="text-xs text-muted mt-0.5">{hint}</div>
      </div>
      <ArrowRight size={14} className="text-subtle group-hover:text-gold-2 mt-auto self-end transition-colors" />
    </Link>
  );
}

function Activity({
  icon: Icon, title, meta, tone,
}: { icon: typeof Wrench; title: string; meta: string; tone: "gold" | "success" | "info" }) {
  const color =
    tone === "gold" ? "text-gold-2" :
    tone === "success" ? "text-moss" :
    "text-parchment";
  return (
    <li className="flex items-start gap-3">
      <span className={`mt-0.5 h-8 w-8 rounded-lg bg-spruce border border-line flex items-center justify-center ${color}`}>
        <Icon size={14} />
      </span>
      <div>
        <div className="text-sm font-semibold text-parchment">{title}</div>
        <div className="text-xs text-muted mt-0.5">{meta}</div>
      </div>
    </li>
  );
}
