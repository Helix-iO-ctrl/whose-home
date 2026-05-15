import { AppShell } from "@/components/app-shell";

export default function LandlordLayout({ children }: { children: React.ReactNode }) {
  return <AppShell role="landlord">{children}</AppShell>;
}
