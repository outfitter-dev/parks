# Where the showcase pieces belong

Parks keeps the product layer thin: anything another app could use lives in `@outfitter/parks` (a component) or the registry (a copy-in block), and the showcase demonstrates it with neutral fixtures. This is the inventory of what the showcase holds today and where each piece goes. "Proposed" rows wait on a design call.

| Piece | Where it is | Decision | Why |
| --- | --- | --- | --- |
| Trace, TraceStep | package | core component (done) | Any agent UI lists tool steps. |
| Message | package | core component (done) | Any conversation UI has turns. |
| HaloSignal | package | core component (done) | The loading signal for work in progress, used across surfaces. |
| Stat | package | core component (done) | A stat tile is generic. |
| Ask (stacked, tray) | registry `ask` | block (done) | Composed from Questionnaire; apps tune the layout, so it is copied rather than imported. |
| CodeFrame, CodeBlock | registry `code-block` | block (done) | Depends on Pierre's renderer, which the package should not require. |
| AppFrame, PageBar, SidebarToggle | showcase `demos/app-frame.tsx` | block (proposed) | An app shell every product needs. Before it moves, the narrow sidebar needs to become a modal Sheet so focus moves into it and the page behind is inert. |
| SidebarPanel, SidebarRail | showcase `demos/app-sidebar.tsx` | block with AppFrame (proposed) | Part of the same shell. |
| Needs you queue (AskRow, AskProgress, list and detail) | showcase `demos/compositions.tsx` | block (proposed) | A review queue of asks is generic once rows take `title`, `source` and `age` instead of agent fields. |
| Agents list, Admin versions (VersionRows) | showcase | composition (stays) | Demonstrates Item rows and groups; the data shape is product-specific. |
| AgentModeBadge, Signal (agent modes → tones) | showcase `demos/kit.tsx` | product mapping (stays) | The mapping from a product's states to tones belongs to the product; Parks supplies `Tone`, `Badge` and `StatusDot`. |
| Surfaces: Mission control, Assistant, Skillset, Trails, Docs, Blog | showcase `demos/surfaces` | demos (stay) | Full screens that show the parts together. Their reusable parts are the rows above. |
| Specimen, Viewport | showcase `demos/kit.tsx` | showcase only | Presentation helpers for this site. |
| ReUI file type, icon stack, icon tile, scrollspy, stepper, timeline | showcase `demos/reui` | vendored (stays) | MIT pieces from ReUI used by the demos; port to Base UI before any moves into the package. |
