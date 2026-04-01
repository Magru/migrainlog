import { openDB, type DBSchema } from "idb";
import type { EpisodeFormData } from "@/lib/types/episode";

interface OfflineEpisodeEntry extends EpisodeFormData {
  id: string;
  queuedAt: string;
}

interface OfflineDB extends DBSchema {
  offline_episodes: {
    key: string;
    value: OfflineEpisodeEntry;
  };
}

function getDB() {
  return openDB<OfflineDB>("migrainlog-offline", 1, {
    upgrade(db) {
      db.createObjectStore("offline_episodes", { keyPath: "id" });
    },
  });
}

/** Queue an episode for later sync */
export async function queueEpisode(data: EpisodeFormData): Promise<string> {
  const db = await getDB();
  const id = crypto.randomUUID();
  await db.put("offline_episodes", {
    ...data,
    id,
    queuedAt: new Date().toISOString(),
  });
  return id;
}

/** Get all queued episodes */
export async function getQueuedEpisodes(): Promise<OfflineEpisodeEntry[]> {
  const db = await getDB();
  return db.getAll("offline_episodes");
}

/** Remove a synced episode from queue */
export async function removeFromQueue(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("offline_episodes", id);
}

/** Check if there are queued episodes */
export async function hasQueuedEpisodes(): Promise<boolean> {
  const db = await getDB();
  const count = await db.count("offline_episodes");
  return count > 0;
}
