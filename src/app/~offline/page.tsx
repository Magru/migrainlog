"use client";

/** Shown by the service worker when the device is offline and no cached page is available */
export default function OfflinePage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-bg-base px-6 text-center">
      <div className="text-5xl">📡</div>
      <h1 className="font-heading text-2xl font-bold text-text-primary">
        You&apos;re offline
      </h1>
      <p className="max-w-xs text-sm text-text-secondary">
        Check your connection and try again. Your logged episodes are saved
        locally and will sync when you&apos;re back online.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white"
      >
        Try Again
      </button>
    </div>
  );
}
