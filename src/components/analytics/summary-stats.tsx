"use client";

interface SummaryStatsProps {
  data: {
    totalEpisodes: number;
    avgIntensity: number;
    maxIntensity: number;
    episodesPerWeek: number;
  };
}

const stats = [
  { key: "totalEpisodes", label: "Episodes", format: (v: number) => String(v) },
  { key: "avgIntensity", label: "Avg Intensity", format: (v: number) => v.toFixed(1) },
  { key: "maxIntensity", label: "Peak", format: (v: number) => `${v}/10` },
  { key: "episodesPerWeek", label: "Per Week", format: (v: number) => v.toFixed(1) },
] as const;

export function SummaryStats({ data }: SummaryStatsProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {stats.map((s) => (
        <div
          key={s.key}
          className="flex flex-col items-center rounded-xl border border-border bg-bg-surface p-3"
        >
          <span className="text-lg font-bold text-accent">
            {s.format(data[s.key])}
          </span>
          <span className="text-[10px] text-text-secondary">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
