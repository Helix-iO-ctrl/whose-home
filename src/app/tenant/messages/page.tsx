"use client";

import * as React from "react";
import { Send } from "lucide-react";
import { PageHeader } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Module } from "@/components/feedback/module";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { messages } from "@/lib/data";
import { relativeTime, cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

export default function TenantMessagesPage() {
  const thread = messages.filter((m) => m.threadId === "thread-james");
  const [draft, setDraft] = React.useState("");
  const toast = useToast();

  return (
    <>
      <PageHeader eyebrow="Messages" title={<>Talking to <span className="italic-accent">Greg.</span></>} />

      <Module id="tenant.messages.thread" label="Greg thread">
        <Card className="!p-0 flex flex-col h-[60vh]">
          <div className="px-5 py-4 border-b border-line flex items-center gap-3">
            <Avatar name="Greg Jensen" size={36} />
            <div>
              <div className="text-sm font-semibold text-parchment">Greg Jensen</div>
              <div className="text-xs text-muted">Whose Home LLC · Property manager</div>
            </div>
          </div>
          <ul className="flex-1 overflow-y-auto p-5 space-y-3">
            {thread.map((m) => (
              <li
                key={m.id}
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  m.from === "tenant"
                    ? "ml-auto bg-gold text-ink"
                    : "bg-spruce/70 border border-line text-parchment",
                )}
              >
                {m.body}
                <div className={cn("text-[10px] mt-1", m.from === "tenant" ? "text-ink/60" : "text-subtle")}>
                  {relativeTime(m.at)}
                </div>
              </li>
            ))}
          </ul>
          <form
            className="p-4 border-t border-line flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!draft.trim()) return;
              toast.show("Sent to Greg.");
              setDraft("");
            }}
          >
            <Input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Write a message…" className="flex-1" />
            <Button variant="primary" size="md" type="submit"><Send size={14} /> Send</Button>
          </form>
        </Card>
      </Module>
    </>
  );
}
