import { Suspense } from "react";
import { PageTransition } from "@/components/layout/page-transition";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <PageTransition>
      <div className="space-y-6 py-6">
        <div>
          <h1 className="font-heading text-[28px] font-extrabold">Dashboard</h1>
          <p className="text-sm text-text-secondary">This month&apos;s overview</p>
        </div>

        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardContent />
        </Suspense>
      </div>
    </PageTransition>
  );
}
