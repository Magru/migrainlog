"use client";

import { daysInMonth, firstDayOfWeek } from "@/lib/utils/date-helpers";
import { getSeverityLevel } from "@/lib/types/database";
import type { EpisodeWithDetails } from "@/lib/types/episode";

interface CalendarHeatmapProps {
  year: number;
  month: number;
  episodesByDay: Record<string, EpisodeWithDetails[]>;
  onDayClick: (date: string) => void;
}

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const severityBg: Record<string, string> = {
  mild: "bg-severity-low",
  moderate: "bg-severity-mid",
  severe: "bg-severity-high",
};

export function CalendarHeatmap({ year, month, episodesByDay, onDayClick }: CalendarHeatmapProps) {
  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfWeek(year, month);

  const cells: (number | null)[] = [];
  // Empty cells for offset
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);

  function getDayKey(day: number) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  return (
    <div>
      {/* Week day headers */}
      <div className="mb-2 grid grid-cols-7 gap-1">
        {weekDays.map((d) => (
          <div key={d} className="text-center text-[10px] font-medium text-text-secondary">
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} className="aspect-square" />;
          }

          const dateKey = getDayKey(day);
          const dayEpisodes = episodesByDay[dateKey];
          const hasEpisode = dayEpisodes && dayEpisodes.length > 0;
          const worstIntensity = hasEpisode
            ? Math.max(...dayEpisodes.map((e) => e.intensity ?? 0))
            : 0;
          const severity = worstIntensity > 0 ? getSeverityLevel(worstIntensity) : null;

          const isToday =
            new Date().getFullYear() === year &&
            new Date().getMonth() === month &&
            new Date().getDate() === day;

          return (
            <button
              key={day}
              onClick={() => onDayClick(dateKey)}
              className={`flex aspect-square items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                severity
                  ? `${severityBg[severity]} text-white`
                  : "bg-bg-surface text-text-secondary hover:bg-bg-elevated"
              } ${isToday ? "ring-2 ring-accent ring-offset-1 ring-offset-bg-base" : ""}`}
              aria-label={`${dateKey}${hasEpisode ? `, ${dayEpisodes.length} episode(s)` : ""}`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
