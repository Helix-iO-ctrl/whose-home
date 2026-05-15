"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Wrench, Users, DollarSign, FileText,
  MessageSquare, Building2, Home as HomeIcon, ArrowLeftRight, Inbox,
} from "lucide-react";
import { OwlMark } from "./owl-mark";
import { cn } from "@/lib/utils";

type Role = "landlord" | "tenant";

const landlordNav = [
  { href: "/landlord/dashboard",   label: "Dashboard",   icon: LayoutDashboard },
  { href: "/landlord/properties",  label: "Properties",  icon: Building2 },
  { href: "/landlord/maintenance", label: "Maintenance", icon: Wrench },
  { href: "/landlord/vendors",     label: "Vendors",     icon: Users },
  { href: "/landlord/payments",    label: "Payments",    icon: DollarSign },
  { href: "/landlord/leases",      label: "Leases",      icon: FileText },
  { href: "/landlord/messages",    label: "Messages",    icon: MessageSquare },
];

const tenantNav = [
  { href: "/tenant/home",        label: "Home",        icon: HomeIcon },
  { href: "/tenant/maintenance", label: "Maintenance", icon: Wrench },
  { href: "/tenant/payments",    label: "Payments",    icon: DollarSign },
  { href: "/tenant/documents",   label: "Documents",   icon: FileText },
  { href: "/tenant/messages",    label: "Messages",    icon: MessageSquare },
];

export function AppShell({
  role, children,
}: { role: Role; children: React.ReactNode }) {
  const pathname = usePathname();
  const nav = role === "landlord" ? landlordNav : tenantNav;
  const otherRoleHref = role === "landlord" ? "/tenant/home" : "/landlord/dashboard";
  const otherRoleLabel = role === "landlord" ? "Switch to tenant view" : "Switch to landlord view";

  return (
    <div className="min-h-screen flex">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-line bg-pine/40 backdrop-blur-sm">
        <div className="p-5 border-b border-line">
          <Link href="/" className="block">
            <OwlMark size={36} withWordmark withTagline />
          </Link>
          <div className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-gold-2">
            {role === "landlord" ? "Landlord workspace" : "Tenant portal"}
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {nav.map((n) => {
            const active = pathname.startsWith(n.href);
            const Icon = n.icon;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                  active
                    ? "bg-forest text-parchment font-semibold"
                    : "text-muted hover:text-parchment hover:bg-pine-2",
                )}
              >
                <Icon size={16} strokeWidth={2.25} />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-line">
          <Link
            href={otherRoleHref}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-muted hover:text-parchment hover:bg-pine-2 transition-colors"
          >
            <ArrowLeftRight size={14} />
            {otherRoleLabel}
          </Link>
          <Link
            href="/feedback"
            className="mt-1 flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-muted hover:text-parchment hover:bg-pine-2 transition-colors"
          >
            <Inbox size={14} />
            Feedback inbox
          </Link>
        </div>
      </aside>

      {/* Main + mobile top bar */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile top */}
        <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between border-b border-line bg-spruce/85 backdrop-blur px-4 py-3">
          <Link href="/" className="flex items-center"><OwlMark size={28} withWordmark /></Link>
          <Link
            href={otherRoleHref}
            className="text-[11px] font-semibold uppercase tracking-wider text-gold-2 hover:text-gold transition-colors"
          >
            {role === "landlord" ? "Tenant view" : "Landlord view"}
          </Link>
        </div>

        <main className="flex-1 px-4 sm:px-6 lg:px-10 py-6 lg:py-10 max-w-6xl w-full mx-auto pb-28">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-line bg-spruce/95 backdrop-blur">
          <div className="flex">
            {nav.slice(0, 5).map((n) => {
              const active = pathname.startsWith(n.href);
              const Icon = n.icon;
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={cn(
                    "flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium",
                    active ? "text-gold-2" : "text-muted",
                  )}
                >
                  <Icon size={18} strokeWidth={2.25} />
                  {n.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
