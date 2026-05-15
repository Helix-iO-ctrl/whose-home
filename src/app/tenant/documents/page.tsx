import { FileText, ClipboardCheck, ScrollText, CalendarClock, Download } from "lucide-react";
import { PageHeader, SectionHead } from "@/components/ui/section";
import { Card, CardLabel, CardTitle } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StubButton } from "@/components/ui/stub-button";
import { Module } from "@/components/feedback/module";
import { leases, getTenant, getUnit } from "@/lib/data";
import { currency, longDate } from "@/lib/utils";

export default function TenantDocumentsPage() {
  const tenant = getTenant("t-james")!;
  const lease = leases.find((l) => l.tenantId === tenant.id)!;
  const unit  = getUnit(tenant.unitId)!;

  return (
    <>
      <PageHeader
        eyebrow="Documents"
        title="Your paperwork"
        subtitle="Lease, addenda, move-in checklist, and renewal — all in one place."
      />

      <Module id="tenant.documents.list" label="My documents">
        <Card>
          <SectionHead title="My documents" />
          <ul className="divide-y divide-line">
            <Doc icon={FileText} title="Lease agreement" meta={`Signed ${longDate(lease.startDate)} · Expires ${longDate(lease.endDate)}`} chip="Active" tone="success" />
            <Doc icon={ClipboardCheck} title="Move-in checklist" meta="Completed Jan 14, 2025" chip="Done" tone="success" />
            <Doc icon={ScrollText} title="Pet policy addendum" meta="Signed Jan 15, 2025" chip="On file" tone="info" />
          </ul>
        </Card>
      </Module>

      <Module id="tenant.documents.renewal" label="Renewal" className="mt-6">
        <Card className="border-gold-2/40">
          <div className="flex items-start gap-3">
            <span className="h-10 w-10 rounded-xl bg-gold/15 text-gold-2 flex items-center justify-center">
              <CalendarClock size={18} />
            </span>
            <div className="flex-1">
              <CardLabel>Renewal coming up</CardLabel>
              <CardTitle className="mt-1">Your lease ends {longDate(lease.endDate)}</CardTitle>
              <p className="text-sm text-muted mt-2 leading-relaxed">
                Greg has sent a renewal offer at <span className="text-parchment font-semibold tabular">{currency(lease.monthlyRent + 25)}/mo</span>{" "}
                ({currency(25)} increase). 12-month term, all other terms unchanged.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <StubButton
                  variant="primary"
                  toast="Renewal opened in DocuSign-style flow (demo)."
                  tone="info"
                >
                  Review & sign
                </StubButton>
                <Link href="/tenant/messages">
                  <Button variant="outline">Ask a question</Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </Module>
    </>
  );
}

function Doc({
  icon: Icon, title, meta, chip, tone,
}: { icon: typeof FileText; title: string; meta: string; chip: string; tone: "success" | "info" }) {
  return (
    <li className="py-3 first:pt-0 last:pb-0 flex items-center gap-3">
      <span className="h-10 w-10 shrink-0 rounded-lg bg-spruce border border-line text-gold-2 flex items-center justify-center">
        <Icon size={16} />
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-parchment">{title}</div>
        <div className="text-xs text-muted mt-0.5">{meta}</div>
      </div>
      <Chip tone={tone}>{chip}</Chip>
      <StubButton
        variant="ghost"
        size="sm"
        toast={`${title} downloaded.`}
        tone="info"
        aria-label={`Download ${title}`}
      >
        <Download size={13} />
      </StubButton>
    </li>
  );
}
