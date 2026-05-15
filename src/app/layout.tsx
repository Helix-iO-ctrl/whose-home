import type { Metadata } from "next";
import { Libre_Baskerville, DM_Sans } from "next/font/google";
import "./globals.css";
import { FeedbackProvider } from "@/components/feedback/feedback-provider";
import { FeedbackButton } from "@/components/feedback/feedback-button";
import { ToastProvider } from "@/components/ui/toast";

const display = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Whose Home — Property management with a wink",
  description:
    "A two-sided property platform for small operators. Manage portfolios, triage maintenance with AI, and dispatch vendors — all in one place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <ToastProvider>
          <FeedbackProvider>
            {children}
            <FeedbackButton />
          </FeedbackProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
