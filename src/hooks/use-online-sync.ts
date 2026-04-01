"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { syncOfflineEpisodes } from "@/lib/pwa/sync-manager";
import { hasQueuedEpisodes } from "@/lib/pwa/offline-queue";

/** Listens for online event and syncs queued episodes */
export function useOnlineSync() {
  useEffect(() => {
    async function handleOnline() {
      const hasQueued = await hasQueuedEpisodes();
      if (!hasQueued) return;

      const { synced } = await syncOfflineEpisodes();
      if (synced > 0) {
        toast.success(`Synced ${synced} offline episode(s)`);
      }
    }

    window.addEventListener("online", handleOnline);

    // Also try sync on mount if online
    if (navigator.onLine) {
      handleOnline();
    }

    return () => window.removeEventListener("online", handleOnline);
  }, []);
}
