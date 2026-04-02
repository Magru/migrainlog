"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { deleteEpisode } from "@/lib/actions/episode-actions";

interface DeleteEpisodeConfirmProps {
  episodeId: string | null;
  onCancel: () => void;
  onDeleted: () => void;
}

export function DeleteEpisodeConfirm({ episodeId, onCancel, onDeleted }: DeleteEpisodeConfirmProps) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!episodeId) return;
    setDeleting(true);
    const result = await deleteEpisode(episodeId);
    setDeleting(false);
    if (result.success) onDeleted();
    else onCancel();
  }

  return (
    <AnimatePresence>
      {episodeId && (
        <>
          <motion.div
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />
          <motion.div
            className="fixed inset-x-0 bottom-0 z-[80] mx-auto max-w-[428px] rounded-t-2xl bg-bg-elevated p-6"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{ paddingBottom: "calc(24px + env(safe-area-inset-bottom))" }}
          >
            <p className="mb-4 text-center font-medium">Delete this episode?</p>
            <p className="mb-6 text-center text-sm text-text-secondary">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="h-12 flex-1 rounded-full border border-border text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="h-12 flex-1 rounded-full bg-red-500 text-sm font-medium text-white"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
