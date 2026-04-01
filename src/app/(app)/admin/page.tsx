import { redirect } from "next/navigation";
import { PageTransition } from "@/components/layout/page-transition";
import { isCurrentUserAdmin, getAllUsersWithStats } from "@/lib/queries/admin-queries";
import { Shield, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const isAdmin = await isCurrentUserAdmin();

  if (!isAdmin) {
    redirect("/dashboard");
  }

  const users = await getAllUsersWithStats();

  return (
    <PageTransition>
      <div className="space-y-6 py-6">
        <div className="flex items-center gap-3">
          <Shield size={24} className="text-accent" />
          <h1 className="font-heading text-[28px] font-extrabold">Admin</h1>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 rounded-[var(--radius-md)] border border-border bg-bg-surface p-4">
          <Users size={20} className="text-accent-secondary" />
          <span className="text-sm text-text-secondary">
            {users.length} user{users.length !== 1 ? "s" : ""} registered
          </span>
        </div>

        {/* User list */}
        <div className="space-y-2">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between rounded-[var(--radius-md)] border border-border bg-bg-surface p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-sm font-bold text-accent">
                  {(user.displayName ?? "?")[0]?.toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-text-primary">
                      {user.displayName ?? "No name"}
                    </span>
                    {user.isAdmin && (
                      <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-medium text-accent">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary">
                    Joined {new Date(user.createdAt).toLocaleDateString("en", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="font-heading text-lg font-bold">{user.episodeCount}</span>
                <p className="text-[10px] text-text-secondary">episodes</p>
              </div>
            </div>
          ))}

          {users.length === 0 && (
            <p className="py-8 text-center text-sm text-text-secondary">No users yet</p>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
