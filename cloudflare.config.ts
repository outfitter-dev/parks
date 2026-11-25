// Parks' showcase as a static Cloudflare Worker: no server code, only the files
// `bun run build` exports to apps/showcase/out (pages, /r and llms.txt), which
// `cf deploy apps/showcase/out` uploads as an assets-only Worker.
import { defineConfig } from "cf/config";

export default defineConfig({
  accountId: "a99f870938c35bab699690600efd5a35",
  worker: {
    name: "parks",
    compatibilityDate: "2026-11-01",
    workersDev: false,
    previewUrls: false,
    domains: ["parks.outfitter.dev"],
    assets: { notFoundHandling: "404-page" },
  },
});
