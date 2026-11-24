import * as React from "react"
import { GitBranchIcon } from "@solar-icons/react/outline/git-branch"
import { GitCommitIcon } from "@solar-icons/react/outline/git-commit"
import { GitPullRequestIcon } from "@solar-icons/react/outline/git-pull-request"
import { cnState } from "#lib/utils"

const glyphs = {
  pr: GitPullRequestIcon,
  branch: GitBranchIcon,
  commit: GitCommitIcon,
} as const

/** Where the referenced change stands. The glyph carries the colour; the text stays neutral. */
type CodeRefState = "open" | "draft" | "merged" | "closed" | "failing"

const stateColor: Record<CodeRefState, string> = {
  open: "text-success-strong",
  draft: "text-muted-foreground",
  merged: "text-merged-strong",
  closed: "text-muted-foreground",
  failing: "text-destructive-strong",
}

/**
 * An inline reference to a pull request, branch or commit, such as `repo#47`:
 * medium-weight text with a leading glyph that shows its state.
 *
 * @example
 * <CodeRef kind="pr" state="open">repo#47</CodeRef>
 */
function CodeRef({
  kind = "pr",
  state,
  className,
  children,
  ...props
}: React.ComponentProps<"span"> & {
  kind?: keyof typeof glyphs
  state?: CodeRefState
}) {
  const Glyph = glyphs[kind]
  return (
    <span
      data-slot="code-ref"
      data-state={state}
      className={cnState(
        "inline-flex items-baseline gap-1 font-medium whitespace-nowrap text-muted-foreground",
        className
      )}
      {...props}
    >
      <Glyph
        aria-hidden
        className={cnState(
          "size-3.5 shrink-0 self-center",
          state ? stateColor[state] : "text-muted-foreground"
        )}
      />
      {children}
    </span>
  )
}

export { CodeRef, type CodeRefState }
