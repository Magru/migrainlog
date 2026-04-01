import { createClient } from "@/lib/supabase/server";

/** Check if current user is admin */
export async function isCurrentUserAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  return data?.is_admin ?? false;
}

/** Get all users with their episode counts (admin only) */
export async function getAllUsersWithStats() {
  const supabase = await createClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (!profiles) return [];

  // Get episode counts per user
  const { data: episodes } = await supabase
    .from("episodes")
    .select("user_id, id");

  const episodeCounts: Record<string, number> = {};
  (episodes ?? []).forEach((ep) => {
    episodeCounts[ep.user_id] = (episodeCounts[ep.user_id] ?? 0) + 1;
  });

  return profiles.map((p) => ({
    id: p.id,
    displayName: p.display_name,
    isAdmin: p.is_admin,
    createdAt: p.created_at,
    episodeCount: episodeCounts[p.id] ?? 0,
  }));
}
