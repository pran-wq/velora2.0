import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["tesseract.js", "pdf-parse", "prisma", "@prisma/client"],
  },
};

export default nextConfig;
