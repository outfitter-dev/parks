"use client";

import { useState, type ReactNode } from "react";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Kbd } from "@workspace/ui/components/kbd";
import { Label } from "@workspace/ui/components/label";
import { Progress } from "@workspace/ui/components/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Textarea } from "@workspace/ui/components/textarea";
import { cn } from "@workspace/ui/lib/utils";
import { ChatRoundDotsIcon } from "@solar-icons/react/linear/chat-round-dots";
import { HistoryIcon } from "@solar-icons/react/linear/history";
import { InboxIcon } from "@solar-icons/react/linear/inbox";
import { KeyIcon } from "@solar-icons/react/linear/key";
import { MagnifierIcon } from "@solar-icons/react/linear/magnifier";
import { RoutingIcon } from "@solar-icons/react/linear/routing";
import { ShieldKeyholeIcon } from "@solar-icons/react/linear/shield-keyhole";
import { UsersGroupRoundedIcon } from "@solar-icons/react/linear/users-group-rounded";
import { InboxIcon as InboxBold } from "@solar-icons/react/bold/inbox";
import { agents, asks, versions, type Ask } from "#lib/fixtures";
import { Signal, Viewport } from "./kit";

type Place = "needs-you" | "inbox" | "agents" | "routing" | "history" | "admin";

const places: { id: Place; label: string; icon: typeof InboxIcon; count?: number }[] = [
  { id: "needs-you", label: "Needs you", icon: ChatRoundDotsIcon, count: asks.length },
  { id: "inbox", label: "Inbox", icon: InboxIcon },
  { id: "agents", label: "Agents", icon: UsersGroupRoundedIcon },
  { id: "routing", label: "Routing", icon: RoutingIcon },
  { id: "history", label: "History", icon: HistoryIcon },
  { id: "admin", label: "Admin", icon: ShieldKeyholeIcon },
];

/** The app frame: a quiet sidebar, a top bar and the page. */
function AppFrame({ place, title, actions, children }: { place: Place; title: string; actions?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex min-h-160 bg-background text-foreground">
      <aside className="hidden w-56 shrink-0 flex-col border-r bg-muted/40 p-2 @3xl:flex">
        <div className="flex items-center gap-2 px-2 py-2 font-semibold">
          <span className="grid size-6 place-items-center rounded-md bg-brand text-xs text-brand-foreground">O</span>
          Outpost
        </div>
        <button
          type="button"
          className="mt-1 mb-2 flex h-(--control-h) items-center gap-2 rounded-lg border bg-background px-2 text-muted-foreground"
        >
          <MagnifierIcon className="size-4" />
          Search
          <Kbd className="ml-auto">⌘K</Kbd>
        </button>
        <nav aria-label="Outpost">
          {places.map(({ id, label, icon: Icon, count }) => (
            <a
              key={id}
              href="#"
              aria-current={id === place ? "page" : undefined}
              className={cn(
                "flex items-center gap-2 rounded-lg px-2 py-1.5 text-muted-foreground hover:bg-accent hover:text-foreground",
                id === place && "bg-accent text-foreground",
              )}
            >
              <Icon className="size-4" />
              {label}
              {count ? <span className="ml-auto text-xs tabular-nums">{count}</span> : null}
            </a>
          ))}
        </nav>
        <div className="mt-auto flex items-center gap-2 rounded-lg px-2 py-2 text-muted-foreground">
          <span className="grid size-6 place-items-center rounded-full bg-muted text-xs">MG</span>
          Matt
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 items-center gap-3 border-b px-4">
          <h1 className="font-medium">{title}</h1>
          <div className="ml-auto flex items-center gap-2">{actions}</div>
        </header>
        <div className="min-h-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

function AskRow({ ask, active, onSelect }: { ask: Ask; active: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={cn(
        "flex w-full flex-col gap-1 rounded-lg px-3 py-2.5 text-left hover:bg-accent",
        active && "bg-accent",
      )}
    >
      <span className="flex items-center gap-2 text-muted-foreground">
        <Signal tone="wait" />
        <span className="font-medium text-foreground">{ask.agent}</span>
        <span>· {ask.project}</span>
        <span className="ml-auto text-xs tabular-nums">{ask.age}</span>
      </span>
      <span className="line-clamp-2">{ask.title}</span>
    </button>
  );
}

function AskDetail({ ask }: { ask: Ask }) {
  const [choice, setChoice] = useState<string | null>(null);
  return (
    <div className="mx-auto w-full max-w-xl p-(--pad) @3xl:p-6">
      <p className="flex items-center gap-2 text-muted-foreground">
        <Badge variant="outline" className="capitalize">
          {ask.kind}
        </Badge>
        {ask.agent} asked {ask.age} ago
      </p>
      <h2 className="mt-3 text-lg font-semibold tracking-tight">{ask.title}</h2>
      <p className="mt-2 text-muted-foreground">{ask.context}</p>
      {ask.kind === "input" ? (
        <div className="mt-5 grid gap-2">
          <Label htmlFor="reply">Your reply</Label>
          <Textarea id="reply" placeholder="Use the ubuntu-24 runner image…" />
          <div className="flex justify-end">
            <Button>Send reply</Button>
          </div>
        </div>
      ) : (
        <div className="mt-5 grid gap-2">
          {ask.options.map((option) => (
            <button
              key={option.label}
              type="button"
              onClick={() => setChoice(option.label)}
              aria-pressed={choice === option.label}
              className={cn(
                "flex items-start gap-3 frame p-frame bg-card text-left shadow-(--shadow-frame) ring-1 ring-foreground/10 hover:ring-foreground/25",
                choice === option.label && "ring-2 ring-brand",
              )}
            >
              <span className="grid gap-0.5 px-inset">
                <span className="flex items-center gap-2 font-medium">
                  {option.label}
                  {option.recommended ? <Badge variant="secondary">Recommended</Badge> : null}
                </span>
                <span className="text-muted-foreground">{option.detail}</span>
              </span>
            </button>
          ))}
          <p className="mt-1 text-muted-foreground" aria-live="polite">
            {choice ? `Posts “${choice}” to the thread as you.` : "Pick an option to answer."}
          </p>
        </div>
      )}
    </div>
  );
}

export function NeedsYouComposition() {
  const [view, setView] = useState<"open" | "answered">("open");
  const [selected, setSelected] = useState(asks[0]?.id);
  const ask = asks.find((item) => item.id === selected) ?? asks[0];
  return (
    <Viewport>
      <AppFrame
        place="needs-you"
        title="Needs you"
        actions={
          <Tabs value={view} onValueChange={(next) => setView(next === "answered" ? "answered" : "open")}>
            <TabsList>
              <TabsTrigger value="open">Open</TabsTrigger>
              <TabsTrigger value="answered">Answered</TabsTrigger>
            </TabsList>
          </Tabs>
        }
      >
        {view === "answered" ? (
          <div className="grid h-full place-items-center p-(--pad) text-center">
            <div>
              <p className="font-medium">Nothing answered yet today</p>
              <p className="mt-1 text-muted-foreground">Asks you reply to move here, with the reply attached.</p>
            </div>
          </div>
        ) : (
        <div className="grid h-full @3xl:grid-cols-[minmax(--spacing(64),--spacing(88))_1fr]">
          <div className="border-b p-2 @3xl:border-r @3xl:border-b-0">
            {asks.map((item) => (
              <AskRow key={item.id} ask={item} active={item.id === ask?.id} onSelect={() => setSelected(item.id)} />
            ))}
          </div>
          {ask ? <AskDetail key={ask.id} ask={ask} /> : null}
        </div>
        )}
      </AppFrame>
    </Viewport>
  );
}

export function AgentsComposition() {
  return (
    <Viewport>
      <AppFrame place="agents" title="Agents" actions={<Button size="sm">New agent</Button>}>
        <div className="grid gap-3 p-(--pad) @2xl:grid-cols-3">
          {[
            ["Live", "3"],
            ["Dry run", "1"],
            ["Failing", "1"],
          ].map(([label, value]) => (
            <Card key={label} size="sm">
              <CardHeader>
                <CardDescription>{label}</CardDescription>
                <CardTitle className="text-2xl tabular-nums">{value}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-(--pad)">Agent</TableHead>
              <TableHead>Runtime</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead className="hidden @2xl:table-cell">Destination</TableHead>
              <TableHead className="pr-(--pad) text-right">Last seen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agents.map((agent) => (
              <TableRow key={agent.name}>
                <TableCell className="pl-(--pad) font-medium">{agent.name}</TableCell>
                <TableCell className="text-muted-foreground">{agent.runtime}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-2">
                    <Signal tone={agent.tone} />
                    {agent.mode}
                  </span>
                </TableCell>
                <TableCell className="hidden font-mono text-muted-foreground @2xl:table-cell">{agent.destination}</TableCell>
                <TableCell className="pr-(--pad) text-right text-muted-foreground">{agent.seen}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AppFrame>
    </Viewport>
  );
}

export function AdminComposition() {
  return (
    <Viewport>
      <AppFrame
        place="admin"
        title="Admin"
        actions={
          <Badge variant="outline">
            <span className="lead"><Signal tone="wait" /></span>Elevated · 11:42 left
          </Badge>
        }
      >
        <div className="grid gap-(--pad) p-(--pad) @5xl:grid-cols-[1fr_--spacing(80)]">
          <Card>
            <CardHeader>
              <CardTitle>Routing versions</CardTitle>
              <CardDescription>Each save makes a new version. Older ones stay here.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="concentric divide-y overflow-hidden rounded-lg bg-muted">
              {versions.map((item, index) => (
                <div key={item.version} className="flex h-(--control-h) items-center gap-3 px-text">
                  <span className="font-mono text-muted-foreground">v{item.version}</span>
                  <span className="min-w-0 flex-1 truncate">{item.change}</span>
                  {index === 0 ? <Badge variant="success">Live</Badge> : <span className="text-muted-foreground">{item.when}</span>}
                </div>
              ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost">Compare</Button>
              <Button variant="outline">Roll back to v13</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Elevation</CardTitle>
              <CardDescription>Admin access ends on its own.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Progress value={78} aria-label="Time left" />
              <div className="flex h-(--control-h) items-center rounded-lg bg-muted pe-text [--lead-size:var(--control-h)]">
                <span className="lead"><KeyIcon className="size-4 text-muted-foreground" /></span>
                Passkey confirmed at 9:38 PM
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                End admin now
              </Button>
            </CardFooter>
          </Card>
        </div>
      </AppFrame>
    </Viewport>
  );
}

export function SignInComposition() {
  return (
    <Viewport>
      <div className="grid min-h-160 place-items-center gap-(--pad) bg-muted/40 p-(--pad) @3xl:grid-cols-2">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <span className="mb-2 grid size-8 place-items-center rounded-lg bg-brand text-brand-foreground">
              <InboxBold className="size-4" />
            </span>
            <CardTitle className="text-lg">Sign in to Outpost</CardTitle>
            <CardDescription>Use your Vercel account. Outpost only reads who you are.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Continue with Vercel</Button>
          </CardContent>
        </Card>
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-lg">Approve this device?</CardTitle>
            <CardDescription>A CLI on another computer asked to act as you.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Label htmlFor="code" className="ps-text">Code shown on that device</Label>
            <Input id="code" defaultValue="KXQM-7TRD" className="font-mono tracking-widest" />
          </CardContent>
          <CardFooter>
            <Button className="flex-1">Approve</Button>
            <Button variant="outline" className="flex-1">
              Deny
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Viewport>
  );
}
