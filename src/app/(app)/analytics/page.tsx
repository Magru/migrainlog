import { PageTransition } from "@/components/layout/page-transition";
import { FrequencyChart } from "@/components/analytics/frequency-chart";
import { SeverityDonut } from "@/components/analytics/severity-donut";
import { TriggerBars } from "@/components/analytics/trigger-bars";
import { LocationSummary } from "@/components/analytics/location-summary";
import {
  getWeeklyFrequency,
  getSeverityDistribution,
  getTriggerFrequency,
  getLocationFrequency,
} from "@/lib/queries/analytics-queries";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const [frequency, severity, triggers, locations] = await Promise.all([
    getWeeklyFrequency(),
    getSeverityDistribution(),
    getTriggerFrequency(),
    getLocationFrequency(),
  ]);

  return (
    <PageTransition>
      <div className="space-y-6 py-6">
        <h1 className="font-heading text-[28px] font-extrabold">Analytics</h1>
        <FrequencyChart data={frequency} />
        <div className="grid grid-cols-2 gap-3">
          <SeverityDonut data={severity} />
          <LocationSummary data={locations} />
        </div>
        <TriggerBars data={triggers} />
      </div>
    </PageTransition>
  );
}
