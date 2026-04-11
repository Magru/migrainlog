import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support — MigrainLog",
};

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0F] text-[#F5F5F7] px-6 py-12 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Support</h1>
      <p className="text-sm text-[#A1A1AA] mb-8">MigrainLog — Headache Diary</p>

      <section className="space-y-6 text-sm leading-relaxed text-[#D4D4D8]">
        <div>
          <h2 className="text-lg font-semibold text-[#F5F5F7] mb-2">Contact Us</h2>
          <p>
            If you have questions, feedback, or need help with MigrainLog, please reach out:
          </p>
          <p className="mt-2">
            Email:{" "}
            <a href="mailto:max.folko@gmail.com" className="text-[#7B61FF] underline">
              max.folko@gmail.com
            </a>
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[#F5F5F7] mb-2">Frequently Asked Questions</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-[#F5F5F7]">How do I log a migraine episode?</h3>
              <p>Tap the &quot;+&quot; button in the center of the tab bar. Follow the 3-step flow: select pain locations, set intensity, then add triggers and symptoms.</p>
            </div>

            <div>
              <h3 className="font-medium text-[#F5F5F7]">Does the app work offline?</h3>
              <p>Yes. Episodes logged without internet are saved locally and automatically sync when you&apos;re back online.</p>
            </div>

            <div>
              <h3 className="font-medium text-[#F5F5F7]">Is my health data shared?</h3>
              <p>No. Apple Health data (sleep, heart rate) is processed on your device only and never sent to our servers. See our Privacy Policy for details.</p>
            </div>

            <div>
              <h3 className="font-medium text-[#F5F5F7]">How do I delete my account?</h3>
              <p>Contact us at max.folko@gmail.com and we will delete your account and all associated data.</p>
            </div>

            <div>
              <h3 className="font-medium text-[#F5F5F7]">Which languages are supported?</h3>
              <p>English and Russian. More languages coming soon.</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[#F5F5F7] mb-2">App Version</h2>
          <p>Current version: 1.0.0</p>
        </div>
      </section>
    </main>
  );
}
