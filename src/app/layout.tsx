import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, DM_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { SplashHide } from "@/components/layout/splash-hide";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MigrainLog",
  description: "Track your migraines, find your patterns",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MigrainLog",
  },
};

export const viewport: Viewport = {
  themeColor: "#0F1117",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-bg-base text-text-primary antialiased">
        {/* Splash screen — visible until app hydrates */}
        <div id="splash" className="splash-screen">
          <div className="splash-content">
            <div className="splash-rings">
              <div className="splash-ring splash-ring-1" />
              <div className="splash-ring splash-ring-2" />
              <div className="splash-ring splash-ring-3" />
              <div className="splash-dot" />
            </div>
            <p className="splash-title">MigrainLog</p>
          </div>
        </div>
        {children}
        <SplashHide />
        <Toaster
          theme="dark"
          position="top-center"
          toastOptions={{
            style: {
              background: "#1A1B23",
              border: "1px solid rgba(123, 97, 255, 0.2)",
              color: "#E8E8F4",
            },
          }}
        />
      </body>
    </html>
  );
}
