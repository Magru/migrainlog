"use client";

import { useState, useEffect, useTransition } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Pill, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { addEpisodeMedication } from "@/lib/actions/medication-actions";
import type { UserMedication } from "@/lib/types/episode";

interface EpisodeMedicationAdderProps {
  episodeId: string;
  /** Names of meds already added to this episode, to avoid duplicates */
  existingMedNames: string[];
}

export function EpisodeMedicationAdder({ episodeId, existingMedNames }: EpisodeMedicationAdderProps) {
  const t = useTranslations("calendar");
  const tc = useTranslations("common");
  const tLog = useTranslations("log");
  const [open, setOpen] = useState(false);
  const [meds, setMeds] = useState<UserMedication[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [dose, setDose] = useState("");
  const [added, setAdded] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  // Fetch user's medication library when opened
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    const supabase = createClient();
    supabase
      .from("user_medications")
      .select("id, name, default_dose")
      .eq("is_active", true)
      .order("name")
      .then(({ data }) => {
        setMeds((data ?? []).map((m) => ({ id: m.id, name: m.name, defaultDose: m.default_dose })));
        setLoading(false);
      });
  }, [open]);

  function handleAdd(med: UserMedication) {
    startTransition(async () => {
      const result = await addEpisodeMedication({
        episodeId,
        userMedicationId: med.id,
        dose: dose.trim() || undefined,
      });
      if (result.success) {
        setAdded((prev) => [...prev, med.name]);
        setExpandedId(null);
        setDose("");
      }
    });
  }

  // Filter out already-logged and just-added meds
  const excluded = new Set([...existingMedNames, ...added]);
  const available = meds.filter((m) => !excluded.has(m.name));

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-full border border-dashed border-border px-2.5 py-1 text-xs text-text-secondary hover:border-accent/40 hover:text-accent"
      >
        <Plus size={12} />
        💊 {t("addMedication")}
      </button>
    );
  }

  return (
    <div className="space-y-2">
      {/* Just-added confirmations */}
      {added.map((name) => (
        <div key={name} className="flex items-center gap-2 text-xs text-accent">
          <Check size={12} />
          <span>{t("medAdded", { name })}</span>
        </div>
      ))}

      {loading ? (
        <p className="text-xs text-text-secondary">{tc("loading")}</p>
      ) : available.length === 0 ? (
        <p className="text-xs text-text-secondary">
          {meds.length === 0 ? (
            <Link href="/profile" className="text-accent underline">{t("addMedsInProfile")}</Link>
          ) : (
            t("allMedsAdded")
          )}
        </p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {available.map((med) =>
            expandedId === med.id ? (
              <div key={med.id} className="flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-accent/30 bg-bg-elevated p-1.5">
                <Pill size={12} className="shrink-0 text-accent" />
                <span className="text-xs font-medium">{med.name}</span>
                <input
                  type="text"
                  placeholder={tLog("dose")}
                  value={dose}
                  onChange={(e) => setDose(e.target.value)}
                  className="w-16 rounded bg-bg-surface px-1.5 py-0.5 text-[10px] outline-none placeholder:text-text-secondary"
                  autoFocus
                />
                <Button
                  onClick={() => handleAdd(med)}
                  disabled={isPending}
                  size="sm"
                  className="h-5 rounded-full bg-accent px-2 text-[10px] text-white"
                >
                  {isPending ? "..." : "OK"}
                </Button>
              </div>
            ) : (
              <button
                key={med.id}
                onClick={() => { setExpandedId(med.id); setDose(med.defaultDose ?? ""); }}
                className="flex items-center gap-1 rounded-full border border-border bg-bg-elevated px-2 py-1 text-xs hover:border-accent/30"
              >
                <Pill size={10} className="text-text-secondary" />
                {med.name}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
