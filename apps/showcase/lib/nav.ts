export type Section = "primitives" | "components" | "compositions" | "surfaces";

export type Entry = {
  section: Section;
  slug: string;
  title: string;
  summary: string;
};

export const sections: { id: Section; title: string }[] = [
  { id: "compositions", title: "Compositions" },
  { id: "surfaces", title: "Surfaces" },
  { id: "components", title: "Components" },
  { id: "primitives", title: "Primitives" },
];

export const entries: Entry[] = [
  {
    section: "compositions",
    slug: "needs-you",
    title: "Needs you",
    summary:
      "The queue of asks waiting on a decision, with the selected ask open beside it.",
  },
  {
    section: "compositions",
    slug: "agents",
    title: "Agents",
    summary: "Every agent with its mode, destination and last activity.",
  },
  {
    section: "compositions",
    slug: "admin",
    title: "Admin",
    summary:
      "Elevated admin with its timer, routing versions and the audit log.",
  },
  {
    section: "compositions",
    slug: "sign-in",
    title: "Sign in",
    summary: "The sign-in card and the device approval prompt.",
  },

  {
    section: "surfaces",
    slug: "board",
    title: "Mission control",
    summary:
      "The fleet at a glance, work by Board state, and one run card in detail.",
  },
  {
    section: "surfaces",
    slug: "assistant",
    title: "Assistant",
    summary:
      "A thread with a tool trace, a diff, an inline ask and a composer with context.",
  },
  {
    section: "surfaces",
    slug: "skillset",
    title: "Skillset",
    summary:
      "The source tree and one skill with its rendered outputs, drift and change ledger.",
  },
  {
    section: "surfaces",
    slug: "trails",
    title: "Trails",
    summary:
      "A topo explorer: trails by group and one contract rendered on each surface.",
  },
  {
    section: "surfaces",
    slug: "docs",
    title: "Docs",
    summary:
      "Section nav, a readable article with steps and an on-this-page rail.",
  },
  {
    section: "surfaces",
    slug: "blog",
    title: "Blog",
    summary: "An index with a featured post, and the reading view.",
  },

  {
    section: "components",
    slug: "button",
    title: "Button",
    summary: "Variants, sizes, icons and states.",
  },
  {
    section: "components",
    slug: "badge",
    title: "Badge",
    summary: "Short status labels.",
  },
  {
    section: "components",
    slug: "breadcrumb",
    title: "Breadcrumb",
    summary: "Paths, separators, and overflow for deep navigation.",
  },
  {
    section: "components",
    slug: "card",
    title: "Card",
    summary: "The frame. Its radius is the inner radius plus its padding.",
  },
  {
    section: "components",
    slug: "inputs",
    title: "Inputs",
    summary: "Input, textarea, select, checkbox and switch.",
  },
  {
    section: "components",
    slug: "forms",
    title: "Forms",
    summary: "Field, radio group, input group, input OTP and combobox.",
  },
  {
    section: "components",
    slug: "tabs",
    title: "Tabs and toggles",
    summary: "Tabs, toggle and toggle group.",
  },
  {
    section: "components",
    slug: "menus",
    title: "Menus and overlays",
    summary:
      "Dropdown menus with checkbox, radio and sub-menu items, dialog and tooltip.",
  },
  {
    section: "components",
    slug: "overlays",
    title: "Overlays and toasts",
    summary: "Alert dialog, sheet, hover card, command palette and toast.",
  },
  {
    section: "components",
    slug: "table",
    title: "Table",
    summary: "Dense rows for lists of agents, deliveries and versions.",
  },
  {
    section: "components",
    slug: "data-table",
    title: "Data table",
    summary:
      "Sorting, filtering, column visibility, selection and paging on TanStack Table.",
  },
  {
    section: "components",
    slug: "questionnaire",
    title: "Questionnaire",
    summary: "One question at a time, with choices, shortcuts and progress.",
  },
  {
    section: "components",
    slug: "trace",
    title: "Trace",
    summary:
      "The steps an agent took, with running, error and expandable lines.",
  },
  {
    section: "components",
    slug: "attachment",
    title: "Attachment",
    summary: "Files on their way into a thread, in each upload state.",
  },
  {
    section: "components",
    slug: "resizable",
    title: "Resizable",
    summary: "Panels split by a draggable, keyboard-friendly handle.",
  },
  {
    section: "components",
    slug: "prose",
    title: "Prose",
    summary: "Styles for rendered Markdown and other long-form text.",
  },
  {
    section: "components",
    slug: "feedback",
    title: "Feedback",
    summary: "Alert, spinner, progress, skeleton, avatar and kbd.",
  },
  {
    section: "components",
    slug: "layout",
    title: "Layout",
    summary: "Separator and scroll area.",
  },
  {
    section: "components",
    slug: "disclosure",
    title: "Disclosure",
    summary: "Collapsible and accordion.",
  },
  {
    section: "components",
    slug: "groups",
    title: "Groups and pages",
    summary: "Button group and pagination.",
  },

  {
    section: "primitives",
    slug: "color",
    title: "Color",
    summary: "Surface, text, border and brand tokens in light and dark.",
  },
  {
    section: "primitives",
    slug: "type",
    title: "Type",
    summary: "The UI face, the mono face and the type scale.",
  },
  {
    section: "primitives",
    slug: "shape",
    title: "Shape and space",
    summary: "Inner radius, frame radius, padding and control height.",
  },
  {
    section: "primitives",
    slug: "icons",
    title: "Icons",
    summary: "Solar icons in the styles the UI uses.",
  },
];

export function findEntry(section: string, slug: string) {
  return entries.find(
    (entry) => entry.section === section && entry.slug === slug
  );
}
