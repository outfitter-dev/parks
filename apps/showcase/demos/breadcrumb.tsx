import { Breadcrumb } from "@workspace/ui/components/breadcrumb";
import { HomeIcon } from "@solar-icons/react/outline/home";
import { FolderIcon } from "@solar-icons/react/outline/folder";

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
        <Breadcrumb items={[path[0], path[1], { label: "Landing" }]} />
      </Specimen>
      <Specimen title="Deep path">
        <Breadcrumb className="w-full" items={path} />
      </Specimen>
      <Specimen title="Narrow container" note="The width folds ancestors into the menu even when the item limit allows the full path.">
        <Breadcrumb className="w-full max-w-64" items={[...path.slice(0, -1), { label: "Landing" }]} maxItems={5} />
      </Specimen>
      <Specimen title="Slash separators" note="Spacing, label width, icon size, and colors can be set on each breadcrumb.">
        <Breadcrumb
          items={path.slice(0, 3)}
          separator="slash"
          className="[--breadcrumb-gap:--spacing(3)] [--breadcrumb-icon-size:--spacing(4)]"
        />
      </Specimen>
    </>
  );
}
