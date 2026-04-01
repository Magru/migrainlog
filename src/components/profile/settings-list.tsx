"use client";

import { Moon, Sun, LogOut } from "lucide-react";
import { useTheme } from "@/lib/theme-provider";
import { signOut } from "@/lib/actions/auth-actions";

export function SettingsList() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-1">
      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="flex w-full items-center justify-between rounded-[var(--radius-sm)] px-3 py-3 text-left hover:bg-bg-surface"
      >
        <div className="flex items-center gap-3">
          {theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
          <span className="text-sm font-medium">Theme</span>
        </div>
        <span className="text-sm text-text-secondary capitalize">{theme}</span>
      </button>

      {/* Sign out */}
      <form action={signOut}>
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-[var(--radius-sm)] px-3 py-3 text-left text-severity-high hover:bg-bg-surface"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </form>

      {/* Version */}
      <div className="px-3 py-2">
        <p className="text-xs text-text-secondary">MigrainLog v0.1.0</p>
      </div>
    </div>
  );
}
