const triggerLabels: Record<string, string> = {
  stress: "Stress", sleep: "Sleep", food: "Food", weather: "Weather",
  hormones: "Hormones", screen: "Screen", alcohol: "Alcohol", caffeine: "Caffeine",
};

interface TriggerBarsProps {
  data: { trigger: string; count: number }[];
}

export function TriggerBars({ data }: TriggerBarsProps) {
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="rounded-[var(--radius-md)] border border-border bg-bg-surface p-4">
      <h3 className="mb-4 text-sm font-medium text-text-secondary">Top Triggers</h3>
      {data.length === 0 ? (
        <p className="py-4 text-center text-sm text-text-secondary">No trigger data yet</p>
      ) : (
        <div className="space-y-3">
          {data.slice(0, 6).map((d) => (
            <div key={d.trigger} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-text-primary">{triggerLabels[d.trigger] ?? d.trigger}</span>
                <span className="text-text-secondary">{d.count}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-bg-elevated">
                <div
                  className="h-2 rounded-full bg-accent transition-all"
                  style={{ width: `${(d.count / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
