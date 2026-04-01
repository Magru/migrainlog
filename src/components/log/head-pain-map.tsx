"use client";

import Image from "next/image";
import type { PainLocation } from "@/lib/types/database";

interface HeadPainMapProps {
  selected: PainLocation[];
  onToggle: (location: PainLocation) => void;
}

/**
 * Bilateral pain zones for ICHD-3 compliant migraine tracking.
 * ~60% of migraines are unilateral — L/R distinction is diagnostically critical.
 * Container: 260x400 (ratio matches head-map-v2.png 339:520).
 * A vertical center line at 50% divides left/right zones.
 */
const zones: {
  id: PainLocation;
  label: string;
  top: string;
  left: string;
  width: string;
  height: string;
  borderRadius: string;
}[] = [
  /* ── Crown (midline) ── */
  {
    id: "crown",
    label: "Crown",
    top: "0%",
    left: "20%",
    width: "60%",
    height: "13%",
    borderRadius: "50% 50% 6px 6px",
  },
  /* ── Forehead L/R ── */
  {
    id: "left_forehead",
    label: "L Forehead",
    top: "13%",
    left: "15%",
    width: "35%",
    height: "17%",
    borderRadius: "6px",
  },
  {
    id: "right_forehead",
    label: "R Forehead",
    top: "13%",
    left: "50%",
    width: "35%",
    height: "17%",
    borderRadius: "6px",
  },
  /* ── Temples L/R ── */
  {
    id: "left_temple",
    label: "L Temple",
    top: "15%",
    left: "2%",
    width: "15%",
    height: "28%",
    borderRadius: "40% 6px 6px 40%",
  },
  {
    id: "right_temple",
    label: "R Temple",
    top: "15%",
    left: "83%",
    width: "15%",
    height: "28%",
    borderRadius: "6px 40% 40% 6px",
  },
  /* ── Behind Eyes L/R ── */
  {
    id: "left_behind_eye",
    label: "L Behind Eye",
    top: "30%",
    left: "15%",
    width: "35%",
    height: "12%",
    borderRadius: "6px",
  },
  {
    id: "right_behind_eye",
    label: "R Behind Eye",
    top: "30%",
    left: "50%",
    width: "35%",
    height: "12%",
    borderRadius: "6px",
  },
  /* ── Back of Head L/R ── */
  {
    id: "left_back_of_head",
    label: "L Back",
    top: "42%",
    left: "12%",
    width: "38%",
    height: "28%",
    borderRadius: "6px 6px 6px 40%",
  },
  {
    id: "right_back_of_head",
    label: "R Back",
    top: "42%",
    left: "50%",
    width: "38%",
    height: "28%",
    borderRadius: "6px 6px 40% 6px",
  },
  /* ── Neck L/R ── */
  {
    id: "left_neck",
    label: "L Neck",
    top: "74%",
    left: "26%",
    width: "24%",
    height: "22%",
    borderRadius: "6px 6px 6px 20%",
  },
  {
    id: "right_neck",
    label: "R Neck",
    top: "74%",
    left: "50%",
    width: "24%",
    height: "22%",
    borderRadius: "6px 6px 20% 6px",
  },
  /* ── Full Head (toggle) ── */
  {
    id: "full_head",
    label: "Full Head",
    top: "",
    left: "",
    width: "",
    height: "",
    borderRadius: "",
  },
];

export function HeadPainMap({ selected, onToggle }: HeadPainMapProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Head illustration with bilateral tap zones */}
      <div className="relative" style={{ width: 260, height: 400 }}>
        <Image
          src="/images/head-map-v2.png"
          alt="Head diagram"
          fill
          className="pointer-events-none object-fill"
          priority
        />

        {/* Center line indicator */}
        <div
          className="pointer-events-none absolute left-1/2 opacity-20"
          style={{
            top: "13%",
            height: "83%",
            width: 1,
            backgroundColor: "var(--accent-primary)",
          }}
        />

        {/* Tappable bilateral pain zones */}
        {zones
          .filter((z) => z.id !== "full_head")
          .map((zone) => {
            const isSelected = selected.includes(zone.id);
            return (
              <button
                key={zone.id}
                onClick={() => onToggle(zone.id)}
                aria-label={zone.label}
                aria-pressed={isSelected}
                className="absolute transition-all duration-200"
                style={{
                  top: zone.top,
                  left: zone.left,
                  width: zone.width,
                  height: zone.height,
                  borderRadius: zone.borderRadius,
                  backgroundColor: isSelected
                    ? "rgba(123, 97, 255, 0.3)"
                    : "transparent",
                  border: isSelected
                    ? "2px solid rgba(123, 97, 255, 0.6)"
                    : "1px solid rgba(123, 97, 255, 0.06)",
                }}
              />
            );
          })}
      </div>

      {/* Full head toggle */}
      <button
        onClick={() => onToggle("full_head")}
        className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
          selected.includes("full_head")
            ? "border-accent bg-accent/20 text-accent"
            : "border-border text-text-secondary hover:border-text-secondary"
        }`}
      >
        Full Head
      </button>

      {/* Selected zone labels */}
      {selected.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1.5">
          {selected.map((loc) => (
            <span
              key={loc}
              className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs text-accent"
            >
              {zones.find((z) => z.id === loc)?.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
