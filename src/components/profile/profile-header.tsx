interface ProfileHeaderProps {
  displayName: string | null;
  email: string;
  createdAt: string;
}

export function ProfileHeader({ displayName, email, createdAt }: ProfileHeaderProps) {
  const initials = (displayName ?? email)
    .split(/[\s@]/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");

  const memberSince = new Date(createdAt).toLocaleDateString("en", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex items-center gap-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-lg font-bold text-white">
        {initials}
      </div>
      <div>
        <h2 className="font-heading text-lg font-bold">{displayName ?? email}</h2>
        <p className="text-sm text-text-secondary">Member since {memberSince}</p>
      </div>
    </div>
  );
}
