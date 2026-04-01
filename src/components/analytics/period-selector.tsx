"use client";

import { useState } from "react";

export type PeriodKey = "week" | "month" | "3months" | "custom";

interface PeriodSelectorProps {
  value: PeriodKey;
  onChange: (period: PeriodKey, from: string, to: string) => void;
}

const presets: { key: PeriodKey; label: string; days: number }[] = [
  { key: "week", label: "7D", days: 7 },
  { key: "month", label: "30D", days: 30 },
  { key: "3months", label: "90D", days: 90 },
];

function toISODate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function daysAgo(n: number): [string, string] {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - n);
  return [from.toISOString(), to.toISOString()];
}

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  const [showCustom, setShowCustom] = useState(false);
  const [customFrom, setCustomFrom] = useState(toISODate(new Date(Date.now() - 30 * 86400000)));
  const [customTo, setCustomTo] = useState(toISODate(new Date()));

  function handlePreset(preset: (typeof presets)[number]) {
    setShowCustom(false);
    const [from, to] = daysAgo(preset.days);
    onChange(preset.key, from, to);
  }

  function handleCustomToggle() {
    if (showCustom) {
      setShowCustom(false);
    } else {
      setShowCustom(true);
      onChange("custom", new Date(customFrom).toISOString(), new Date(customTo + "T23:59:59").toISOString());
    }
  }

  function handleCustomApply() {
    onChange("custom", new Date(customFrom).toISOString(), new Date(customTo + "T23:59:59").toISOString());
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-1 rounded-full border border-border bg-bg-surface p-1">
        {presets.map((p) => (
          <button
            key={p.key}
            onClick={() => handlePreset(p)}
            className={`flex-1 rounded-full py-1.5 text-xs font-medium transition-all ${
              value === p.key && !showCustom
                ? "bg-accent text-white"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {p.label}
          </button>
        ))}
        <button
          onClick={handleCustomToggle}
          className={`flex-1 rounded-full py-1.5 text-xs font-medium transition-all ${
            value === "custom" || showCustom
              ? "bg-accent text-white"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          Custom
        </button>
      </div>

      {showCustom && (
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={customFrom}
            max={customTo}
            onChange={(e) => setCustomFrom(e.target.value)}
            className="flex-1 rounded-lg border border-border bg-bg-surface px-2 py-1.5 text-xs text-text-primary"
          />
          <span className="text-xs text-text-secondary">—</span>
          <input
            type="date"
            value={customTo}
            min={customFrom}
            max={toISODate(new Date())}
            onChange={(e) => setCustomTo(e.target.value)}
            className="flex-1 rounded-lg border border-border bg-bg-surface px-2 py-1.5 text-xs text-text-primary"
          />
          <button
            onClick={handleCustomApply}
            className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white"
          >
            Go
          </button>
        </div>
      )}
    </div>
  );
}
