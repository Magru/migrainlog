"use client";

import { useTranslations } from "next-intl";

interface CyclePhaseBarsProps {
  data: {
    menstrual: { phase: string; count: number }[];
    ovulation: { phase: string; count: number }[];
    total: number;
  };
}

function PhaseBarGroup({ title, items, max, tCycle }: { title: string; items: { phase: string; count: number }[]; max: number; tCycle: ReturnType<typeof useTranslations> }) {
  if (items.length === 0) return null;
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-text-secondary">{title}</p>
      {items.map((d) => (
        <div key={d.phase} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-text-primary">{tCycle(d.phase)}</span>
            <span className="text-text-secondary">{d.count}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-bg-elevated">
            <div
              className="h-2 rounded-full bg-pink-400 transition-all"
              style={{ width: `${(d.count / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CyclePhaseBars({ data }: CyclePhaseBarsProps) {
  const t = useTranslations("analytics");
  const tCycle = useTranslations("cycle");

  if (data.total === 0) return null;

  const allCounts = [...data.menstrual, ...data.ovulation].map((d) => d.count);
  const max = Math.max(...allCounts, 1);

  return (
    <div className="rounded-[var(--radius-md)] border border-border bg-bg-surface p-4">
      <h3 className="mb-4 text-sm font-medium text-text-secondary">{t("cyclePhases")}</h3>
      <div className="space-y-4">
        <PhaseBarGroup title={t("period")} items={data.menstrual} max={max} tCycle={tCycle} />
        <PhaseBarGroup title={t("ovulation")} items={data.ovulation} max={max} tCycle={tCycle} />
      </div>
    </div>
  );
}
