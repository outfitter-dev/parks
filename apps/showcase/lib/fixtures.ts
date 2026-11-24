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
  { name: "Donna", runtime: "Devin", mode: "Live", tone: "live", destination: "webhook · devin", seen: "2 min ago" },
  { name: "Rex", runtime: "exe.dev", mode: "Dry run", tone: "wait", destination: "board · #forge", seen: "14 min ago" },
  { name: "Ranger lead", runtime: "Claude Code", mode: "Live", tone: "live", destination: "mcp inbox", seen: "1 hr ago" },
  { name: "Forge lead", runtime: "Claude Code", mode: "Failing", tone: "alert", destination: "webhook · forge", seen: "3 hr ago" },
  { name: "Climb lead", runtime: "Codex", mode: "Off", tone: "off", destination: "none", seen: "Yesterday" },
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
    agent: "Donna",
    kind: "approval",
    title: "Merge outpost#47 once CI is green?",
    project: "outpost",
    age: "4 min",
    context: "All review threads are resolved. CI is running its last job.",
    options: [
      { label: "Approve", detail: "Merge when the last check passes.", recommended: true },
      { label: "Hold", detail: "Leave it open for you to look at." },
    ],
  },
  {
    id: "a2",
    agent: "Ranger lead",
    kind: "choice",
    title: "Run the v5 vs v6 held-out comparison?",
    project: "ranger",
    age: "1 hr",
    context: "Needs about 2.5M fresh tokens. The cap set in RNG-40 was 1.5M.",
    options: [
      { label: "Run it", detail: "Spend up to 2.5M tokens." },
      { label: "Half the set", detail: "Stay under the 1.5M cap.", recommended: true },
      { label: "Skip", detail: "Keep v5 for now." },
    ],
  },
  {
    id: "a3",
    agent: "Forge lead",
    kind: "input",
    title: "Which runner should the trusted-install check use?",
    project: "forge",
    age: "3 hr",
    context: "forge#53 is through three review rounds. The open question is the runner image.",
    options: [{ label: "Reply", detail: "Answer in the thread." }],
  },
];

export const versions = [
  { version: 14, author: "Matt", change: "Mute Rex outside work hours", when: "Today, 9:41 PM" },
  { version: 13, author: "Donna", change: "Add the devin webhook route", when: "Today, 6:02 PM" },
  { version: 12, author: "Matt", change: "Move Forge asks to #forge", when: "Yesterday" },
];
