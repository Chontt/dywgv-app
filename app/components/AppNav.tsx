"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useI18n } from '@/lib/i18n';

export default function AppNav() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<any>(null);
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
      // Call server logout to clear httpOnly Supabase cookies
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.warn('Server logout failed', e);
    }

    // Also clear any client-side session/localStorage
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
        className={`text-sm font-medium transition-colors ${isActive ? "text-indigo-600" : "text-slate-600 hover:text-slate-900"
          }`}
      >
        {label}
      </Link>
    );
  };

  // Hide Navbar on specific app routes where custom navigation/sidebar is used
  if (
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/studio") ||
    pathname?.startsWith("/plans") ||
    pathname?.startsWith("/projects") ||
    pathname?.startsWith("/settings") ||
    pathname?.startsWith("/profiles") ||
    pathname?.startsWith("/onboarding")
  ) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/40 bg-white/60 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/logo.png"
              alt="PROMPTY Logo"
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="font-heading font-bold text-slate-900 tracking-tight text-lg">PROMPTY</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {user && (
              <>
                {navLink("/dashboard", t('nav_dashboard'))}
                {navLink("/studio", t('nav_studio'))}
                {navLink("/projects", t('nav_projects'))}
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <div className="h-4 w-px bg-slate-200" />
          {user ? (
            <button
              onClick={handleLogout}
              className="text-xs font-medium text-slate-500 hover:text-rose-600 transition-colors"
            >
              {t('nav_logout')}
            </button>
          ) : (
            <Link
              href="/login"
              className="text-xs font-medium text-slate-600 hover:text-indigo-600 transition-colors"
            >
              {t('nav_login')}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
