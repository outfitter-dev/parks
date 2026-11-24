import { notFound } from "next/navigation";

import { demos } from "#demos/index";
import { entries, findEntry } from "#lib/nav";

export function generateStaticParams() {
  return entries.map((entry) => ({ section: entry.section, slug: entry.slug }));
}

export default async function EntryPage({
  params,
}: PageProps<"/[section]/[slug]">) {
  const { section, slug } = await params;
  const entry = findEntry(section, slug);
  const Demo = demos[`${section}/${slug}`];
  if (!entry || !Demo) {
    notFound();
  }
  const isSpecimen =
    entry.section === "components" || entry.section === "primitives";
  return (
    <div className={isSpecimen ? "mx-auto max-w-5xl" : undefined}>
      <p className="text-muted-foreground text-xs font-medium capitalize">
        {entry.section}
      </p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">
        {entry.title}
      </h1>
      <p className="text-muted-foreground mt-1 max-w-prose">{entry.summary}</p>
      <div className="mt-6">
        <Demo />
      </div>
    </div>
  );
}
