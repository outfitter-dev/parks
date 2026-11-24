/**
 * The Parks source rules: what an app's components may write in class names
 * so they stay on the theme in light and dark. Each rule finds offending
 * text; `checkSource` reports it with a line number. A line can opt out of
 * one rule with a `parks-ignore <rule>` comment on it or on the line above,
 * with a reason after the rule name.
 */

type Rule = {
  id: string;
  message: string;
  find: (text: string) => Iterable<{ index: number; match: string }>;
};

type Violation = {
  rule: string;
  message: string;
  line: number;
  match: string;
};

function matches(pattern: RegExp) {
  return function* find(text: string) {
    for (const found of text.matchAll(pattern)) {
      yield { index: found.index, match: found[0] };
    }
  };
}

/** A colour utility with an opacity modifier, such as bg-foreground/10. Text sizes with a line height (text-xs/5) are not colours. */
const colourOpacity =
  /\b(?:bg|text|border|ring|fill|stroke|outline|shadow|from|via|to|divide|decoration|caret|accent|placeholder)-(?!(?:xs|sm|base|lg|\d?xl)\/)[a-z][a-z0-9-]*\/\d+\b/gu;

const paletteNames =
  "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose";

const lengthUnit = String.raw`\d+(?:\.\d+)?(?:px|rem|em|ch|ex|vw|vh|vmin|vmax|pt|pc|cm|mm|in)\b`;
const lengthInBrackets = new RegExp(
  String.raw`\[[^\]\n]*${lengthUnit}[^\]\n]*\]`,
  "gu"
);
const hairline = new Set(["1px", "2px"]);

/**
 * Bracketed lengths other than 1px and 2px hairlines.
 * @yields {{ index: number; match: string }} each offending bracket value
 */
function* literalLengths(text: string) {
  for (const found of text.matchAll(lengthInBrackets)) {
    const lengths = found[0].match(new RegExp(lengthUnit, "gu")) ?? [];
    if (lengths.some((length) => !hairline.has(length))) {
      yield { index: found.index, match: found[0] };
    }
  }
}

/** A Button's opening tag, allowing JSX-valued props such as render={<a />}. */
const buttonTag = /<Button\b(?:[^>{]|\{(?:[^{}]|\{[^{}]*\})*\})*>/gu;
const nearby = 400;

function variantOf(tag: string) {
  return /\bvariant=(?:\{\s*)?["'`]([a-z-]+)["'`]/u.exec(tag)?.[1];
}

/** Partners an outline Button may stand beside: solid (and its aliases) or secondary. */
const partners = new Set([
  undefined,
  "solid",
  "default",
  "destructive",
  "secondary",
]);

/**
 * An outline Button with no solid or secondary Button near it.
 * @yields {{ index: number; match: string }} each lone outline Button tag
 */
function* loneOutlineButtons(text: string) {
  const tags = Array.from(text.matchAll(buttonTag), (found) => ({
    index: found.index,
    tag: found[0],
    variant: variantOf(found[0]),
  }));
  for (const { index, tag, variant } of tags) {
    if (variant !== "outline") {
      continue;
    }
    const paired = tags.some(
      (other) =>
        other.index !== index &&
        Math.abs(other.index - index) < nearby &&
        partners.has(other.variant)
    );
    if (!paired) {
      yield { index, match: tag };
    }
  }
}

const colourFunctions = /\b(?:oklch|oklab|lab|lch|hsla?|hwb|rgba?|color)\(/giu;
/** A hex colour, but not a fragment link or id such as href="#add". */
const hexColour =
  /(?<!(?:href|to|id|src|htmlFor|aria-[a-z]+)=["'`])(?<![\w&/])#[0-9a-f]{3,8}\b(?![\w-])/giu;
/** A named colour as a style value: color: "red". */
const namedColour =
  /\b(?:color|background|backgroundColor|borderColor|outlineColor|fill|stroke)\s*:\s*["'`](?!var\(|currentColor|transparent|inherit|initial|unset)[a-z]+["'`]/giu;

function* literalColours(text: string) {
  for (const pattern of [colourFunctions, hexColour, namedColour]) {
    for (const found of text.matchAll(pattern)) {
      yield { index: found.index, match: found[0] };
    }
  }
}

const rules: readonly Rule[] = [
  {
    id: "colour-opacity",
    message:
      "Use a translucent colour role (fill-subtle, border-muted, …) instead of a /NN opacity.",
    find: matches(colourOpacity),
  },
  {
    id: "dark-variant",
    message:
      "Put light and dark values in one token with light-dark(); don't restate colours under dark:.",
    find: matches(/\bdark:[^\s"'`]+/gu),
  },
  {
    id: "literal-colour",
    message: "Use a colour role, not a literal colour.",
    find: literalColours,
  },
  {
    id: "palette-colour",
    message: "Use a colour role, not a palette step such as red-500.",
    find: matches(
      new RegExp(
        String.raw`\b(?:bg|text|border|ring|fill|stroke|outline|shadow|from|via|to|divide|decoration|caret|accent|placeholder)-(?:white|black|(?:${paletteNames})-\d+)\b`,
        "gu"
      )
    ),
  },
  {
    id: "literal-length",
    message:
      "Use the Tailwind scale or a token; only 1px and 2px hairlines may be literal.",
    find: literalLengths,
  },
  {
    id: "lone-outline-button",
    message:
      'Pair an outline Button with a solid one, or use variant="secondary" on its own.',
    find: loneOutlineButtons,
  },
];

function lineOf(text: string, index: number) {
  let line = 1;
  for (let at = 0; at < index; at += 1) {
    if (text.codePointAt(at) === 10) {
      line += 1;
    }
  }
  return line;
}

function ignored(lines: readonly string[], line: number, rule: string) {
  const marker = new RegExp(String.raw`parks-ignore\s+${rule}\b`, "u");
  return (
    marker.test(lines[line - 1] ?? "") || marker.test(lines[line - 2] ?? "")
  );
}

// Strings come first in the alternation, so a `//` inside one (a URL) isn't read as a comment.
const stringOrComment =
  /"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`|\/\*[\s\S]*?\*\/|\/\/[^\n]*/gu;

/** Replaces comments with spaces, keeping offsets and line breaks, so prose in comments is not checked. */
function withoutComments(text: string) {
  return text.replaceAll(stringOrComment, (found) =>
    found.startsWith("/") ? found.replaceAll(/[^\n]/gu, " ") : found
  );
}

/** Every rule violation in one file's text, with its line. */
function checkSource(text: string, only?: readonly string[]): Violation[] {
  const lines = text.split("\n");
  const code = withoutComments(text);
  const active = only ? rules.filter((rule) => only.includes(rule.id)) : rules;
  const found: Violation[] = [];
  for (const rule of active) {
    for (const { index, match } of rule.find(code)) {
      const line = lineOf(text, index);
      if (!ignored(lines, line, rule.id)) {
        found.push({ rule: rule.id, message: rule.message, line, match });
      }
    }
  }
  return found.toSorted((a, b) => a.line - b.line);
}

export { checkSource, colourOpacity, rules };
export type { Rule, Violation };
