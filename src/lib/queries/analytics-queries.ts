import { createClient } from "@/lib/supabase/server";
import type { PainLocation, TriggerType } from "@/lib/types/database";

/** Episodes per week for last 8 weeks */
export async function getWeeklyFrequency() {
  const supabase = await createClient();
  const weeks: { label: string; count: number }[] = [];

  for (let i = 7; i >= 0; i--) {
    const weekEnd = new Date();
    weekEnd.setDate(weekEnd.getDate() - i * 7);
    const weekStart = new Date(weekEnd);
    weekStart.setDate(weekStart.getDate() - 7);

    const { count } = await supabase
      .from("episodes")
      .select("*", { count: "exact", head: true })
      .gte("started_at", weekStart.toISOString())
      .lt("started_at", weekEnd.toISOString());

    weeks.push({
      label: `W${8 - i}`,
      count: count ?? 0,
    });
  }

  return weeks;
}

/** Severity distribution: mild/moderate/severe counts */
export async function getSeverityDistribution() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("episodes")
    .select("intensity")
    .not("intensity", "is", null);

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

/** Trigger frequency sorted descending */
export async function getTriggerFrequency() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("episode_triggers")
    .select("trigger");

  const counts: Record<string, number> = {};
  (data ?? []).forEach((row) => {
    const t = row.trigger as TriggerType;
    counts[t] = (counts[t] ?? 0) + 1;
  });

  return Object.entries(counts)
    .map(([trigger, count]) => ({ trigger, count }))
    .sort((a, b) => b.count - a.count);
}

/** Location frequency for head heatmap */
export async function getLocationFrequency() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("episode_locations")
    .select("location");

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
