import type { ComponentType } from "react";
import {
  BadgeDemo,
  ButtonDemo,
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
import { LoadersDemo } from "./loaders";
import { ColorDemo, IconsDemo, ShapeDemo, TypeDemo } from "./primitives";

/** Keyed by `section/slug` from lib/nav.ts. */
export const demos: Record<string, ComponentType> = {
  "compositions/needs-you": NeedsYouComposition,
  "compositions/agents": AgentsComposition,
  "compositions/admin": AdminComposition,
  "compositions/sign-in": SignInComposition,
  "components/button": ButtonDemo,
  "components/badge": BadgeDemo,
  "components/card": CardDemo,
  "components/inputs": InputsDemo,
  "components/tabs": TabsDemo,
  "components/menus": MenusDemo,
  "components/table": TableDemo,
  "components/feedback": FeedbackDemo,
  "components/layout": LayoutDemo,
  "components/loaders": LoadersDemo,
  "primitives/color": ColorDemo,
  "primitives/type": TypeDemo,
  "primitives/shape": ShapeDemo,
  "primitives/icons": IconsDemo,
};
