"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@outfitter/parks/components/alert-dialog";
import { Avatar, AvatarFallback } from "@outfitter/parks/components/avatar";
import { Button } from "@outfitter/parks/components/button";
import {
  CommandDialog,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@outfitter/parks/components/command";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@outfitter/parks/components/hover-card";
import { Kbd } from "@outfitter/parks/components/kbd";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@outfitter/parks/components/sheet";
import { Toaster, toast } from "@outfitter/parks/components/toast";
import { TrashBinMinimalisticIcon } from "@solar-icons/react/bold-duotone/trash-bin-minimalistic";
import { BellOffIcon } from "@solar-icons/react/outline/bell-off";
import { HomeIcon } from "@solar-icons/react/outline/home";
import { InboxIcon } from "@solar-icons/react/outline/inbox";
import { RoutingIcon } from "@solar-icons/react/outline/routing";
import { SettingsIcon } from "@solar-icons/react/outline/settings";
import { UsersGroupRoundedIcon } from "@solar-icons/react/outline/users-group-rounded";
import { useEffect, useState } from "react";

import { agents } from "#lib/fixtures";

import { AgentModeBadge, Specimen } from "./kit";

export function OverlaysDemo() {
  // The action runs the change, then closes the dialog.
  const [removing, setRemoving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  return (
    <>
      <Specimen
        title="Alert dialog"
        note="Confirms an action that can't be undone. It has no close button: the person cancels or confirms."
      >
        <AlertDialog open={removing} onOpenChange={setRemoving}>
          <AlertDialogTrigger
            render={<Button tone="destructive" variant="tint" />}
          >
            Remove agent
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Bartram?</AlertDialogTitle>
              <AlertDialogDescription>
                Bartram stops receiving deliveries and leaves every channel. Its
                history stays in the audit log.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Bartram</AlertDialogCancel>
              <AlertDialogAction
                tone="destructive"
                onClick={() => setRemoving(false)}
              >
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <AlertDialog open={deleting} onOpenChange={setDeleting}>
          <AlertDialogTrigger render={<Button variant="secondary" />}>
            Small, with media
          </AlertDialogTrigger>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogMedia className="text-destructive">
                <TrashBinMinimalisticIcon />
              </AlertDialogMedia>
              <AlertDialogTitle>Delete 3 drafts?</AlertDialogTitle>
              <AlertDialogDescription>
                Drafts aren&rsquo;t sent anywhere, so nobody loses a message.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                tone="destructive"
                onClick={() => setDeleting(false)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Specimen>

      <Specimen
        title="Sheet"
        note="A panel from an edge: the phone and tablet nav overlay, or a detail view beside a list."
      >
        {(["right", "left", "bottom"] as const).map((side) => (
          <Sheet key={side}>
            <SheetTrigger render={<Button variant="secondary" />}>
              {side === "right"
                ? "Agent detail"
                : side === "left"
                  ? "Nav overlay"
                  : "From the bottom"}
            </SheetTrigger>
            <SheetContent side={side}>
              <SheetHeader>
                <SheetTitle>Mardy</SheetTitle>
                <SheetDescription>
                  Devin · webhook · last seen 2 min ago
                </SheetDescription>
              </SheetHeader>
              <div className="text-muted-foreground px-4 text-sm">
                Recent deliveries and settings go here.
              </div>
              <SheetFooter>
                <SheetClose render={<Button variant="secondary" />}>
                  Close
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        ))}
      </Specimen>

      <Specimen
        title="Hover card"
        note="A preview of an agent, person or PR on hover, without leaving the page."
      >
        <p className="text-sm">
          Waiting on{" "}
          <HoverCard>
            <HoverCardTrigger
              render={
                <a
                  href="#agent"
                  className="font-medium underline underline-offset-3"
                />
              }
            >
              @mardy
            </HoverCardTrigger>
            <HoverCardContent className="w-64">
              <div className="flex gap-3">
                <Avatar>
                  <AvatarFallback>DO</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="font-medium">Mardy</p>
                  <p className="text-muted-foreground">
                    {agents[0]?.runtime} · {agents[0]?.destination}
                  </p>
                  <AgentModeBadge tone="live" mode="Live" className="w-fit" />
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>{" "}
          to approve the release.
        </p>
      </Specimen>

      <Specimen
        title="Command"
        note="The command palette and quick switcher. Rows share the menu row recipe."
        className="block"
      >
        <Command className="ring-border-muted max-w-md rounded-lg ring-1">
          <PaletteBody />
        </Command>
        <PaletteDialog />
      </Specimen>

      <Specimen
        title="Toast"
        note="Confirms an action without interrupting. Like Alert, only the glyph takes the tone."
      >
        <Toaster />
        <Button
          variant="secondary"
          onClick={() =>
            toast.add({
              type: "success",
              title: "Bartram muted",
              description: "No deliveries until you unmute it.",
            })
          }
        >
          Success
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            toast.add({ type: "info", title: "Routing v12 is live" })
          }
        >
          Info
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            toast.add({ type: "warning", title: "Elevation ends in 2 minutes" })
          }
        >
          Warning
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            toast.add({
              type: "error",
              title: "Delivery failed",
              description: "zion webhook returned 502.",
              actionProps: { children: "Retry", onClick: () => {} },
            })
          }
        >
          Error
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
              loading: { title: "Re-running delivery…" },
              success: { title: "Delivered" },
              error: { title: "Failed" },
            })
          }
        >
          Loading
        </Button>
      </Specimen>
    </>
  );
}

function PaletteBody() {
  return (
    <>
      <CommandInput placeholder="Search or jump to…" />
      <CommandList>
        <CommandEmpty>Nothing matches.</CommandEmpty>
        <CommandGroup heading="Go to">
          <CommandItem>
            <HomeIcon /> Mission control
          </CommandItem>
          <CommandItem>
            <InboxIcon /> Needs you
            <CommandShortcut>G N</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <UsersGroupRoundedIcon /> Agents
            <CommandShortcut>G A</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <RoutingIcon /> Routing
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem>
            <BellOffIcon /> Mute an agent…
          </CommandItem>
          <CommandItem disabled>
            <SettingsIcon /> Elevate to admin
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </>
  );
}

function PaletteDialog() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  return (
    <>
      <Button
        variant="secondary"
        className="mt-3"
        onClick={() => setOpen(true)}
      >
        Open palette <Kbd>⌘K</Kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <PaletteBody />
        </Command>
      </CommandDialog>
    </>
  );
}
