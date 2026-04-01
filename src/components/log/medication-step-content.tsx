"use client";

import { useState } from "react";
import { Pill, Check, X } from "lucide-react";
import type { UserMedication } from "@/lib/types/episode";

interface SelectedMed {
  id: string;
  name: string;
  dose: string;
}

interface MedicationStepContentProps {
  userMeds: UserMedication[];
  selectedMeds: SelectedMed[];
  onSelect: (meds: SelectedMed[]) => void;
}

export function MedicationStepContent({ userMeds, selectedMeds, onSelect }: MedicationStepContentProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [dose, setDose] = useState("");

  function handleAdd(med: UserMedication) {
    onSelect([...selectedMeds, { id: med.id, name: med.name, dose: dose.trim() }]);
    setExpandedId(null);
    setDose("");
  }

  function handleRemove(medId: string) {
    onSelect(selectedMeds.filter((m) => m.id !== medId));
  }

  const selectedIds = new Set(selectedMeds.map((m) => m.id));

  if (userMeds.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <Pill size={32} className="text-text-secondary" />
        <p className="text-sm text-text-secondary">No medications in your library yet.</p>
        <a href="/profile" className="text-sm text-accent underline">Add in Profile → My Medications</a>
        <p className="text-xs text-text-secondary">You can skip this step</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Selected medications */}
      {selectedMeds.length > 0 && (
        <div className="space-y-2">
          {selectedMeds.map((m) => (
            <div key={m.id} className="flex items-center gap-2 rounded-full bg-accent/10 px-3 py-2 text-sm">
              <Check size={14} className="text-accent" />
              <span className="font-medium">{m.name}</span>
              {m.dose && <span className="text-text-secondary">{m.dose}</span>}
              <button
                onClick={() => handleRemove(m.id)}
                className="ml-auto flex h-5 w-5 items-center justify-center rounded-full hover:bg-bg-surface"
              >
                <X size={12} className="text-text-secondary" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Available medications */}
      <div className="flex flex-wrap gap-2">
        {userMeds
          .filter((m) => !selectedIds.has(m.id))
          .map((med) => (
            <div key={med.id}>
              {expandedId === med.id ? (
                <div className="flex items-center gap-2 rounded-[var(--radius-md)] border border-accent/30 bg-bg-surface p-2">
                  <Pill size={16} className="shrink-0 text-accent" />
                  <span className="text-sm font-medium">{med.name}</span>
                  <input
                    type="text"
                    placeholder="Dose"
                    value={dose}
                    onChange={(e) => setDose(e.target.value)}
                    className="w-20 rounded-[var(--radius-sm)] bg-bg-elevated px-2 py-1 text-xs outline-none placeholder:text-text-secondary"
                    autoFocus
                  />
                  <button
                    onClick={() => handleAdd(med)}
                    className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-white"
                  >
                    Add
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setExpandedId(med.id); setDose(med.defaultDose ?? ""); }}
                  className="flex items-center gap-1.5 rounded-full border border-border bg-bg-surface px-3 py-1.5 text-sm hover:border-accent/30 hover:bg-accent/5"
                >
                  <Pill size={14} className="text-text-secondary" />
                  {med.name}
                </button>
              )}
            </div>
          ))}
      </div>

      {selectedMeds.length === 0 && (
        <p className="text-center text-xs text-text-secondary">Tap a medication to add it, or skip to save</p>
      )}
    </div>
  );
}
