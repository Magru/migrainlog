"use client";

import { useEffect } from "react";

/** Hides the splash screen after hydration + short delay for smooth transition */
export function SplashHide() {
  useEffect(() => {
    const splash = document.getElementById("splash");
    if (!splash) return;

    // Small delay so the splash doesn't flash away instantly
    const timer = setTimeout(() => {
      splash.classList.add("splash-hidden");
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
