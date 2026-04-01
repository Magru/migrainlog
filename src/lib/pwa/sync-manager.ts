import { getQueuedEpisodes, removeFromQueue } from "./offline-queue";
import { createEpisode } from "@/lib/actions/episode-actions";

/** Flush offline queue — call when back online */
export async function syncOfflineEpisodes(): Promise<{ synced: number; failed: number }> {
  const queued = await getQueuedEpisodes();
  let synced = 0;
  let failed = 0;

  for (const entry of queued) {
    const result = await createEpisode({
      locations: entry.locations,
      intensity: entry.intensity,
      triggers: entry.triggers,
      symptoms: entry.symptoms,
      startedAt: entry.startedAt,
      notes: entry.notes,
    });

    if (result.success) {
      await removeFromQueue(entry.id);
      synced++;
    } else {
      failed++;
    }
  }

  return { synced, failed };
}
