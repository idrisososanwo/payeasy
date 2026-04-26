import type { Metadata } from "next";
import "@/lib/env";
import { AppShell } from "@/components/ui/app-shell";
import { StellarAuthProvider } from "@/contexts/StellarAuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "PayEasy — Blockchain-Powered Rent Sharing for Roommates",
  description:
    "Find roommates, split rent, and pay securely through Stellar blockchain escrow. PayEasy makes rent sharing transparent, trustless, and effortless.",
  keywords: [
    "rent sharing",
    "roommate finder",
    "blockchain payments",
    "stellar",
    "escrow",
    "rent splitting",
  ],
  openGraph: {
    title: "PayEasy — Blockchain-Powered Rent Sharing",
    description:
      "Find roommates, split rent, and pay securely through Stellar blockchain escrow.",
    type: "website",
    url: "https://payeasy.dev",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PayEasy - Blockchain-Powered Rent Sharing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PayEasy — Blockchain-Powered Rent Sharing",
    description:
      "Find roommates, split rent, and pay securely through Stellar blockchain escrow.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <StellarAuthProvider>
          <AppShell>{children}</AppShell>
        </StellarAuthProvider>
      </body>
    </html>
  );
}
