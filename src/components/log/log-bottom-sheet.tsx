"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, ChevronLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeadPainMap } from "./head-pain-map";
import { IntensitySlider } from "./intensity-slider";
import { TriggerSymptomGrid } from "./trigger-symptom-grid";
import { StepIndicator } from "./step-indicator";
import { createEpisode } from "@/lib/actions/episode-actions";
import type { PainLocation, TriggerType, SymptomType } from "@/lib/types/database";

interface LogBottomSheetProps {
  open: boolean;
  onClose: () => void;
}

const stepTitles = ["Where does it hurt?", "How intense?", "Triggers & Symptoms"];

export function LogBottomSheet({ open, onClose }: LogBottomSheetProps) {
  const shouldReduce = useReducedMotion();
  const [step, setStep] = useState(1);
  const [locations, setLocations] = useState<PainLocation[]>([]);
  const [intensity, setIntensity] = useState(5);
  const [triggers, setTriggers] = useState<TriggerType[]>([]);
  const [symptoms, setSymptoms] = useState<SymptomType[]>([]);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

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
                  aria-label="Previous step"
                >
                  <ChevronLeft size={20} />
                </button>
              ) : (
                <div className="w-10" />
              )}

              <h2 className="font-heading text-lg font-bold">
                {done ? "Saved!" : stepTitles[step - 1]}
              </h2>

              <button
                onClick={resetAndClose}
                className="flex h-10 w-10 items-center justify-center rounded-full text-text-secondary hover:bg-bg-surface"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {!done && <StepIndicator current={step} total={3} />}

            {/* Content */}
            <div className="px-4 py-6" style={{ minHeight: 320 }}>
              {done ? (
                <div className="flex flex-col items-center justify-center gap-3 py-12">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-mint/20">
                    <Check size={32} className="text-accent-mint" />
                  </div>
                  <p className="text-text-secondary">Episode logged</p>
                </div>
              ) : step === 1 ? (
                <HeadPainMap selected={locations} onToggle={toggleLocation} />
              ) : step === 2 ? (
                <IntensitySlider value={intensity} onChange={setIntensity} />
              ) : (
                <TriggerSymptomGrid
                  selectedTriggers={triggers}
                  selectedSymptoms={symptoms}
                  onToggleTrigger={toggleTrigger}
                  onToggleSymptom={toggleSymptom}
                />
              )}
            </div>

            {/* Footer */}
            {!done && (
              <div className="px-4 pb-6" style={{ paddingBottom: "calc(24px + env(safe-area-inset-bottom))" }}>
                {step < 3 ? (
                  <Button
                    onClick={() => setStep((s) => s + 1)}
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
