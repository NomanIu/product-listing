import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Prefer AVIF (then WebP) — far smaller than PNG/JPEG, which speeds up the LCP.
    formats: ["image/avif", "image/webp"],
    // Allow next/image to optimise the product images served by dummyjson's CDN.
    remotePatterns: [
      { protocol: "https", hostname: "cdn.dummyjson.com" },
      { protocol: "https", hostname: "i.dummyjson.com" },
    ],
  },
};

export default nextConfig;
