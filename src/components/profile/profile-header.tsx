"use client";

import { useState, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { updateGender } from "@/lib/actions/profile-actions";
import type { Gender } from "@/lib/types/database";

interface ProfileHeaderProps {
  displayName: string | null;
  email: string;
  createdAt: string;
  gender: Gender | null;
}

const genderKeys: { value: Gender; key: string; icon: string }[] = [
  { value: "male", key: "male", icon: "♂" },
  { value: "female", key: "female", icon: "♀" },
];

export function ProfileHeader({ displayName, email, createdAt, gender }: ProfileHeaderProps) {
  const t = useTranslations("profile");
  const locale = useLocale();
  const [selected, setSelected] = useState<Gender | null>(gender);
  const [isPending, startTransition] = useTransition();

  const initials = (displayName ?? email)
    .split(/[\s@]/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");

  const memberSince = new Date(createdAt).toLocaleDateString(locale, {
    month: "long",
    year: "numeric",
  });

  function handleToggle(value: Gender) {
    if (isPending) return;
    const next = selected === value ? null : value;
    const prev = selected;
    setSelected(next);

    startTransition(async () => {
      const result = await updateGender(next);
      if (result.error) {
        setSelected(prev);
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-lg font-bold text-white">
          {initials}
        </div>
        <div>
          <h2 className="font-heading text-lg font-bold">{displayName ?? email}</h2>
          <p className="text-sm text-text-secondary">{t("memberSince", { date: memberSince })}</p>
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-text-secondary">{t("gender")}</p>
        <div className="grid grid-cols-2 gap-2">
          {genderKeys.map((opt) => {
            const isSelected = selected === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                aria-pressed={isSelected}
                disabled={isPending}
                onClick={() => handleToggle(opt.value)}
                className={`flex h-12 items-center justify-center gap-2 rounded-[var(--radius-md)] border text-sm font-medium transition-colors disabled:opacity-50 ${
                  isSelected
                    ? "border-accent bg-accent/10 text-accent shadow-[0_0_12px_rgba(123,97,255,0.15)]"
                    : "border-border bg-bg-surface text-text-secondary hover:border-text-secondary"
                }`}
              >
                <span>{opt.icon}</span>
                <span>{t(opt.key)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
