import { ChatRoundWarningIcon as ChatRoundWarningBold } from "@solar-icons/react/bold/chat-round-warning";
import { HistoryIcon as HistoryBold } from "@solar-icons/react/bold/history";
import { InboxIcon as InboxBold } from "@solar-icons/react/bold/inbox";
import { RoutingIcon as RoutingBold } from "@solar-icons/react/bold/routing";
import { ShieldKeyholeIcon as ShieldKeyholeBold } from "@solar-icons/react/bold/shield-keyhole";
import { UsersGroupRoundedIcon as UsersGroupRoundedBold } from "@solar-icons/react/bold/users-group-rounded";
import { ChatRoundWarningIcon } from "@solar-icons/react/outline/chat-round-warning";
import { HistoryIcon } from "@solar-icons/react/outline/history";
import { InboxIcon } from "@solar-icons/react/outline/inbox";
import { RoutingIcon } from "@solar-icons/react/outline/routing";
import { ShieldKeyholeIcon } from "@solar-icons/react/outline/shield-keyhole";
import { UsersGroupRoundedIcon } from "@solar-icons/react/outline/users-group-rounded";

import { asks } from "#lib/fixtures";

import type { AppNavigation } from "./app-sidebar";

export const sequoiaNavigation = {
  name: "Sequoia",
  mark: "O",
  account: "Muir",
  items: [
    {
      id: "needs-you",
      label: "Needs you",
      icon: ChatRoundWarningIcon,
      solid: ChatRoundWarningBold,
      count: asks.length,
    },
    {
      id: "inbox",
      label: "Inbox",
      icon: InboxIcon,
      solid: InboxBold,
      dot: true,
    },
    {
      id: "agents",
      label: "Agents",
      icon: UsersGroupRoundedIcon,
      solid: UsersGroupRoundedBold,
      count: 5,
    },
    { id: "routing", label: "Routing", icon: RoutingIcon, solid: RoutingBold },
    {
      id: "history",
      label: "History",
      icon: HistoryIcon,
      solid: HistoryBold,
      count: 128,
    },
    {
      id: "admin",
      label: "Admin",
      icon: ShieldKeyholeIcon,
      solid: ShieldKeyholeBold,
    },
  ],
} satisfies AppNavigation;
