import { createClient } from "@/lib/supabase/server";
import type { UserMedication, EpisodeMedication } from "@/lib/types/episode";
import type { MedicationEffectiveness } from "@/lib/types/database";

/** Fetch user's active medication library */
export async function getUserMedications(): Promise<UserMedication[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("user_medications")
    .select("id, name, default_dose")
    .eq("is_active", true)
    .order("name");

  return (data ?? []).map((m) => ({
    id: m.id,
    name: m.name,
    defaultDose: m.default_dose,
  }));
}

/** Fetch medications logged for specific episodes */
export async function getEpisodeMedications(episodeIds: string[]): Promise<Record<string, EpisodeMedication[]>> {
  if (episodeIds.length === 0) return {};

  const supabase = await createClient();

  const { data } = await supabase
    .from("episode_medications")
    .select("id, episode_id, user_medication_id, dose, taken_at, relief_minutes, effectiveness, user_medications(name)")
    .in("episode_id", episodeIds);

  const byEpisode: Record<string, EpisodeMedication[]> = {};

  for (const row of data ?? []) {
    const med: EpisodeMedication = {
      id: row.id,
      userMedicationId: row.user_medication_id,
      name: (row.user_medications as unknown as { name: string })?.name ?? "Unknown",
      dose: row.dose,
      takenAt: row.taken_at,
      reliefMinutes: row.relief_minutes,
      effectiveness: row.effectiveness as MedicationEffectiveness | null,
    };
    const epId = row.episode_id;
    if (!byEpisode[epId]) byEpisode[epId] = [];
    byEpisode[epId].push(med);
  }

  return byEpisode;
}
