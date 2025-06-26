import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "incredible-elephant-290.convex.cloud",
      }
    ]
  }
};

export default nextConfig;
