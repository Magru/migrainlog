"use client";

import { useTranslations, useLocale } from "next-intl";
import { getSeverityLevel } from "@/lib/types/database";
import { relativeDate, formatDuration } from "@/lib/utils/date-helpers";
import type { EpisodeWithDetails } from "@/lib/types/episode";

const severityColors = {
  mild: "bg-severity-low",
  moderate: "bg-severity-mid",
  severe: "bg-severity-high",
};

interface LastEpisodeCardProps {
  episode: EpisodeWithDetails | null;
}

export function LastEpisodeCard({ episode }: LastEpisodeCardProps) {
  const t = useTranslations("dashboard");
  const tTriggers = useTranslations("triggers");
  const locale = useLocale();

  if (!episode) {
    return (
      <div className="rounded-[var(--radius-md)] border border-border bg-bg-surface p-4">
        <h3 className="text-sm font-medium text-text-secondary">{t("lastEpisode")}</h3>
        <p className="mt-2 text-text-secondary">{t("noEpisodesYet")}</p>
      </div>
    );
  }

  const severity = getSeverityLevel(episode.intensity ?? 5);

  return (
    <div className="rounded-[var(--radius-md)] border border-border bg-bg-surface p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-text-secondary">{t("lastEpisode")}</h3>
        <span className="text-xs text-text-secondary">{relativeDate(episode.startedAt, locale)}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className={`h-3 w-3 rounded-full ${severityColors[severity]}`} />
        <span className="font-heading text-lg font-bold">
          {t("intensity", { value: episode.intensity ?? 5 })}
        </span>
        <span className="text-sm text-text-secondary">
          {formatDuration(episode.startedAt, episode.endedAt, locale)}
        </span>
      </div>

      {episode.triggers.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {episode.triggers.map((tr) => (
            <span
              key={tr}
              className="rounded-full bg-bg-elevated px-2.5 py-0.5 text-xs text-text-secondary"
            >
              {tTriggers(tr)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
