import type { NextConfig } from "next";

const config: NextConfig = {
  // A static site: Cloudflare serves the exported files with no server.
  output: "export",
  transpilePackages: ["@outfitter/parks"],
};

export default config;
