import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, DM_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${plusJakarta.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-bg-base text-text-primary antialiased">
        {/* Splash screen — inline styles so it renders before CSS loads */}
        <div
          id="splash"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0F1117",
            transition: "opacity 0.4s ease, visibility 0.4s ease",
          }}
        >
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes sp-spin { to { transform: rotate(360deg) } }
            @keyframes sp-pulse { 0%,100% { transform: scale(1); opacity:.8 } 50% { transform: scale(1.4); opacity:1 } }
            @media (prefers-reduced-motion: reduce) {
              .sp-r1,.sp-r2,.sp-r3,.sp-dot { animation: none !important; }
            }
          `}} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
            <div style={{ position: "relative", width: 100, height: 100 }}>
              <div className="sp-r1" style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid transparent", borderTopColor: "#7B61FF", animation: "sp-spin 1.2s linear infinite" }} />
              <div className="sp-r2" style={{ position: "absolute", inset: 12, borderRadius: "50%", border: "2px solid transparent", borderRightColor: "#38BDF8", animation: "sp-spin 1.6s linear infinite reverse" }} />
              <div className="sp-r3" style={{ position: "absolute", inset: 24, borderRadius: "50%", border: "2px solid transparent", borderBottomColor: "#34D399", animation: "sp-spin 2s linear infinite" }} />
              <div className="sp-dot" style={{ position: "absolute", top: "50%", left: "50%", width: 16, height: 16, margin: "-8px 0 0 -8px", borderRadius: "50%", background: "#7B61FF", animation: "sp-pulse 1.2s ease-in-out infinite" }} />
            </div>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", background: "linear-gradient(135deg, #7B61FF, #38BDF8, #34D399)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 }}>
              MigrainLog
            </p>
          </div>
        </div>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
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
