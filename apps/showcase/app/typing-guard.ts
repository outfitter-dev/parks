/**
 * Inline script for the document head that keeps typing inside shadow roots
 * away from page-wide keyboard shortcuts.
 *
 * Agentation's note box lives in a shadow root. A shortcut listener outside it
 * sees the shadow host as the event target, concludes nobody is typing, and
 * swallows keys such as `c` (the Vercel preview toolbar's comment shortcut is
 * one such listener). This runs first, in the capture phase on `window`, and
 * stops plain printable keys aimed at an editable field inside a shadow root
 * before any later listener sees them. Stopping propagation does not cancel
 * the key's default action, so the character still lands in the field.
 * Enter, Escape and modified keys pass through untouched.
 */
export const typingGuard = `(() => {
  const editable = (node) =>
    node instanceof HTMLElement &&
    (node.tagName === "TEXTAREA" || node.tagName === "INPUT" || node.isContentEditable);
  window.addEventListener("keydown", (event) => {
    if (event.key.length !== 1 || event.metaKey || event.ctrlKey || event.altKey) return;
    const origin = event.composedPath()[0];
    if (origin !== event.target && editable(origin)) event.stopImmediatePropagation();
  }, true);
})();`;
