import Link from "next/link";
import { Building2, MapPin, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Button } from "@/components/ui/button";
import { Module } from "@/components/feedback/module";
import { properties, getTenant } from "@/lib/data";
import { currency, longDate } from "@/lib/utils";

export default function PropertiesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Portfolio"
        title="Properties"
        subtitle="Your full portfolio in one place. Tap a unit to manage its tenant, lease, and history."
        actions={<Button variant="outline" size="md"><Plus size={14} /> Add property</Button>}
      />

      <div className="space-y-5">
        {properties.map((p) => (
          <Module key={p.id} id={`landlord.properties.${p.id}`} label={p.name}>
            <Card>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-start gap-3">
                  <span className="h-10 w-10 rounded-xl bg-forest/40 border border-line text-gold-2 flex items-center justify-center shrink-0">
                    <Building2 size={18} />
                  </span>
                  <div>
                    <div className="font-display text-lg font-bold text-parchment">{p.name}</div>
                    <div className="text-xs text-muted mt-1 flex items-center gap-1.5">
                      <MapPin size={12} /> {p.address}
                    </div>
                  </div>
                </div>
                <Chip tone="info">{p.units.length} {p.units.length === 1 ? "unit" : "units"}</Chip>
              </div>

              <ul className="grid sm:grid-cols-2 gap-3">
                {p.units.map((u) => {
                  const t = u.tenantId ? getTenant(u.tenantId) : null;
                  return (
                    <li key={u.id} className="rounded-xl border border-line bg-spruce/40 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="overline">{u.label}</div>
                          <div className="font-semibold text-parchment mt-1">{currency(u.rent)}<span className="text-xs text-subtle font-normal">/mo</span></div>
                        </div>
                        {u.status === "late"   && <Chip tone="danger">Late</Chip>}
                        {u.status === "current"&& <Chip tone="success">Current</Chip>}
                        {u.status === "vacant" && <Chip tone="neutral">Vacant</Chip>}
                      </div>
                      <div className="mt-3 text-sm text-muted">
                        {t ? <>Tenant: <span className="text-parchment">{t.name}</span></> : <>No active tenant</>}
                      </div>
                      <div className="mt-1 text-xs text-subtle">
                        Lease through {longDate(u.leaseEnd)}
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Link href={`/landlord/maintenance?unit=${u.id}`} className="text-xs text-gold-2 hover:text-gold">View requests &rarr;</Link>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </Module>
        ))}
      </div>
    </>
  );
}
