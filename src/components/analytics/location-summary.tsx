"use client";

import type { PainLocation } from "@/lib/types/database";

interface LocationSummaryProps {
  data: { location: PainLocation; count: number; opacity: number }[];
}

/** Human-readable labels for pain locations */
const locationLabels: Record<string, string> = {
  crown: "Crown",
  left_forehead: "L Forehead",
  right_forehead: "R Forehead",
  left_temple: "L Temple",
  right_temple: "R Temple",
  left_behind_eye: "L Eye",
  right_behind_eye: "R Eye",
  left_back_of_head: "L Back",
  right_back_of_head: "R Back",
  left_neck: "L Neck",
  right_neck: "R Neck",
  full_head: "Full Head",
  /* legacy */
  forehead: "Forehead",
  behind_eyes: "Eyes",
  back_of_head: "Back",
  neck: "Neck",
};

export function LocationSummary({ data }: LocationSummaryProps) {
  const sorted = [...data].sort((a, b) => b.count - a.count);
  const max = sorted[0]?.count ?? 1;

  return (
    <div className="rounded-[var(--radius-md)] border border-border bg-bg-surface p-4">
      <h3 className="mb-3 text-sm font-medium text-text-secondary">Pain Locations</h3>
      {sorted.length === 0 ? (
        <p className="py-4 text-center text-sm text-text-secondary">No data yet</p>
      ) : (
        <div className="space-y-2">
          {sorted.slice(0, 5).map((item) => (
            <div key={item.location} className="flex items-center gap-2">
              <span className="w-16 shrink-0 text-[11px] text-text-secondary">
                {locationLabels[item.location] ?? item.location}
              </span>
              <div className="relative h-4 flex-1 overflow-hidden rounded-full bg-bg-elevated">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-accent"
                  style={{
                    width: `${Math.max(12, (item.count / max) * 100)}%`,
                    opacity: 0.6 + 0.4 * (item.count / max),
                  }}
                />
              </div>
              <span className="w-5 text-right text-xs font-medium text-text-primary">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
