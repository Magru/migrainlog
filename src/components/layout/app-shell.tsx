export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <main
      className="mx-auto w-full max-w-[428px] overflow-y-auto px-4"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "calc(80px + env(safe-area-inset-bottom))",
      }}
    >
      {children}
    </main>
  );
}
