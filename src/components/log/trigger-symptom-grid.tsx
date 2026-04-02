"use client";

import { useTranslations } from "next-intl";
import {
  Brain, Moon, UtensilsCrossed, Cloud,
  Heart, Monitor, Wine, Coffee,
  Eye, Frown, Sun, Volume2,
} from "lucide-react";
import type { TriggerType, SymptomType } from "@/lib/types/database";

interface TriggerSymptomGridProps {
  selectedTriggers: TriggerType[];
  selectedSymptoms: SymptomType[];
  onToggleTrigger: (trigger: TriggerType) => void;
  onToggleSymptom: (symptom: SymptomType) => void;
}

const triggerItems: { id: TriggerType; icon: typeof Brain }[] = [
  { id: "stress", icon: Brain },
  { id: "sleep", icon: Moon },
  { id: "food", icon: UtensilsCrossed },
  { id: "weather", icon: Cloud },
  { id: "hormones", icon: Heart },
  { id: "screen", icon: Monitor },
  { id: "alcohol", icon: Wine },
  { id: "caffeine", icon: Coffee },
];

const symptomItems: { id: SymptomType; icon: typeof Eye }[] = [
  { id: "aura", icon: Eye },
  { id: "nausea", icon: Frown },
  { id: "light_sensitivity", icon: Sun },
  { id: "sound_sensitivity", icon: Volume2 },
];

function ToggleCard({
  label,
  icon: Icon,
  selected,
  onToggle,
}: {
  label: string;
  icon: typeof Brain;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={selected}
      className={`flex h-[72px] w-full flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] border transition-all ${
        selected
          ? "border-accent bg-accent/10 text-accent shadow-[0_0_12px_rgba(123,97,255,0.15)]"
          : "border-border bg-bg-surface text-text-secondary hover:border-text-secondary"
      }`}
    >
      <Icon size={24} />
      <span className="text-[11px] font-medium leading-tight">{label}</span>
    </button>
  );
}

export function TriggerSymptomGrid({
  selectedTriggers,
  selectedSymptoms,
  onToggleTrigger,
  onToggleSymptom,
}: TriggerSymptomGridProps) {
  const tTriggers = useTranslations("triggers");
  const tSymptoms = useTranslations("symptoms");

  return (
    <div className="space-y-6">
      {/* Triggers */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-text-secondary">{tTriggers("heading")}</h3>
        <div className="grid grid-cols-4 gap-2">
          {triggerItems.map((item) => (
            <ToggleCard
              key={item.id}
              label={tTriggers(item.id)}
              icon={item.icon}
              selected={selectedTriggers.includes(item.id)}
              onToggle={() => onToggleTrigger(item.id)}
            />
          ))}
        </div>
      </div>

      {/* Symptoms */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-text-secondary">{tSymptoms("heading")}</h3>
        <div className="grid grid-cols-4 gap-2">
          {symptomItems.map((item) => (
            <ToggleCard
              key={item.id}
              label={tSymptoms(item.id)}
              icon={item.icon}
              selected={selectedSymptoms.includes(item.id)}
              onToggle={() => onToggleSymptom(item.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
