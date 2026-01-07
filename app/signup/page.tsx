"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { validatePasswordSecurity } from "@/app/actions/security";

import { useI18n } from "@/lib/i18n";

export default function SignupPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!username.trim() || !email.trim() || !password.trim()) {
      setError(t('auth_fill_all_fields'));
      return;
    }

    setLoading(true);
    try {
      // 1. Security Check (HIBP)
      const security = await validatePasswordSecurity(password);
      if (!security.success) {
        throw new Error(security.message);
      }

      // 2. Supabase Signup
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username.trim(),
          },
        },
      });

      if (error) throw error;

      setMessage(
        t('auth_signup_success_message')
      );

      // Optional: Auto redirect if email confirmation isn't strictly blocking login flow immediately
      setTimeout(() => {
        router.push("/onboarding");
      }, 3000);

    } catch (err: any) {
      console.error(err);
      setError(err.message ?? t('auth_signup_failed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 font-sans relative overflow-hidden selection:bg-primary/30 transition-colors duration-700">
      {/* Decorative Blobs */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full -ml-96 -mt-96 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-secondary/5 blur-[150px] rounded-full -mr-96 -mb-96 pointer-events-none" />

      <div className="w-full max-w-[500px] relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="bg-surface/40 backdrop-blur-2xl rounded-[64px] border border-surface p-16 shadow-bubble overflow-hidden group">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-surface rounded-[32px] mx-auto mb-8 flex items-center justify-center shadow-bubble group-hover:scale-110 transition-transform duration-700">
              <Shield className="w-8 h-8 text-primary opacity-80" fill="currentColor" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-foreground">
              {t('auth_signup_title')} <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Gate</span>
            </h1>
            <p className="text-muted mt-4 text-xs font-black uppercase tracking-[0.5em]">
              {t('auth_signup_subtitle') || "Establish Your Authority Domain"}
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-8">
            <div className="space-y-3">
              <label htmlFor="username" className="block text-xs font-black uppercase tracking-[0.5em] text-muted ml-4">
                {t('auth_username')}
              </label>
              <input
                id="username"
                required
                className="w-full rounded-full border border-border bg-surface px-10 py-6 text-sm font-bold text-foreground shadow-sm transition-all placeholder:text-muted/50 focus:bg-surface focus:border-primary/50 focus:ring-8 focus:ring-primary/5 outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. creative_executive"
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="email" className="block text-xs font-black uppercase tracking-[0.5em] text-muted ml-4">
                {t('auth_email')}
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full rounded-full border border-border bg-surface px-10 py-6 text-sm font-bold text-foreground shadow-sm transition-all placeholder:text-muted/50 focus:bg-surface focus:border-primary/50 focus:ring-8 focus:ring-primary/5 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
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
                className="w-full rounded-full border border-border bg-surface px-10 py-6 text-sm font-bold text-foreground shadow-sm transition-all placeholder:text-muted/50 focus:bg-surface focus:border-primary/50 focus:ring-8 focus:ring-primary/5 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Secure access key"
              />
              <p className="text-xs font-black uppercase tracking-widest text-muted mt-3 ml-4 opacity-60">
                {t('auth_hibp_note')}
              </p>
            </div>

            {error && (
              <div className="rounded-[24px] border border-red-500/10 bg-red-500/5 px-8 py-5 text-xs font-black uppercase tracking-widest text-red-500 animate-pulse text-center">
                {error}
              </div>
            )}
            {message && (
              <div className="rounded-[24px] border border-emerald-500/10 bg-emerald-500/5 px-8 py-5 text-xs font-black uppercase tracking-widest text-emerald-500 text-center">
                {message}
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
                  {t('auth_submitting_signup')}
                </div>
              ) : t('auth_submit_signup')}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-muted">
              {t('auth_has_account')}{" "}
              <Link href="/login" className="text-primary hover:text-secondary transition-colors ml-2">
                {t('auth_link_login')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
