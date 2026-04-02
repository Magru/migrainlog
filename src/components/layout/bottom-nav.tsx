"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { LayoutDashboard, Calendar, Plus, BarChart3, User } from "lucide-react";
import { LogBottomSheet } from "@/components/log/log-bottom-sheet";

const tabs = [
  { href: "/dashboard", key: "dashboard", icon: LayoutDashboard },
  { href: "/calendar", key: "calendar", icon: Calendar },
  { href: "/analytics", key: "analytics", icon: BarChart3 },
  { href: "/profile", key: "profile", icon: User },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const [logOpen, setLogOpen] = useState(false);
  const t = useTranslations("nav");

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-bg-surface/95 backdrop-blur-sm"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto flex h-16 max-w-[428px] items-center justify-around">
          {tabs.slice(0, 2).map(({ href, key, icon: Icon }) => {
            const active = pathname === href;
            const label = t(key);
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

          {/* Center log button — opens bottom sheet */}
          <button
            onClick={() => setLogOpen(true)}
            aria-label={t("logEpisode")}
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-white shadow-lg shadow-accent/20 transition-transform active:scale-[0.94]"
          >
            <Plus size={24} />
          </button>

          {tabs.slice(2).map(({ href, key, icon: Icon }) => {
            const active = pathname === href;
            const label = t(key);
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

      <LogBottomSheet open={logOpen} onClose={() => setLogOpen(false)} />
    </>
  );
}
