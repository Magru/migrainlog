"use client";

import { useTranslations } from "next-intl";
import { Lightbulb } from "lucide-react";

interface InsightCardProps {
  totalEpisodes: number;
  topTrigger: string | null;
  avgIntensity: number;
}

export function InsightCard({ totalEpisodes, topTrigger, avgIntensity }: InsightCardProps) {
  const t = useTranslations("dashboard");
  const tTriggers = useTranslations("triggers");

  let insight: string;

  if (totalEpisodes === 0) {
    insight = t("insightNone");
  } else if (totalEpisodes <= 2) {
    insight = t("insightFew", { count: totalEpisodes });
  } else {
    const parts: string[] = [t("insightMany", { count: totalEpisodes })];
    if (topTrigger) parts.push(t("insightTrigger", { trigger: tTriggers(topTrigger).toLowerCase() }));
    if (avgIntensity > 6) parts.push(t("insightHighIntensity"));
    insight = parts.join(", ") + ".";
  }

  return (
    <div className="flex items-start gap-3 rounded-[var(--radius-md)] border border-border bg-bg-surface p-4">
      <Lightbulb size={20} className="mt-0.5 shrink-0 text-accent-secondary" />
      <p className="text-sm leading-relaxed text-text-secondary">{insight}</p>
    </div>
  );
}
