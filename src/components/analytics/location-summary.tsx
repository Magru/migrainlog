"use client";

import { useTranslations } from "next-intl";
import type { PainLocation } from "@/lib/types/database";

interface LocationSummaryProps {
  data: { location: PainLocation; count: number; opacity: number }[];
}

export function LocationSummary({ data }: LocationSummaryProps) {
  const t = useTranslations("analytics");
  const tLoc = useTranslations("locations");
  const tc = useTranslations("common");
  const sorted = [...data].sort((a, b) => b.count - a.count);
  const max = sorted[0]?.count ?? 1;

  return (
    <div className="rounded-[var(--radius-md)] border border-border bg-bg-surface p-4">
      <h3 className="mb-3 text-sm font-medium text-text-secondary">{t("painLocations")}</h3>
      {sorted.length === 0 ? (
        <p className="py-4 text-center text-sm text-text-secondary">{tc("noDataYet")}</p>
      ) : (
        <div className="space-y-2">
          {sorted.slice(0, 5).map((item) => (
            <div key={item.location} className="flex items-center gap-2">
              <span className="w-16 shrink-0 text-[11px] text-text-secondary">
                {tLoc(item.location)}
              </span>
              <div className="relative h-4 flex-1 overflow-hidden rounded-full bg-bg-elevated">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-accent"
                  style={{
                    width: `${Math.max(12, (item.count / max) * 100)}%`,
                    opacity: 0.6 + 0.4 * (item.count / max),
                  }}
                />
              </div>
              <span className="w-5 text-right text-xs font-medium text-text-primary">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
