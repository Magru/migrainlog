"use client";

import { useTranslations } from "next-intl";
import { Shield, Trophy } from "lucide-react";

interface StreakCardsProps {
  daysSinceLast: number;
  longestStreak: number;
}

export function StreakCards({ daysSinceLast, longestStreak }: StreakCardsProps) {
  const t = useTranslations("dashboard");

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Days since last episode */}
      <div className="flex flex-col items-center gap-2 rounded-[var(--radius-md)] border border-border bg-bg-surface p-4">
        <Shield size={24} className="text-accent-mint" />
        <span className="font-heading text-3xl font-bold text-accent-mint">
          {daysSinceLast}
        </span>
        <span className="text-center text-[11px] text-text-secondary">
          {t("daysSinceLastEpisode", { count: daysSinceLast })}
        </span>
      </div>

      {/* Longest streak */}
      <div className="flex flex-col items-center gap-2 rounded-[var(--radius-md)] border border-border bg-bg-surface p-4">
        <Trophy size={24} className="text-accent-secondary" />
        <span className="font-heading text-3xl font-bold text-accent-secondary">
          {longestStreak}
        </span>
        <span className="text-center text-[11px] text-text-secondary">
          {t("daysBestStreak", { count: longestStreak })}
        </span>
      </div>
    </div>
  );
}
