"use client";

import dynamic from "next/dynamic";

interface WeeklyChartProps {
  data: { day: string; count: number; maxIntensity: number }[];
}

function getBarColor(intensity: number): string {
  if (intensity === 0) return "var(--bg-surface)";
  if (intensity <= 3) return "var(--severity-low)";
  if (intensity <= 7) return "var(--severity-mid)";
  return "var(--severity-high)";
}

/** Lazy-load recharts — saves ~120KB from initial bundle */
const LazyBarChart = dynamic(
  () => import("recharts").then((mod) => {
    const { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } = mod;

    function ChartInner({ data }: { data: WeeklyChartProps["data"] }) {
      return (
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={data} barSize={24}>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
            />
            <YAxis hide allowDecimals={false} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {data.map((entry, i) => (
                <Cell key={i} fill={getBarColor(entry.maxIntensity)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );
    }

    return ChartInner;
  }),
  {
    ssr: false,
    loading: () => (
      <div className="h-[140px] animate-pulse rounded-lg bg-bg-elevated" />
    ),
  }
);

export function WeeklyChart({ data }: WeeklyChartProps) {
  const hasData = data.some((d) => d.count > 0);

  if (!hasData) {
    return (
      <div className="rounded-[var(--radius-md)] border border-border bg-bg-surface p-4">
        <h3 className="text-sm font-medium text-text-secondary">This Week</h3>
        <p className="mt-4 text-center text-sm text-text-secondary">No episodes this week</p>
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-md)] border border-border bg-bg-surface p-4">
      <h3 className="mb-4 text-sm font-medium text-text-secondary">This Week</h3>
      <LazyBarChart data={data} />
    </div>
  );
}
