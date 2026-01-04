"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
    <main className="min-h-screen bg-gradient-to-br from-indigo-50/80 via-white to-pastel-lavender/30 flex items-center justify-center px-4 font-sans">
      <div className="w-full max-w-md relative">
        {/* Abstract Background Shapes */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-pink-200/40 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-200/40 rounded-full blur-3xl animate-blob animation-delay-2000"></div>

        <div className="relative bg-white/40 backdrop-blur-xl border border-white/60 shadow-glass rounded-3xl p-8 overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400"></div>

          <div className="text-center mb-8">
            <h1 className="font-heading text-2xl font-bold text-slate-900">
              {t('auth_signup_title')}
            </h1>
            <p className="text-slate-500 mt-2 text-sm">
              {t('auth_signup_subtitle')}
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-xs font-semibold text-slate-700 mb-1.5 ml-1">
                {t('auth_username')}
              </label>
              <input
                id="username"
                className="w-full rounded-xl border-0 bg-white/50 px-4 py-3 text-sm shadow-sm ring-1 ring-slate-200 transition-all placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. creative_mind"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1.5 ml-1">
                {t('auth_email')}
              </label>
              <input
                id="email"
                type="email"
                className="w-full rounded-xl border-0 bg-white/50 px-4 py-3 text-sm shadow-sm ring-1 ring-slate-200 transition-all placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-700 mb-1.5 ml-1">
                {t('auth_password')}
              </label>
              <input
                id="password"
                type="password"
                className="w-full rounded-xl border-0 bg-white/50 px-4 py-3 text-sm shadow-sm ring-1 ring-slate-200 transition-all placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 chars"
              />
              <p className="text-[10px] text-slate-400 mt-1 ml-1">
                {t('auth_hibp_note')}
              </p>
            </div>

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-xs font-medium text-rose-700 animate-pulse">
                ⚠️ {error}
              </div>
            )}
            {message && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-xs font-medium text-emerald-700 shadow-sm">
                ✅ {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-slate-800 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? t('auth_submitting_signup') : t('auth_submit_signup')}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              {t('auth_has_account')}{" "}
              <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors">
                {t('auth_link_login')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
