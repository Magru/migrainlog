"use client";

import { useRef, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";

interface FrequencyChartProps {
  data: { label: string; count: number }[];
}

/** Pixels per data point — enough space for readable labels */
const PX_PER_POINT = 48;
/** If chart fits in this width, no scrolling needed */
const MIN_SCROLL_WIDTH = 380;

export function FrequencyChart({ data }: FrequencyChartProps) {
  const hasData = data.some((d) => d.count > 0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to the right (most recent) on mount
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [data]);

  const chartWidth = Math.max(MIN_SCROLL_WIDTH, data.length * PX_PER_POINT);
  const needsScroll = data.length > 8;

  return (
    <div className="rounded-[var(--radius-md)] border border-border bg-bg-surface p-4">
      <h3 className="mb-4 text-sm font-medium text-text-secondary">
        Frequency
        {needsScroll && (
          <span className="ml-2 text-[10px] font-normal text-text-secondary/60">← swipe →</span>
        )}
      </h3>
      {!hasData ? (
        <p className="py-8 text-center text-sm text-text-secondary">No data yet</p>
      ) : needsScroll ? (
        <div
          ref={scrollRef}
          className="overflow-x-auto scrollbar-none"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div style={{ width: chartWidth, height: 160 }}>
            <AreaChart width={chartWidth} height={160} data={data}>
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
                tick={{ fill: "var(--text-secondary)", fontSize: 10 }}
                interval={0}
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
          </div>
        </div>
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
              interval={0}
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
