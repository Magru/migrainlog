import { getTranslations } from "next-intl/server";
import { PageTransition } from "@/components/layout/page-transition";
import { ProfileHeader } from "@/components/profile/profile-header";
import { MedicationLibrary } from "@/components/profile/medication-library";
import { SettingsList } from "@/components/profile/settings-list";
import { createClient } from "@/lib/supabase/server";
import { getUserMedications } from "@/lib/queries/medication-queries";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const t = await getTranslations("profile");
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, medications] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user?.id ?? "").single(),
    getUserMedications(),
  ]);

  return (
    <PageTransition>
      <div className="space-y-6 py-6">
        <h1 className="font-heading text-[28px] font-extrabold">{t("title")}</h1>

        <ProfileHeader
          displayName={profile?.display_name ?? null}
          email={user?.email ?? ""}
          createdAt={profile?.created_at ?? new Date().toISOString()}
          gender={profile?.gender ?? null}
        />

        <MedicationLibrary medications={medications} />

        <div className="rounded-[var(--radius-md)] border border-border bg-bg-surface p-2">
          <SettingsList />
        </div>
      </div>
    </PageTransition>
  );
}
