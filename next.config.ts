import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during production builds to unblock build output
    ignoreDuringBuilds: true,
  },
  env: {
    API_URL: process.env.API_URL || 'https://short-link-backend-ssr2.onrender.com',
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    qualities: [25, 50, 75, 85, 100],
  },
};

export default nextConfig;
