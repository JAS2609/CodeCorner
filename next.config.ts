import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Allow production builds to pass even with ESLint errors
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
