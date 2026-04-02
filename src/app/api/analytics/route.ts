import { NextResponse, type NextRequest } from "next/server";
import {
  getWeeklyFrequency,
  getSeverityDistribution,
  getTriggerFrequency,
  getLocationFrequency,
  getSummaryStats,
  getCyclePhaseStats,
} from "@/lib/queries/analytics-queries";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const from = searchParams.get("from") ?? undefined;
  const to = searchParams.get("to") ?? undefined;

  try {
    const [frequency, severity, triggers, locations, summary, cyclePhases] = await Promise.all([
      getWeeklyFrequency(from, to),
      getSeverityDistribution(from, to),
      getTriggerFrequency(from, to),
      getLocationFrequency(from, to),
      getSummaryStats(from, to),
      getCyclePhaseStats(from, to),
    ]);

    return NextResponse.json({ frequency, severity, triggers, locations, summary, cyclePhases });
  } catch {
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
