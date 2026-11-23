"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@workspace/ui/lib/utils";
import { Widget2Icon } from "@solar-icons/react/outline/widget-2";
import { entries, sections } from "#lib/nav";

export function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="grid min-h-dvh md:grid-cols-[--spacing(60)_1fr]">
      <aside className="border-b bg-fill-subtle md:sticky md:top-0 md:h-dvh md:overflow-y-auto md:border-r md:border-b-0">
        <Link href="/" className="flex items-center gap-2 px-4 pt-4 pb-3 font-medium">
          <Widget2Icon className="size-4 text-brand" />
          Outpost workbench
        </Link>
        <nav aria-label="Workbench" className="flex gap-6 overflow-x-auto px-2 pb-4 md:flex-col md:gap-4">
          {sections.map((section) => (
            <div key={section.id} className="min-w-max">
              <p className="px-2 pb-1 text-xs font-medium text-muted-foreground">{section.title}</p>
              <ul>
                {entries
                  .filter((entry) => entry.section === section.id)
                  .map((entry) => {
                    const href = `/${entry.section}/${entry.slug}`;
                    const active = pathname === href;
                    return (
                      <li key={href}>
                        <Link
                          href={href}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "block rounded-md px-2 py-1 text-muted-foreground hover:bg-accent hover:text-foreground",
                            active && "bg-accent font-medium text-foreground",
                          )}
                        >
                          {entry.title}
                        </Link>
                      </li>
                    );
                  })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
      <main className="min-w-0 px-4 py-6 md:px-8">{children}</main>
    </div>
  );
}
