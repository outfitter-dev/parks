import { notFound } from "next/navigation";
import { entries, findEntry } from "#lib/nav";
import { demos } from "#demos/index";

export function generateStaticParams() {
  return entries.map((entry) => ({ section: entry.section, slug: entry.slug }));
}

export default async function EntryPage({ params }: PageProps<"/[section]/[slug]">) {
  const { section, slug } = await params;
  const entry = findEntry(section, slug);
  const Demo = demos[`${section}/${slug}`];
  if (!entry || !Demo) notFound();
  const isSpecimen = entry.section === "components" || entry.section === "primitives";
  return (
    <div className={isSpecimen ? "mx-auto max-w-5xl" : undefined}>
      <p className="text-xs font-medium text-muted-foreground capitalize">{entry.section}</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">{entry.title}</h1>
      <p className="mt-1 max-w-prose text-muted-foreground">{entry.summary}</p>
      <div className="mt-6">
        <Demo />
      </div>
    </div>
  );
}
