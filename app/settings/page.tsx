"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n";
import SideNav from "../dashboard/components/SideNav";
import { BrandProfile } from "@/types/app";
import { getSubscriptionStatus } from "@/lib/subscription";

export default function SettingsPage() {
    const router = useRouter();
    const { t, locale, setLocale } = useI18n();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [activeProfile, setActiveProfile] = useState<BrandProfile | null>(null);
    const [isPro, setIsPro] = useState(false);

    useEffect(() => {
        async function load() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.replace("/login");
                return;
            }
            setUser(user);

            // Check Subscription
            const { isPro: proStatus } = await getSubscriptionStatus(user.id);
            setIsPro(proStatus);

            const { data: settings } = await supabase
                .from("user_settings")
                .select("active_profile_id")
                .eq("user_id", user.id)
                .maybeSingle();

            if ((settings as any)?.active_profile_id) {
                const { data: activeP } = await supabase
                    .from("brand_profiles")
                    .select("*")
                    .eq("id", (settings as any).active_profile_id)
                    .maybeSingle();

                if (activeP) setActiveProfile(activeP as BrandProfile);
            }
            setLoading(false);
        }
        load();
    }, [router]);

    const handleLanguageChange = async (lang: 'en' | 'th' | 'ja' | 'ko') => {
        setLocale(lang);
        // Persist to DB if we have an active profile
        if (activeProfile) {
            await supabase
                .from("brand_profiles")
                .update({ language: lang } as any)
                .eq("id", activeProfile.id);

            // Update local state to reflect change
            setActiveProfile({ ...activeProfile, language: lang });
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.replace("/login");
    };

    const [manageLoading, setManageLoading] = useState(false);

    const handleManageSubscription = async () => {
        try {
            setManageLoading(true);
            const response = await fetch('/api/create-portal-session', {
                method: 'POST',
            });

            if (!response.ok) throw new Error('Failed to create portal session');

            const { url } = await response.json();
            window.location.href = url;
        } catch (error) {
            console.error('Error:', error);
            alert(t('error_generic') || 'Something went wrong'); // Fallback string if key missing
            setManageLoading(false);
        }
    };

    if (loading) return null;

    return (
        <div className="flex min-h-screen bg-background font-sans text-foreground selection:bg-primary/30 transition-colors duration-500">
            <SideNav userEmail={user?.email} activeProfile={activeProfile} isPro={isPro} />

            <main className="flex-1 lg:ml-68 min-h-screen p-8 lg:p-20 flex justify-center relative overflow-hidden">
                {/* Decorative Pastels */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none" />

                <div className="max-w-4xl w-full pt-12 pb-40 relative z-10">
                    <header className="mb-16 space-y-6">
                        <div className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-8 py-3 text-xs font-black tracking-[0.4em] text-primary uppercase shadow-sm">
                            System Registry
                        </div>
                        <h1 className="text-6xl font-black tracking-tighter text-foreground leading-tight">
                            {t('settings_title')} <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Control</span>
                        </h1>
                        <p className="text-muted font-black uppercase tracking-widest text-lg leading-relaxed opacity-60">{t('settings_subtitle')}</p>
                    </header>

                    <div className="space-y-12">
                        {/* Account Section */}
                        <section className="bg-surface/40 backdrop-blur-xl rounded-[48px] border border-border p-12 shadow-bubble">
                            <h2 className="text-xs font-black text-muted uppercase tracking-[0.5em] mb-10 opacity-50">{t('settings_account')}</h2>
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
                                <div className="space-y-3">
                                    <p className="text-xs font-black text-primary uppercase tracking-[0.4em]">{t('settings_email')}</p>
                                    <p className="text-3xl font-black text-foreground tracking-tight">{user?.email}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="px-10 py-5 rounded-full border border-red-500/10 bg-red-500/5 text-red-500 font-black text-sm uppercase tracking-[0.3em] hover:bg-red-500 hover:text-white transition-all duration-500 shadow-sm"
                                >
                                    {t('settings_sign_out')}
                                </button>
                            </div>
                        </section>

                        {/* Localization */}
                        <section className="bg-surface/40 backdrop-blur-xl rounded-[48px] border border-border p-12 shadow-bubble">
                            <h2 className="text-xs font-black text-muted uppercase tracking-[0.5em] mb-10 opacity-50">{t('settings_lang_region')}</h2>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                                {(['en', 'th', 'ja', 'ko'] as const).map((lang) => (
                                    <button
                                        key={lang}
                                        onClick={() => handleLanguageChange(lang)}
                                        className={`py-8 px-8 rounded-[32px] border transition-all duration-500 relative overflow-hidden group
                                            ${locale === lang
                                                ? 'border-transparent bg-gradient-to-br from-primary to-secondary text-white shadow-bubble shadow-primary/20'
                                                : 'border-border bg-background text-muted hover:border-primary/30'}
                                            }`}
                                    >
                                        <span className="relative z-10 flex flex-col items-center gap-4">
                                            {lang === 'en' && <span className="text-2xl">🇬🇧</span>}
                                            {lang === 'th' && <span className="text-2xl">🇹🇭</span>}
                                            {lang === 'ja' && <span className="text-2xl">🇯🇵</span>}
                                            {lang === 'ko' && <span className="text-2xl">🇰🇷</span>}
                                            <span className="text-xs font-black uppercase tracking-[0.2em]">
                                                {lang === 'en' && 'English'}
                                                {lang === 'th' && 'Thai'}
                                                {lang === 'ja' && 'Japan'}
                                                {lang === 'ko' && 'Korea'}
                                            </span>
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Subscription */}
                        <section className="bg-surface/40 backdrop-blur-xl rounded-[48px] border border-border p-12 shadow-bubble">
                            <h2 className="text-xs font-black text-muted uppercase tracking-[0.5em] mb-10 opacity-50">{t('settings_subscription')}</h2>
                            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between p-10 bg-background rounded-[40px] border border-border shadow-sm">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-5">
                                        <h3 className="text-2xl font-black text-foreground tracking-tight">{t('settings_current_plan')}</h3>
                                        <span className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-[0.3em] ${isPro ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-sm' : 'bg-surface text-muted opacity-60'}`}>
                                            {isPro ? 'Authority Elite' : 'Entry Protocol'}
                                        </span>
                                    </div>
                                    <p className="text-xs font-black text-muted uppercase tracking-[0.3em] opacity-60">
                                        {isPro ? t('settings_next_billing') + ': Feb 2, 2026' : t('settings_upgrade_promo')}
                                    </p>
                                </div>
                                {!isPro ? (
                                    <button
                                        onClick={() => router.push('/plans')}
                                        className="mt-8 md:mt-0 bg-foreground text-background dark:bg-surface dark:text-foreground px-10 py-5 rounded-full text-sm font-black uppercase tracking-[0.3em] hover:opacity-90 hover:scale-105 active:scale-95 transition-all duration-500 shadow-bubble"
                                    >
                                        {t('settings_btn_upgrade')}
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleManageSubscription}
                                        className="mt-8 md:mt-0 text-primary text-sm font-black uppercase tracking-[0.3em] hover:underline underline-offset-8 transition-all disabled:opacity-50"
                                        disabled={manageLoading}
                                    >
                                        {manageLoading ? '...' : t('settings_manage_billing')}
                                    </button>
                                )}
                            </div>
                        </section>

                        {/* Data Privacy */}
                        <section className="bg-surface/40 backdrop-blur-xl rounded-[48px] border border-border p-12 shadow-bubble">
                            <h2 className="text-xs font-black text-muted uppercase tracking-[0.5em] mb-10 opacity-50">{t('settings_data_privacy')}</h2>
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-12">
                                <div className="space-y-3">
                                    <p className="text-2xl font-black text-foreground tracking-tight">{t('settings_export_data')}</p>
                                    <p className="text-base font-black text-muted uppercase tracking-widest leading-relaxed max-w-lg opacity-60">{t('settings_export_desc')}</p>
                                </div>
                                <button
                                    onClick={async () => {
                                        if (!user) return;
                                        const { data: projects } = await supabase.from('content_projects').select('*').eq('user_id', user.id);
                                        const { data: profiles } = await supabase.from('brand_profiles').select('*').eq('user_id', user.id);
                                        const blob = new Blob([JSON.stringify({ user, projects, profiles }, null, 2)], { type: "application/json" });
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = `dywgv-data-export-${new Date().toISOString().split('T')[0]}.json`;
                                        a.click();
                                    }}
                                    className="w-full md:w-auto px-10 py-5 rounded-full border border-border bg-background text-foreground font-black text-sm uppercase tracking-[0.3em] hover:border-primary transition-all duration-500 shadow-sm whitespace-nowrap"
                                >
                                    {t('settings_btn_export')}
                                </button>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
