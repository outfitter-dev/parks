import type { ReactNode } from "react";
import { PageBar } from "../app-frame";
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
        <PageBar title={browserLabel} as="h2" />
        {browser}
      </div>

      <div className="min-w-0">
        <PageBar toggle={false} className="gap-3 ps-4" start={<BreadcrumbPath items={path.map((label) => ({ label }))} />}>
          {actions}
        </PageBar>
        <div className="flex min-w-0 flex-col gap-6 px-4 pb-4">{children}</div>
      </div>
    </div>
  );
}
