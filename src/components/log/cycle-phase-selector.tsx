"use client";

import type { MenstrualPhase, OvulationPhase } from "@/lib/types/database";

interface CyclePhaseSelectorProps {
  menstrualPhase: MenstrualPhase | null;
  ovulationPhase: OvulationPhase | null;
  onMenstrualChange: (phase: MenstrualPhase | null) => void;
  onOvulationChange: (phase: OvulationPhase | null) => void;
}

const phaseOptions: { value: MenstrualPhase; label: string }[] = [
  { value: "before", label: "Before" },
  { value: "during", label: "During" },
  { value: "after", label: "After" },
  { value: "not_applicable", label: "N/A" },
];

function PhaseRow<T extends string>({
  label,
  selected,
  onChange,
}: {
  label: string;
  selected: T | null;
  onChange: (value: T | null) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-text-secondary">{label}</p>
      <div className="flex gap-2">
        {phaseOptions.map((opt) => {
          const isSelected = selected === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(isSelected ? null : (opt.value as T))}
              className={`flex-1 rounded-full border px-2 py-2 text-xs font-medium transition-all ${
                isSelected
                  ? "border-accent bg-accent/10 text-accent shadow-[0_0_12px_rgba(123,97,255,0.15)]"
                  : "border-border bg-bg-surface text-text-secondary hover:border-text-secondary"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function CyclePhaseSelector({
  menstrualPhase,
  ovulationPhase,
  onMenstrualChange,
  onOvulationChange,
}: CyclePhaseSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-text-secondary">
        Menstrual Cycle
      </h3>
      <PhaseRow<MenstrualPhase>
        label="Period:"
        selected={menstrualPhase}
        onChange={onMenstrualChange}
      />
      <PhaseRow<OvulationPhase>
        label="Ovulation:"
        selected={ovulationPhase}
        onChange={onOvulationChange}
      />
    </div>
  );
}
