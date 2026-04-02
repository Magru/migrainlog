"use client";

import { useTranslations } from "next-intl";
import { getSeverityLevel } from "@/lib/types/database";

interface IntensitySliderProps {
  value: number;
  onChange: (value: number) => void;
}

const severityColors = {
  mild: "var(--severity-low)",
  moderate: "var(--severity-mid)",
  severe: "var(--severity-high)",
} as const;

export function IntensitySlider({ value, onChange }: IntensitySliderProps) {
  const tSeverity = useTranslations("severity");
  const severity = getSeverityLevel(value);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Large number display */}
      <div className="text-center">
        <span
          className="font-heading text-7xl font-extrabold"
          style={{ color: severityColors[severity] }}
        >
          {value}
        </span>
        <p
          className="mt-1 text-lg font-medium"
          style={{ color: severityColors[severity] }}
        >
          {tSeverity(severity)}
        </p>
      </div>

      {/* Custom slider */}
      <div className="w-full px-2">
        <input
          type="range"
          min={1}
          max={10}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="intensity-slider w-full"
          aria-label={`Pain intensity: ${value} out of 10, ${tSeverity(severity)}`}
        />
        <div className="mt-2 flex justify-between text-xs text-text-secondary">
          <span>1</span>
          <span>5</span>
          <span>10</span>
        </div>
      </div>

      {/* Slider custom styles */}
      <style jsx>{`
        .intensity-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 8px;
          border-radius: 4px;
          background: linear-gradient(
            to right,
            var(--severity-low) 0%,
            var(--severity-mid) 50%,
            var(--severity-high) 100%
          );
          outline: none;
        }
        .intensity-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 0 12px ${severityColors[severity]}80;
          border: 2px solid ${severityColors[severity]};
        }
        .intensity-slider::-moz-range-thumb {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 0 12px ${severityColors[severity]}80;
          border: 2px solid ${severityColors[severity]};
        }
      `}</style>
    </div>
  );
}
