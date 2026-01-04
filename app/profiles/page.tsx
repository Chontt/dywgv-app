"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n";
import SideNav from "../dashboard/components/SideNav";
import { BrandProfile } from "@/types/app";
import IdentitySection from "./components/IdentitySection";
import VoiceConfig from "./components/VoiceConfig";
import StrategyConfig from "./components/StrategyConfig";
import PositioningInput from "./components/PositioningInput";
import { getSubscriptionStatus } from "@/lib/subscription";
import { usePlan } from "@/lib/hooks/usePlan";
import Link from "next/link";

export default function ProfileIdentityPage() {
    const router = useRouter();
    const { t } = useI18n();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<BrandProfile | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [isPro, setIsPro] = useState(false);

    // Gating Logic
    const { isPro: isProFromPlan } = usePlan();
    const effectiveIsPro = isProFromPlan ?? false;

    // Load active profile
    useEffect(() => {
        async function load() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.replace("/login");
                return;
            }
            setUserId(user.email || "");

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

                if (activeP) setProfile(activeP as BrandProfile);
            }
            setLoading(false);
        }
        load();
    }, [router]);

    const handleUpdate = (updates: Partial<BrandProfile>) => {
        if (!profile) return;
        setProfile({ ...profile, ...updates });
    };

    const handleSave = async () => {
        if (!profile) return;
        setSaving(true);

        // Explicitly map BrandProfile fields to Supabase Database Row structure
        const updates: any = {
            brand_name: profile.brand_name,
            role: profile.role,
            niche: profile.niche,
            // Tone is mapped to niche currently? No, wait, 'tone' exists in my BrandProfile type locally, 
            // but in DB I might have missed it. 
            // In types/supabase.ts line 22: tone: string | null. It EXISTS.
            // So I should map it.
            tone: profile.tone, // Mapped correctly now
            authority_level: profile.authority_level,
            emoji_preference: profile.emoji_preference,
            content_goal: profile.content_goal,
            platform_focus: profile.platform_focus,
            positioning_statement: profile.positioning_statement,
            emotional_impact: profile.emotional_impact,
            updated_at: new Date().toISOString()
        };

        const { error } = await supabase
            .from("brand_profiles")
            .update(updates as any)
            .eq("id", profile.id);

        if (!error) {
            router.refresh();
            setTimeout(() => setSaving(false), 1000);
        } else {
            console.error(error);
            setSaving(false);
        }
    };

    // Calculate Profile Strength (Gamification)
    const calculateStrength = () => {
        if (!profile) return 0;
        let score = 0;
        if (profile.brand_name) score += 10;
        if (profile.role) score += 10;
        if (profile.authority_level) score += 20; // High value
        if (profile.niche) score += 10;
        if (profile.target_audience) score += 10;
        if (profile.content_goal) score += 10;
        if (profile.tone) score += 10;
        if (profile.positioning_statement) score += 20; // Hardest one
        return score;
    };

    const strength = calculateStrength();

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Modal/Overlay Helper */}
            <SideNav userEmail={userId} activeProfile={profile} isPro={isPro} />

            <main className="flex-1 lg:ml-64 min-h-screen bg-slate-50 p-8 flex justify-center">
                <div className="max-w-3xl w-full pt-8 pb-32">

                    {/* Motivational Header Card */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 mb-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-bl-full -mr-16 -mt-16 opacity-50 pointer-events-none"></div>

                        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
                            {/* Avatar */}
                            <div className="shrink-0 relative">
                                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shadow-xl shadow-indigo-200">
                                    <div className="w-full h-full bg-slate-50 rounded-2xl border-2 border-white flex items-center justify-center overflow-hidden">
                                        {(profile?.avatar_url) ? (
                                            <img src={profile.avatar_url} alt="You" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="font-heading font-bold text-3xl text-indigo-600">
                                                {(profile?.brand_name || "C").charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="absolute -bottom-3 -right-3 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider border-2 border-white">
                                    {t('profile_lvl')} {Math.floor(strength / 10) + 1}
                                </div>
                            </div>

                            {/* Text & Stats */}
                            <div className="flex-1 w-full">
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <h1 className="font-heading text-2xl font-bold text-slate-900">
                                            {profile?.brand_name || t('profile_new_brand')}
                                        </h1>
                                        <p className="text-slate-500 text-sm font-medium">
                                            {profile?.role || t('profile_role_creator')} • {profile?.niche || t('profile_niche_unspecified')}
                                        </p>
                                    </div>
                                    {!isPro && (
                                        <button onClick={() => router.push('/plans')} className="hidden md:block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg hover:bg-indigo-100 transition-colors">
                                            {t('profile_upgrade_identity')}
                                        </button>
                                    )}
                                </div>

                                {/* Progress Bar */}
                                <div className="mt-4">
                                    <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                                        <span className="text-slate-400 uppercase tracking-wider">{t('profile_strength_label')}</span>
                                        <span className={strength === 100 ? "text-emerald-600" : "text-indigo-600"}>{strength}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ${strength === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`}
                                            style={{ width: `${strength}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-2">
                                        {strength < 50 ? t('profile_strength_complete') : t('profile_strength_ready')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="animate-pulse space-y-4">
                            <div className="h-64 bg-white rounded-3xl border border-slate-100"></div>
                            <div className="h-64 bg-white rounded-3xl border border-slate-100"></div>
                        </div>
                    ) : profile ? (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                            {/* Section 1: Core Identity */}
                            <div className="relative group">
                                <div className="absolute -left-12 top-8 text-slate-300 font-heading font-bold text-4xl opacity-0 xl:opacity-20 group-hover:opacity-100 transition-opacity">01</div>
                                <IdentitySection profile={profile} onChange={handleUpdate} />
                            </div>

                            {/* Section 2: Voice & Tone */}
                            <div className="relative group">
                                <div className="absolute -left-12 top-8 text-slate-300 font-heading font-bold text-4xl opacity-0 xl:opacity-20 group-hover:opacity-100 transition-opacity">02</div>
                                <GatedSection isPro={effectiveIsPro} title="Voice & Tone Strategy">
                                    <VoiceConfig profile={profile} onChange={handleUpdate} />
                                </GatedSection>
                            </div>

                            <div className="flex items-center gap-4 py-8 opacity-50">
                                <div className="h-px bg-slate-300 flex-1"></div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('profile_strategy_section')}</span>
                                <div className="h-px bg-slate-300 flex-1"></div>
                            </div>

                            {/* Section 3: Strategy */}
                            <div className="relative group">
                                <div className="absolute -left-12 top-8 text-slate-300 font-heading font-bold text-4xl opacity-0 xl:opacity-20 group-hover:opacity-100 transition-opacity">03</div>
                                <GatedSection isPro={effectiveIsPro} title="Strategy & Conversion">
                                    <StrategyConfig profile={profile} onChange={handleUpdate} />
                                </GatedSection>
                            </div>

                            {/* Section 4: Positioning */}
                            <div className="relative group">
                                <div className="absolute -left-12 top-8 text-slate-300 font-heading font-bold text-4xl opacity-0 xl:opacity-20 group-hover:opacity-100 transition-opacity">04</div>
                                <GatedSection isPro={effectiveIsPro} title="Brand Positioning">
                                    <PositioningInput profile={profile} onChange={handleUpdate} />
                                </GatedSection>
                            </div>

                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <h2 className="text-xl font-bold text-slate-900 mb-2">{t('profile_empty_title')}</h2>
                            <button onClick={() => router.push('/onboarding')} className="text-indigo-600 font-bold hover:underline">
                                {t('profile_empty_btn')}
                            </button>
                        </div>
                    )}
                </div>

                {/* Floating Save Action (Premium Feel) */}
                <div className="fixed bottom-8 right-8 lg:right-12 z-50">
                    <button
                        onClick={handleSave}
                        disabled={saving || loading}
                        className={`flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 rounded-full font-bold shadow-2xl transition-all hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed ${saving
                            ? 'bg-emerald-500 text-white shadow-emerald-200'
                            : strength === 100
                                ? 'bg-indigo-600 text-white shadow-indigo-300'
                                : 'bg-slate-900 text-white shadow-slate-400 hover:bg-slate-800'
                            }`}
                    >
                        {saving ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>{t('profile_btn_syncing')}</span>
                            </>
                        ) : (
                            <>
                                <span>{t('profile_btn_save')}</span>
                                <div className="w-px h-4 bg-white/20"></div>
                                <span className="opacity-80 text-xs uppercase tracking-wider font-medium">{strength}% {t('studio_ready')}</span>
                            </>
                        )}
                    </button>
                </div>
            </main>
        </div>
    );
}

function GatedSection({ children, isPro, title }: { children: React.ReactNode, isPro: boolean, title: string }) {
    if (isPro) return <>{children}</>;

    return (
        <div className="relative group overflow-hidden rounded-3xl">
            <div className="blur-[6px] pointer-events-none transition-all duration-500 opacity-60">
                {children}
            </div>
            <div className="absolute inset-0 bg-white/40 flex flex-col items-center justify-center p-8 text-center z-10 animate-in fade-in zoom-in-95 duration-500">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200 mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2-2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
                <p className="text-xs text-slate-500 mb-6 max-w-[240px]">This strategy feature is reserved for users on the Authority Plan. Unlock it to build your brand faster.</p>
                <Link href="/plans" className="bg-slate-900 text-white px-6 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-slate-100 active:scale-95">
                    Unlock Authority Plan
                </Link>
            </div>
        </div>
    );
}
