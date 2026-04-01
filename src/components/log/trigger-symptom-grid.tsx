"use client";

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

const triggers: { id: TriggerType; label: string; icon: typeof Brain }[] = [
  { id: "stress", label: "Stress", icon: Brain },
  { id: "sleep", label: "Sleep", icon: Moon },
  { id: "food", label: "Food", icon: UtensilsCrossed },
  { id: "weather", label: "Weather", icon: Cloud },
  { id: "hormones", label: "Hormones", icon: Heart },
  { id: "screen", label: "Screen", icon: Monitor },
  { id: "alcohol", label: "Alcohol", icon: Wine },
  { id: "caffeine", label: "Caffeine", icon: Coffee },
];

const symptoms: { id: SymptomType; label: string; icon: typeof Eye }[] = [
  { id: "aura", label: "Aura", icon: Eye },
  { id: "nausea", label: "Nausea", icon: Frown },
  { id: "light_sensitivity", label: "Light", icon: Sun },
  { id: "sound_sensitivity", label: "Sound", icon: Volume2 },
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
  return (
    <div className="space-y-6">
      {/* Triggers */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-text-secondary">Triggers</h3>
        <div className="grid grid-cols-4 gap-2">
          {triggers.map((t) => (
            <ToggleCard
              key={t.id}
              label={t.label}
              icon={t.icon}
              selected={selectedTriggers.includes(t.id)}
              onToggle={() => onToggleTrigger(t.id)}
            />
          ))}
        </div>
      </div>

      {/* Symptoms */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-text-secondary">Symptoms</h3>
        <div className="grid grid-cols-4 gap-2">
          {symptoms.map((s) => (
            <ToggleCard
              key={s.id}
              label={s.label}
              icon={s.icon}
              selected={selectedSymptoms.includes(s.id)}
              onToggle={() => onToggleSymptom(s.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
