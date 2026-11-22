"use client";

import { Alert, AlertDescription, AlertMeta, AlertTitle } from "@workspace/ui/components/alert";
import { CodeRef } from "@workspace/ui/components/code-ref";
import { Avatar, AvatarFallback, AvatarGroup } from "@workspace/ui/components/avatar";
import { Badge } from "@workspace/ui/components/badge";
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
import { AddCircleIcon } from "@solar-icons/react/bold/add-circle";
import { BellOffIcon } from "@solar-icons/react/linear/bell-off";
import { CheckCircleIcon } from "@solar-icons/react/linear/check-circle";
import { DangerCircleIcon } from "@solar-icons/react/linear/danger-circle";
import { DangerTriangleIcon } from "@solar-icons/react/linear/danger-triangle";
import { InfoCircleIcon } from "@solar-icons/react/linear/info-circle";
import { MenuDotsIcon } from "@solar-icons/react/bold/menu-dots";
import { PenIcon } from "@solar-icons/react/linear/pen";
import { RefreshIcon } from "@solar-icons/react/linear/refresh";
import { RefreshIcon as RefreshBoldIcon } from "@solar-icons/react/bold/refresh";
import { PenIcon as PenBoldIcon } from "@solar-icons/react/bold/pen";
import { TrashBinMinimalisticIcon } from "@solar-icons/react/linear/trash-bin-minimalistic";
import { agents } from "#lib/fixtures";
import { Signal, Specimen } from "./kit";

export function ButtonDemo() {
  return (
    <>
      <Specimen title="Variants">
        <Button>Approve</Button>
        <Button variant="secondary">Snooze</Button>
        <Button variant="outline">View thread</Button>
        <Button variant="ghost">Dismiss</Button>
        <Button variant="destructive">Revoke</Button>
        <Button variant="link">Open in Board</Button>
      </Specimen>
      <Specimen title="Sizes" note="Default height follows the control token.">
        <Button size="xs">Extra small</Button>
        <Button size="sm">Small</Button>
        <Button>Default</Button>
        <Button size="lg">Large</Button>
      </Specimen>
      <Specimen title="With icons" note="Glyph-only buttons and filled buttons use solid glyphs; text buttons on light fills keep the outline.">
        <Button>
          <AddCircleIcon data-icon="inline-start" />
          New agent
        </Button>
        <Button variant="outline">
          <RefreshIcon data-icon="inline-start" />
          Re-run
        </Button>
        <Button variant="ghost" size="icon" aria-label="More">
          <MenuDotsIcon />
        </Button>
        <Button variant="outline" size="icon-sm" aria-label="Edit">
          <PenBoldIcon />
        </Button>
      </Specimen>
      <Specimen title="States">
        <Button disabled>Disabled</Button>
        <Button variant="outline" aria-invalid>
          Invalid
        </Button>
      </Specimen>
    </>
  );
}

export function BadgeDemo() {
  return (
    <>
      <Specimen title="Variants">
        <Badge>Live</Badge>
        <Badge variant="secondary">Dry run</Badge>
        <Badge variant="outline">Muted</Badge>
        <Badge variant="success">Live</Badge>
        <Badge variant="warning">Waiting</Badge>
        <Badge variant="info">Queued</Badge>
        <Badge variant="destructive">Failed</Badge>
      </Specimen>
      <Specimen
        title="On a surface"
        note="Fills are translucent and each badge carries a soft tonal ring, so it separates from whatever sits behind it."
      >
        <div className="flex flex-wrap items-center gap-2 rounded-lg bg-muted p-3">
          <Badge variant="secondary">Dry run</Badge>
          <Badge variant="outline">
            <span className="lead"><Signal tone="live" /></span>Live
          </Badge>
          <Badge variant="success">Live</Badge>
          <Badge variant="destructive">Failed</Badge>
        </div>
      </Specimen>
      <Specimen title="With a signal dot" note="The dot carries the state; the label stays neutral.">
        <Badge variant="outline">
          <span className="lead"><Signal tone="live" /></span>Live
        </Badge>
        <Badge variant="outline">
          <span className="lead"><Signal tone="wait" /></span>Waiting on you
        </Badge>
        <Badge variant="outline">
          <span className="lead"><Signal tone="off" /></span>Off
        </Badge>
        <Badge variant="outline">
          <span className="lead"><Signal tone="alert" /></span>Failing
        </Badge>
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
              <Badge variant="outline">
                <span className="lead"><Signal tone="live" /></span>Live
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="panel flex items-center justify-between bg-muted px-text">
              <span>Destination</span>
              <span className="font-mono text-muted-foreground">webhook · devin</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost">Mute</Button>
            <Button>Open</Button>
          </CardFooter>
        </Card>
      </Specimen>
      <Specimen title="Small size" className="block">
        <Card size="sm" className="max-w-xs">
          <CardHeader>
            <CardTitle>3 asks waiting</CardTitle>
            <CardDescription>Oldest from 2 hours ago</CardDescription>
          </CardHeader>
        </Card>
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
      <Specimen title="Toggle and toggle group">
        <Toggle aria-label="Mute">
          <BellOffIcon />
        </Toggle>
        <ToggleGroup variant="outline" defaultValue={["all"]}>
          <ToggleGroupItem value="all">All</ToggleGroupItem>
          <ToggleGroupItem value="mine">Mine</ToggleGroupItem>
          <ToggleGroupItem value="agents">Agents</ToggleGroupItem>
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
            <DropdownMenuItem variant="destructive">
              <TrashBinMinimalisticIcon /> Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Specimen>
      <Specimen title="Dialog">
        <Dialog>
          <DialogTrigger render={<Button variant="destructive" />}>Revoke credential</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Revoke Donna&rsquo;s credential?</DialogTitle>
              <DialogDescription>
                Donna stops receiving deliveries at once. You can issue a new credential later.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>Keep it</DialogClose>
              <Button variant="destructive">Revoke</Button>
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
                <span className="inline-flex items-center gap-2">
                  <Signal tone={agent.tone} /> {agent.mode}
                </span>
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
                <Badge variant={modeBadge[agent.tone]}>{agent.mode}</Badge>
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

const modeBadge = {
  live: "success",
  wait: "warning",
  alert: "destructive",
  off: "secondary",
} as const;

export function FeedbackDemo() {
  return (
    <>
      <Specimen title="Alert" className="grid max-w-lg grid-cols-1">
        <Alert>
          <CheckCircleIcon />
          <AlertTitle>Routing saved</AlertTitle>
          <AlertDescription>Version 14 is live. The previous version stays in history.</AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <DangerTriangleIcon />
          <AlertTitle>Delivery failing</AlertTitle>
          <AlertDescription>Donna&rsquo;s webhook has returned 502 three times since 9:10 PM.</AlertDescription>
        </Alert>
        <Alert variant="warning">
          <DangerCircleIcon />
          <AlertTitle>Approval waiting</AlertTitle>
          <AlertDescription>
            Rex has asked to merge <CodeRef kind="pr" state="open">outpost#47</CodeRef>. The request expires in 40 minutes.
          </AlertDescription>
        </Alert>
        <Alert variant="info">
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
        <Alert variant="destructive">
          <DangerTriangleIcon />
          <AlertTitle>Checks failing</AlertTitle>
          <AlertMeta>
            <time dateTime="2026-11-22T21:22:00Z">4 min ago</time>
          </AlertMeta>
          <AlertDescription>
            <CodeRef kind="pr" state="failing">climb#91</CodeRef> failed 2 of 4 jobs. Climb lead is looking at it.
          </AlertDescription>
        </Alert>
        <Alert variant="success">
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
          <div className="p-(--pad)">
            {Array.from({ length: 24 }, (_, index) => (
              <div key={index} className="flex justify-between border-b py-2 last:border-b-0">
                <span>Delivery {String(index + 1).padStart(3, "0")}</span>
                <span className="font-mono text-muted-foreground">200</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Specimen>
    </>
  );
}
