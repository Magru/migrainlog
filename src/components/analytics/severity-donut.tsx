"use client";

import { useTranslations } from "next-intl";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface SeverityDonutProps {
  data: { name: string; value: number; color: string }[];
}

export function SeverityDonut({ data }: SeverityDonutProps) {
  const t = useTranslations("analytics");
  const tc = useTranslations("common");
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="rounded-[var(--radius-md)] border border-border bg-bg-surface p-4">
      <h3 className="mb-4 text-sm font-medium text-text-secondary">{t("severityDistribution")}</h3>
      {total === 0 ? (
        <p className="py-8 text-center text-sm text-text-secondary">{tc("noDataYet")}</p>
      ) : (
        <div className="flex items-center gap-4">
          <ResponsiveContainer width={120} height={120}>
            <PieChart>
              <Pie
                data={data}
                innerRadius={35}
                outerRadius={55}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="space-y-2">
            {data.map((d) => (
              <div key={d.name} className="flex items-center gap-2 text-sm">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-text-secondary">{d.name}</span>
                <span className="font-medium">{d.value}</span>
              </div>
            ))}
            <p className="text-xs text-text-secondary">{t("total", { count: total })}</p>
          </div>
        </div>
      )}
    </div>
  );
}
