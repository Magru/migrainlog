"use client";

import { useState, useTransition } from "react";
import { updateGender } from "@/lib/actions/profile-actions";
import type { Gender } from "@/lib/types/database";

interface ProfileHeaderProps {
  displayName: string | null;
  email: string;
  createdAt: string;
  gender: Gender | null;
}

const genderOptions: { value: Gender; label: string; icon: string }[] = [
  { value: "male", label: "Male", icon: "♂" },
  { value: "female", label: "Female", icon: "♀" },
];

export function ProfileHeader({ displayName, email, createdAt, gender }: ProfileHeaderProps) {
  const [selected, setSelected] = useState<Gender | null>(gender);
  const [isPending, startTransition] = useTransition();

  const initials = (displayName ?? email)
    .split(/[\s@]/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");

  const memberSince = new Date(createdAt).toLocaleDateString("en", {
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
          <p className="text-sm text-text-secondary">Member since {memberSince}</p>
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-text-secondary">Gender</p>
        <div className="grid grid-cols-2 gap-2">
          {genderOptions.map((opt) => {
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
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
