"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { EpisodeFormData } from "@/lib/types/episode";

export async function createEpisode(data: EpisodeFormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Insert episode
  const { data: episode, error: episodeError } = await supabase
    .from("episodes")
    .insert({
      user_id: user.id,
      started_at: data.startedAt,
      intensity: data.intensity,
      notes: data.notes || null,
    })
    .select("id")
    .single();

  if (episodeError || !episode) {
    return { error: episodeError?.message ?? "Failed to create episode" };
  }

  // Insert related data in parallel
  const promises: PromiseLike<unknown>[] = [];

  if (data.locations.length > 0) {
    promises.push(
      supabase.from("episode_locations").insert(
        data.locations.map((location) => ({
          episode_id: episode.id,
          location,
        }))
      )
    );
  }

  if (data.triggers.length > 0) {
    promises.push(
      supabase.from("episode_triggers").insert(
        data.triggers.map((trigger) => ({
          episode_id: episode.id,
          trigger,
        }))
      )
    );
  }

  if (data.symptoms.length > 0) {
    promises.push(
      supabase.from("episode_symptoms").insert(
        data.symptoms.map((symptom) => ({
          episode_id: episode.id,
          symptom,
        }))
      )
    );
  }

  await Promise.all(promises);

  // Revalidate pages that display episode data
  revalidatePath("/dashboard");
  revalidatePath("/calendar");
  revalidatePath("/analytics");

  return { success: true, episodeId: episode.id };
}
