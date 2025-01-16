import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "doting-goose-862.convex.cloud" },
    ],
  },
};

export default nextConfig;
