import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import withPWAInit from "@ducanh2912/next-pwa";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  fallbacks: { document: "/~offline" },
  workboxOptions: {
    runtimeCaching: [
      {
        // Cache page navigations so iOS standalone doesn't show blank screen
        urlPattern: ({ request }: { request: Request }) =>
          request.mode === "navigate",
        handler: "NetworkFirst" as const,
        options: {
          cacheName: "pages",
          networkTimeoutSeconds: 5,
          expiration: { maxEntries: 32 },
        },
      },
      {
        // Cache Supabase API calls
        urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
        handler: "NetworkFirst" as const,
        options: {
          cacheName: "supabase-api",
          networkTimeoutSeconds: 5,
          expiration: { maxEntries: 64, maxAgeSeconds: 60 * 60 },
        },
      },
      {
        // Cache static assets aggressively
        urlPattern: /\.(?:js|css|woff2?|png|jpg|jpeg|svg|gif|webp|ico)$/i,
        handler: "StaleWhileRevalidate" as const,
        options: {
          cacheName: "static-assets",
          expiration: { maxEntries: 128, maxAgeSeconds: 7 * 24 * 60 * 60 },
        },
      },
    ],
  },
});

const nextConfig: NextConfig = {
  // Allow Turbopack alongside webpack PWA plugin
  turbopack: {},
};

export default withPWA(withNextIntl(nextConfig));
