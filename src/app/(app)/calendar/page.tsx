"use client";

import { useState, useEffect, useCallback } from "react";
import { PageTransition } from "@/components/layout/page-transition";
import { MonthSelector } from "@/components/calendar/month-selector";
import { CalendarHeatmap } from "@/components/calendar/calendar-heatmap";
import { DayDetailSheet } from "@/components/calendar/day-detail-sheet";
import { toLocalDateStr } from "@/lib/utils/date-helpers";
import type { EpisodeWithDetails } from "@/lib/types/episode";

export default function CalendarPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [episodesByDay, setEpisodesByDay] = useState<Record<string, EpisodeWithDetails[]>>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const fetchMonth = useCallback(async () => {
    const from = new Date(year, month, 1).toISOString();
    const to = new Date(year, month + 1, 0, 23, 59, 59).toISOString();

    const res = await fetch(`/api/episodes?from=${from}&to=${to}`);
    if (res.ok) {
      const data = await res.json();
      // Group by date
      const grouped: Record<string, EpisodeWithDetails[]> = {};
      (data as EpisodeWithDetails[]).forEach((ep) => {
        const day = toLocalDateStr(ep.startedAt);
        if (!grouped[day]) grouped[day] = [];
        grouped[day].push(ep);
      });
      setEpisodesByDay(grouped);
    }
  }, [year, month]);

  useEffect(() => {
    fetchMonth();
  }, [fetchMonth]);

  function goPrev() {
    if (month === 0) { setYear((y) => y - 1); setMonth(11); }
    else setMonth((m) => m - 1);
  }
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();

  function goNext() {
    if (isCurrentMonth) return;
    if (month === 11) { setYear((y) => y + 1); setMonth(0); }
    else setMonth((m) => m + 1);
  }

  return (
    <PageTransition>
      <div className="space-y-6 py-6">
        <h1 className="font-heading text-[28px] font-extrabold">Calendar</h1>
        <MonthSelector year={year} month={month} onPrev={goPrev} onNext={goNext} disableNext={isCurrentMonth} />
        <CalendarHeatmap
          year={year}
          month={month}
          episodesByDay={episodesByDay}
          onDayClick={setSelectedDate}
        />
      </div>

      <DayDetailSheet
        date={selectedDate}
        episodes={selectedDate ? (episodesByDay[selectedDate] ?? []) : []}
        onClose={() => setSelectedDate(null)}
      />
    </PageTransition>
  );
}
