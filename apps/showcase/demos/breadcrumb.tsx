import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbPath,
  BreadcrumbSeparator,
} from "@outfitter/parks/components/breadcrumb";
import { FolderIcon } from "@solar-icons/react/outline/folder";
import { HomeIcon } from "@solar-icons/react/outline/home";

import { Specimen } from "./kit";

const path = [
  { label: "Workbench", href: "/", icon: <HomeIcon /> },
  { label: "Skillset", href: "/surfaces/skillset" },
  { label: "Source", href: "/surfaces/skillset" },
  { label: "Outfitter Dev", href: "/surfaces/skillset", icon: <FolderIcon /> },
  { label: "Landing and review workflow for shared tools" },
];

export function BreadcrumbDemo() {
  return (
    <>
      <Specimen title="Short path">
        <BreadcrumbPath items={[path[0], path[1], { label: "Landing" }]} />
      </Specimen>
      <Specimen title="Deep path">
        <BreadcrumbPath className="w-full" items={path} />
      </Specimen>
      <Specimen
        title="Narrow container"
        note="The width folds ancestors into the menu even when the item limit allows the full path."
      >
        <BreadcrumbPath
          className="w-full max-w-64"
          items={[...path.slice(0, -1), { label: "Landing" }]}
          maxItems={5}
        />
      </Specimen>
      <Specimen title="Slash separators">
        <BreadcrumbPath items={path.slice(0, 3)} separator="slash" />
      </Specimen>
      <Specimen
        title="Composed parts"
        note="The shadcn parts, for a path that isn't a list of entries. BreadcrumbPath is built from these."
      >
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Workbench</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/surfaces/skillset">
                Skillset
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Landing</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Specimen>
    </>
  );
}
