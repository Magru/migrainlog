"use server";

import { createClient } from "@/lib/supabase/server";
import type { MedicationEffectiveness } from "@/lib/types/database";

export async function addUserMedication(data: { name: string; defaultDose?: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.from("user_medications").insert({
    user_id: user.id,
    name: data.name,
    default_dose: data.defaultDose || null,
  });

  if (error) return { error: error.message };

  return { success: true };
}

export async function updateUserMedication(id: string, data: { name?: string; defaultDose?: string | null }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("user_medications")
    .update({
      ...(data.name !== undefined && { name: data.name }),
      ...(data.defaultDose !== undefined && { default_dose: data.defaultDose }),
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  return { success: true };
}

export async function deactivateUserMedication(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("user_medications")
    .update({ is_active: false })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  return { success: true };
}

export async function addEpisodeMedication(data: {
  episodeId: string;
  userMedicationId: string;
  dose?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.from("episode_medications").insert({
    episode_id: data.episodeId,
    user_medication_id: data.userMedicationId,
    dose: data.dose || null,
  });

  if (error) return { error: error.message };

  return { success: true };
}

export async function rateEpisodeMedication(
  id: string,
  data: { reliefMinutes: number; effectiveness: MedicationEffectiveness }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("episode_medications")
    .update({
      relief_minutes: data.reliefMinutes,
      effectiveness: data.effectiveness,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  return { success: true };
}
