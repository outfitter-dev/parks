"use client";

import { Agentation } from "agentation";
import { useEffect, useState } from "react";

/** Where `agentation-mcp server` listens by default. */
const localEndpoint = "http://localhost:4747";
const storageKey = "workbench.annotations.endpoint";

/**
 * Picks the annotation server the toolbar syncs to.
 *
 * On localhost the toolbar always syncs to the local MCP server. On a deployed
 * preview it stays local-only (copy still works) unless you opt in with
 * `?annotations=mcp`, because reaching localhost from a public page makes the
 * browser ask for local network access. `?annotations=off` opts back out.
 */
function resolveEndpoint(): string | undefined {
  const configured = process.env.NEXT_PUBLIC_AGENTATION_ENDPOINT;
  if (configured) {
    return configured;
  }

  const { hostname, search } = window.location;
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return localEndpoint;
  }

  const choice = new URLSearchParams(search).get("annotations");
  try {
    if (choice === "mcp") {
      window.localStorage.setItem(storageKey, localEndpoint);
    }
    if (choice === "off") {
      window.localStorage.removeItem(storageKey);
    }
    return window.localStorage.getItem(storageKey) ?? undefined;
  } catch {
    return choice === "mcp" ? localEndpoint : undefined;
  }
}

/**
 * Agentation toolbar for pinning notes to elements. Copy (`C`) puts every note
 * on the clipboard as markdown; with an endpoint, notes also sync to the local
 * `agentation-mcp` server so agents can read, answer and resolve them.
 */
export function Annotations() {
  const [ready, setReady] = useState(false);
  const [endpoint, setEndpoint] = useState<string | undefined>();

  useEffect(() => {
    setEndpoint(resolveEndpoint());
    setReady(true);
  }, []);

  if (!ready) {
    return null;
  }
  return <Agentation appName="Parks showcase" endpoint={endpoint} />;
}
