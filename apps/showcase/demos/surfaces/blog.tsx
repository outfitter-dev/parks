"use client";

import { Avatar, AvatarFallback } from "@outfitter/parks/components/avatar";
import { Badge } from "@outfitter/parks/components/badge";
import { Button } from "@outfitter/parks/components/button";
import { Input } from "@outfitter/parks/components/input";
import { cn } from "@outfitter/parks/lib/utils";

import { Viewport } from "../kit";
import { CodeBlock } from "./parts";

const posts = [
  {
    date: "Nov 21",
    tag: "Outpost",
    title: "The Board is the record",
    dek: "Why runtimes post into one Board instead of Outpost polling each of them.",
    read: "6 min",
  },
  {
    date: "Nov 19",
    tag: "Ropes",
    title: "One plan, four verbs",
    dek: "explain, check, fix and doctor all read the same plan. Nothing runs that explain would not show.",
    read: "8 min",
  },
  {
    date: "Nov 14",
    tag: "Trails",
    title: "Derive by default",
    dek: "Author what is new, derive what is known, override what is wrong.",
    read: "5 min",
  },
  {
    date: "Nov 10",
    tag: "Skillset",
    title: "Generated output merges as text",
    dek: "Per-entry lock provenance means two branches rarely conflict.",
    read: "4 min",
  },
];

/** A dotted cover, drawn from the dot matrix motif so posts need no stock art. */
function Cover({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "bg-muted text-brand-strong ring-border-muted rounded-xl ring-1",
        "bg-[radial-gradient(currentColor_1.5px,transparent_1.5px)] bg-size-[--spacing(3)_--spacing(3)]",
        "mask-radial-from-30% mask-radial-at-[70%_40%]",
        className
      )}
    />
  );
}

function Index() {
  const [featured, ...rest] = posts;
  if (!featured) {
    return null;
  }
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <p className="text-muted-foreground">Field notes</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">
        Building Outfitter in the open
      </h1>

      <a
        href="#"
        className="group mt-8 grid gap-5 @3xl:grid-cols-[1.2fr_1fr] @3xl:items-center"
      >
        <Cover className="aspect-16/10" />
        <div>
          <span className="text-muted-foreground flex items-center gap-2">
            <Badge variant="outline">{featured.tag}</Badge>
            {featured.date} · {featured.read}
          </span>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight group-hover:underline">
            {featured.title}
          </h2>
          <p className="text-muted-foreground mt-2">{featured.dek}</p>
        </div>
      </a>

      <ul className="mt-10 divide-y border-y">
        {rest.map((post) => (
          <li key={post.title}>
            <a
              href="#"
              className="group grid gap-1 py-4 @3xl:grid-cols-[6rem_1fr_auto] @3xl:items-baseline @3xl:gap-6"
            >
              <span className="text-muted-foreground tabular-nums">
                {post.date}
              </span>
              <span>
                <span className="font-medium group-hover:underline">
                  {post.title}
                </span>
                <span className="text-muted-foreground block">{post.dek}</span>
              </span>
              <span className="text-muted-foreground text-xs">{post.tag}</span>
            </a>
          </li>
        ))}
      </ul>

      <form className="bg-fill-subtle mt-10 flex flex-col gap-3 rounded-xl p-5 @3xl:flex-row @3xl:items-center">
        <span className="flex-1">
          <span className="font-medium">New notes by email</span>
          <span className="text-muted-foreground block">
            About twice a month. No tracking pixels.
          </span>
        </span>
        <Input
          type="email"
          placeholder="you@example.com"
          aria-label="Email"
          className="@3xl:w-56"
        />
        <Button>Subscribe</Button>
      </form>
    </div>
  );
}

function Article() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-12">
      <span className="text-muted-foreground flex items-center gap-2">
        <Badge variant="outline">Outpost</Badge>
        Nov 21 · 6 min read
      </span>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance">
        The Board is the record
      </h1>
      <p className="text-muted-foreground mt-4 text-lg text-pretty">
        We almost built an adapter for every agent runtime. Then we noticed
        every runtime could already post to a thread.
      </p>
      <div className="mt-6 flex items-center gap-3 border-y py-3">
        <Avatar aria-hidden>
          <AvatarFallback className="text-xs font-medium">MG</AvatarFallback>
        </Avatar>
        <span>
          Matt Galligan
          <span className="text-muted-foreground block text-xs">Outfitter</span>
        </span>
      </div>
      <Cover className="mt-8 aspect-21/9" />
      <div className="mt-8 flex flex-col gap-5 leading-7">
        <p>
          Outpost started as a gateway. Each runtime would get an adapter that
          could observe, notify, steer, start and stop. That is five
          capabilities times every runtime we use, and most of them change their
          APIs monthly.
        </p>
        <h2 className="mt-4 text-xl font-semibold">
          Posting is the one thing they all do
        </h2>
        <p>
          Every runtime can run a hook or call a CLI. So producers post a run
          card to the Board, and Outpost edits it in place. The app hides those
          channels from the main views and decides who gets woken.
        </p>
        <blockquote className="border-brand border-s-2 ps-4 text-lg text-pretty">
          Observe broadly, control narrowly. The Board holds the history;
          Outpost holds the policy.
        </blockquote>
        <CodeBlock
          code={
            '```json#run@1\n{ "agent": "climb-lead", "state": "working", "step": 3 }\n```'
          }
          label="A run card's block"
        />
        <p>
          The fence names the shape and its version, so every reader knows how
          to render it.
        </p>
      </div>
    </article>
  );
}

/** A blog: an index with one featured post and the reading view. */
export function BlogSurface() {
  return (
    <div className="flex flex-col gap-8">
      <Viewport>
        <div className="bg-background text-foreground min-h-160">
          <Index />
        </div>
      </Viewport>
      <Viewport>
        <div className="bg-background text-foreground">
          <Article />
        </div>
      </Viewport>
    </div>
  );
}
