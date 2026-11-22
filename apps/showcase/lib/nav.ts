export type Section = "primitives" | "components" | "compositions";

export type Entry = {
  section: Section;
  slug: string;
  title: string;
  summary: string;
};

export const sections: { id: Section; title: string }[] = [
  { id: "compositions", title: "Compositions" },
  { id: "components", title: "Components" },
  { id: "primitives", title: "Primitives" },
];

export const entries: Entry[] = [
  { section: "compositions", slug: "needs-you", title: "Needs you", summary: "The queue of asks waiting on a decision, with the selected ask open beside it." },
  { section: "compositions", slug: "agents", title: "Agents", summary: "Every agent with its mode, destination and last activity." },
  { section: "compositions", slug: "admin", title: "Admin", summary: "Elevated admin with its timer, routing versions and the audit log." },
  { section: "compositions", slug: "sign-in", title: "Sign in", summary: "The sign-in card and the device approval prompt." },

  { section: "components", slug: "button", title: "Button", summary: "Variants, sizes, icons and states." },
  { section: "components", slug: "badge", title: "Badge", summary: "Short status labels." },
  { section: "components", slug: "card", title: "Card", summary: "The frame. Its radius is the inner radius plus its padding." },
  { section: "components", slug: "inputs", title: "Inputs", summary: "Input, textarea, select, checkbox and switch." },
  { section: "components", slug: "tabs", title: "Tabs and toggles", summary: "Tabs, toggle and toggle group." },
  { section: "components", slug: "menus", title: "Menus and overlays", summary: "Dropdown menu, dialog and tooltip." },
  { section: "components", slug: "table", title: "Table", summary: "Dense rows for lists of agents, deliveries and versions." },
  { section: "components", slug: "feedback", title: "Feedback", summary: "Alert, progress, skeleton, avatar and kbd." },
  { section: "components", slug: "layout", title: "Layout", summary: "Separator and scroll area." },

  { section: "primitives", slug: "color", title: "Color", summary: "Surface, text, border and brand tokens in light and dark." },
  { section: "primitives", slug: "type", title: "Type", summary: "The UI face, the mono face and the type scale." },
  { section: "primitives", slug: "shape", title: "Shape and space", summary: "Inner radius, frame radius, padding and control height." },
  { section: "primitives", slug: "icons", title: "Icons", summary: "Solar icons in the styles the UI uses." },
];

export function findEntry(section: string, slug: string) {
  return entries.find((entry) => entry.section === section && entry.slug === slug);
}
