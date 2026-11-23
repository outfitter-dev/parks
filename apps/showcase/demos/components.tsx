"use client";

import { Alert, AlertDescription, AlertMeta, AlertTitle } from "@workspace/ui/components/alert";
import { CodeRef } from "@workspace/ui/components/code-ref";
import { Avatar, AvatarFallback, AvatarGroup } from "@workspace/ui/components/avatar";
import { Fragment } from "react";
import { Item, ItemContent, ItemGroup, ItemMeta, ItemTitle } from "@workspace/ui/components/item";
import { Badge } from "@workspace/ui/components/badge";
import { Mark } from "@workspace/ui/components/mark";
import { StatusDot } from "@workspace/ui/components/status-dot";
import { tones } from "@workspace/ui/lib/tone";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Separator } from "@workspace/ui/components/separator";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardLead,
  CardMeta,
  CardTitle,
} from "@workspace/ui/components/card";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Input } from "@workspace/ui/components/input";
import { Kbd, KbdGroup } from "@workspace/ui/components/kbd";
import { Label } from "@workspace/ui/components/label";
import { Progress } from "@workspace/ui/components/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Spinner } from "@workspace/ui/components/spinner";
import { Switch } from "@workspace/ui/components/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Textarea } from "@workspace/ui/components/textarea";
import { Toggle } from "@workspace/ui/components/toggle";
import { ToggleGroup, ToggleGroupItem } from "@workspace/ui/components/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/ui/components/tooltip";
import { BellOffIcon } from "@solar-icons/react/outline/bell-off";
import { CheckCircleIcon } from "@solar-icons/react/outline/check-circle";
import { DangerCircleIcon } from "@solar-icons/react/outline/danger-circle";
import { DangerTriangleIcon } from "@solar-icons/react/outline/danger-triangle";
import { InfoCircleIcon } from "@solar-icons/react/outline/info-circle";
import { PenIcon } from "@solar-icons/react/outline/pen";
import { RefreshIcon as RefreshBoldIcon } from "@solar-icons/react/bold/refresh";
import { TrashBinMinimalisticIcon } from "@solar-icons/react/outline/trash-bin-minimalistic";
import { agents } from "#lib/fixtures";
import { AgentModeBadge, HaloSignal, Specimen } from "./kit";

const badgeEmphases = ["tint", "solid", "outline", "plain"] as const;

export function BadgeDemo() {
  return (
    <>
      <Specimen title="Tones" note="`tone` is the colour; the default emphasis is a soft tint with matching text and no edge. Neutral is the default tone.">
        <Badge>Dry run</Badge>
        <Badge variant="surface" shape="pill">Approval</Badge>
        <Badge tone="info">Queued</Badge>
        <Badge tone="success">Live</Badge>
        <Badge tone="warning">Waiting</Badge>
        <Badge tone="destructive">Failed</Badge>
        <Badge tone="brand">Outfitter</Badge>
        <Badge tone="merged">Merged</Badge>
      </Specimen>
      <Specimen title="Tone and emphasis" note="`variant` is emphasis only, so every tone takes every variant: tint, solid, outline and plain.">
        <div className="grid grid-cols-[auto_repeat(4,auto)] items-center justify-start gap-x-3 gap-y-2 text-xs text-muted-foreground">
          <span />
          {badgeEmphases.map((variant) => <span key={variant}>{variant}</span>)}
          {tones.map((tone) => (
            <Fragment key={tone}>
              <span>{tone}</span>
              {badgeEmphases.map((variant) => (
                <span key={variant}><Badge tone={tone} variant={variant} dot>{tone}</Badge></span>
              ))}
            </Fragment>
          ))}
        </div>
      </Specimen>
      <Specimen title="Status dot" note="StatusDot is the one status dot: badges, nav rows and lists all draw it. Neutral is quieter than its text; `live` pulses.">
        {tones.map((tone) => <StatusDot key={tone} tone={tone} label={tone} />)}
        <StatusDot tone="success" live label="Live" />
        <StatusDot tone="info" size="xs" />
        <StatusDot tone="info" size="md" />
      </Specimen>
      <Specimen title="Mark" note="Mark is the glyph tile: brand marks, option tiles, step numbers and the icon above an empty state. Tint by default; `selected` turns it solid.">
        <div className="flex flex-col gap-3">
          {(["tint", "solid"] as const).map((variant) => (
            <div key={variant} className="flex flex-wrap items-center gap-2">
              {tones.map((tone) => <Mark key={tone} tone={tone} variant={variant}>{tone.slice(0, 1).toUpperCase()}</Mark>)}
            </div>
          ))}
          <div className="flex flex-wrap items-center gap-2">
            <Mark size="sm">1</Mark>
            <Mark size="md">2</Mark>
            <Mark size="lg" shape="circle">3</Mark>
            <Mark tone="brand" size="xl" shape="circle">O</Mark>
            <Mark tone="success" selected>A</Mark>
          </div>
        </div>
      </Specimen>
      <Specimen
        title="Status"
        note="Rectangular badges with dots use the same side padding as text-only badges. A neutral dot is lighter than its label."
      >
        <Badge dot>Off</Badge>
        <Badge tone="info" live>Running</Badge>
        <Badge tone="success" dot>In sync</Badge>
        <Badge tone="warning" dot>Needs you</Badge>
        <Badge tone="destructive" dot>Failing</Badge>
        <Badge icon={<HaloSignal label="Working" />}>Working</Badge>
      </Specimen>
      <Specimen title="Live" note="The dot gives off a soft halo while something runs. Reduced motion stops it.">
        <Badge tone="success" live>Live</Badge>
        <Badge tone="info" live>Deploying</Badge>
        <Badge tone="destructive" live>Recording</Badge>
      </Specimen>
      <Specimen title="Counts" note="Plain and filled counts share the same sizing. Above the cap, the count reads 99+.">
        <Badge count={3} />
        <Badge tone="info" count={12} />
        <Badge tone="destructive" count={128} />
        <Badge variant="plain" shape="rect" count={7} />
        <Badge tone="success" shape="rect" count={7} />
      </Specimen>
      <Specimen
        title="Shape"
        note="A rounded rectangle by default, so it sits quietly beside other corners. In a card's corner it becomes a pill that shares the corner's centre."
      >
        <Badge tone="success" dot>Rectangle</Badge>
        <Badge tone="success" dot shape="pill">Pill</Badge>
      </Specimen>
      <Specimen
        title="With a ring"
        note="For a busy surface, `ring` adds a 1px ring in the badge's own tone."
      >
        <div className="flex flex-wrap items-center gap-2 rounded-lg bg-muted p-3">
          <Badge ring>Dry run</Badge>
          <Badge tone="success" ring live>Live</Badge>
          <Badge tone="warning" ring dot>Needs you</Badge>
          <Badge tone="destructive" ring>Failed</Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2 rounded-lg bg-muted p-3">
          <Badge>Dry run</Badge>
          <Badge tone="success" live>Live</Badge>
          <Badge tone="warning" dot>Needs you</Badge>
          <Badge tone="destructive">Failed</Badge>
        </div>
      </Specimen>
    </>
  );
}

export function CardDemo() {
  return (
    <>
      <Specimen
        title="Concentric corners"
        note="Pieces at a corner share its centre. A single row in the middle takes the flatter field radius."
        className="block"
      >
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Donna</CardTitle>
            <CardDescription>Devin · overnight PR backlog</CardDescription>
            <CardAction>
              <Badge tone="success" live>Live</Badge>
            </CardAction>
          </CardHeader>
          <CardContent>
            <Item variant="muted" size="xs" className="panel">
              <ItemContent>
                <ItemTitle className="font-normal">Destination</ItemTitle>
              </ItemContent>
              <ItemMeta className="font-mono">webhook · devin</ItemMeta>
            </Item>
          </CardContent>
          <CardFooter>
            <Button variant="ghost">Mute</Button>
            <Button>Open</Button>
          </CardFooter>
        </Card>
      </Specimen>
      <Specimen title="Header slots" note="Lead, title, description, meta and actions, in one grid shared with Dialog and Popover. Empty slots take no room." className="block">
        <Card className="max-w-md">
          <CardHeader>
            <CardLead><Mark size="lg">D</Mark></CardLead>
            <CardTitle>Donna</CardTitle>
            <CardDescription>Devin · overnight PR backlog</CardDescription>
            <CardMeta>2 min ago</CardMeta>
            <CardAction>
              <Button variant="ghost" size="sm">Mute</Button>
              <Button size="sm">Open</Button>
            </CardAction>
          </CardHeader>
        </Card>
      </Specimen>
      <Specimen title="Variants" note="Raised by default; outline for dense cards in a list; filled for stat tiles; tray to hold other cards with concentric corners." className="block">
        <div className="grid max-w-3xl gap-4 sm:grid-cols-3">
          <Card size="sm">
            <CardHeader><CardTitle>Raised</CardTitle><CardDescription>The default.</CardDescription></CardHeader>
          </Card>
          <Card variant="outline" size="sm">
            <CardHeader><CardTitle>Outline</CardTitle><CardDescription>An edge, no shadow.</CardDescription></CardHeader>
          </Card>
          <Card variant="filled" size="sm">
            <CardHeader><CardTitle>Filled</CardTitle><CardDescription>A panel fill, no edge.</CardDescription></CardHeader>
          </Card>
        </div>
        <Card variant="tray" className="mt-4 grid max-w-3xl gap-1.5 sm:grid-cols-3">
          {["Webhook", "Board thread", "MCP inbox"].map((label, index) => (
            <Card key={label} size="sm" render={<button type="button" />} selected={index === 0}>
              <CardHeader><CardTitle>{label}</CardTitle><CardDescription>{index === 0 ? "Selected" : "Interactive"}</CardDescription></CardHeader>
            </Card>
          ))}
        </Card>
      </Specimen>
      <Specimen title="Sizes" note="Small, default and large pad differently; the radius follows the padding." className="block">
        <div className="grid max-w-3xl items-start gap-4 sm:grid-cols-3">
          {(["sm", "default", "lg"] as const).map((size) => (
            <Card key={size} size={size}>
              <CardHeader>
                <CardTitle>3 asks waiting</CardTitle>
                <CardDescription>{size === "default" ? "Default" : size === "sm" ? "Small" : "Large"}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Specimen>
    </>
  );
}

const destinations = [
  { value: "webhook", label: "Webhook" },
  { value: "board", label: "Board thread" },
  { value: "mcp", label: "MCP inbox" },
];

export function InputsDemo() {
  return (
    <>
      <Specimen title="Text fields" note="Labels and hints start where the input text starts." className="grid max-w-md grid-cols-1 items-stretch">
        <div className="grid gap-1.5">
          <Label htmlFor="agent-name" className="ps-field">Agent name</Label>
          <Input id="agent-name" placeholder="donna" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="agent-url" className="ps-field">Webhook URL</Label>
          <Input id="agent-url" aria-invalid defaultValue="http://not-https.example" />
          <p className="field-hint text-destructive">Use an https URL.</p>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="agent-note" className="ps-field">Note</Label>
          <Textarea id="agent-note" placeholder="What this agent is for" />
        </div>
      </Specimen>
      <Specimen title="Select">
        <Select items={destinations} defaultValue="webhook">
          <SelectTrigger className="w-48" aria-label="Destination">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {destinations.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Specimen>
      <Specimen title="Checkbox and switch">
        <Label className="gap-2">
          <Checkbox defaultChecked /> Wake on mentions
        </Label>
        <Label className="gap-2">
          <Checkbox /> Digest instead
        </Label>
        <Label className="gap-2">
          <Switch defaultChecked /> Live delivery
        </Label>
        <Label className="gap-2">
          <Switch disabled /> Locked by admin
        </Label>
      </Specimen>
    </>
  );
}

export function TabsDemo() {
  return (
    <>
      <Specimen title="Tabs" className="block">
        <Tabs defaultValue="asks">
          <TabsList>
            <TabsTrigger value="asks">Asks</TabsTrigger>
            <TabsTrigger value="inbox">Inbox</TabsTrigger>
            <TabsTrigger value="runs">Runs</TabsTrigger>
          </TabsList>
          <TabsContent value="asks" className="pt-3 text-muted-foreground">
            Three asks are waiting.
          </TabsContent>
          <TabsContent value="inbox" className="pt-3 text-muted-foreground">
            Nothing new since this morning.
          </TabsContent>
          <TabsContent value="runs" className="pt-3 text-muted-foreground">
            Two runs in progress.
          </TabsContent>
        </Tabs>
      </Specimen>
      <Specimen title="Line tabs" className="block">
        <Tabs defaultValue="overview">
          <TabsList variant="line">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="routing">Routing</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
        </Tabs>
      </Specimen>
      <Specimen title="Segmented control" note="ToggleGroup's default look, drawn the same as TabsList. Use it to switch a filter or view; use Tabs when each choice has a panel.">
        <ToggleGroup aria-label="Show" defaultValue={["all"]}>
          <ToggleGroupItem value="all">All</ToggleGroupItem>
          <ToggleGroupItem value="mine">Mine</ToggleGroupItem>
          <ToggleGroupItem value="agents">Agents</ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup aria-label="Show" size="sm" defaultValue={["open"]}>
          <ToggleGroupItem value="open">Open</ToggleGroupItem>
          <ToggleGroupItem value="answered">Answered</ToggleGroupItem>
        </ToggleGroup>
      </Specimen>
      <Specimen title="Toggle beside Button" note="A Toggle is a Button that stays pressed: same sizes, shapes and emphasis, plus the pressed fill.">
        <Button variant="ghost" size="sm">
          <PenIcon data-icon="inline-start" />
          Button
        </Button>
        <Toggle size="sm">
          <PenIcon data-icon="inline-start" />
          Toggle
        </Toggle>
        <Toggle size="sm" defaultPressed>
          <PenIcon data-icon="inline-start" />
          Pressed
        </Toggle>
        <Button variant="outline" size="sm">Button</Button>
        <Toggle variant="outline" size="sm">Toggle</Toggle>
        <Toggle variant="outline" size="sm" defaultPressed>Pressed</Toggle>
        <Toggle size="icon-sm" aria-label="Mute">
          <BellOffIcon />
        </Toggle>
        <Toggle size="icon-sm" aria-label="Mute" defaultPressed>
          <BellOffIcon />
        </Toggle>
      </Specimen>
      <Specimen title="Toolbar toggles" note="ghost, outline or secondary: separate toggles, spaced, for a toolbar.">
        <ToggleGroup variant="outline" size="icon-sm" shape="rect" multiple defaultValue={["pen"]} aria-label="Tools">
          <ToggleGroupItem value="pen" aria-label="Edit">
            <PenIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="mute" aria-label="Mute">
            <BellOffIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="info" aria-label="Info">
            <InfoCircleIcon />
          </ToggleGroupItem>
        </ToggleGroup>
      </Specimen>
    </>
  );
}

export function MenusDemo() {
  return (
    <>
      <Specimen title="Dropdown menu">
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" />}>Agent actions</DropdownMenuTrigger>
          <DropdownMenuContent className="w-52">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Donna</DropdownMenuLabel>
              <DropdownMenuItem>
                <PenIcon /> Edit
                <DropdownMenuShortcut>E</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BellOffIcon /> Mute
                <DropdownMenuShortcut>M</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem tone="destructive">
              <TrashBinMinimalisticIcon /> Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Specimen>
      <Specimen title="Dialog">
        <Dialog>
          <DialogTrigger render={<Button tone="destructive" variant="tint" />}>Revoke credential</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Revoke Donna&rsquo;s credential?</DialogTitle>
              <DialogDescription>
                Donna stops receiving deliveries at once. You can issue a new credential later.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>Keep it</DialogClose>
              <Button tone="destructive" variant="tint">Revoke</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Specimen>
      <Specimen title="Tooltip">
        <Tooltip>
          <TooltipTrigger render={<Button variant="ghost" size="icon" aria-label="Re-run" />}>
            <RefreshBoldIcon />
          </TooltipTrigger>
          <TooltipContent>Re-run the last delivery</TooltipContent>
        </Tooltip>
      </Specimen>
    </>
  );
}

export function TableDemo() {
  return (
    <>
    <Specimen title="Agents" className="block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-(--pad)">Agent</TableHead>
            <TableHead>Mode</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead className="pr-(--pad) text-right">Last seen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agents.map((agent) => (
            <TableRow key={agent.name}>
              <TableCell className="pl-(--pad) font-medium">{agent.name}</TableCell>
              <TableCell>
                <AgentModeBadge tone={agent.tone} mode={agent.mode} />
              </TableCell>
              <TableCell className="font-mono text-muted-foreground">{agent.destination}</TableCell>
              <TableCell className="pr-(--pad) text-right text-muted-foreground">{agent.seen}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Specimen>
    <Specimen
      title="Two-line rows"
      note="An alternative for narrow cards: each row stacks a secondary line under the name and the status over its time, so more fits without more columns."
      className="block"
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-(--pad)">Agent</TableHead>
            <TableHead className="pr-(--pad) text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agents.map((agent) => (
            <TableRow key={agent.name}>
              <TableCell className="py-2.5 pl-(--pad)">
                <span className="block font-medium">{agent.name}</span>
                <span className="block text-xs text-muted-foreground">
                  {agent.runtime} · <span className="font-mono">{agent.destination}</span>
                </span>
              </TableCell>
              <TableCell className="py-2.5 pr-(--pad) text-right">
                <AgentModeBadge tone={agent.tone} mode={agent.mode} />
                <span className="block pt-0.5 text-xs text-muted-foreground">{agent.seen}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Specimen>
    </>
  );
}

export function FeedbackDemo() {
  return (
    <>
      <Specimen title="Alert" className="grid max-w-lg grid-cols-1">
        <Alert>
          <CheckCircleIcon />
          <AlertTitle>Routing saved</AlertTitle>
          <AlertDescription>Version 14 is live. The previous version stays in history.</AlertDescription>
        </Alert>
        <Alert tone="destructive">
          <DangerTriangleIcon />
          <AlertTitle>Delivery failing</AlertTitle>
          <AlertDescription>Donna&rsquo;s webhook has returned 502 three times since 9:10 PM.</AlertDescription>
        </Alert>
        <Alert tone="warning">
          <DangerCircleIcon />
          <AlertTitle>Approval waiting</AlertTitle>
          <AlertDescription>
            Rex has asked to merge <CodeRef kind="pr" state="open">outpost#47</CodeRef>. The request expires in 40 minutes.
          </AlertDescription>
        </Alert>
        <Alert tone="info">
          <InfoCircleIcon />
          <AlertTitle>Quiet hours on</AlertTitle>
          <AlertDescription>Notices queue until 8:00 AM and arrive as one digest.</AlertDescription>
        </Alert>
      </Specimen>
      <Specimen
        title="Alert with time"
        note="The time sits on the title's line in the top-right corner. Use relative time for recent events and a clock time once it is older than a day."
        className="grid max-w-lg grid-cols-1"
      >
        <Alert tone="destructive">
          <DangerTriangleIcon />
          <AlertTitle>Checks failing</AlertTitle>
          <AlertMeta>
            <time dateTime="2026-11-22T21:22:00Z">4 min ago</time>
          </AlertMeta>
          <AlertDescription>
            <CodeRef kind="pr" state="failing">climb#91</CodeRef> failed 2 of 4 jobs. Climb lead is looking at it.
          </AlertDescription>
        </Alert>
        <Alert tone="success">
          <CheckCircleIcon />
          <AlertTitle>Merged</AlertTitle>
          <AlertMeta>
            <time dateTime="2026-11-22T20:26:00Z">1 hr ago</time>
          </AlertMeta>
          <AlertDescription>
            <CodeRef kind="pr" state="merged">forge#52</CodeRef> landed on main from{" "}
            <CodeRef kind="branch">gate-policy</CodeRef>.
          </AlertDescription>
        </Alert>
      </Specimen>
      <Specimen
        title="Code references"
        note="Pull requests, branches and commits read as one unit. The glyph colour carries the state; text stays neutral."
        className="flex flex-wrap items-center gap-x-5 gap-y-2"
      >
        <CodeRef kind="pr" state="open">outpost#47</CodeRef>
        <CodeRef kind="pr" state="draft">ropes#18</CodeRef>
        <CodeRef kind="pr" state="merged">forge#52</CodeRef>
        <CodeRef kind="pr" state="closed">climb#88</CodeRef>
        <CodeRef kind="pr" state="failing">climb#91</CodeRef>
        <CodeRef kind="branch">claude/project-thread</CodeRef>
        <CodeRef kind="commit">8203cae</CodeRef>
      </Specimen>
      <Specimen title="Spinner" className="flex flex-wrap items-center gap-4">
        <Spinner />
        <Spinner className="size-6" />
        <Button disabled>
          <Spinner data-icon="inline-start" aria-label="Approving" />
          Approving
        </Button>
        <span className="inline-flex items-center gap-2 text-muted-foreground">
          <Spinner aria-label="Delivering" />
          Delivering to Donna
        </span>
      </Specimen>
      <Specimen title="Progress" className="block max-w-sm">
        <Progress value={64} />
      </Specimen>
      <Specimen title="Skeleton" className="grid max-w-sm grid-cols-1">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-16 w-full" />
      </Specimen>
      <Specimen title="Avatar and keys">
        <AvatarGroup>
          {agents.slice(0, 4).map((agent) => (
            <Avatar key={agent.name}>
              <AvatarFallback>{agent.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroup>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </Specimen>
    </>
  );
}

export function LayoutDemo() {
  return (
    <>
      <Specimen title="Separator" note="Horizontal between groups, vertical between inline items.">
        <div className="w-full max-w-sm">
          <p className="font-medium">Routing</p>
          <p className="text-muted-foreground">Version 14, saved by Matt</p>
          <Separator className="my-(--pad)" />
          <div className="flex h-5 items-center gap-3 text-muted-foreground">
            <span>History</span>
            <Separator orientation="vertical" />
            <span>Dry run</span>
            <Separator orientation="vertical" />
            <span>Export</span>
          </div>
        </div>
      </Specimen>
      <Specimen title="Scroll area" note="A bounded list with an overlay scrollbar.">
        <ScrollArea className="h-56 w-full max-w-sm rounded-lg border">
          <ItemGroup variant="list" className="px-(--pad)">
            {Array.from({ length: 24 }, (_, index) => (
              <Item key={index} size="xs" className="px-0">
                <ItemContent>
                  <ItemTitle className="font-normal">Delivery {String(index + 1).padStart(3, "0")}</ItemTitle>
                </ItemContent>
                <ItemMeta className="font-mono">200</ItemMeta>
              </Item>
            ))}
          </ItemGroup>
        </ScrollArea>
      </Specimen>
    </>
  );
}
