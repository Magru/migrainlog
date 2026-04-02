"use client";

import { useTranslations } from "next-intl";
import type { MenstrualPhase, OvulationPhase } from "@/lib/types/database";

interface CyclePhaseSelectorProps {
  menstrualPhase: MenstrualPhase | null;
  ovulationPhase: OvulationPhase | null;
  onMenstrualChange: (phase: MenstrualPhase | null) => void;
  onOvulationChange: (phase: OvulationPhase | null) => void;
}

const phaseValues: MenstrualPhase[] = ["before", "during", "after", "not_applicable"];

function PhaseRow<T extends string>({
  label,
  selected,
  onChange,
  tCycle,
}: {
  label: string;
  selected: T | null;
  onChange: (value: T | null) => void;
  tCycle: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-text-secondary">{label}</p>
      <div className="flex gap-2">
        {phaseValues.map((val) => {
          const isSelected = selected === val;
          return (
            <button
              key={val}
              onClick={() => onChange(isSelected ? null : (val as T))}
              className={`flex-1 rounded-full border px-2 py-2 text-xs font-medium transition-all ${
                isSelected
                  ? "border-accent bg-accent/10 text-accent shadow-[0_0_12px_rgba(123,97,255,0.15)]"
                  : "border-border bg-bg-surface text-text-secondary hover:border-text-secondary"
              }`}
            >
              {tCycle(val)}
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
  const tCycle = useTranslations("cycle");

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-text-secondary">
        {tCycle("menstrualCycle")}
      </h3>
      <PhaseRow<MenstrualPhase>
        label={tCycle("period")}
        selected={menstrualPhase}
        onChange={onMenstrualChange}
        tCycle={tCycle}
      />
      <PhaseRow<OvulationPhase>
        label={tCycle("ovulation")}
        selected={ovulationPhase}
        onChange={onOvulationChange}
        tCycle={tCycle}
      />
    </div>
  );
}
