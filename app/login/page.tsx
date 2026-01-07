"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield } from "lucide-react";
import { supabase } from "@/lib/supabase";
// Using server-side login API to persist session cookies for SSR

import { useI18n } from "@/lib/i18n";

export default function LoginPage() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Check for Forced Reset flag
      if (data.user?.user_metadata?.force_password_reset) {
        router.push('/reset-password');
      } else {
        router.refresh(); // Refresh to update server components with new cookies (if any)
        router.push('/dashboard');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message === "Invalid login credentials"
        ? t('auth_error_invalid_credentials')
        : err.message || t('auth_error_something_went_wrong')
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 font-sans relative overflow-hidden selection:bg-primary/30 transition-colors duration-700">
      {/* Decorative Blobs */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full -mr-96 -mt-96 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-secondary/5 blur-[150px] rounded-full -ml-96 -mb-96 pointer-events-none" />

      <div className="w-full max-w-[500px] relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="bg-surface/40 backdrop-blur-2xl rounded-[64px] border border-surface p-16 shadow-bubble overflow-hidden group">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-surface rounded-[32px] mx-auto mb-8 flex items-center justify-center shadow-bubble group-hover:scale-110 transition-transform duration-700">
              <Shield className="w-8 h-8 text-primary opacity-80" fill="currentColor" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-foreground">
              DYWGV <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Elite</span>
            </h1>
            <p className="text-muted mt-4 text-xs font-black uppercase tracking-[0.5em]">
              {t('auth_login_subtitle') || "Secure Authority Portal"}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-3">
              <label htmlFor="email" className="block text-xs font-black uppercase tracking-[0.5em] text-muted ml-4">
                {t('auth_email')}
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full rounded-full border border-border bg-surface px-10 py-6 text-base font-bold text-foreground shadow-sm transition-all placeholder:text-muted/50 focus:bg-surface focus:border-primary/50 focus:ring-8 focus:ring-primary/5 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth_email_placeholder')}
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="password" className="block text-xs font-black uppercase tracking-[0.5em] text-muted ml-4">
                {t('auth_password')}
              </label>
              <input
                id="password"
                type="password"
                required
                className="w-full rounded-full border border-border bg-surface px-10 py-6 text-base font-bold text-foreground shadow-sm transition-all placeholder:text-muted/50 focus:bg-surface focus:border-primary/50 focus:ring-8 focus:ring-primary/5 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth_password_placeholder')}
              />
            </div>

            {error && (
              <div className="rounded-[24px] border border-red-500/10 bg-red-500/5 px-8 py-5 text-xs font-black uppercase tracking-widest text-red-500 animate-pulse text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-6 text-sm font-black uppercase tracking-[0.4em] text-white shadow-bubble shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-3 h-3 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  {t('auth_submitting_login')}
                </div>
              ) : t('auth_submit_login')}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-muted">
              {t('auth_no_account')}{" "}
              <Link href="/signup" className="text-primary hover:text-secondary transition-colors ml-2">
                {t('auth_link_signup')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
