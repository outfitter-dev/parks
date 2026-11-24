"use client";

import dynamic from "next/dynamic";

/**
 * The Agentation toolbar, in development only. Production builds drop the
 * import entirely, so the showcase never ships Agentation (a source-available
 * dev tool) to visitors.
 */
export const DevAnnotations =
  process.env.NODE_ENV === "development"
    ? dynamic(() => import("./annotations").then((mod) => mod.Annotations), {
        ssr: false,
      })
    : () => null;
