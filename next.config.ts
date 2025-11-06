import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Note: `output: "export"` was removed because Next.js middleware
  // cannot be used together with static HTML export. See:
  // https://nextjs.org/docs/advanced-features/static-html-export
  images: {
    unoptimized: true,
    domains: ["github.com", "res.cloudinary.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
