"use client";

import { useEffect } from "react";

/** Hides the splash screen after hydration (kept in DOM to avoid React reconciliation crash) */
export function SplashHide() {
  useEffect(() => {
    const splash = document.getElementById("splash");
    if (!splash) return;

    // Fade out after short delay — do NOT remove from DOM,
    // React needs the node as a sibling reference for insertBefore
    const fadeTimer = setTimeout(() => {
      splash.style.opacity = "0";
      splash.style.visibility = "hidden";
      splash.style.pointerEvents = "none";
    }, 400);

    return () => {
      clearTimeout(fadeTimer);
    };
  }, []);

  return null;
}
