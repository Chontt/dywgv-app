"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeSwitcher from "./ThemeSwitcher";
import { useI18n } from '@/lib/i18n';
import { Shield } from "lucide-react";

export default function AppNav() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const { t } = useI18n();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.warn('Server logout failed', e);
    }

    try {
      await supabase.auth.signOut();
    } catch (e) {
      // ignore
    }

    router.replace('/login');
  }

  const navLink = (path: string, label: string) => {
    const isActive = pathname === path;
    return (
      <Link
        href={path}
        className={`text-sm font-semibold tracking-wide transition-all mx-2 ${isActive ? "text-primary border-b-2 border-primary" : "text-muted hover:text-primary"
          }`}
      >
        {label}
      </Link>
    );
  };

  if (
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/studio") ||
    pathname?.startsWith("/plans") ||
    pathname?.startsWith("/projects") ||
    pathname?.startsWith("/settings") ||
    pathname?.startsWith("/profiles") ||
    pathname?.startsWith("/onboarding") ||
    pathname?.startsWith("/help-feedback")
  ) {
    return null;
  }

  const isHome = pathname === "/";

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-500 ${isHome ? "bg-transparent border-transparent" : "bg-white/60 dark:bg-black/60 backdrop-blur-2xl border-b border-border"}`}>
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-8">
        <div className="flex items-center gap-16">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-bubble relative z-10 group-hover:rotate-12 transition-transform duration-700 ease-out">
                <Shield className="w-6 h-6 text-white" fill="currentColor" fillOpacity={0.2} />
              </div>
              <div className="absolute inset-0 bg-primary/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 scale-150" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-black text-2xl tracking-tighter text-foreground leading-none">DYWGV</span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary mt-1">Belief System</span>
            </div>
          </Link>
          <nav className="hidden lg:flex items-center gap-8">
            {user && (
              <div className="flex items-center gap-2 p-1 bg-surface/40 dark:bg-white/5 rounded-2xl border border-border shadow-bubble">
                {navLink("/dashboard", t('nav_dashboard'))}
                {navLink("/studio", t('nav_studio'))}
                {navLink("/projects", t('nav_projects'))}
              </div>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-surface/40 dark:bg-white/5 p-1.5 rounded-[20px] border border-border shadow-bubble">
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>

          <div className="hidden md:block h-6 w-px bg-border" />

          {user ? (
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary leading-none">Creative</p>
                <p className="text-[11px] font-bold text-muted truncate max-w-[120px]">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-6 py-3 rounded-2xl bg-surface dark:bg-white/5 text-[10px] font-black uppercase tracking-widest text-muted hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-all"
              >
                {t('nav_logout')}
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-8 py-3.5 rounded-[24px] bg-gradient-to-r from-primary to-secondary text-white text-[11px] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-bubble shadow-primary/20"
            >
              {t('nav_login')}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
