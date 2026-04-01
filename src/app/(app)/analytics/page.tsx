"use client";

import { useState, useEffect, useCallback } from "react";
import { PageTransition } from "@/components/layout/page-transition";
import { PeriodSelector, type PeriodKey } from "@/components/analytics/period-selector";
import { SummaryStats } from "@/components/analytics/summary-stats";
import { FrequencyChart } from "@/components/analytics/frequency-chart";
import { SeverityDonut } from "@/components/analytics/severity-donut";
import { TriggerBars } from "@/components/analytics/trigger-bars";
import { LocationSummary } from "@/components/analytics/location-summary";
import type { PainLocation } from "@/lib/types/database";

interface AnalyticsData {
  frequency: { label: string; count: number }[];
  severity: { name: string; value: number; color: string }[];
  triggers: { trigger: string; count: number }[];
  locations: { location: PainLocation; count: number; opacity: number }[];
  summary: { totalEpisodes: number; avgIntensity: number; maxIntensity: number; episodesPerWeek: number };
}

const emptyData: AnalyticsData = {
  frequency: [],
  severity: [],
  triggers: [],
  locations: [],
  summary: { totalEpisodes: 0, avgIntensity: 0, maxIntensity: 0, episodesPerWeek: 0 },
};

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<PeriodKey>("month");
  const [from, setFrom] = useState(() => new Date(Date.now() - 30 * 86400000).toISOString());
  const [to, setTo] = useState(() => new Date().toISOString());
  const [data, setData] = useState<AnalyticsData>(emptyData);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics?from=${from}&to=${to}`);
      if (res.ok) {
        setData(await res.json());
      }
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function handlePeriodChange(newPeriod: PeriodKey, newFrom: string, newTo: string) {
    setPeriod(newPeriod);
    setFrom(newFrom);
    setTo(newTo);
  }

  return (
    <PageTransition>
      <div className="space-y-4 py-6">
        <h1 className="font-heading text-[28px] font-extrabold">Analytics</h1>

        <PeriodSelector value={period} onChange={handlePeriodChange} />

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          </div>
        ) : (
          <>
            <SummaryStats data={data.summary} />
            <FrequencyChart data={data.frequency} />
            <div className="grid grid-cols-2 gap-3">
              <SeverityDonut data={data.severity} />
              <LocationSummary data={data.locations} />
            </div>
            <TriggerBars data={data.triggers} />
          </>
        )}
      </div>
    </PageTransition>
  );
}
