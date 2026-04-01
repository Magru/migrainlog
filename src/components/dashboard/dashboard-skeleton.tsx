/** Lightweight skeleton shown instantly while dashboard data loads */
export function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Streak cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="h-24 rounded-[var(--radius-md)] bg-bg-surface" />
        <div className="h-24 rounded-[var(--radius-md)] bg-bg-surface" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="h-20 rounded-[var(--radius-md)] bg-bg-surface" />
        <div className="h-20 rounded-[var(--radius-md)] bg-bg-surface" />
        <div className="h-20 rounded-[var(--radius-md)] bg-bg-surface" />
      </div>

      {/* Last episode card */}
      <div className="h-28 rounded-[var(--radius-md)] bg-bg-surface" />

      {/* Weekly chart */}
      <div className="h-48 rounded-[var(--radius-md)] bg-bg-surface" />

      {/* Insight card */}
      <div className="h-20 rounded-[var(--radius-md)] bg-bg-surface" />
    </div>
  );
}
