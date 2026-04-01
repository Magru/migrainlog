import { PageTransition } from "@/components/layout/page-transition";
import { StatsRow } from "@/components/dashboard/stats-row";
import { StreakCards } from "@/components/dashboard/streak-cards";
import { LastEpisodeCard } from "@/components/dashboard/last-episode-card";
import { WeeklyChart } from "@/components/dashboard/weekly-chart";
import { InsightCard } from "@/components/dashboard/insight-card";
import { getDashboardStats } from "@/lib/queries/episode-queries";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <PageTransition>
      <div className="space-y-6 py-6">
        <div>
          <h1 className="font-heading text-[28px] font-extrabold">Dashboard</h1>
          <p className="text-sm text-text-secondary">This month&apos;s overview</p>
        </div>

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
      </div>
    </PageTransition>
  );
}
