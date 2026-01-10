import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "d3fyty2h10se9r.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "ingents.s3.ap-south-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
