"use client";

import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";

interface FrequencyChartProps {
  data: { label: string; count: number }[];
}

export function FrequencyChart({ data }: FrequencyChartProps) {
  const hasData = data.some((d) => d.count > 0);
  const isDaily = data.length > 12;

  // For 30-day daily view, show every Nth label to avoid crowding
  const labelInterval = data.length <= 7 ? 0 : data.length <= 14 ? 1 : Math.floor(data.length / 7) - 1;

  return (
    <div className="rounded-[var(--radius-md)] border border-border bg-bg-surface p-4">
      <h3 className="mb-4 text-sm font-medium text-text-secondary">
        {isDaily ? "Daily Frequency" : "Weekly Frequency"}
      </h3>
      {!hasData ? (
        <p className="py-8 text-center text-sm text-text-secondary">No data yet</p>
      ) : (
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="freqGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
              interval={labelInterval}
            />
            <YAxis hide allowDecimals={false} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="var(--accent-primary)"
              strokeWidth={2}
              fill="url(#freqGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
