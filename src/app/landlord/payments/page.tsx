import { CreditCard, Building2, AlertCircle, Send } from "lucide-react";
import { PageHeader, SectionHead } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Stat } from "@/components/ui/stat";
import { StubButton } from "@/components/ui/stub-button";
import { Module } from "@/components/feedback/module";
import { Avatar } from "@/components/ui/avatar";
import { payments, getTenant, getUnit, totalCollected, totalOutstanding } from "@/lib/data";
import { currency, longDate } from "@/lib/utils";

export default function PaymentsPage() {
  const collected = totalCollected();
  const outstanding = totalOutstanding();
  const total = collected + outstanding;
  const pct = Math.round((collected / total) * 100);

  return (
    <>
      <PageHeader
        eyebrow="Money in"
        title="Payments"
        subtitle="Track who's paid, who's late, and follow up in one tap."
      />

      <Module id="landlord.payments.stats" label="Payment summary">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          <Stat label="Collected · May" value={currency(collected)}    tone="success" hint={`${pct}% of expected`} />
          <Stat label="Outstanding"     value={currency(outstanding)}  tone="danger"  hint="1 tenant" />
          <Stat label="Avg method"      value="ACH" hint="4 of 6 paid via ACH" />
        </div>
      </Module>

      <Module id="landlord.payments.transactions" label="Recent transactions">
        <Card>
          <SectionHead title="May transactions" />
          <ul className="divide-y divide-line">
            {payments.map((p) => {
              const tenant = getTenant(p.tenantId);
              const u = getUnit(p.unitId);
              const isLate = p.status === "late";
              return (
                <li key={p.id} className="py-3 first:pt-0 last:pb-0 flex items-center gap-3">
                  <Avatar name={tenant?.name ?? "—"} size={36} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-parchment truncate">{tenant?.name}</div>
                    <div className="text-xs text-muted flex items-center gap-1.5 mt-0.5">
                      <Building2 size={11} /> {u?.property.name} &middot; {u?.unit.label}
                      <span>&middot;</span>
                      <CreditCard size={11} /> {p.method}
                      <span>&middot;</span>
                      {longDate(p.date)}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`tabular text-sm font-semibold ${isLate ? "text-danger" : "text-moss"}`}>
                      {isLate ? `${currency(p.amount)}` : `+${currency(p.amount)}`}
                    </div>
                    {isLate
                      ? <Chip tone="danger" className="mt-1"><AlertCircle size={11} /> Late</Chip>
                      : <Chip tone="success" className="mt-1">Received</Chip>}
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 flex justify-end">
            <StubButton
              variant="outline"
              size="sm"
              toast="Late notice queued — Tom will get a templated SMS in ~10 seconds."
            >
              <Send size={13} /> Send late notice
            </StubButton>
          </div>
        </Card>
      </Module>
    </>
  );
}
