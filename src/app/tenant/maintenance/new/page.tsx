"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, Sparkles, Camera, CheckCircle2, XCircle, PlayCircle, Wrench,
} from "lucide-react";
import { PageHeader } from "@/components/ui/section";
import { Card, CardLabel, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea, Select } from "@/components/ui/input";
import { Module } from "@/components/feedback/module";
import { Chip } from "@/components/ui/chip";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3 | 4;

export default function NewRequestPage() {
  const [step, setStep] = React.useState<Step>(1);
  const [category, setCategory] = React.useState<string>("");
  const [description, setDescription] = React.useState("");
  const [make, setMake] = React.useState("Bosch");
  const [model, setModel] = React.useState("SHE53C85N");
  const [done, setDone] = React.useState<Record<number, boolean>>({});
  const [resolution, setResolution] = React.useState<"resolved" | "escalate" | null>(null);

  return (
    <>
      <Link href="/tenant/maintenance" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-parchment mb-5">
        <ArrowLeft size={14} /> Back to my requests
      </Link>

      <PageHeader
        eyebrow="New request"
        title={
          <>What's <span className="italic-accent">going on?</span></>
        }
        subtitle="The more we know up front, the faster Greg can act."
      />

      {/* Stepper */}
      <Module id="tenant.maintenance.new.stepper" label="Step indicator">
        <ol className="flex items-center gap-2 mb-6">
          {[1, 2, 3, 4].map((n) => (
            <li key={n} className="flex items-center gap-2">
              <span
                className={cn(
                  "h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold",
                  n === step
                    ? "bg-gold text-ink"
                    : n < step
                      ? "bg-moss text-parchment"
                      : "bg-spruce border border-line text-subtle",
                )}
              >
                {n < step ? <CheckCircle2 size={13} /> : n}
              </span>
              {n < 4 && <span className={cn("h-px w-6", n < step ? "bg-moss" : "bg-line")} />}
            </li>
          ))}
        </ol>
      </Module>

      {step === 1 && (
        <Module id="tenant.maintenance.new.describe" label="Describe the issue">
          <Card>
            <CardLabel>Step 1 of 4</CardLabel>
            <CardTitle className="mt-1">Describe the issue</CardTitle>
            <div className="mt-4">
              <Field label="Issue category">
                <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="">Pick a category…</option>
                  <option value="appliance">Appliance</option>
                  <option value="plumbing">Plumbing / water</option>
                  <option value="hvac">Heating / cooling</option>
                  <option value="electrical">Electrical</option>
                  <option value="other">Other</option>
                </Select>
              </Field>
              <Field label="What's happening?" hint="Plain language is fine. Pretend you're texting Greg.">
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Water is pooling under the dishwasher after each cycle. Started two days ago."
                />
              </Field>
              <Field label="Add a photo (optional)">
                <button type="button" className="rounded-lg border border-dashed border-line-2 bg-spruce/40 hover:bg-pine-2 transition-colors w-full py-6 text-sm text-muted flex items-center justify-center gap-2">
                  <Camera size={14} /> Tap to attach
                </button>
              </Field>
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                variant="primary"
                disabled={!category || description.trim().length < 5}
                onClick={() => setStep(2)}
              >
                Next <ArrowRight size={14} />
              </Button>
            </div>
          </Card>
        </Module>
      )}

      {step === 2 && (
        <Module id="tenant.maintenance.new.appliance" label="Appliance info">
          <Card>
            <CardLabel>Step 2 of 4</CardLabel>
            <CardTitle className="mt-1">Tell us about the appliance</CardTitle>
            <p className="text-sm text-muted mt-1.5">
              Knowing the make/model lets the AI find fixes specific to your unit. Skip if you don't know.
            </p>
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              <Field label="Make"><Input value={make} onChange={(e) => setMake(e.target.value)} placeholder="Bosch, Whirlpool, GE…" /></Field>
              <Field label="Model number"><Input value={model} onChange={(e) => setModel(e.target.value)} placeholder="e.g. SHE53C85N" /></Field>
            </div>
            <div className="mt-4 flex justify-between">
              <Button variant="ghost" onClick={() => setStep(1)}><ArrowLeft size={14} /> Back</Button>
              <Button variant="primary" onClick={() => setStep(3)}>Run triage <Sparkles size={14} /></Button>
            </div>
          </Card>
        </Module>
      )}

      {step === 3 && (
        <Module id="tenant.maintenance.new.triage" label="AI troubleshooting">
          <Card>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-gold-2" />
              <CardLabel className="!mb-0">Step 3 of 4 · AI troubleshooting</CardLabel>
            </div>
            <CardTitle className="mt-1">Try these first &mdash; specific to your {make} {model}</CardTitle>

            <ul className="mt-4 space-y-2">
              {triageSteps.map((s, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => setDone((d) => ({ ...d, [i]: !d[i] }))}
                    className={cn(
                      "w-full text-left flex items-start gap-3 rounded-lg border p-3 transition-colors",
                      done[i]
                        ? "border-moss/60 bg-moss/10"
                        : "border-line bg-spruce/40 hover:bg-pine-2",
                    )}
                  >
                    <span className={cn(
                      "mt-0.5 h-5 w-5 rounded-md flex items-center justify-center shrink-0 border",
                      done[i] ? "bg-moss border-moss text-parchment" : "border-line-2 text-transparent",
                    )}>
                      <CheckCircle2 size={12} />
                    </span>
                    <span className="text-sm text-parchment leading-relaxed">{s}</span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-5 rounded-xl border border-line bg-spruce/60 p-4">
              <div className="flex items-center gap-2 text-xs text-gold-2 font-semibold uppercase tracking-wider mb-3">
                <PlayCircle size={13} /> Watch this if step 1 didn't help
              </div>
              <div className="aspect-video rounded-lg bg-gradient-to-br from-spruce to-pine border border-line flex items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-gold-2 text-ink flex items-center justify-center">
                  <PlayCircle size={22} />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-sm font-semibold text-parchment">Bosch Dishwasher Leaking From Door — Fix in 5 Min</div>
                <div className="text-xs text-muted mt-0.5">AppliancePros · 142K views</div>
              </div>
            </div>

            <div className="mt-5">
              <CardLabel>Did any of these fix it?</CardLabel>
              <div className="mt-2 flex flex-wrap gap-2">
                <Button
                  variant={resolution === "resolved" ? "forest" : "outline"}
                  onClick={() => { setResolution("resolved"); setStep(4); }}
                >
                  <CheckCircle2 size={14} /> Resolved — close out
                </Button>
                <Button
                  variant={resolution === "escalate" ? "primary" : "outline"}
                  onClick={() => { setResolution("escalate"); setStep(4); }}
                >
                  <XCircle size={14} /> Still broken — escalate to Greg
                </Button>
              </div>
            </div>

            <div className="mt-5">
              <Button variant="ghost" onClick={() => setStep(2)}><ArrowLeft size={14} /> Back</Button>
            </div>
          </Card>
        </Module>
      )}

      {step === 4 && (
        <Module id="tenant.maintenance.new.confirm" label="Confirmation">
          <Card>
            <div className="text-center py-4">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-moss/20 text-moss">
                {resolution === "resolved" ? <CheckCircle2 size={26} /> : <Wrench size={26} />}
              </span>
              <CardTitle className="mt-4 text-2xl">
                {resolution === "resolved" ? "Glad we got it sorted." : "Sent to Greg."}
              </CardTitle>
              <p className="text-sm text-muted mt-2 max-w-sm mx-auto">
                {resolution === "resolved"
                  ? "We'll keep this on your record so we can spot patterns later."
                  : "Greg has the description, photos, the make/model, and your troubleshooting log. He'll dispatch a vendor and you'll get a notification with the appointment window."}
              </p>
              <div className="mt-5 inline-flex items-center gap-2">
                <Chip tone="success">Logged · {new Date().toLocaleDateString()}</Chip>
                {resolution === "escalate" && <Chip tone="gold">Awaiting dispatch</Chip>}
              </div>
            </div>
            <div className="mt-3 flex flex-col sm:flex-row gap-2">
              <Link href="/tenant/maintenance" className="flex-1">
                <Button variant="outline" className="w-full">Back to my requests</Button>
              </Link>
              <Link href="/tenant/home" className="flex-1">
                <Button variant="primary" className="w-full">Done</Button>
              </Link>
            </div>
          </Card>
        </Module>
      )}
    </>
  );
}

const triageSteps = [
  "Open the door and check the rubber gasket along the bottom edge — Bosch dishwashers leak from this spot if a piece of food is stuck in the seal.",
  "Pull the lower rack out and inspect the spray arm — make sure it spins freely and isn't cracked.",
  "Run an empty rinse cycle. If water still pools, you've ruled out the easy stuff and a plumber should look at the inlet valve.",
];
