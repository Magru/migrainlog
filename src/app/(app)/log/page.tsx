"use client";

import { useState } from "react";
import { PageTransition } from "@/components/layout/page-transition";
import { HeadPainMap } from "@/components/log/head-pain-map";
import { IntensitySlider } from "@/components/log/intensity-slider";
import { TriggerSymptomGrid } from "@/components/log/trigger-symptom-grid";
import { StepIndicator } from "@/components/log/step-indicator";
import { Button } from "@/components/ui/button";
import { MedicationStepContent } from "@/components/log/medication-step-content";
import { createEpisode } from "@/lib/actions/episode-actions";
import { createClient } from "@/lib/supabase/client";
import { Check, ChevronLeft } from "lucide-react";
import type { PainLocation, TriggerType, SymptomType } from "@/lib/types/database";
import type { UserMedication } from "@/lib/types/episode";

export default function LogPage() {
  const [step, setStep] = useState(1);
  const [locations, setLocations] = useState<PainLocation[]>([]);
  const [intensity, setIntensity] = useState(5);
  const [triggers, setTriggers] = useState<TriggerType[]>([]);
  const [symptoms, setSymptoms] = useState<SymptomType[]>([]);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [episodeId, setEpisodeId] = useState<string | null>(null);
  const [userMeds, setUserMeds] = useState<UserMedication[]>([]);
  const [selectedMeds, setSelectedMeds] = useState<{ id: string; name: string; dose: string }[]>([]);

  const stepTitles = ["Where does it hurt?", "How intense?", "Triggers & Symptoms", "Medications"];

  function toggle<T>(arr: T[], item: T): T[] {
    return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
  }

  async function fetchUserMeds() {
    const supabase = createClient();
    const { data } = await supabase
      .from("user_medications")
      .select("id, name, default_dose")
      .eq("is_active", true)
      .order("name");
    setUserMeds(
      (data ?? []).map((m) => ({ id: m.id, name: m.name, defaultDose: m.default_dose }))
    );
  }

  async function handleSave() {
    setSaving(true);
    const result = await createEpisode({
      locations,
      intensity,
      triggers,
      symptoms,
      startedAt: new Date().toISOString(),
    });
    if (result.success) {
      const epId = result.episodeId ?? null;
      setEpisodeId(epId);
      // Save selected medications to the episode
      if (epId && selectedMeds.length > 0) {
        const { addEpisodeMedication } = await import("@/lib/actions/medication-actions");
        await Promise.all(
          selectedMeds.map((m) =>
            addEpisodeMedication({ episodeId: epId, userMedicationId: m.id, dose: m.dose || undefined })
          )
        );
      }
      setDone(true);
    }
    setSaving(false);
  }

  function reset() {
    setStep(1);
    setLocations([]);
    setIntensity(5);
    setTriggers([]);
    setSymptoms([]);
    setDone(false);
    setEpisodeId(null);
    setUserMeds([]);
    setSelectedMeds([]);
  }

  return (
    <PageTransition>
      <div className="space-y-6 py-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          {step > 1 && !done && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-text-secondary hover:bg-bg-surface"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <h1 className="font-heading text-[28px] font-extrabold">
            {done ? "Saved!" : stepTitles[step - 1]}
          </h1>
        </div>

        {!done && <StepIndicator current={step} total={4} />}

        {/* Content */}
        {done ? (
          <div className="flex flex-col items-center gap-4 py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-mint/20">
              <Check size={32} className="text-accent-mint" />
            </div>
            <p className="text-text-secondary">Episode logged successfully</p>
            <Button onClick={reset} variant="outline" className="rounded-full">
              Log Another
            </Button>
          </div>
        ) : step === 1 ? (
          <HeadPainMap selected={locations} onToggle={(l) => setLocations(toggle(locations, l))} />
        ) : step === 2 ? (
          <IntensitySlider value={intensity} onChange={setIntensity} />
        ) : step === 3 ? (
          <TriggerSymptomGrid
            selectedTriggers={triggers}
            selectedSymptoms={symptoms}
            onToggleTrigger={(t) => setTriggers(toggle(triggers, t))}
            onToggleSymptom={(s) => setSymptoms(toggle(symptoms, s))}
          />
        ) : (
          <MedicationStepContent
            userMeds={userMeds}
            selectedMeds={selectedMeds}
            onSelect={setSelectedMeds}
          />
        )}

        {/* Action button */}
        {!done && (
          <div className="pt-4">
            {step < 4 ? (
              <Button
                onClick={() => {
                  const next = step + 1;
                  setStep(next);
                  if (next === 4) fetchUserMeds();
                }}
                disabled={step === 1 && locations.length === 0}
                className="h-14 w-full rounded-full bg-accent text-base font-medium text-white"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSave}
                disabled={saving}
                className="h-14 w-full rounded-full bg-accent text-base font-medium text-white"
              >
                {saving ? "Saving..." : "Save Episode"}
              </Button>
            )}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
