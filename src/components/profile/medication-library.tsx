"use client";

import { useState, useTransition } from "react";
import { Pill, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addUserMedication, deactivateUserMedication } from "@/lib/actions/medication-actions";
import type { UserMedication } from "@/lib/types/episode";

interface MedicationLibraryProps {
  medications: UserMedication[];
}

export function MedicationLibrary({ medications: initial }: MedicationLibraryProps) {
  const [meds, setMeds] = useState(initial);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [dose, setDose] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleAdd() {
    if (!name.trim()) return;
    startTransition(async () => {
      const result = await addUserMedication({ name: name.trim(), defaultDose: dose.trim() || undefined });
      if (result.success) {
        // Optimistic: add to local list (actual id comes from revalidation)
        setMeds((prev) => [...prev, { id: crypto.randomUUID(), name: name.trim(), defaultDose: dose.trim() || null }]);
        setName("");
        setDose("");
        setShowAdd(false);
      }
    });
  }

  function handleRemove(id: string) {
    startTransition(async () => {
      const result = await deactivateUserMedication(id);
      if (result.success) {
        setMeds((prev) => prev.filter((m) => m.id !== id));
      }
    });
  }

  return (
    <div className="space-y-3">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Pill size={20} className="text-accent" />
          <h2 className="text-base font-semibold">My Medications</h2>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent hover:bg-accent/20"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="rounded-[var(--radius-md)] border border-border bg-bg-surface p-3 space-y-3">
          <input
            type="text"
            placeholder="Medication name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-[var(--radius-sm)] bg-bg-elevated px-3 py-2 text-sm outline-none placeholder:text-text-secondary"
            autoFocus
          />
          <input
            type="text"
            placeholder="Default dose (e.g., 400mg)"
            value={dose}
            onChange={(e) => setDose(e.target.value)}
            className="w-full rounded-[var(--radius-sm)] bg-bg-elevated px-3 py-2 text-sm outline-none placeholder:text-text-secondary"
          />
          <div className="flex gap-2">
            <Button
              onClick={handleAdd}
              disabled={!name.trim() || isPending}
              className="flex-1 rounded-full bg-accent text-sm font-medium text-white"
              size="sm"
            >
              {isPending ? "Adding..." : "Add"}
            </Button>
            <Button
              onClick={() => { setShowAdd(false); setName(""); setDose(""); }}
              variant="outline"
              className="rounded-full text-sm"
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Medications list */}
      <div className="rounded-[var(--radius-md)] border border-border bg-bg-surface p-2">
        {meds.length === 0 ? (
          <p className="px-3 py-4 text-center text-sm text-text-secondary">No medications added yet</p>
        ) : (
          <div className="space-y-1">
            {meds.map((med) => (
              <div
                key={med.id}
                className="flex items-center justify-between rounded-[var(--radius-sm)] px-3 py-3 hover:bg-bg-elevated"
              >
                <div>
                  <span className="text-sm font-medium">{med.name}</span>
                  {med.defaultDose && (
                    <span className="ml-2 text-xs text-text-secondary">{med.defaultDose}</span>
                  )}
                </div>
                <button
                  onClick={() => handleRemove(med.id)}
                  disabled={isPending}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary hover:bg-severity-high/10 hover:text-severity-high"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
