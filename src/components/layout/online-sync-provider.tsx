"use client";

import { useOnlineSync } from "@/hooks/use-online-sync";

export function OnlineSyncProvider({ children }: { children: React.ReactNode }) {
  useOnlineSync();
  return <>{children}</>;
}
