"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, Plus, Pencil, Trash2 } from "lucide-react";
import { getSeverityLevel } from "@/lib/types/database";
import { formatDuration } from "@/lib/utils/date-helpers";
import { MedicationRatingForm } from "./medication-rating-form";
import { EpisodeMedicationAdder } from "./episode-medication-adder";
import { EditEpisodeSheet } from "./edit-episode-sheet";
import { DeleteEpisodeConfirm } from "./delete-episode-confirm";
import { LogBottomSheet } from "@/components/log/log-bottom-sheet";
import type { EpisodeWithDetails } from "@/lib/types/episode";

interface DayDetailSheetProps {
  date: string | null;
  episodes: EpisodeWithDetails[];
  onClose: () => void;
  onRefresh: () => void;
}

const severityDot: Record<string, string> = {
  mild: "bg-severity-low",
  moderate: "bg-severity-mid",
  severe: "bg-severity-high",
};

export function DayDetailSheet({ date, episodes, onClose, onRefresh }: DayDetailSheetProps) {
  const shouldReduce = useReducedMotion();
  const t = useTranslations("calendar");
  const tTriggers = useTranslations("triggers");
  const locale = useLocale();
  const [logOpen, setLogOpen] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState<EpisodeWithDetails | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  return (
    <>
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
                {new Date(date + "T00:00:00").toLocaleDateString(locale, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </h2>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setLogOpen(true)}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-accent hover:bg-accent/10"
                  aria-label={t("logEpisodeForDay")}
                >
                  <Plus size={20} />
                </button>
                <button
                  onClick={onClose}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-text-secondary hover:bg-bg-surface"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div
              className="space-y-3 overflow-y-auto px-4"
              style={{ maxHeight: "60vh", paddingBottom: "calc(100px + env(safe-area-inset-bottom))" }}
            >
              {episodes.length === 0 ? (
                <p className="py-8 text-center text-sm text-text-secondary">{t("noEpisodesThisDay")}</p>
              ) : (
                episodes.map((ep) => {
                  const severity = getSeverityLevel(ep.intensity ?? 5);
                  return (
                    <div key={ep.id} className="rounded-[var(--radius-md)] border border-border bg-bg-surface p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className={`h-2.5 w-2.5 rounded-full ${severityDot[severity]}`} />
                        <span className="font-medium">{t("intensity")} {ep.intensity}/10</span>
                        <span className="text-xs text-text-secondary">
                          {new Date(ep.startedAt).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", hour12: false })}
                        </span>
                        <span className="text-xs text-text-secondary">
                          {formatDuration(ep.startedAt, ep.endedAt, locale)}
                        </span>
                        <span className="ml-auto flex gap-1">
                          <button
                            onClick={() => setEditingEpisode(ep)}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-text-secondary hover:bg-bg-elevated"
                            aria-label={t("editEpisodeLabel")}
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(ep.id)}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-red-400 hover:bg-red-400/10"
                            aria-label={t("deleteEpisodeLabel")}
                          >
                            <Trash2 size={14} />
                          </button>
                        </span>
                      </div>
                      {ep.triggers.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {ep.triggers.map((tr) => (
                            <span key={tr} className="rounded-full bg-bg-elevated px-2 py-0.5 text-[10px] text-text-secondary">
                              {tTriggers(tr)}
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

      {date && (
        <LogBottomSheet
          open={logOpen}
          onClose={() => {
            setLogOpen(false);
            onRefresh();
          }}
          initialDate={date}
        />
      )}

      {/* Edit episode sheet */}
      {editingEpisode && (
        <EditEpisodeSheet
          episode={editingEpisode}
          onClose={() => setEditingEpisode(null)}
          onSaved={() => {
            setEditingEpisode(null);
            onRefresh();
          }}
        />
      )}

      <DeleteEpisodeConfirm
        episodeId={confirmDeleteId}
        onCancel={() => setConfirmDeleteId(null)}
        onDeleted={() => {
          setConfirmDeleteId(null);
          onRefresh();
        }}
      />
    </>
  );
}
