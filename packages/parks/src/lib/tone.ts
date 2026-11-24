/**
 * The colour a component speaks in, separate from how loudly it speaks.
 *
 * `tone` picks the hue role (neutral, info, success, warning, destructive,
 * brand, merged). A component's `variant` picks emphasis: a soft tint, a
 * solid fill, an outline, plain text. Components set `data-tone` and read
 * the `--tone-*` roles in globals.css, so any tone pairs with any variant
 * without a compound class for each pair.
 *
 * @example
 * <Badge tone="success">Merged</Badge>
 * <Badge tone="warning" variant="solid">Blocked</Badge>
 * <Button tone="destructive" variant="tint">Delete</Button>
 */
export const tones = ["neutral", "info", "success", "warning", "destructive", "brand", "merged"] as const

export type Tone = (typeof tones)[number]

export function isTone(value: unknown): value is Tone {
  return typeof value === "string" && (tones as readonly string[]).includes(value)
}
