"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
    <main className="min-h-screen bg-gradient-to-br from-indigo-50/80 via-white to-pastel-lavender/30 flex items-center justify-center px-4 font-sans">
      <div className="w-full max-w-md relative">
        {/* Abstract Background Shapes */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-200/40 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-pastel-mint/40 rounded-full blur-3xl animate-blob animation-delay-2000"></div>

        <div className="relative bg-white/40 backdrop-blur-xl border border-white/60 shadow-glass rounded-3xl p-8 overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"></div>

          <div className="text-center mb-8">
            <h1 className="font-heading text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              ContentBuddyAI
            </h1>
            <p className="text-slate-500 mt-2 text-sm">
              {t('auth_login_subtitle')}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1.5 ml-1">
                {t('auth_email')}
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full rounded-xl border-0 bg-white/50 px-4 py-3 text-sm shadow-sm ring-1 ring-slate-200 transition-all placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth_email_placeholder')}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-700 mb-1.5 ml-1">
                {t('auth_password')}
              </label>
              <input
                id="password"
                type="password"
                required
                className="w-full rounded-xl border-0 bg-white/50 px-4 py-3 text-sm shadow-sm ring-1 ring-slate-200 transition-all placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth_password_placeholder')}
              />
            </div>

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-xs font-medium text-rose-700 animate-pulse">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-slate-800 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? t('auth_submitting_login') : t('auth_submit_login')}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              {t('auth_no_account')}{" "}
              <Link href="/signup" className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors">
                {t('auth_link_signup')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
