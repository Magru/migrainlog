"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Pill, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addEpisodeMedication } from "@/lib/actions/medication-actions";
import type { UserMedication } from "@/lib/types/episode";

interface MedicationPickerProps {
  episodeId: string;
  medications: UserMedication[];
}

interface AddedMed {
  name: string;
  dose: string | null;
}

export function MedicationPicker({ episodeId, medications }: MedicationPickerProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [dose, setDose] = useState("");
  const [added, setAdded] = useState<AddedMed[]>([]);
  const [isPending, startTransition] = useTransition();

  function handleExpand(med: UserMedication) {
    setExpandedId(med.id);
    setDose(med.defaultDose ?? "");
  }

  function handleAdd(med: UserMedication) {
    startTransition(async () => {
      const result = await addEpisodeMedication({
        episodeId,
        userMedicationId: med.id,
        dose: dose.trim() || undefined,
      });
      if (result.success) {
        setAdded((prev) => [...prev, { name: med.name, dose: dose.trim() || null }]);
        setExpandedId(null);
        setDose("");
      }
    });
  }

  if (medications.length === 0) {
    return (
      <div className="text-center text-sm text-text-secondary">
        <p>No medications in your library.</p>
        <Link href="/profile" className="text-accent underline">Add in Profile → My Medications</Link>
      </div>
    );
  }

  // Filter out already-added meds
  const addedNames = new Set(added.map((a) => a.name));

  return (
    <div className="space-y-3">
      {/* Added medications */}
      {added.length > 0 && (
        <div className="space-y-1.5">
          {added.map((m, i) => (
            <div key={i} className="flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1.5 text-sm">
              <Check size={14} className="text-accent" />
              <span className="font-medium">{m.name}</span>
              {m.dose && <span className="text-text-secondary">{m.dose}</span>}
            </div>
          ))}
        </div>
      )}

      {/* Medication chips */}
      <div className="flex flex-wrap gap-2">
        {medications
          .filter((m) => !addedNames.has(m.name))
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
                  <Button
                    onClick={() => handleAdd(med)}
                    disabled={isPending}
                    size="sm"
                    className="h-7 rounded-full bg-accent px-3 text-xs text-white"
                  >
                    {isPending ? "..." : "Add"}
                  </Button>
                </div>
              ) : (
                <button
                  onClick={() => handleExpand(med)}
                  className="flex items-center gap-1.5 rounded-full border border-border bg-bg-surface px-3 py-1.5 text-sm hover:border-accent/30 hover:bg-accent/5"
                >
                  <Pill size={14} className="text-text-secondary" />
                  {med.name}
                </button>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
