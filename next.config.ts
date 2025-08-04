import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["github.com"], // Tambahkan domain di sini
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
        pathname: "/**",
      },
    ],
    unoptimized: false, // default: false
  },
};

export default nextConfig;
