import { Wrench, Snowflake, Zap, KeyRound, Hammer, Phone, Mail, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Button } from "@/components/ui/button";
import { Module } from "@/components/feedback/module";
import { vendors } from "@/lib/data";

const tradeIcon = {
  Plumbing:   Wrench,
  HVAC:       Snowflake,
  Electrical: Zap,
  Locksmith:  KeyRound,
  General:    Hammer,
} as const;

export default function VendorsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Directory"
        title="Vendors"
        subtitle="Your trusted contractors by trade. One tap to dispatch from any maintenance request."
        actions={<Button variant="primary"><Plus size={14} /> Add vendor</Button>}
      />

      <div className="grid sm:grid-cols-2 gap-4">
        {vendors.map((v) => {
          const Icon = tradeIcon[v.trade];
          return (
            <Module key={v.id} id={`landlord.vendors.${v.id}`} label={v.name}>
              <Card>
                <div className="flex items-start gap-3">
                  <span className="h-10 w-10 shrink-0 rounded-xl bg-forest/40 border border-line text-gold-2 flex items-center justify-center">
                    <Icon size={18} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-parchment text-sm">{v.name}</span>
                      {v.active ? <Chip tone="success">Active</Chip> : <Chip tone="neutral">Paused</Chip>}
                    </div>
                    <div className="text-xs text-muted mt-0.5">{v.trade}</div>
                    <div className="mt-3 space-y-1 text-xs text-muted">
                      <div className="flex items-center gap-1.5"><Phone size={12} /> {v.phone}</div>
                      <div className="flex items-center gap-1.5"><Mail size={12} /> {v.email}</div>
                    </div>
                  </div>
                </div>
              </Card>
            </Module>
          );
        })}
      </div>
    </>
  );
}
