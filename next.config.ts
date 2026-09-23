import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The Sport API's real image host is unknown ahead of time, so
    // <SmartImage> renders with `unoptimized` to skip Next's image proxy
    // entirely. This pattern is here for when you're ready to turn
    // optimization back on for a known host.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
