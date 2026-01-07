"use client";

import { useI18n } from "@/lib/i18n";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { UserCircle, Plus, Shield, Check } from "lucide-react";

type Profile = {
    id: string;
    brand_name?: string | null;
    mode: "business" | "creator";
    niche?: string | null;
};

type ProfileBrainWidgetProps = {
    profiles: Profile[];
    activeProfileId: string | null;
    onSelectProfile: (id: string) => void;
};

export default function ProfileBrainWidget({ profiles, activeProfileId, onSelectProfile }: ProfileBrainWidgetProps) {
    const { t } = useI18n();
    const router = useRouter();

    async function handleSelect(id: string) {
        onSelectProfile(id);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            await supabase.from("user_settings").upsert({
                user_id: user.id,
                active_profile_id: id
            });
        }
    }

    return (
        <section className="bg-surface/40 dark:bg-white/5 backdrop-blur-xl p-6 lg:p-8 space-y-4 flex flex-col rounded-[48px] border border-border shadow-bubble group transition-all duration-700">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[20px] bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary shadow-inner transition-transform group-hover:scale-110 duration-500">
                        <UserCircle className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">{t('profile_authority_base')}</p>
                        <h2 className="text-lg font-black uppercase tracking-widest text-foreground">{t('profile_identities')}</h2>
                    </div>
                </div>
                <button
                    onClick={() => router.push("/onboarding?new=1")}
                    className="group w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-muted hover:text-primary hover:border-primary hover:shadow-sm transition-all shadow-sm"
                >
                    <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
            </div>

            <div className="grid gap-3 overflow-y-auto flex-1 min-h-0 pr-2 custom-scrollbar">
                {profiles.map((p) => {
                    const isActive = p.id === activeProfileId;
                    return (
                        <button
                            key={p.id}
                            onClick={() => handleSelect(p.id)}
                            className={`
                                flex items-center gap-4 p-4 rounded-[28px] border transition-all duration-500 text-left relative group/btn
                                ${isActive
                                    ? 'border-transparent bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20'
                                    : 'border-border bg-surface/60 dark:bg-white/5 hover:border-secondary/30 hover:bg-surface text-foreground'
                                }
                            `}
                        >
                            <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center border ${isActive ? 'bg-white/20 border-white/20' : 'bg-secondary/5 border-secondary/10'}`}>
                                <Shield className={`w-5 h-5 ${isActive ? 'text-white' : 'text-secondary'}`} />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className={`text-xs font-black uppercase tracking-widest truncate ${isActive ? 'text-white' : 'text-foreground'}`}>
                                    {p.brand_name || (p.mode === 'business' ? t('profile_business_intel') : t('profile_creator_base'))}
                                </div>
                                <div className={`text-[9px] font-bold uppercase tracking-[0.2em] mt-1 ${isActive ? 'text-white/60' : 'text-muted'}`}>
                                    {p.niche || t('profile_general_authority')}
                                </div>
                            </div>

                            {isActive && (
                                <div className="bg-white/20 p-1.5 rounded-full">
                                    <Check className="w-3.5 h-3.5 text-white" />
                                </div>
                            )}
                        </button>
                    );
                })}

                {profiles.length === 0 && (
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-muted italic text-center py-12">
                        {t('profile_no_identities')}
                    </div>
                )}
            </div>

            {profiles.length > 0 && (
                <div className="pt-6 border-t border-border flex items-center justify-between text-[9px] font-black uppercase tracking-[0.3em] text-muted">
                    <span>{profiles.length} {t('profile_total')}</span>
                    {activeProfileId && <span>{t('profile_active_label')}: {profiles.find(p => p.id === activeProfileId)?.brand_name || "Primary"}</span>}
                </div>
            )}
        </section>
    );
}
