// Shared by the packages/parks and workbench colour checks.

/** A colour utility with an opacity modifier, such as bg-foreground/10. Text sizes with a line height (text-xs/5) are not colours. */
export const colourOpacity =
  /\b(?:bg|text|border|ring|fill|stroke|outline|shadow|from|via|to|divide|decoration|caret|accent|placeholder)-(?!(?:xs|sm|base|lg|\d?xl)\/)[a-z][a-z0-9-]*\/\d+\b/g;
