import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // @ts-ignore - Some versions of Next.js expect this at the top level
  allowedDevOrigins: ['192.168.100.16'],
};

export default nextConfig;
