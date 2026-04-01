import Image from "next/image";
import type { PainLocation } from "@/lib/types/database";

interface LocationSummaryProps {
  data: { location: PainLocation; count: number; opacity: number }[];
}

/** Zone positions matching head-pain-map bilateral layout */
const zoneStyles: Record<string, { top: string; left: string; width: string; height: string; borderRadius: string }> = {
  crown:               { top: "0%",  left: "20%", width: "60%", height: "13%", borderRadius: "50% 50% 6px 6px" },
  left_forehead:       { top: "13%", left: "15%", width: "35%", height: "17%", borderRadius: "6px" },
  right_forehead:      { top: "13%", left: "50%", width: "35%", height: "17%", borderRadius: "6px" },
  left_temple:         { top: "15%", left: "2%",  width: "15%", height: "28%", borderRadius: "40% 6px 6px 40%" },
  right_temple:        { top: "15%", left: "83%", width: "15%", height: "28%", borderRadius: "6px 40% 40% 6px" },
  left_behind_eye:     { top: "30%", left: "15%", width: "35%", height: "12%", borderRadius: "6px" },
  right_behind_eye:    { top: "30%", left: "50%", width: "35%", height: "12%", borderRadius: "6px" },
  left_back_of_head:   { top: "42%", left: "12%", width: "38%", height: "28%", borderRadius: "6px 6px 6px 40%" },
  right_back_of_head:  { top: "42%", left: "50%", width: "38%", height: "28%", borderRadius: "6px 6px 40% 6px" },
  left_neck:           { top: "74%", left: "26%", width: "24%", height: "22%", borderRadius: "6px 6px 6px 20%" },
  right_neck:          { top: "74%", left: "50%", width: "24%", height: "22%", borderRadius: "6px 6px 20% 6px" },
};

export function LocationSummary({ data }: LocationSummaryProps) {
  const opacityMap: Record<string, number> = {};
  data.forEach((d) => {
    opacityMap[d.location] = d.opacity;
  });

  return (
    <div className="rounded-[var(--radius-md)] border border-border bg-bg-surface p-4">
      <h3 className="mb-4 text-sm font-medium text-text-secondary">Pain Locations</h3>
      {data.length === 0 ? (
        <p className="py-4 text-center text-sm text-text-secondary">No location data yet</p>
      ) : (
        <div className="flex justify-center">
          <div className="relative" style={{ width: 160, height: 246 }}>
            <Image
              src="/images/head-map-v2.png"
              alt="Pain heatmap"
              fill
              className="pointer-events-none object-fill opacity-40"
            />
            {Object.entries(zoneStyles).map(([loc, style]) => (
              <div
                key={loc}
                className="absolute"
                style={{
                  ...style,
                  backgroundColor: "var(--accent-primary)",
                  opacity: opacityMap[loc] ?? 0,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
