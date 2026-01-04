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

    if (loading) return null;

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <SideNav userEmail={user?.email} activeProfile={activeProfile} isPro={isPro} />

            <main className="flex-1 lg:ml-64 min-h-screen bg-slate-50 p-8 flex justify-center">
                <div className="max-w-2xl w-full pt-12 pb-24">

                    <header className="mb-10">
                        <h1 className="font-heading text-3xl font-bold text-slate-900">{t('settings_title')}</h1>
                        <p className="text-slate-500 mt-2">{t('settings_subtitle')}</p>
                    </header>

                    <div className="space-y-6">

                        {/* Account Section */}
                        <section className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">{t('settings_account')}</h2>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-slate-900 text-lg">{t('settings_email')}</p>
                                    <p className="text-slate-500">{user?.email}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-500 font-medium hover:bg-slate-50 hover:text-red-600 transition-colors text-sm"
                                >
                                    {t('settings_sign_out')}
                                </button>
                            </div>
                        </section>

                        {/* Localization */}
                        <section className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">{t('settings_lang_region')}</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {(['en', 'th', 'ja', 'ko'] as const).map((lang) => (
                                    <button
                                        key={lang}
                                        onClick={() => handleLanguageChange(lang)}
                                        className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all ${locale === lang
                                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                            : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                                            }`}
                                    >
                                        {lang === 'en' && '🇬🇧 English'}
                                        {lang === 'th' && '🇹🇭 Thai'}
                                        {lang === 'ja' && '🇯🇵 Japanese'}
                                        {lang === 'ko' && '🇰🇷 Korean'}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Subscription */}
                        <section className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">{t('settings_subscription')}</h2>
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-slate-900">{t('settings_current_plan')}</h3>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${isPro ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'}`}>
                                            {isPro ? 'Authority' : 'Free'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        {isPro ? t('settings_next_billing') + ': Feb 2, 2026' : t('settings_upgrade_promo')}
                                    </p>
                                </div>
                                {!isPro ? (
                                    <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors">
                                        {t('settings_btn_upgrade')}
                                    </button>
                                ) : (
                                    <button className="text-indigo-600 text-sm font-bold hover:underline">
                                        {t('settings_manage_billing')}
                                    </button>
                                )}
                            </div>
                        </section>

                        {/* Data Privacy */}
                        <section className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">{t('settings_data_privacy')}</h2>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-slate-900">{t('settings_export_data')}</p>
                                    <p className="text-xs text-slate-400 mt-1">{t('settings_export_desc')}</p>
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
                                        a.download = `prompty-data-export-${new Date().toISOString().split('T')[0]}.json`;
                                        a.click();
                                    }}
                                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors text-sm"
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
