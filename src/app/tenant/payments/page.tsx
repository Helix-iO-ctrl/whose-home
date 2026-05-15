import { CreditCard, CheckCircle2, RotateCcw, Download } from "lucide-react";
import { PageHeader, SectionHead } from "@/components/ui/section";
import { Card, CardLabel } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Button } from "@/components/ui/button";
import { Module } from "@/components/feedback/module";
import { payments, getTenant, getUnit, leases } from "@/lib/data";
import { currency, longDate } from "@/lib/utils";

export default function TenantPaymentsPage() {
  const tenant = getTenant("t-james")!;
  const lease = leases.find((l) => l.tenantId === tenant.id)!;
  const unit = getUnit(tenant.unitId)!;
  const mine = payments.filter((p) => p.tenantId === tenant.id);

  return (
    <>
      <PageHeader
        eyebrow="Money out"
        title="Payments"
        subtitle="Pay rent, view receipts, and manage autopay."
      />

      <Module id="tenant.payments.next" label="Next payment">
        <Card className="bg-gradient-to-br from-forest to-pine !border-line-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardLabel>May rent</CardLabel>
              <div className="mt-2 font-display text-4xl font-bold text-parchment tabular">{currency(lease.monthlyRent)}</div>
              <div className="mt-1.5 flex items-center gap-2 text-sm text-muted">
                Due {longDate("2026-05-01")} &middot; <Chip tone="success"><CheckCircle2 size={11} /> Paid</Chip>
              </div>
              <div className="mt-1 text-xs text-subtle">{unit.property.name} &middot; {unit.unit.label}</div>
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="primary"><CreditCard size={14} /> Pay early</Button>
              <Button variant="outline" size="sm"><RotateCcw size={13} /> Manage autopay</Button>
            </div>
          </div>
        </Card>
      </Module>

      <Module id="tenant.payments.history" label="Payment history" className="mt-6">
        <Card>
          <SectionHead title="Payment history" />
          <ul className="divide-y divide-line">
            {mine.map((p) => (
              <li key={p.id} className="py-3 first:pt-0 last:pb-0 flex items-center gap-3">
                <span className="h-9 w-9 rounded-lg bg-spruce border border-line text-moss flex items-center justify-center">
                  <CheckCircle2 size={14} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-parchment">{longDate(p.date)}</div>
                  <div className="text-xs text-muted">{p.method} &middot; transaction #{p.id.toUpperCase()}</div>
                </div>
                <div className="text-sm font-semibold text-parchment tabular">{currency(p.amount)}</div>
                <Button variant="ghost" size="sm"><Download size={13} /> Receipt</Button>
              </li>
            ))}
          </ul>
        </Card>
      </Module>
    </>
  );
}
