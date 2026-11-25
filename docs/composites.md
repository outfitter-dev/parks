# Where the showcase pieces belong

Parks keeps the product layer thin: anything another app could use lives in `@outfitter/parks` (a component) or the registry (a copy-in block), and the showcase demonstrates it with neutral fixtures. This is the inventory of what the showcase holds today and where each piece goes.

| Piece | Where it is | Decision | Why |
| --- | --- | --- | --- |
| Trace, TraceStep | package | core component (done) | Any agent UI lists tool steps. |
| Message | package | core component (done) | Any conversation UI has turns. |
| HaloSignal | package | core component (done) | The loading signal for work in progress, used across surfaces. |
| Stat | package | core component (done) | A stat tile is generic. |
| QuestionnaireForm (stacked, tray) | package, registry `questionnaire` | core component | A named question with choices, selection state, keyboard shortcuts and a hint. Part of the Questionnaire family. The `ask` registry entry and `Ask` export remain compatibility aliases. |
| CodeFrame, CodeBlock | registry `code-block` | block (done) | Depends on Pierre's renderer, which the package should not require. |
| AppFrame, PageBar, SidebarToggle | registry `app-shell` | block (done) | An app shell every product needs. Opened over the page on a narrow frame, the sidebar is modal: focus moves in, the page is inert, Escape closes it and focus returns to the toggle. `className` goes on the frame, such as `min-h-svh` when it is the whole page. |
| SidebarPanel, SidebarRail | registry `app-shell` | block (done) | Part of the same shell. Each place takes an `href`, and the account an `accountHref`; `search: false` hides the search control until an app wires one up, and `link` renders the links with the app's own component, such as Next.js's `Link`. |
| QuestionnaireQueue | registry `questionnaire-queue` | block | A queue of questions: rows take `from`, `source` and `age`; choice questions use QuestionnaireForm, others a written reply; Open and Answered views; two screens with QuestionnaireStep progress when narrow. The `ask-queue` entry and `AskQueue` export remain compatibility aliases. The showcase's Needs you composition stays as the design lab for option looks. |
| Agents list, Admin versions (VersionRows) | showcase | composition (stays) | Demonstrates Item rows and groups; the data shape is product-specific. |
| AgentModeBadge, Signal (agent modes → tones) | showcase `demos/kit.tsx` | product mapping (stays) | The mapping from a product's states to tones belongs to the product; Parks supplies `Tone`, `Badge` and `StatusDot`. |
| Surfaces: Mission control, Assistant, Skillset, Trails, Docs, Blog | showcase `demos/surfaces` | demos (stay) | Full screens that show the parts together. Their reusable parts are the rows above. |
| Specimen, Viewport | showcase `demos/kit.tsx` | showcase only | Presentation helpers for this site. |
| ReUI file type, icon stack, icon tile, scrollspy, stepper, timeline | showcase `demos/reui` | vendored (stays) | MIT pieces from ReUI used by the demos; port to Base UI before any moves into the package. |
