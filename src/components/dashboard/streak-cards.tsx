import { Shield, Trophy } from "lucide-react";

interface StreakCardsProps {
  daysSinceLast: number;
  longestStreak: number;
}

export function StreakCards({ daysSinceLast, longestStreak }: StreakCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Days since last episode */}
      <div className="flex flex-col items-center gap-2 rounded-[var(--radius-md)] border border-border bg-bg-surface p-4">
        <Shield size={24} className="text-accent-mint" />
        <span className="font-heading text-3xl font-bold text-accent-mint">
          {daysSinceLast}
        </span>
        <span className="text-center text-[11px] text-text-secondary">
          {daysSinceLast === 1 ? "day" : "days"} since last episode
        </span>
      </div>

      {/* Longest streak */}
      <div className="flex flex-col items-center gap-2 rounded-[var(--radius-md)] border border-border bg-bg-surface p-4">
        <Trophy size={24} className="text-accent-secondary" />
        <span className="font-heading text-3xl font-bold text-accent-secondary">
          {longestStreak}
        </span>
        <span className="text-center text-[11px] text-text-secondary">
          {longestStreak === 1 ? "day" : "days"} best streak
        </span>
      </div>
    </div>
  );
}
