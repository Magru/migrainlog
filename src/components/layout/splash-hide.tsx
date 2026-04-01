"use client";

import { useEffect } from "react";

/** Hides the splash screen after hydration, then removes it from DOM */
export function SplashHide() {
  useEffect(() => {
    const splash = document.getElementById("splash");
    if (!splash) return;

    // Fade out after short delay
    const fadeTimer = setTimeout(() => {
      splash.classList.add("splash-hidden");
    }, 400);

    // Remove from DOM after fade completes
    const removeTimer = setTimeout(() => {
      splash.remove();
    }, 900);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  return null;
}
