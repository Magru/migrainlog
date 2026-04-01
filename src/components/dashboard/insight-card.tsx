import { Lightbulb } from "lucide-react";

interface InsightCardProps {
  totalEpisodes: number;
  topTrigger: string | null;
  avgIntensity: number;
}

const triggerLabels: Record<string, string> = {
  stress: "Stress",
  sleep: "Sleep",
  food: "Food",
  weather: "Weather",
  hormones: "Hormones",
  screen: "Screen",
  alcohol: "Alcohol",
  caffeine: "Caffeine",
};

export function InsightCard({ totalEpisodes, topTrigger, avgIntensity }: InsightCardProps) {
  let insight: string;

  if (totalEpisodes === 0) {
    insight = "No episodes logged this month. Start tracking to discover patterns.";
  } else if (totalEpisodes <= 2) {
    insight = `${totalEpisodes} episode${totalEpisodes > 1 ? "s" : ""} this month. Keep logging to build a useful picture.`;
  } else {
    const parts: string[] = [`${totalEpisodes} episodes this month`];
    if (topTrigger) parts.push(`most often linked to ${triggerLabels[topTrigger]?.toLowerCase() ?? topTrigger}`);
    if (avgIntensity > 6) parts.push("average intensity is high — consider discussing with your doctor");
    insight = parts.join(", ") + ".";
  }

  return (
    <div className="flex items-start gap-3 rounded-[var(--radius-md)] border border-border bg-bg-surface p-4">
      <Lightbulb size={20} className="mt-0.5 shrink-0 text-accent-secondary" />
      <p className="text-sm leading-relaxed text-text-secondary">{insight}</p>
    </div>
  );
}
