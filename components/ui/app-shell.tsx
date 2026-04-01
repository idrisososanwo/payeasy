"use client";

import { ThemeProvider } from "@/components/ui/theme-provider";
import { DottedSurface } from "@/components/ui/dotted-surface";
import { StellarProvider } from "@/context/StellarContext";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <DottedSurface />
      <div className="mesh-gradient" aria-hidden="true" />
      <StellarProvider>
        <div className="relative z-10">{children}</div>
      </StellarProvider>
    </ThemeProvider>
  );
}
