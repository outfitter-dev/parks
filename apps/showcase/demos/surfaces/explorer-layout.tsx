import type { ReactNode } from "react";
import { SidebarToggle } from "../app-frame";
import { BreadcrumbPath } from "@workspace/ui/components/breadcrumb";

/** The browser pane owns navigation. The detail pane owns the selected item's path and actions. */
export function ExplorerLayout({
  browserLabel,
  browser,
  path,
  actions,
  children,
}: {
  browserLabel: string;
  browser: ReactNode;
  path: string[];
  actions: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-full @3xl:grid-cols-[14rem_minmax(0,1fr)] @5xl:grid-cols-[16rem_minmax(0,1fr)]">
      <div className="min-w-0 border-b @3xl:border-e @3xl:border-b-0">
        <div className="flex h-14 items-center gap-1.5 ps-3 pe-4">
          <SidebarToggle />
          <span className="font-medium">{browserLabel}</span>
        </div>
        {browser}
      </div>

      <div className="min-w-0">
        <header className="flex min-h-14 items-center gap-3 px-4">
          <BreadcrumbPath className="min-w-0 flex-1" items={path.map((label) => ({ label }))} />
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        </header>
        <div className="flex min-w-0 flex-col gap-6 px-4 pb-4">{children}</div>
      </div>
    </div>
  );
}
