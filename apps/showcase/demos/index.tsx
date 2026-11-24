import { ButtonDemo } from "./button";
import type { ComponentType } from "react";
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
import { BreadcrumbDemo } from "./breadcrumb";
import { DisclosureDemo, GroupsDemo } from "./disclosure";
import { FormsDemo } from "./forms";
import { OverlaysDemo } from "./overlays";
import {
  AdminComposition,
  AgentsComposition,
  NeedsYouComposition,
  SignInComposition,
} from "./compositions";
import { AssistantSurface } from "./surfaces/assistant";
import { BlogSurface } from "./surfaces/blog";
import { BoardSurface } from "./surfaces/board";
import { DocsSurface } from "./surfaces/docs";
import { SkillsetSurface } from "./surfaces/skillset";
import { TrailsSurface } from "./surfaces/trails";
import { IconsDemo } from "./icons";
import { ColorDemo, ShapeDemo, TypeDemo } from "./primitives";

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
  "components/feedback": FeedbackDemo,
  "components/layout": LayoutDemo,
  "components/disclosure": DisclosureDemo,
  "components/groups": GroupsDemo,
  "primitives/color": ColorDemo,
  "primitives/type": TypeDemo,
  "primitives/shape": ShapeDemo,
  "primitives/icons": IconsDemo,
};
