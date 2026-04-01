import { StatsRow } from "@/components/dashboard/stats-row";
import { StreakCards } from "@/components/dashboard/streak-cards";
import { LastEpisodeCard } from "@/components/dashboard/last-episode-card";
import { WeeklyChart } from "@/components/dashboard/weekly-chart";
import { InsightCard } from "@/components/dashboard/insight-card";
import { getDashboardStats } from "@/lib/queries/episode-queries";

/** Async server component — fetches data while Suspense shows skeleton */
export async function DashboardContent() {
  const stats = await getDashboardStats();

  return (
    <>
      <StreakCards daysSinceLast={stats.daysSinceLast} longestStreak={stats.longestStreak} />

      <StatsRow
        totalEpisodes={stats.totalEpisodes}
        avgIntensity={stats.avgIntensity}
        topTrigger={stats.topTrigger}
      />

      <LastEpisodeCard episode={stats.lastEpisode} />

      <WeeklyChart data={stats.weeklyData} />

      <InsightCard
        totalEpisodes={stats.totalEpisodes}
        topTrigger={stats.topTrigger}
        avgIntensity={stats.avgIntensity}
      />
    </>
  );
}
