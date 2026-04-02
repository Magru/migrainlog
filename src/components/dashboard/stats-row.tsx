"use client";

import { useTranslations } from "next-intl";
import { Activity, TrendingUp, Zap } from "lucide-react";

interface StatsRowProps {
  totalEpisodes: number;
  avgIntensity: number;
  topTrigger: string | null;
}

export function StatsRow({ totalEpisodes, avgIntensity, topTrigger }: StatsRowProps) {
  const t = useTranslations("dashboard");
  const tTriggers = useTranslations("triggers");

  const stats = [
    { icon: Activity, label: t("episodes"), value: totalEpisodes.toString(), color: "text-accent" },
    { icon: TrendingUp, label: t("avgIntensity"), value: avgIntensity > 0 ? avgIntensity.toFixed(1) : "—", color: "text-severity-mid" },
    { icon: Zap, label: t("topTrigger"), value: topTrigger ? tTriggers(topTrigger) : "—", color: "text-accent-secondary" },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map(({ icon: Icon, label, value, color }) => (
        <div
          key={label}
          className="flex flex-col items-center gap-1.5 rounded-[var(--radius-md)] border border-border bg-bg-surface p-3"
        >
          <Icon size={20} className={color} />
          <span className="font-heading text-xl font-bold">{value}</span>
          <span className="text-[11px] text-text-secondary">{label}</span>
        </div>
      ))}
    </div>
  );
}
