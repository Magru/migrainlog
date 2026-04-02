"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { signInWithEmail, signInWithPassword, signUp } from "@/lib/actions/auth-actions";

type AuthMode = "magic-link" | "password" | "signup";

export default function LoginPage() {
  const t = useTranslations("auth");
  const [mode, setMode] = useState<AuthMode>("magic-link");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const formData = new FormData();
    formData.set("email", email);
    formData.set("password", password);

    try {
      if (mode === "magic-link") {
        const result = await signInWithEmail(formData);
        if (result.error) setError(result.error);
        else setMessage(t("checkEmailLogin"));
      } else if (mode === "password") {
        const result = await signInWithPassword(formData);
        if (result?.error) setError(result.error);
      } else {
        const result = await signUp(formData);
        if (result.error) setError(result.error);
        else setMessage(t("checkEmailConfirm"));
      }
    } catch (err: unknown) {
      // Next.js redirect() throws NEXT_REDIRECT — not an actual error
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("NEXT_REDIRECT")) return;
      setError(t("somethingWentWrong"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-4 bg-bg-base">
      <Card className="w-full max-w-sm border-border bg-bg-surface">
        <CardHeader className="text-center space-y-2">
          <h1 className="font-heading text-2xl font-extrabold text-text-primary">
            {t("appName")}
          </h1>
          <p className="text-sm text-text-secondary">
            {t("tagline")}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-text-primary">
                {t("email")}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full rounded-[var(--radius-sm)] border border-border bg-bg-base px-3 py-2.5 text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="you@example.com"
              />
            </div>

            {mode !== "magic-link" && (
              <div>
                <label htmlFor="password" className="text-sm font-medium text-text-primary">
                  {t("password")}
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="mt-1 w-full rounded-[var(--radius-sm)] border border-border bg-bg-base px-3 py-2.5 text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="••••••••"
                />
              </div>
            )}

            {error && (
              <p className="text-sm text-severity-high">{error}</p>
            )}
            {message && (
              <p className="text-sm text-accent-mint">{message}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-full bg-accent text-white font-medium text-base"
            >
              {loading
                ? t("signIn") + "..."
                : mode === "magic-link"
                  ? t("sendMagicLink")
                  : mode === "signup"
                    ? t("createAccount")
                    : t("signIn")}
            </Button>
          </form>

          <div className="mt-4 space-y-2 text-center text-sm text-text-secondary">
            {mode === "magic-link" ? (
              <>
                <button onClick={() => setMode("password")} className="underline hover:text-text-primary">
                  {t("signInWithPassword")}
                </button>
                <span className="mx-2">·</span>
                <button onClick={() => setMode("signup")} className="underline hover:text-text-primary">
                  {t("createAccount")}
                </button>
              </>
            ) : mode === "password" ? (
              <>
                <button onClick={() => setMode("magic-link")} className="underline hover:text-text-primary">
                  {t("useMagicLink")}
                </button>
                <span className="mx-2">·</span>
                <button onClick={() => setMode("signup")} className="underline hover:text-text-primary">
                  {t("createAccount")}
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setMode("magic-link")} className="underline hover:text-text-primary">
                  {t("useMagicLink")}
                </button>
                <span className="mx-2">·</span>
                <button onClick={() => setMode("password")} className="underline hover:text-text-primary">
                  {t("signInWithPassword")}
                </button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
