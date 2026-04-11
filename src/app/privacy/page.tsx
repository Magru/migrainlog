import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — MigrainLog",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0F] text-[#F5F5F7] px-6 py-12 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-[#A1A1AA] mb-8">Last updated: April 11, 2026</p>

      <section className="space-y-6 text-sm leading-relaxed text-[#D4D4D8]">
        <div>
          <h2 className="text-lg font-semibold text-[#F5F5F7] mb-2">Overview</h2>
          <p>
            MigrainLog (&quot;the App&quot;) is a migraine tracking application developed by Maxim Folko.
            We take your privacy seriously. This policy explains what data we collect, how we use it,
            and your rights regarding your information.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[#F5F5F7] mb-2">Data We Collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Account information:</strong> email address used for authentication</li>
            <li><strong>Migraine episodes:</strong> pain locations, intensity, triggers, symptoms, timestamps, notes, medications, and menstrual cycle phase data that you voluntarily log</li>
            <li><strong>Profile preferences:</strong> display name, gender, language, theme settings</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[#F5F5F7] mb-2">Data We Do NOT Collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Apple Health / HealthKit data is processed locally on your device and never sent to our servers</li>
            <li>Barometric pressure readings are stored locally on your device only</li>
            <li>We do not collect location data, contacts, or browsing history</li>
            <li>We do not sell or share your personal data with third parties</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[#F5F5F7] mb-2">How We Store Data</h2>
          <p>
            Your episode data is stored securely on Supabase (cloud database) protected by
            Row Level Security — only you can access your own data. Authentication tokens on
            mobile devices are stored using encrypted secure storage (iOS Keychain / Android Keystore).
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[#F5F5F7] mb-2">Offline Data</h2>
          <p>
            When offline, episodes are saved locally on your device using SQLite and synced
            to the cloud when connectivity is restored. Local data is not encrypted by default
            but is protected by your device&apos;s passcode/biometric lock.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[#F5F5F7] mb-2">Third-Party Services</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Supabase:</strong> authentication and database hosting</li>
            <li><strong>Expo/EAS:</strong> app build and update delivery</li>
            <li>We may display ads in the future via third-party ad networks, which may collect anonymous usage data per their own privacy policies</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[#F5F5F7] mb-2">Your Rights</h2>
          <p>You can:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Export your data at any time</li>
            <li>Delete your account and all associated data</li>
            <li>Revoke HealthKit permissions through iOS Settings</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[#F5F5F7] mb-2">Contact</h2>
          <p>
            For privacy-related questions, contact us at{" "}
            <a href="mailto:max.folko@gmail.com" className="text-[#7B61FF] underline">
              max.folko@gmail.com
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
