"use client";

import { GroupLabel } from "@outfitter/parks/components/group-label";
import { NavItem } from "@outfitter/parks/components/nav-item";
import { Widget2Icon } from "@solar-icons/react/outline/widget-2";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { entries, sections } from "#lib/nav";

export function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="grid min-h-dvh md:grid-cols-[--spacing(60)_1fr]">
      <aside className="bg-fill-subtle border-b md:sticky md:top-0 md:h-dvh md:overflow-y-auto md:border-r md:border-b-0">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 pt-4 pb-3 font-medium"
        >
          <Widget2Icon className="text-brand size-4" />
          Parks showcase
        </Link>
        <nav
          aria-label="Workbench"
          className="flex gap-6 overflow-x-auto px-2 pb-4 md:flex-col md:gap-4"
        >
          {sections.map((section) => (
            <div key={section.id} className="min-w-max">
              <GroupLabel className="px-2 pb-1">{section.title}</GroupLabel>
              <ul>
                {entries
                  .filter((entry) => entry.section === section.id)
                  .map((entry) => {
                    const href = `/${entry.section}/${entry.slug}`;
                    const active = pathname === href;
                    return (
                      <li key={href}>
                        <NavItem
                          render={<Link href={href} />}
                          current={active}
                          size="sm"
                          className="text-sm"
                        >
                          {entry.title}
                        </NavItem>
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
