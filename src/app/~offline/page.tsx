"use client";

import { useTranslations } from "next-intl";

/** Shown by the service worker when the device is offline and no cached page is available */
export default function OfflinePage() {
  const t = useTranslations("offline");

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-bg-base px-6 text-center">
      <div className="text-5xl">📡</div>
      <h1 className="font-heading text-2xl font-bold text-text-primary">
        {t("title")}
      </h1>
      <p className="max-w-xs text-sm text-text-secondary">
        {t("message")}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white"
      >
        {t("tryAgain")}
      </button>
    </div>
  );
}
