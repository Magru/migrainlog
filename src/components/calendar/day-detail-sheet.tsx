"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { getSeverityLevel } from "@/lib/types/database";
import { formatDuration } from "@/lib/utils/date-helpers";
import { MedicationRatingForm } from "./medication-rating-form";
import { EpisodeMedicationAdder } from "./episode-medication-adder";
import type { EpisodeWithDetails } from "@/lib/types/episode";

interface DayDetailSheetProps {
  date: string | null;
  episodes: EpisodeWithDetails[];
  onClose: () => void;
}

const severityDot: Record<string, string> = {
  mild: "bg-severity-low",
  moderate: "bg-severity-mid",
  severe: "bg-severity-high",
};

const triggerLabels: Record<string, string> = {
  stress: "Stress", sleep: "Sleep", food: "Food", weather: "Weather",
  hormones: "Hormones", screen: "Screen", alcohol: "Alcohol", caffeine: "Caffeine",
};

export function DayDetailSheet({ date, episodes, onClose }: DayDetailSheetProps) {
  const shouldReduce = useReducedMotion();

  return (
    <AnimatePresence>
      {date && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={shouldReduce ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={shouldReduce ? undefined : { opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-[428px] rounded-t-3xl bg-bg-elevated"
            initial={shouldReduce ? undefined : { y: "100%" }}
            animate={{ y: 0 }}
            exit={shouldReduce ? undefined : { y: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" as const }}
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="h-1 w-10 rounded-full bg-border" />
            </div>

            <div className="flex items-center justify-between px-4 pb-4">
              <h2 className="font-heading text-lg font-bold">
                {new Date(date + "T00:00:00").toLocaleDateString("en", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </h2>
              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full text-text-secondary hover:bg-bg-surface"
              >
                <X size={20} />
              </button>
            </div>

            <div
              className="space-y-3 overflow-y-auto px-4"
              style={{ maxHeight: "60vh", paddingBottom: "calc(100px + env(safe-area-inset-bottom))" }}
            >
              {episodes.length === 0 ? (
                <p className="py-8 text-center text-sm text-text-secondary">No episodes this day</p>
              ) : (
                episodes.map((ep) => {
                  const severity = getSeverityLevel(ep.intensity ?? 5);
                  return (
                    <div key={ep.id} className="rounded-[var(--radius-md)] border border-border bg-bg-surface p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className={`h-2.5 w-2.5 rounded-full ${severityDot[severity]}`} />
                        <span className="font-medium">Intensity {ep.intensity}/10</span>
                        <span className="text-xs text-text-secondary">
                          {new Date(ep.startedAt).toLocaleTimeString("en", { hour: "numeric", minute: "2-digit" })}
                        </span>
                        <span className="text-xs text-text-secondary">
                          {formatDuration(ep.startedAt, ep.endedAt)}
                        </span>
                      </div>
                      {ep.triggers.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {ep.triggers.map((t) => (
                            <span key={t} className="rounded-full bg-bg-elevated px-2 py-0.5 text-[10px] text-text-secondary">
                              {triggerLabels[t] ?? t}
                            </span>
                          ))}
                        </div>
                      )}
                      {ep.medications.length > 0 && (
                        <div className="space-y-1.5">
                          {ep.medications.map((med) => (
                            <MedicationRatingForm key={med.id} medication={med} />
                          ))}
                        </div>
                      )}
                      <EpisodeMedicationAdder
                        episodeId={ep.id}
                        existingMedNames={ep.medications.map((m) => m.name)}
                      />
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
