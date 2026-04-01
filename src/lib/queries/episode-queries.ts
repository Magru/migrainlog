import { createClient } from "@/lib/supabase/server";
import type { EpisodeWithDetails } from "@/lib/types/episode";
import type { PainLocation, TriggerType, SymptomType } from "@/lib/types/database";
import { getEpisodeMedications } from "./medication-queries";

/** Get episodes for a date range with all relations */
export async function getEpisodesInRange(from: string, to: string): Promise<EpisodeWithDetails[]> {
  const supabase = await createClient();

  const { data: episodes } = await supabase
    .from("episodes")
    .select("*")
    .gte("started_at", from)
    .lte("started_at", to)
    .order("started_at", { ascending: false });

  if (!episodes || episodes.length === 0) return [];

  const ids = episodes.map((e) => e.id);

  const [locRes, trigRes, symRes, medsByEpisode] = await Promise.all([
    supabase.from("episode_locations").select("*").in("episode_id", ids),
    supabase.from("episode_triggers").select("*").in("episode_id", ids),
    supabase.from("episode_symptoms").select("*").in("episode_id", ids),
    getEpisodeMedications(ids),
  ]);

  return episodes.map((ep) => ({
    id: ep.id,
    userId: ep.user_id,
    startedAt: ep.started_at,
    endedAt: ep.ended_at,
    intensity: ep.intensity,
    notes: ep.notes,
    createdAt: ep.created_at,
    locations: (locRes.data ?? [])
      .filter((l) => l.episode_id === ep.id)
      .map((l) => l.location as PainLocation),
    triggers: (trigRes.data ?? [])
      .filter((t) => t.episode_id === ep.id)
      .map((t) => t.trigger as TriggerType),
    symptoms: (symRes.data ?? [])
      .filter((s) => s.episode_id === ep.id)
      .map((s) => s.symptom as SymptomType),
    medications: medsByEpisode[ep.id] ?? [],
  }));
}

/** Dashboard stats for current month */
export async function getDashboardStats() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();

  const episodes = await getEpisodesInRange(monthStart, monthEnd);

  const totalEpisodes = episodes.length;
  const avgIntensity = totalEpisodes > 0
    ? Math.round(episodes.reduce((sum, e) => sum + (e.intensity ?? 0), 0) / totalEpisodes * 10) / 10
    : 0;

  // Find most common trigger
  const triggerCounts: Record<string, number> = {};
  episodes.forEach((ep) => {
    ep.triggers.forEach((t) => {
      triggerCounts[t] = (triggerCounts[t] ?? 0) + 1;
    });
  });
  const topTrigger = Object.entries(triggerCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  // Last episode
  const lastEpisode = episodes[0] ?? null;

  // Weekly data (last 7 days)
  const weeklyData: { day: string; count: number; maxIntensity: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayStr = date.toISOString().slice(0, 10);
    const dayLabel = date.toLocaleDateString("en", { weekday: "short" });
    const dayEpisodes = episodes.filter((e) => e.startedAt.slice(0, 10) === dayStr);
    weeklyData.push({
      day: dayLabel,
      count: dayEpisodes.length,
      maxIntensity: dayEpisodes.length > 0
        ? Math.max(...dayEpisodes.map((e) => e.intensity ?? 0))
        : 0,
    });
  }

  return { totalEpisodes, avgIntensity, topTrigger, lastEpisode, weeklyData };
}

/** Get episodes grouped by day for a month (calendar view) */
export async function getMonthEpisodes(year: number, month: number) {
  const from = new Date(year, month, 1).toISOString();
  const to = new Date(year, month + 1, 0, 23, 59, 59).toISOString();

  const episodes = await getEpisodesInRange(from, to);

  // Group by date
  const byDay: Record<string, EpisodeWithDetails[]> = {};
  episodes.forEach((ep) => {
    const day = ep.startedAt.slice(0, 10);
    if (!byDay[day]) byDay[day] = [];
    byDay[day].push(ep);
  });

  return byDay;
}
