"use client";

import { useState } from "react";
import Image from "next/image";
import type { PainLocation } from "@/lib/types/database";

interface HeadPainMapProps {
  selected: PainLocation[];
  onToggle: (location: PainLocation) => void;
}

type Zone = {
  id: PainLocation;
  label: string;
  top: string;
  left: string;
  width: string;
  height: string;
  borderRadius: string;
};

/**
 * Front-view zones — bilateral (L/R), calibrated to head-map-v2.png.
 */
const frontZones: Zone[] = [
  { id: "crown", label: "Crown", top: "0%", left: "20%", width: "60%", height: "13%", borderRadius: "50% 50% 6px 6px" },
  { id: "left_forehead", label: "L Forehead", top: "13%", left: "15%", width: "35%", height: "17%", borderRadius: "6px" },
  { id: "right_forehead", label: "R Forehead", top: "13%", left: "50%", width: "35%", height: "17%", borderRadius: "6px" },
  { id: "left_temple", label: "L Temple", top: "15%", left: "2%", width: "15%", height: "28%", borderRadius: "40% 6px 6px 40%" },
  { id: "right_temple", label: "R Temple", top: "15%", left: "83%", width: "15%", height: "28%", borderRadius: "6px 40% 40% 6px" },
  { id: "left_behind_eye", label: "L Behind Eye", top: "30%", left: "15%", width: "35%", height: "12%", borderRadius: "6px" },
  { id: "right_behind_eye", label: "R Behind Eye", top: "30%", left: "50%", width: "35%", height: "12%", borderRadius: "6px" },
];

/**
 * Back-view zones — bilateral, calibrated to head-map-back.png.
 * Note: on back view, L/R are mirrored (viewer's left = patient's right).
 */
const backZones: Zone[] = [
  { id: "crown", label: "Crown", top: "0%", left: "18%", width: "64%", height: "14%", borderRadius: "50% 50% 6px 6px" },
  { id: "left_back_of_head", label: "L Back", top: "14%", left: "50%", width: "38%", height: "30%", borderRadius: "6px 6px 40% 6px" },
  { id: "right_back_of_head", label: "R Back", top: "14%", left: "12%", width: "38%", height: "30%", borderRadius: "6px 6px 6px 40%" },
  { id: "left_neck", label: "L Neck", top: "50%", left: "50%", width: "24%", height: "28%", borderRadius: "6px 6px 20% 6px" },
  { id: "right_neck", label: "R Neck", top: "50%", left: "26%", width: "24%", height: "28%", borderRadius: "6px 6px 6px 20%" },
];

const allZones = [...frontZones, ...backZones];

export function HeadPainMap({ selected, onToggle }: HeadPainMapProps) {
  const [view, setView] = useState<"front" | "back">("front");

  const zones = view === "front" ? frontZones : backZones;
  const imageSrc = view === "front" ? "/images/head-map-v2.png" : "/images/head-map-back.png";

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Front / Back toggle */}
      <div className="flex gap-1 rounded-full border border-border bg-bg-surface p-1">
        <button
          onClick={() => setView("front")}
          className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
            view === "front"
              ? "bg-accent text-white"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          Front
        </button>
        <button
          onClick={() => setView("back")}
          className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
            view === "back"
              ? "bg-accent text-white"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          Back
        </button>
      </div>

      {/* Head illustration with bilateral tap zones */}
      <div className="relative" style={{ width: 240, height: 370 }}>
        <Image
          src={imageSrc}
          alt={`Head diagram — ${view} view`}
          fill
          className="pointer-events-none object-fill"
          priority
        />

        {/* Center line */}
        <div
          className="pointer-events-none absolute left-1/2 opacity-15"
          style={{ top: "12%", height: "80%", width: 1, backgroundColor: "var(--accent-primary)" }}
        />

        {/* Tappable pain zones */}
        {zones.map((zone) => {
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
                backgroundColor: isSelected ? "rgba(123, 97, 255, 0.3)" : "transparent",
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
          {selected.map((loc) => {
            const zone = allZones.find((z) => z.id === loc);
            return (
              <span
                key={loc}
                className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs text-accent"
              >
                {zone?.label ?? loc}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
