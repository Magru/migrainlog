"use client";

import { useTranslations } from "next-intl";

interface SummaryStatsProps {
  data: {
    totalEpisodes: number;
    avgIntensity: number;
    maxIntensity: number;
    episodesPerWeek: number;
  };
}

const statDefs = [
  { key: "totalEpisodes", tKey: "episodes", format: (v: number) => String(v) },
  { key: "avgIntensity", tKey: "avgIntensity", format: (v: number) => v.toFixed(1) },
  { key: "maxIntensity", tKey: "peak", format: (v: number) => `${v}/10` },
  { key: "episodesPerWeek", tKey: "perWeek", format: (v: number) => v.toFixed(1) },
] as const;

export function SummaryStats({ data }: SummaryStatsProps) {
  const t = useTranslations("analytics");

  return (
    <div className="grid grid-cols-4 gap-2">
      {statDefs.map((s) => (
        <div
          key={s.key}
          className="flex flex-col items-center rounded-xl border border-border bg-bg-surface p-3"
        >
          <span className="text-lg font-bold text-accent">
            {s.format(data[s.key])}
          </span>
          <span className="text-[10px] text-text-secondary">{t(s.tKey)}</span>
        </div>
      ))}
    </div>
  );
}
