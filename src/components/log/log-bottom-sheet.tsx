"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, ChevronLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeadPainMap } from "./head-pain-map";
import { IntensitySlider } from "./intensity-slider";
import { TriggerSymptomGrid } from "./trigger-symptom-grid";
import { StepIndicator } from "./step-indicator";
import { MedicationStepContent } from "./medication-step-content";
import { createEpisode } from "@/lib/actions/episode-actions";
import { createClient } from "@/lib/supabase/client";
import { CyclePhaseSelector } from "./cycle-phase-selector";
import { useUserGender } from "@/hooks/use-user-gender";
import type { PainLocation, TriggerType, SymptomType, MenstrualPhase, OvulationPhase } from "@/lib/types/database";
import type { UserMedication } from "@/lib/types/episode";

interface LogBottomSheetProps {
  open: boolean;
  onClose: () => void;
  /** Pre-fill date (YYYY-MM-DD) — e.g. from calendar day tap */
  initialDate?: string;
}

const stepKeys = ["step1", "step2", "step3", "step4"] as const;

export function LogBottomSheet({ open, onClose, initialDate }: LogBottomSheetProps) {
  const shouldReduce = useReducedMotion();
  const t = useTranslations("log");
  const tc = useTranslations("common");
  const [step, setStep] = useState(1);
  const [locations, setLocations] = useState<PainLocation[]>([]);
  const [intensity, setIntensity] = useState(5);
  const [triggers, setTriggers] = useState<TriggerType[]>([]);
  const [symptoms, setSymptoms] = useState<SymptomType[]>([]);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [userMeds, setUserMeds] = useState<UserMedication[]>([]);
  const [selectedMeds, setSelectedMeds] = useState<{ id: string; name: string; dose: string }[]>([]);
  const gender = useUserGender(open);
  const [menstrualPhase, setMenstrualPhase] = useState<MenstrualPhase | null>(null);
  const [ovulationPhase, setOvulationPhase] = useState<OvulationPhase | null>(null);
  const [dateMode, setDateMode] = useState<"now" | "custom">(initialDate ? "custom" : "now");
  const [customDate, setCustomDate] = useState(() => {
    if (initialDate) return initialDate;
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });
  const [customTime, setCustomTime] = useState(() => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  });

  function toggleLocation(loc: PainLocation) {
    setLocations((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]
    );
  }

  function toggleTrigger(t: TriggerType) {
    setTriggers((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  }

  function toggleSymptom(s: SymptomType) {
    setSymptoms((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
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
    let startedAt: string;
    if (dateMode === "now") {
      startedAt = new Date().toISOString();
    } else {
      // Build date in local timezone — avoid UTC shift that moves the date back a day
      const [y, m, d] = customDate.split("-").map(Number);
      const [h, min] = customTime.split(":").map(Number);
      startedAt = new Date(y, m - 1, d, h, min).toISOString();
    }

    const result = await createEpisode({
      locations,
      intensity,
      triggers,
      symptoms,
      startedAt,
      menstrualPhase,
      ovulationPhase,
    });

    if (result.success) {
      // Save selected medications
      if (result.episodeId && selectedMeds.length > 0) {
        const { addEpisodeMedication } = await import("@/lib/actions/medication-actions");
        await Promise.all(
          selectedMeds.map((m) =>
            addEpisodeMedication({ episodeId: result.episodeId!, userMedicationId: m.id, dose: m.dose || undefined })
          )
        );
      }
      setDone(true);
      setTimeout(() => {
        resetAndClose();
      }, 1200);
    } else {
      setSaving(false);
    }
  }

  function resetAndClose() {
    setStep(1);
    setLocations([]);
    setIntensity(5);
    setTriggers([]);
    setSymptoms([]);
    setSaving(false);
    setDone(false);
    setDateMode(initialDate ? "custom" : "now");
    setUserMeds([]);
    setSelectedMeds([]);
    setMenstrualPhase(null);
    setOvulationPhase(null);
    onClose();
  }

  const animationProps = shouldReduce
    ? {}
    : {
        initial: { y: "100%" },
        animate: { y: 0 },
        exit: { y: "100%" },
        transition: { duration: 0.3, ease: "easeOut" as const },
      };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            initial={shouldReduce ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={shouldReduce ? undefined : { opacity: 0 }}
            onClick={resetAndClose}
          />

          {/* Sheet */}
          <motion.div
            className="fixed inset-x-0 bottom-0 z-[60] mx-auto max-w-[428px] rounded-t-3xl bg-bg-elevated"
            {...animationProps}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="h-1 w-10 rounded-full bg-border" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 pb-2">
              {step > 1 && !done ? (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-text-secondary hover:bg-bg-surface"
                  aria-label={t("previousStep")}
                >
                  <ChevronLeft size={20} />
                </button>
              ) : (
                <div className="w-10" />
              )}

              <h2 className="font-heading text-lg font-bold">
                {done ? t("saved") : t(stepKeys[step - 1])}
              </h2>

              <button
                onClick={resetAndClose}
                className="flex h-10 w-10 items-center justify-center rounded-full text-text-secondary hover:bg-bg-surface"
                aria-label={tc("close")}
              >
                <X size={20} />
              </button>
            </div>

            {!done && <StepIndicator current={step} total={4} />}

            {/* Content */}
            <div className="px-4 py-6" style={{ minHeight: 320 }}>
              {done ? (
                <div className="flex flex-col items-center justify-center gap-3 py-12">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-mint/20">
                    <Check size={32} className="text-accent-mint" />
                  </div>
                  <p className="text-text-secondary">{t("episodeLogged")}</p>
                </div>
              ) : step === 1 ? (
                <HeadPainMap selected={locations} onToggle={toggleLocation} />
              ) : step === 2 ? (
                <IntensitySlider value={intensity} onChange={setIntensity} />
              ) : step === 3 ? (
                <div className="space-y-4">
                  {/* Date/time selector */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-text-secondary">{t("whenDidItStart")}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setDateMode("now")}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                          dateMode === "now"
                            ? "border-accent bg-accent/20 text-accent"
                            : "border-border text-text-secondary"
                        }`}
                      >
                        {t("now")}
                      </button>
                      <button
                        onClick={() => setDateMode("custom")}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                          dateMode === "custom"
                            ? "border-accent bg-accent/20 text-accent"
                            : "border-border text-text-secondary"
                        }`}
                      >
                        {t("otherDate")}
                      </button>
                    </div>
                    {dateMode === "custom" && (
                      <div className="flex gap-2">
                        <input
                          type="date"
                          value={customDate}
                          max={`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`}
                          onChange={(e) => setCustomDate(e.target.value)}
                          className="flex-1 rounded-lg border border-border bg-bg-surface px-2 py-1.5 text-sm text-text-primary"
                        />
                        <input
                          type="time"
                          value={customTime}
                          onChange={(e) => setCustomTime(e.target.value)}
                          className="w-24 rounded-lg border border-border bg-bg-surface px-2 py-1.5 text-sm text-text-primary"
                        />
                      </div>
                    )}
                  </div>

                  <TriggerSymptomGrid
                    selectedTriggers={triggers}
                    selectedSymptoms={symptoms}
                    onToggleTrigger={toggleTrigger}
                    onToggleSymptom={toggleSymptom}
                  />
                  {gender === "female" && (
                    <CyclePhaseSelector
                      menstrualPhase={menstrualPhase}
                      ovulationPhase={ovulationPhase}
                      onMenstrualChange={setMenstrualPhase}
                      onOvulationChange={setOvulationPhase}
                    />
                  )}
                </div>
              ) : (
                <MedicationStepContent
                  userMeds={userMeds}
                  selectedMeds={selectedMeds}
                  onSelect={setSelectedMeds}
                />
              )}
            </div>

            {/* Footer */}
            {!done && (
              <div className="px-4 pb-6" style={{ paddingBottom: "calc(24px + env(safe-area-inset-bottom))" }}>
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
                    {tc("next")}
                  </Button>
                ) : (
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="h-14 w-full rounded-full bg-accent text-base font-medium text-white"
                  >
                    {saving ? tc("saving") : t("saveEpisode")}
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
