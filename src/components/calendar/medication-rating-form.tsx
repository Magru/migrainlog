"use client";

import { useState, useTransition } from "react";
import { Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import { rateEpisodeMedication } from "@/lib/actions/medication-actions";
import type { EpisodeMedication } from "@/lib/types/episode";
import type { MedicationEffectiveness } from "@/lib/types/database";

interface MedicationRatingFormProps {
  medication: EpisodeMedication;
}

const effectivenessOptions: { value: MedicationEffectiveness; label: string }[] = [
  { value: "none", label: "No relief" },
  { value: "partial", label: "Partial" },
  { value: "full", label: "Full relief" },
];

export function MedicationRatingForm({ medication }: MedicationRatingFormProps) {
  const isRated = medication.reliefMinutes != null && medication.effectiveness != null;
  const [expanded, setExpanded] = useState(false);
  const [relief, setRelief] = useState(medication.reliefMinutes ?? 30);
  const [effectiveness, setEffectiveness] = useState<MedicationEffectiveness | null>(
    medication.effectiveness
  );
  const [saved, setSaved] = useState(isRated);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    if (effectiveness == null) return;
    startTransition(async () => {
      const result = await rateEpisodeMedication(medication.id, {
        reliefMinutes: relief,
        effectiveness,
      });
      if (result.success) {
        setSaved(true);
        setExpanded(false);
      }
    });
  }

  // Compact rated display
  if (saved && !expanded) {
    const effLabel = effectivenessOptions.find((o) => o.value === (effectiveness ?? medication.effectiveness))?.label;
    return (
      <div className="flex items-center gap-2 rounded-[var(--radius-sm)] bg-accent/5 p-2 text-sm">
        <Pill size={14} className="shrink-0 text-accent" />
        <span className="font-medium">{medication.name}</span>
        {medication.dose && <span className="text-text-secondary">{medication.dose}</span>}
        <span className="text-text-secondary">·</span>
        <span className="text-text-secondary">
          {relief ?? medication.reliefMinutes}мин · {effLabel}
        </span>
      </div>
    );
  }

  // Unrated — show "Rate" badge or expanded form
  if (!expanded) {
    return (
      <div className="flex items-center justify-between rounded-[var(--radius-sm)] bg-accent/5 p-2">
        <div className="flex items-center gap-2 text-sm">
          <Pill size={14} className="shrink-0 text-accent" />
          <span className="font-medium">{medication.name}</span>
          {medication.dose && <span className="text-text-secondary">{medication.dose}</span>}
        </div>
        <button
          onClick={() => setExpanded(true)}
          className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-medium text-accent"
        >
          Rate
        </button>
      </div>
    );
  }

  // Expanded rating form
  return (
    <div className="space-y-3 rounded-[var(--radius-sm)] bg-accent/5 p-3">
      <div className="flex items-center gap-2 text-sm">
        <Pill size={14} className="text-accent" />
        <span className="font-medium">{medication.name}</span>
        {medication.dose && <span className="text-text-secondary">{medication.dose}</span>}
      </div>

      {/* Relief time slider */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <span>Time to relief</span>
          <span className="font-medium text-text-primary">{relief}мин</span>
        </div>
        <input
          type="range"
          min={0}
          max={180}
          step={15}
          value={relief}
          onChange={(e) => setRelief(Number(e.target.value))}
          className="w-full accent-accent"
        />
        <div className="flex justify-between text-[10px] text-text-secondary">
          <span>0мин</span>
          <span>3ч</span>
        </div>
      </div>

      {/* Effectiveness buttons */}
      <div className="flex gap-2">
        {effectivenessOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setEffectiveness(opt.value)}
            className={`flex-1 rounded-full border px-2 py-1.5 text-xs font-medium transition-colors ${
              effectiveness === opt.value
                ? "border-accent bg-accent/20 text-accent"
                : "border-border bg-bg-surface text-text-secondary hover:border-accent/30"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Save button */}
      <Button
        onClick={handleSave}
        disabled={effectiveness == null || isPending}
        size="sm"
        className="w-full rounded-full bg-accent text-xs font-medium text-white"
      >
        {isPending ? "Saving..." : "Save Rating"}
      </Button>
    </div>
  );
}
