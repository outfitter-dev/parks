import type { ReactNode } from "react";
import { TooltipProvider } from "@workspace/ui/components/tooltip";
import { Annotations } from "./annotations";
import { Shell } from "./shell";
import { ThemeController } from "./theme-controller";
import { typingGuard } from "./typing-guard";
import "./globals.css";

export const metadata = {
  title: "Outpost workbench",
  description: "Compositions, components and primitives for the Outpost UI.",
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
        <Annotations />
      </body>
    </html>
  );
}
