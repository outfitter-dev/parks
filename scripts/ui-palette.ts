/**
 * Writes packages/ui/src/styles/palette.css from packages/ui/src/lib/palette.ts.
 *
 *   bun scripts/ui-palette.ts
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { renderPalette } from "../packages/ui/src/lib/palette";

export const palettePath = join(import.meta.dirname, "../packages/ui/src/styles/palette.css");

if (import.meta.main) {
  writeFileSync(palettePath, renderPalette());
  console.log(`wrote ${palettePath}`);
}
