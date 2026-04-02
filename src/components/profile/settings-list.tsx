"use client";

import { useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Moon, Sun, Globe, LogOut } from "lucide-react";
import { useTheme } from "@/lib/theme-provider";
import { signOut } from "@/lib/actions/auth-actions";
import { updateLocale } from "@/lib/actions/profile-actions";
import { locales, type Locale } from "@/i18n/config";

const localeLabels: Record<Locale, string> = {
  en: "English",
  ru: "Русский",
};

export function SettingsList() {
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations("profile");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleLocaleChange(newLocale: Locale) {
    if (newLocale === locale || isPending) return;
    // Set cookie for immediate effect
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=${365 * 24 * 60 * 60}`;
    // Persist to DB
    startTransition(async () => {
      await updateLocale(newLocale);
      router.refresh();
    });
  }

  return (
    <div className="space-y-1">
      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="flex w-full items-center justify-between rounded-[var(--radius-sm)] px-3 py-3 text-left hover:bg-bg-surface"
      >
        <div className="flex items-center gap-3">
          {theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
          <span className="text-sm font-medium">{t("theme")}</span>
        </div>
        <span className="text-sm text-text-secondary capitalize">{theme}</span>
      </button>

      {/* Locale switcher */}
      <div className="flex w-full items-center justify-between rounded-[var(--radius-sm)] px-3 py-3">
        <div className="flex items-center gap-3">
          <Globe size={20} />
          <span className="text-sm font-medium">{t("language")}</span>
        </div>
        <div className="flex gap-1 rounded-full border border-border bg-bg-elevated p-0.5">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => handleLocaleChange(loc)}
              disabled={isPending}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                locale === loc
                  ? "bg-accent text-white"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {localeLabels[loc]}
            </button>
          ))}
        </div>
      </div>

      {/* Sign out */}
      <form action={signOut}>
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-[var(--radius-sm)] px-3 py-3 text-left text-severity-high hover:bg-bg-surface"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">{t("signOut")}</span>
        </button>
      </form>

      {/* Version */}
      <div className="px-3 py-2">
        <p className="text-xs text-text-secondary">{t("version")}</p>
      </div>
    </div>
  );
}
