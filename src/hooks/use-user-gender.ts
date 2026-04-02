"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Gender } from "@/lib/types/database";

/** Fetch the current user's gender from their profile. Returns null while loading or if unset. */
export function useUserGender(enabled = true): Gender | null {
  const [gender, setGender] = useState<Gender | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    (async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || cancelled) return;
        const { data: profile } = await supabase
          .from("profiles")
          .select("gender")
          .eq("id", user.id)
          .single();
        if (!cancelled) {
          setGender((profile?.gender as Gender) ?? null);
        }
      } catch {
        // Silently fall back to null — cycle selector won't render
      }
    })();

    return () => { cancelled = true; };
  }, [enabled]);

  return gender;
}
