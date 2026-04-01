import { createClient } from "@/lib/supabase/server";
import type { PainLocation, TriggerType } from "@/lib/types/database";

/** Episodes per week within a date range */
export async function getWeeklyFrequency(from?: string, to?: string) {
  const supabase = await createClient();
  const endDate = to ? new Date(to) : new Date();
  const startDate = from ? new Date(from) : new Date(endDate.getTime() - 8 * 7 * 86400000);

  const weeks: { label: string; count: number }[] = [];
  const totalMs = endDate.getTime() - startDate.getTime();
  const totalWeeks = Math.max(1, Math.ceil(totalMs / (7 * 86400000)));
  const buckets = Math.min(totalWeeks, 12);

  for (let i = 0; i < buckets; i++) {
    const bucketStart = new Date(startDate.getTime() + (i * totalMs) / buckets);
    const bucketEnd = new Date(startDate.getTime() + ((i + 1) * totalMs) / buckets);

    const { count } = await supabase
      .from("episodes")
      .select("*", { count: "exact", head: true })
      .gte("started_at", bucketStart.toISOString())
      .lt("started_at", bucketEnd.toISOString());

    const label = bucketStart.toLocaleDateString("en", { month: "short", day: "numeric" });
    weeks.push({ label, count: count ?? 0 });
  }

  return weeks;
}

/** Severity distribution within date range */
export async function getSeverityDistribution(from?: string, to?: string) {
  const supabase = await createClient();

  let query = supabase.from("episodes").select("intensity").not("intensity", "is", null);
  if (from) query = query.gte("started_at", from);
  if (to) query = query.lte("started_at", to);

  const { data } = await query;

  const dist = { mild: 0, moderate: 0, severe: 0 };
  (data ?? []).forEach((ep) => {
    const i = ep.intensity!;
    if (i <= 3) dist.mild++;
    else if (i <= 7) dist.moderate++;
    else dist.severe++;
  });

  return [
    { name: "Mild", value: dist.mild, color: "var(--severity-low)" },
    { name: "Moderate", value: dist.moderate, color: "var(--severity-mid)" },
    { name: "Severe", value: dist.severe, color: "var(--severity-high)" },
  ];
}

/** Trigger frequency within date range */
export async function getTriggerFrequency(from?: string, to?: string) {
  const supabase = await createClient();

  let episodeQuery = supabase.from("episodes").select("id");
  if (from) episodeQuery = episodeQuery.gte("started_at", from);
  if (to) episodeQuery = episodeQuery.lte("started_at", to);
  const { data: episodes } = await episodeQuery;
  const ids = (episodes ?? []).map((e) => e.id);

  if (ids.length === 0) return [];

  const { data } = await supabase
    .from("episode_triggers")
    .select("trigger")
    .in("episode_id", ids);

  const counts: Record<string, number> = {};
  (data ?? []).forEach((row) => {
    const t = row.trigger as TriggerType;
    counts[t] = (counts[t] ?? 0) + 1;
  });

  return Object.entries(counts)
    .map(([trigger, count]) => ({ trigger, count }))
    .sort((a, b) => b.count - a.count);
}

/** Location frequency within date range */
export async function getLocationFrequency(from?: string, to?: string) {
  const supabase = await createClient();

  let episodeQuery = supabase.from("episodes").select("id");
  if (from) episodeQuery = episodeQuery.gte("started_at", from);
  if (to) episodeQuery = episodeQuery.lte("started_at", to);
  const { data: episodes } = await episodeQuery;
  const ids = (episodes ?? []).map((e) => e.id);

  if (ids.length === 0) return [];

  const { data } = await supabase
    .from("episode_locations")
    .select("location")
    .in("episode_id", ids);

  const counts: Record<string, number> = {};
  (data ?? []).forEach((row) => {
    const l = row.location as PainLocation;
    counts[l] = (counts[l] ?? 0) + 1;
  });

  const max = Math.max(...Object.values(counts), 1);
  return Object.entries(counts).map(([location, count]) => ({
    location: location as PainLocation,
    count,
    opacity: Math.max(0.2, count / max),
  }));
}

/** Summary stats for a date range */
export async function getSummaryStats(from?: string, to?: string) {
  const supabase = await createClient();

  let query = supabase.from("episodes").select("intensity, started_at");
  if (from) query = query.gte("started_at", from);
  if (to) query = query.lte("started_at", to);

  const { data } = await query;
  const episodes = data ?? [];

  if (episodes.length === 0) {
    return { totalEpisodes: 0, avgIntensity: 0, maxIntensity: 0, episodesPerWeek: 0 };
  }

  const intensities = episodes.map((e) => e.intensity ?? 0).filter((i) => i > 0);
  const avgIntensity = intensities.length > 0
    ? Math.round((intensities.reduce((a, b) => a + b, 0) / intensities.length) * 10) / 10
    : 0;

  const fromDate = from ? new Date(from) : new Date(episodes[episodes.length - 1].started_at);
  const toDate = to ? new Date(to) : new Date();
  const weeks = Math.max(1, (toDate.getTime() - fromDate.getTime()) / (7 * 86400000));

  return {
    totalEpisodes: episodes.length,
    avgIntensity,
    maxIntensity: Math.max(...intensities, 0),
    episodesPerWeek: Math.round((episodes.length / weeks) * 10) / 10,
  };
}
