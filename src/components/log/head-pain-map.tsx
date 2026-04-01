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
 * Front-view zones — calibrated to head-map-v2.png (339x520).
 * Container 240x370 (same ratio). Covers full face including
 * sinus (V2 trigeminal) and jaw (V3 trigeminal) areas.
 *
 * Anatomy % from top: skull 0-5%, crown 5-15%, forehead 15-30%,
 * eyes 30-40%, sinus/cheeks 40-52%, mouth/jaw 52-68%,
 * chin 68-72%, neck 72-95%. Ears ~15-50% on sides.
 */
const frontZones: Zone[] = [
  /* Crown — midline top of skull */
  { id: "crown", label: "Crown", top: "0%", left: "22%", width: "56%", height: "15%", borderRadius: "50% 50% 6px 6px" },
  /* Forehead L/R */
  { id: "left_forehead", label: "L Forehead", top: "15%", left: "18%", width: "32%", height: "15%", borderRadius: "6px" },
  { id: "right_forehead", label: "R Forehead", top: "15%", left: "50%", width: "32%", height: "15%", borderRadius: "6px" },
  /* Temples — sides of head at ear level */
  { id: "left_temple", label: "L Temple", top: "15%", left: "4%", width: "16%", height: "25%", borderRadius: "40% 6px 6px 40%" },
  { id: "right_temple", label: "R Temple", top: "15%", left: "80%", width: "16%", height: "25%", borderRadius: "6px 40% 40% 6px" },
  /* Behind eyes / orbital */
  { id: "left_behind_eye", label: "L Eye", top: "30%", left: "18%", width: "32%", height: "11%", borderRadius: "6px" },
  { id: "right_behind_eye", label: "R Eye", top: "30%", left: "50%", width: "32%", height: "11%", borderRadius: "6px" },
  /* Sinus / maxillary — cheeks below eyes */
  { id: "left_sinus", label: "L Sinus", top: "41%", left: "16%", width: "34%", height: "13%", borderRadius: "6px" },
  { id: "right_sinus", label: "R Sinus", top: "41%", left: "50%", width: "34%", height: "13%", borderRadius: "6px" },
  /* Jaw / mandibular */
  { id: "left_jaw", label: "L Jaw", top: "54%", left: "14%", width: "36%", height: "16%", borderRadius: "6px 6px 6px 30%" },
  { id: "right_jaw", label: "R Jaw", top: "54%", left: "50%", width: "36%", height: "16%", borderRadius: "6px 6px 30% 6px" },
  /* Neck */
  { id: "left_neck", label: "L Neck", top: "72%", left: "26%", width: "24%", height: "22%", borderRadius: "6px 6px 6px 20%" },
  { id: "right_neck", label: "R Neck", top: "72%", left: "50%", width: "24%", height: "22%", borderRadius: "6px 6px 20% 6px" },
];

/**
 * Back-view zones — calibrated to head-map-back.png.
 * Mirrored: viewer's left = patient's right.
 */
const backZones: Zone[] = [
  { id: "crown", label: "Crown", top: "0%", left: "20%", width: "60%", height: "15%", borderRadius: "50% 50% 6px 6px" },
  { id: "left_back_of_head", label: "L Back", top: "15%", left: "50%", width: "36%", height: "30%", borderRadius: "6px 6px 40% 6px" },
  { id: "right_back_of_head", label: "R Back", top: "15%", left: "14%", width: "36%", height: "30%", borderRadius: "6px 6px 6px 40%" },
  { id: "left_neck", label: "L Neck", top: "50%", left: "50%", width: "24%", height: "28%", borderRadius: "6px 6px 20% 6px" },
  { id: "right_neck", label: "R Neck", top: "50%", left: "26%", width: "24%", height: "28%", borderRadius: "6px 6px 6px 20%" },
];

/** All unique zones for label lookup */
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
            view === "front" ? "bg-accent text-white" : "text-text-secondary hover:text-text-primary"
          }`}
        >
          Front
        </button>
        <button
          onClick={() => setView("back")}
          className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
            view === "back" ? "bg-accent text-white" : "text-text-secondary hover:text-text-primary"
          }`}
        >
          Back
        </button>
      </div>

      {/* Head illustration with tap zones */}
      <div className="relative" style={{ width: 240, height: 370 }}>
        <Image
          src={imageSrc}
          alt={`Head — ${view} view`}
          fill
          className="pointer-events-none object-fill"
          priority
        />

        {/* Center divider */}
        <div
          className="pointer-events-none absolute left-1/2 opacity-15"
          style={{ top: "15%", height: "78%", width: 1, backgroundColor: "var(--accent-primary)" }}
        />

        {/* Tappable zones */}
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
              <span key={loc} className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs text-accent">
                {zone?.label ?? loc}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
