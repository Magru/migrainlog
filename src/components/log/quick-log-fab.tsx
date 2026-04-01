"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { LogBottomSheet } from "./log-bottom-sheet";

export function QuickLogFab() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Quick log migraine"
          className="fixed z-40 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent/30 transition-transform active:scale-[0.94]"
          style={{
            bottom: "calc(80px + env(safe-area-inset-bottom))",
            right: "20px",
          }}
        >
          {/* Pulse ring */}
          <span className="absolute inset-0 animate-ping rounded-full bg-accent/20" />
          <Plus size={28} />
        </button>
      )}

      <LogBottomSheet open={open} onClose={() => setOpen(false)} />
    </>
  );
}
