import Link from "next/link";

import { entries, sections } from "#lib/nav";

export default function Overview() {
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-semibold tracking-tight">Parks showcase</h1>
      <p className="text-muted-foreground mt-2 max-w-prose">
        Every screen and part of Parks, drawn from packages/parks. Open the
        panel in the corner to switch between the Luma tuned and Linear-like
        presets, or tune any token live. &ldquo;Copy tokens&rdquo; copies the
        CSS for what you see.
      </p>
      {sections.map((section) => (
        <section key={section.id} className="mt-8">
          <h2 className="text-muted-foreground text-sm font-medium">
            {section.title}
          </h2>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {entries
              .filter((entry) => entry.section === section.id)
              .map((entry) => (
                <li key={entry.slug}>
                  <Link
                    href={`/${entry.section}/${entry.slug}`}
                    className="frame p-frame bg-card ring-border-muted hover:ring-border-strong block h-full shadow-(--shadow-frame) ring-1"
                  >
                    <span className="px-inset block font-medium">
                      {entry.title}
                    </span>
                    <span className="px-inset text-muted-foreground mt-1 block">
                      {entry.summary}
                    </span>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
