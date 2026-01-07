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
import { Shield, Plus, Zap, Lock } from "lucide-react";

export default function ProfileIdentityPage() {
    const router = useRouter();
    const { t } = useI18n();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profiles, setProfiles] = useState<BrandProfile[]>([]);
    const [activeProfile, setActiveProfile] = useState<BrandProfile | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [isPro, setIsPro] = useState(false);

    // Gating Logic
    const { isPro: isProFromPlan } = usePlan();
    const effectiveIsPro = isProFromPlan ?? false;

    // Load data
    useEffect(() => {
        async function load() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.replace("/login");
                return;
            }
            setUserId(user.id);

            // Check Subscription
            const { isPro: proStatus } = await getSubscriptionStatus(user.id);
            setIsPro(proStatus);

            const { data: allProfiles } = await supabase
                .from("brand_profiles")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (allProfiles) {
                setProfiles(allProfiles as BrandProfile[]);

                const { data: settings } = await supabase
                    .from("user_settings")
                    .select("active_profile_id")
                    .eq("user_id", user.id)
                    .maybeSingle();

                const activeId = (settings as any)?.active_profile_id || (allProfiles[0] as BrandProfile)?.id;
                const active = (allProfiles as BrandProfile[]).find(p => p.id === activeId) || (allProfiles[0] as BrandProfile);
                if (active) setActiveProfile(active);
            }
            setLoading(false);
        }
        load();
    }, [router]);

    const handleUpdate = (updates: Partial<BrandProfile>) => {
        if (!activeProfile) return;
        const updatedProfile = { ...activeProfile, ...updates };
        setActiveProfile(updatedProfile);
        setProfiles(prev => prev.map(p => p.id === activeProfile.id ? updatedProfile : p));
    };

    const [saved, setSaved] = useState(false);

    const handleSave = async () => {
        if (!activeProfile) return;
        setSaving(true);
        setSaved(false);

        const updates: any = {
            brand_name: activeProfile.brand_name,
            role: activeProfile.role,
            niche: activeProfile.niche,
            tone: activeProfile.tone,
            authority_level: activeProfile.authority_level,
            emoji_preference: activeProfile.emoji_preference,
            content_goal: activeProfile.content_goal,
            platform_focus: activeProfile.platform_focus,
            positioning_statement: activeProfile.positioning_statement,
            emotional_impact: activeProfile.emotional_impact,
            updated_at: new Date().toISOString()
        };

        const { error } = await supabase
            .from("brand_profiles")
            .update(updates as any)
            .eq("id", activeProfile.id);

        if (!error) {
            setSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } else {
            console.error(error);
            setSaving(false);
        }
    };

    const switchProfile = async (p: BrandProfile) => {
        setActiveProfile(p);
        await supabase.from("user_settings").upsert({ user_id: userId, active_profile_id: p.id });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-6 transition-colors duration-500">
                <div className="relative">
                    <img src="/logo.png" alt="DYWGV" className="w-20 h-20 opacity-20 animate-pulse transition-transform duration-1000 scale-110" />
                    <div className="absolute inset-0 bg-primary/20 blur-2xl animate-pulse rounded-full" />
                </div>
                <div className="space-y-2 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted">Synchronizing Identities</p>
                    <div className="h-0.5 w-24 bg-border mx-auto rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-1/2 animate-[shimmer_2s_infinite]" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-background font-sans text-foreground selection:bg-primary/30 transition-colors duration-500">
            <SideNav userEmail={userId} activeProfile={activeProfile} isPro={isPro} />

            <main className="flex-1 lg:ml-68 min-h-screen p-8 lg:p-20 flex flex-col items-center">
                <div className="max-w-6xl w-full space-y-20 pb-40">

                    {/* Header: Identity Switcher */}
                    <header className="space-y-12">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border pb-12">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-[10px] font-black uppercase tracking-[0.3em] text-secondary">
                                    <Shield className="w-4 h-4" /> Identity Hub
                                </div>
                                <h1 className="text-6xl lg:text-7xl font-black tracking-tighter text-foreground">Authority <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Base</span></h1>
                                <p className="text-[11px] font-black text-muted uppercase tracking-[0.4em] leading-relaxed">Strategic Control Center for Multi-Identity Synchronization</p>
                            </div>
                            <Link href="/onboarding" className="group relative px-10 py-5 bg-gradient-to-r from-primary to-secondary text-white rounded-[28px] text-[11px] font-black uppercase tracking-[0.3em] shadow-bubble shadow-primary/20 hover:scale-[1.05] active:scale-95 transition-all flex items-center gap-4">
                                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> Establish New Identity
                            </Link>
                        </div>

                        {/* Profiles Scroll/Grid */}
                        <div className="flex flex-wrap gap-6">
                            {profiles.map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => switchProfile(p)}
                                    className={`group flex items-center gap-6 p-6 pr-10 rounded-[40px] border transition-all duration-500 relative overflow-hidden
                                        ${activeProfile?.id === p.id
                                            ? 'bg-surface border-border text-foreground shadow-bubble translate-y-[-4px]'
                                            : 'bg-surface/40 border-transparent text-muted hover:bg-surface/60 hover:border-border'}
                                    `}
                                >
                                    <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center text-2xl font-black transition-all duration-500 ${activeProfile?.id === p.id ? 'bg-gradient-to-br from-primary to-secondary text-white shadow-lg' : 'bg-background text-muted group-hover:scale-110 opacity-50'}`}>
                                        {p.brand_name?.charAt(0) || 'D'}
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[13px] font-black uppercase tracking-widest leading-none mb-2.5">{p.brand_name || 'Untitled Identity'}</p>
                                        <div className="flex items-center gap-2.5">
                                            <div className={`w-2 h-2 rounded-full ${activeProfile?.id === p.id ? 'bg-secondary animate-pulse' : 'bg-border'}`} />
                                            <p className={`text-[10px] font-black uppercase tracking-widest opacity-60 text-muted`}>{p.role || 'High-Authority Generator'}</p>
                                        </div>
                                    </div>
                                    {activeProfile?.id === p.id && <div className="absolute top-5 right-5 w-2.5 h-2.5 bg-secondary rounded-full shadow-sm"></div>}
                                </button>
                            ))}
                        </div>
                    </header>

                    {activeProfile ? (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">

                            {/* Identity Section */}
                            <IdentitySection profile={activeProfile} onChange={handleUpdate} />

                            {/* Gated Strategy Sections */}
                            <div className="space-y-12">
                                <GatedSection isPro={effectiveIsPro} title="Strategic Voice">
                                    <VoiceConfig profile={activeProfile} onChange={handleUpdate} />
                                </GatedSection>

                                <GatedSection isPro={effectiveIsPro} title="Revenue & Ecosystem">
                                    <StrategyConfig profile={activeProfile} onChange={handleUpdate} />
                                </GatedSection>

                                <GatedSection isPro={effectiveIsPro} title="Market Positioning">
                                    <PositioningInput profile={activeProfile} onChange={handleUpdate} />
                                </GatedSection>
                            </div>

                        </div>
                    ) : (
                        <div className="text-center py-40 space-y-8 bg-surface/40 backdrop-blur-xl rounded-[60px] border border-border">
                            <img src="/logo.png" className="w-24 h-24 opacity-10 mx-auto animate-float" />
                            <div className="space-y-3">
                                <h2 className="text-2xl font-black tracking-tight text-foreground">No identities established.</h2>
                                <p className="text-[10px] font-black text-muted uppercase tracking-[0.4em]">Multi-Identity Synchronization Inactive</p>
                            </div>
                            <Link href="/onboarding" className="inline-block px-12 py-5 bg-foreground text-background dark:bg-surface dark:text-foreground rounded-full text-[11px] font-black uppercase tracking-[0.4em] hover:opacity-90 shadow-bubble transition-all">Initialization Required</Link>
                        </div>
                    )}
                </div>

                {/* Floating Sync Control */}
                {activeProfile && (
                    <div className="fixed bottom-12 right-12 lg:right-24 z-50">
                        <button
                            onClick={handleSave}
                            disabled={saving || saved}
                            className={`flex items-center gap-6 p-6 px-14 rounded-[32px] font-black text-[13px] uppercase tracking-[0.4em] shadow-bubble backdrop-blur-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-80 group
                                ${saved
                                    ? 'bg-green-500 text-white shadow-green-500/30 border border-green-400/50'
                                    : saving
                                        ? 'bg-surface text-primary border border-primary/20'
                                        : 'bg-gradient-to-r from-primary to-secondary text-white shadow-primary/30 hover:shadow-primary/40'
                                }
                            `}
                        >
                            {saved ? (
                                <Zap className="w-5 h-5 fill-current" strokeWidth={3} />
                            ) : saving ? (
                                <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                            ) : <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" strokeWidth={3} />}

                            {saved ? 'Identity Synchronized' : saving ? 'Transmitting Identity' : 'Sync Strategic Base'}
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}

function GatedSection({ children, isPro, title }: { children: React.ReactNode, isPro: boolean, title: string }) {
    if (isPro) return <>{children}</>;

    return (
        <div className="relative group overflow-hidden rounded-[60px] border border-border bg-surface/40 backdrop-blur-xl shadow-bubble transition-all duration-700 hover:border-primary/20">
            <div className="blur-3xl pointer-events-none opacity-20 select-none grayscale p-20 scale-105">
                {children}
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-16 text-center z-10 animate-in fade-in duration-1000">
                <div className="w-24 h-24 bg-surface border border-border rounded-[32px] flex items-center justify-center text-primary shadow-bubble mb-10 animate-float">
                    <Lock className="w-10 h-10" strokeWidth={3} />
                </div>
                <h3 className="text-3xl font-black tracking-tight text-foreground mb-4">Locked: <span className="text-primary">{title}</span></h3>
                <p className="text-[11px] font-black text-muted uppercase tracking-[0.3em] mb-12 max-w-[400px] leading-relaxed">Authority synchronization required for high-level market frameworks.</p>
                <Link href="/plans" className="px-14 py-6 bg-gradient-to-r from-primary to-secondary text-white rounded-full text-[12px] font-black uppercase tracking-[0.4em] hover:scale-110 active:scale-95 transition-all shadow-bubble shadow-primary/20">
                    Unlock Elite Access
                </Link>
            </div>
        </div>
    );
}
