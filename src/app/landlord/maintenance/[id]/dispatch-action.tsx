"use client";

import * as React from "react";
import { Send, Zap, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field, Select, Textarea } from "@/components/ui/input";
import type { Vendor } from "@/lib/data";

export function DispatchAction({
  requestId, vendors, alreadyScheduled,
}: { requestId: string; vendors: Vendor[]; alreadyScheduled: boolean }) {
  const [open, setOpen] = React.useState(false);
  const [sent, setSent] = React.useState(alreadyScheduled);
  const [vendorId, setVendorId] = React.useState(vendors[0]?.id ?? "");
  const [channel, setChannel] = React.useState<"sms" | "email" | "both">("sms");

  if (sent) {
    return (
      <Button variant="forest" className="w-full" disabled>
        <CheckCircle2 size={14} /> Vendor dispatched
      </Button>
    );
  }

  return (
    <>
      <Button variant="primary" className="w-full" onClick={() => setOpen(true)}>
        <Zap size={14} /> Dispatch vendor
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Dispatch vendor"
        size="md"
      >
        <p className="text-xs text-muted -mt-2 mb-4">
          Greg picks the vendor and channel; the platform sends the pre-formatted work order with full context.
        </p>

        <Field label="Vendor">
          <Select value={vendorId} onChange={(e) => setVendorId(e.target.value)}>
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>{v.name} &middot; {v.trade}</option>
            ))}
          </Select>
        </Field>

        <Field label="Send via">
          <Select value={channel} onChange={(e) => setChannel(e.target.value as never)}>
            <option value="sms">SMS</option>
            <option value="email">Email</option>
            <option value="both">Both</option>
          </Select>
        </Field>

        <Field label="Work order preview" hint="Auto-generated from the request. You can edit before sending.">
          <Textarea
            defaultValue={[
              "WORK ORDER — Whose Home",
              "Property: 214 Maple St, Unit B",
              "Issue:    Bosch SHE53C85N — leak under unit",
              "Triage:   Door seal OK, drain hose OK; leak persists",
              "Photos:   1 attached",
              "Tenant:   James Reyes · (801) 555-0112",
            ].join("\n")}
            rows={7}
            className="font-mono text-xs"
          />
        </Field>

        <div className="flex items-center justify-end gap-2 mt-4">
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="primary"
            onClick={() => { setSent(true); setOpen(false); }}
          >
            <Send size={14} /> Send work order
          </Button>
        </div>
      </Dialog>
    </>
  );
}
