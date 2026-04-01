import { ThemeProvider } from "@/lib/theme-provider";
import { AppShell } from "@/components/layout/app-shell";
import { BottomNav } from "@/components/layout/bottom-nav";
import { OnlineSyncProvider } from "@/components/layout/online-sync-provider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <OnlineSyncProvider>
        <AppShell>{children}</AppShell>
        <BottomNav />
      </OnlineSyncProvider>
    </ThemeProvider>
  );
}
