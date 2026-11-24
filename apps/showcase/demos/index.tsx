import type { ComponentType } from "react";

import { BreadcrumbDemo } from "./breadcrumb";
import { ButtonDemo } from "./button";
import {
  BadgeDemo,
  CardDemo,
  FeedbackDemo,
  InputsDemo,
  LayoutDemo,
  MenusDemo,
  TableDemo,
  TabsDemo,
} from "./components";
import {
  AdminComposition,
  AgentsComposition,
  NeedsYouComposition,
  SignInComposition,
} from "./compositions";
import {
  AttachmentDemo,
  ProseDemo,
  QuestionnaireDemo,
  ResizableDemo,
  TraceDemo,
} from "./content";
import { DataTableDemo } from "./data-table";
import { DisclosureDemo, GroupsDemo } from "./disclosure";
import { FormsDemo } from "./forms";
import { IconsDemo } from "./icons";
import { OverlaysDemo } from "./overlays";
import { ColorDemo, ShapeDemo, TypeDemo } from "./primitives";
import { AssistantSurface } from "./surfaces/assistant";
import { BlogSurface } from "./surfaces/blog";
import { BoardSurface } from "./surfaces/board";
import { DocsSurface } from "./surfaces/docs";
import { SkillsetSurface } from "./surfaces/skillset";
import { TrailsSurface } from "./surfaces/trails";

/** Keyed by `section/slug` from lib/nav.ts. */
export const demos: Record<string, ComponentType> = {
  "compositions/needs-you": NeedsYouComposition,
  "compositions/agents": AgentsComposition,
  "compositions/admin": AdminComposition,
  "compositions/sign-in": SignInComposition,
  "surfaces/board": BoardSurface,
  "surfaces/assistant": AssistantSurface,
  "surfaces/skillset": SkillsetSurface,
  "surfaces/trails": TrailsSurface,
  "surfaces/docs": DocsSurface,
  "surfaces/blog": BlogSurface,
  "components/button": ButtonDemo,
  "components/badge": BadgeDemo,
  "components/breadcrumb": BreadcrumbDemo,
  "components/card": CardDemo,
  "components/inputs": InputsDemo,
  "components/forms": FormsDemo,
  "components/tabs": TabsDemo,
  "components/menus": MenusDemo,
  "components/overlays": OverlaysDemo,
  "components/table": TableDemo,
  "components/data-table": DataTableDemo,
  "components/questionnaire": QuestionnaireDemo,
  "components/trace": TraceDemo,
  "components/attachment": AttachmentDemo,
  "components/resizable": ResizableDemo,
  "components/prose": ProseDemo,
  "components/feedback": FeedbackDemo,
  "components/layout": LayoutDemo,
  "components/disclosure": DisclosureDemo,
  "components/groups": GroupsDemo,
  "primitives/color": ColorDemo,
  "primitives/type": TypeDemo,
  "primitives/shape": ShapeDemo,
  "primitives/icons": IconsDemo,
};
