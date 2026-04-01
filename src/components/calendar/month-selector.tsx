"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { monthLabel } from "@/lib/utils/date-helpers";

interface MonthSelectorProps {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
}

export function MonthSelector({ year, month, onPrev, onNext }: MonthSelectorProps) {
  return (
    <div className="flex items-center justify-between">
      <button
        onClick={onPrev}
        className="flex h-10 w-10 items-center justify-center rounded-full text-text-secondary hover:bg-bg-surface"
        aria-label="Previous month"
      >
        <ChevronLeft size={20} />
      </button>
      <h2 className="font-heading text-lg font-bold">{monthLabel(year, month)}</h2>
      <button
        onClick={onNext}
        className="flex h-10 w-10 items-center justify-center rounded-full text-text-secondary hover:bg-bg-surface"
        aria-label="Next month"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
