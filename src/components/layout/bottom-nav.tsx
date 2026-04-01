"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, Plus, BarChart3, User } from "lucide-react";

const tabs = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, isLog: false },
  { href: "/calendar", label: "Calendar", icon: Calendar, isLog: false },
  { href: "/log", label: "Log", icon: Plus, isLog: true },
  { href: "/analytics", label: "Analytics", icon: BarChart3, isLog: false },
  { href: "/profile", label: "Profile", icon: User, isLog: false },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-bg-surface/95 backdrop-blur-sm"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex h-16 max-w-[428px] items-center justify-around">
        {tabs.map(({ href, label, icon: Icon, isLog }) => {
          const active = pathname === href;

          if (isLog) {
            return (
              <Link
                key={href}
                href={href}
                aria-label={label}
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-white shadow-lg shadow-accent/20 transition-transform active:scale-[0.94]"
              >
                <Icon size={24} />
              </Link>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              className={`flex min-w-[56px] flex-col items-center gap-0.5 py-1 transition-colors ${
                active ? "text-accent" : "text-text-secondary"
              }`}
            >
              <Icon size={24} />
              <span className="text-[11px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
