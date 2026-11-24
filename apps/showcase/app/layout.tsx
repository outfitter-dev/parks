import { TooltipProvider } from "@outfitter/parks/components/tooltip";
import type { ReactNode } from "react";

import { DevAnnotations } from "./dev-annotations";
import { Shell } from "./shell";
import { ThemeController } from "./theme-controller";
import { typingGuard } from "./typing-guard";

import "./globals.css";

export const metadata = {
  title: "Parks showcase",
  description:
    "Compositions, components and primitives in Parks, Outfitter's design system.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Runs before any other script so page-wide shortcuts cannot eat note typing. */}
        <script dangerouslySetInnerHTML={{ __html: typingGuard }} />
      </head>
      <body>
        <ThemeController />
        <TooltipProvider>
          <Shell>{children}</Shell>
        </TooltipProvider>
        <DevAnnotations />
      </body>
    </html>
  );
}
