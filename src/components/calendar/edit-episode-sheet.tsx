"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeadPainMap } from "@/components/log/head-pain-map";
import { IntensitySlider } from "@/components/log/intensity-slider";
import { TriggerSymptomGrid } from "@/components/log/trigger-symptom-grid";
import { CyclePhaseSelector } from "@/components/log/cycle-phase-selector";
import { useUserGender } from "@/hooks/use-user-gender";
import { updateEpisode } from "@/lib/actions/episode-actions";
import type { EpisodeWithDetails } from "@/lib/types/episode";
import type { PainLocation, TriggerType, SymptomType, MenstrualPhase, OvulationPhase } from "@/lib/types/database";

interface EditEpisodeSheetProps {
  episode: EpisodeWithDetails;
  onClose: () => void;
  onSaved: () => void;
}

export function EditEpisodeSheet({ episode, onClose, onSaved }: EditEpisodeSheetProps) {
  const shouldReduce = useReducedMotion();
  const gender = useUserGender(true);
  const [locations, setLocations] = useState<PainLocation[]>(episode.locations);
  const [intensity, setIntensity] = useState(episode.intensity ?? 5);
  const [triggers, setTriggers] = useState<TriggerType[]>(episode.triggers);
  const [symptoms, setSymptoms] = useState<SymptomType[]>(episode.symptoms);
  const [menstrualPhase, setMenstrualPhase] = useState<MenstrualPhase | null>(episode.menstrualPhase);
  const [ovulationPhase, setOvulationPhase] = useState<OvulationPhase | null>(episode.ovulationPhase);
  const [saving, setSaving] = useState(false);

  // Parse existing startedAt into date/time inputs
  const startDate = new Date(episode.startedAt);
  const [customDate, setCustomDate] = useState(
    `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, "0")}-${String(startDate.getDate()).padStart(2, "0")}`
  );
  const [customTime, setCustomTime] = useState(
    `${String(startDate.getHours()).padStart(2, "0")}:${String(startDate.getMinutes()).padStart(2, "0")}`
  );

  function toggleLocation(loc: PainLocation) {
    setLocations((prev) => (prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]));
  }

  function toggleTrigger(t: TriggerType) {
    setTriggers((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  function toggleSymptom(s: SymptomType) {
    setSymptoms((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  }

  async function handleSave() {
    setSaving(true);
    const [y, m, d] = customDate.split("-").map(Number);
    const [h, min] = customTime.split(":").map(Number);
    const startedAt = new Date(y, m - 1, d, h, min).toISOString();

    const result = await updateEpisode(episode.id, {
      locations,
      intensity,
      triggers,
      symptoms,
      startedAt,
      menstrualPhase,
      ovulationPhase,
    });

    if (result.success) {
      onSaved();
    } else {
      setSaving(false);
    }
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
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
        initial={shouldReduce ? undefined : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={shouldReduce ? undefined : { opacity: 0 }}
        onClick={onClose}
      />

      {/* Sheet */}
      <motion.div
        className="fixed inset-x-0 bottom-0 z-[70] mx-auto max-w-[428px] rounded-t-3xl bg-bg-elevated"
        {...animationProps}
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className="h-1 w-10 rounded-full bg-border" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-2">
          <div className="w-10" />
          <h2 className="font-heading text-lg font-bold">Edit Episode</h2>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-text-secondary hover:bg-bg-surface"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable content */}
        <div
          className="space-y-6 overflow-y-auto px-4 py-4"
          style={{ maxHeight: "70vh", paddingBottom: "calc(100px + env(safe-area-inset-bottom))" }}
        >
          {/* Date/time */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-text-secondary">When did it start?</p>
            <div className="flex gap-2">
              <input
                type="date"
                value={customDate}
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
          </div>

          {/* Pain locations */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-text-secondary">Pain locations</p>
            <HeadPainMap selected={locations} onToggle={toggleLocation} />
          </div>

          {/* Intensity */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-text-secondary">Intensity</p>
            <IntensitySlider value={intensity} onChange={setIntensity} />
          </div>

          {/* Triggers & symptoms */}
          <TriggerSymptomGrid
            selectedTriggers={triggers}
            selectedSymptoms={symptoms}
            onToggleTrigger={toggleTrigger}
            onToggleSymptom={toggleSymptom}
          />

          {/* Cycle phases (female only) */}
          {gender === "female" && (
            <CyclePhaseSelector
              menstrualPhase={menstrualPhase}
              ovulationPhase={ovulationPhase}
              onMenstrualChange={setMenstrualPhase}
              onOvulationChange={setOvulationPhase}
            />
          )}
        </div>

        {/* Save button */}
        <div className="px-4 pb-6" style={{ paddingBottom: "calc(24px + env(safe-area-inset-bottom))" }}>
          <Button
            onClick={handleSave}
            disabled={saving || locations.length === 0}
            className="h-14 w-full rounded-full bg-accent text-base font-medium text-white"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
