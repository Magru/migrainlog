"use server";

import { createClient } from "@/lib/supabase/server";
import { locales, type Locale } from "@/i18n/config";
import type { Gender } from "@/lib/types/database";

const VALID_GENDERS: (Gender | null)[] = ["male", "female", null];

export async function updateGender(gender: Gender | null) {
  if (!VALID_GENDERS.includes(gender)) return { error: "Invalid gender value" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("profiles")
    .update({ gender })
    .eq("id", user.id);

  if (error) return { error: "Failed to update gender" };

  return { success: true };
}

export async function updateLocale(locale: Locale) {
  if (!locales.includes(locale)) return { error: "Invalid locale" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("profiles")
    .update({ locale })
    .eq("id", user.id);

  if (error) return { error: "Failed to update locale" };

  return { success: true };
}
