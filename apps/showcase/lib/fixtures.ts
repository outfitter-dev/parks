/** Made-up data for the workbench. Nothing here comes from a live Board. */

export type Tone = "live" | "wait" | "off" | "alert";

export const agents: {
  name: string;
  runtime: string;
  mode: string;
  tone: Tone;
  destination: string;
  seen: string;
}[] = [
  {
    name: "Mardy",
    runtime: "Devin",
    mode: "Live",
    tone: "live",
    destination: "webhook · devin",
    seen: "2 min ago",
  },
  {
    name: "Bartram",
    runtime: "exe.dev",
    mode: "Dry run",
    tone: "wait",
    destination: "board · #zion",
    seen: "14 min ago",
  },
  {
    name: "Yosemite lead",
    runtime: "Claude Code",
    mode: "Live",
    tone: "live",
    destination: "mcp inbox",
    seen: "1 hr ago",
  },
  {
    name: "Zion lead",
    runtime: "Claude Code",
    mode: "Failing",
    tone: "alert",
    destination: "webhook · zion",
    seen: "3 hr ago",
  },
  {
    name: "Denali lead",
    runtime: "Codex",
    mode: "Off",
    tone: "off",
    destination: "none",
    seen: "Yesterday",
  },
];

export type Ask = {
  id: string;
  agent: string;
  kind: "approval" | "choice" | "input";
  title: string;
  project: string;
  age: string;
  context: string;
  options: { label: string; detail: string; recommended?: boolean }[];
};

export const asks: Ask[] = [
  {
    id: "a1",
    agent: "Mardy",
    kind: "approval",
    title: "Merge sequoia#47 once CI is green?",
    project: "sequoia",
    age: "4 min",
    context: "All review threads are resolved. CI is running its last job.",
    options: [
      {
        label: "Approve",
        detail: "Merge when the last check passes.",
        recommended: true,
      },
      { label: "Hold", detail: "Leave it open for you to look at." },
    ],
  },
  {
    id: "a2",
    agent: "Yosemite lead",
    kind: "choice",
    title: "Run the v5 vs v6 held-out comparison?",
    project: "yosemite",
    age: "1 hr",
    context: "Needs about 2.5M fresh tokens. The cap set last week was 1.5M.",
    options: [
      { label: "Run it", detail: "Spend up to 2.5M tokens." },
      {
        label: "Half the set",
        detail: "Stay under the 1.5M cap.",
        recommended: true,
      },
      { label: "Skip", detail: "Keep v5 for now." },
    ],
  },
  {
    id: "a3",
    agent: "Zion lead",
    kind: "input",
    title: "Which runner should the trusted-install check use?",
    project: "zion",
    age: "3 hr",
    context:
      "zion#53 is through three review rounds. The open question is the runner image.",
    options: [{ label: "Reply", detail: "Answer in the thread." }],
  },
];

export const versions = [
  {
    version: 14,
    author: "Muir",
    change: "Mute Bartram outside work hours",
    when: "Today, 9:41 PM",
  },
  {
    version: 13,
    author: "Mardy",
    change: "Add the devin webhook route",
    when: "Today, 6:02 PM",
  },
  {
    version: 12,
    author: "Muir",
    change: "Move Zion asks to #zion",
    when: "Yesterday",
  },
];
