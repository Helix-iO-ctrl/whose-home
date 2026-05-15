import { FileText, CalendarClock, CheckCircle2, Clock, Plus } from "lucide-react";
import { PageHeader, SectionHead } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { StubButton } from "@/components/ui/stub-button";
import { Module } from "@/components/feedback/module";
import { leases, getTenant, getUnit } from "@/lib/data";
import { currency, longDate } from "@/lib/utils";

export default function LeasesPage() {
  // mark "renewal coming up" if lease ends within ~6 months
  const now = new Date();
  const sixMonthsOut = new Date(now); sixMonthsOut.setMonth(sixMonthsOut.getMonth() + 6);

  return (
    <>
      <PageHeader
        eyebrow="Leases"
        title="Lease library"
        subtitle="All active leases, signed copies, and upcoming renewals in one place."
        actions={
          <StubButton
            variant="primary"
            toast="Lease drafting wizard coming soon — will pre-fill from a unit + tenant pair."
            tone="info"
          >
            <Plus size={14} /> Draft new lease
          </StubButton>
        }
      />

      <Module id="landlord.leases.list" label="Active leases">
        <Card>
          <SectionHead title="Active leases" />
          <ul className="divide-y divide-line">
            {leases.map((l) => {
              const tenant = getTenant(l.tenantId);
              const u = getUnit(l.unitId);
              const ends = new Date(l.endDate);
              const renewalSoon = ends < sixMonthsOut;
              return (
                <li key={l.id} className="py-4 first:pt-0 last:pb-0 flex items-start gap-3">
                  <span className="h-10 w-10 shrink-0 rounded-xl bg-forest/40 border border-line text-gold-2 flex items-center justify-center">
                    <FileText size={16} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-parchment text-sm">{tenant?.name}</span>
                      <Chip tone="info">{u?.property.name} &middot; {u?.unit.label}</Chip>
                      {l.signed && <Chip tone="success"><CheckCircle2 size={11} /> Signed</Chip>}
                      {renewalSoon && <Chip tone="gold"><Clock size={11} /> Renewal coming</Chip>}
                    </div>
                    <div className="text-xs text-muted mt-1.5">
                      <CalendarClock size={11} className="inline -mt-0.5 mr-1" />
                      {longDate(l.startDate)} &rarr; {longDate(l.endDate)} &middot; {currency(l.monthlyRent)}/mo
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col gap-2">
                    <StubButton
                      variant="outline"
                      size="sm"
                      toast={`Opened ${tenant?.name}'s lease PDF (demo).`}
                      tone="info"
                    >
                      View
                    </StubButton>
                    {renewalSoon && (
                      <StubButton
                        variant="primary"
                        size="sm"
                        toast={`Renewal offer sent to ${tenant?.name} — they'll get an in-app notification + email.`}
                      >
                        Send renewal
                      </StubButton>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      </Module>
    </>
  );
}
