"use client";

import * as React from "react";
import { Send, Search } from "lucide-react";
import { PageHeader } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Module } from "@/components/feedback/module";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { messages, tenants } from "@/lib/data";
import { relativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function MessagesPage() {
  const threadIds = Array.from(new Set(messages.map((m) => m.threadId)));
  const [active, setActive] = React.useState(threadIds[0]);
  const [draft, setDraft] = React.useState("");

  const tenantForThread = (id: string) => {
    // Map thread-james -> "t-james"
    const tid = id.replace("thread-", "t-");
    return tenants.find((t) => t.id === tid);
  };

  const threadMessages = messages.filter((m) => m.threadId === active);

  return (
    <>
      <PageHeader eyebrow="Conversations" title="Messages" />

      <div className="grid lg:grid-cols-3 gap-5 min-h-[60vh]">
        <Module id="landlord.messages.threads" label="Threads">
          <Card className="!p-0 overflow-hidden">
            <div className="p-3 border-b border-line">
              <div className="relative">
                <Search size={14} className="absolute top-1/2 -translate-y-1/2 left-3 text-subtle" />
                <Input placeholder="Search…" className="pl-8" />
              </div>
            </div>
            <ul>
              {threadIds.map((tid) => {
                const t = tenantForThread(tid);
                const last = messages.filter((m) => m.threadId === tid).slice(-1)[0];
                const isActive = tid === active;
                return (
                  <li key={tid}>
                    <button
                      type="button"
                      onClick={() => setActive(tid)}
                      className={cn(
                        "w-full text-left flex items-center gap-3 px-4 py-3 border-b border-line transition-colors",
                        isActive ? "bg-pine-2" : "hover:bg-pine-2/60",
                      )}
                    >
                      <Avatar name={t?.name ?? "—"} size={34} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-parchment truncate">{t?.name}</div>
                        <div className="text-xs text-muted truncate">{last?.body}</div>
                      </div>
                      <div className="text-[11px] text-subtle shrink-0">{last && relativeTime(last.at)}</div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Card>
        </Module>

        <Module id="landlord.messages.thread" label="Thread" className="lg:col-span-2">
          <Card className="!p-0 flex flex-col h-full min-h-[60vh]">
            <div className="px-5 py-4 border-b border-line flex items-center gap-3">
              <Avatar name={tenantForThread(active)?.name ?? "—"} size={36} />
              <div>
                <div className="text-sm font-semibold text-parchment">{tenantForThread(active)?.name}</div>
                <div className="text-xs text-muted">{tenantForThread(active)?.email}</div>
              </div>
            </div>

            <ul className="flex-1 overflow-y-auto p-5 space-y-3">
              {threadMessages.map((m) => (
                <li
                  key={m.id}
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                    m.from === "landlord"
                      ? "ml-auto bg-gold text-ink"
                      : "bg-spruce/70 border border-line text-parchment",
                  )}
                >
                  {m.body}
                  <div className={cn("text-[10px] mt-1", m.from === "landlord" ? "text-ink/60" : "text-subtle")}>
                    {relativeTime(m.at)}
                  </div>
                </li>
              ))}
            </ul>

            <form
              className="p-4 border-t border-line flex items-center gap-2"
              onSubmit={(e) => { e.preventDefault(); setDraft(""); }}
            >
              <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Write a message…"
                className="flex-1"
              />
              <Button variant="primary" size="md" type="submit"><Send size={14} /> Send</Button>
            </form>
          </Card>
        </Module>
      </div>
    </>
  );
}
