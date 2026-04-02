"use server";

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
      menstrual_phase: data.menstrualPhase ?? null,
      ovulation_phase: data.ovulationPhase ?? null,
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

  return { success: true, episodeId: episode.id };
}

export async function updateEpisode(episodeId: string, data: EpisodeFormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Verify ownership
  const { data: existing } = await supabase
    .from("episodes")
    .select("id")
    .eq("id", episodeId)
    .eq("user_id", user.id)
    .single();

  if (!existing) {
    return { error: "Episode not found" };
  }

  // Update episode row
  const { error: updateError } = await supabase
    .from("episodes")
    .update({
      started_at: data.startedAt,
      intensity: data.intensity,
      notes: data.notes || null,
      menstrual_phase: data.menstrualPhase ?? null,
      ovulation_phase: data.ovulationPhase ?? null,
    })
    .eq("id", episodeId);

  if (updateError) {
    return { error: updateError.message };
  }

  // Re-insert junction rows (delete old + insert new)
  await Promise.all([
    supabase.from("episode_locations").delete().eq("episode_id", episodeId),
    supabase.from("episode_triggers").delete().eq("episode_id", episodeId),
    supabase.from("episode_symptoms").delete().eq("episode_id", episodeId),
  ]);

  const promises: PromiseLike<unknown>[] = [];

  if (data.locations.length > 0) {
    promises.push(
      supabase.from("episode_locations").insert(
        data.locations.map((location) => ({
          episode_id: episodeId,
          location,
        }))
      )
    );
  }

  if (data.triggers.length > 0) {
    promises.push(
      supabase.from("episode_triggers").insert(
        data.triggers.map((trigger) => ({
          episode_id: episodeId,
          trigger,
        }))
      )
    );
  }

  if (data.symptoms.length > 0) {
    promises.push(
      supabase.from("episode_symptoms").insert(
        data.symptoms.map((symptom) => ({
          episode_id: episodeId,
          symptom,
        }))
      )
    );
  }

  await Promise.all(promises);

  return { success: true };
}

export async function deleteEpisode(episodeId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("episodes")
    .delete()
    .eq("id", episodeId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
