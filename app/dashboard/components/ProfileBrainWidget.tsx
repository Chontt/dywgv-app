"use client";

import { useI18n } from "@/lib/i18n";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type ProfileBrainWidgetProps = {
    profiles: any[];
    activeProfileId: string | null;
    onSelectProfile: (id: string) => void;
};

export default function ProfileBrainWidget({ profiles, activeProfileId, onSelectProfile }: ProfileBrainWidgetProps) {
    const { t } = useI18n();
    const router = useRouter();

    async function handleSelect(id: string) {
        onSelectProfile(id);
        // Persist to user_settings
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            await supabase.from("user_settings").upsert({
                user_id: user.id,
                active_profile_id: id
            } as any);
        }
    }

    const activeProfile = profiles.find(p => p.id === activeProfileId);

    return (
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/50 relative overflow-hidden group">
            {/* Decorative Blob */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-8 -mt-8 z-0 transition-transform group-hover:scale-110 duration-700"></div>

            <div className="relative z-10 flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-2 h-8 bg-indigo-500 rounded-full shadow-lg shadow-indigo-200"></span>
                    {t('widget_profile_title')}
                </h2>
                <button
                    onClick={() => router.push("/onboarding?new=1")}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 hover:border-indigo-200 transition-all"
                >
                    {t('widget_profile_new')}
                </button>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {profiles.map((p) => {
                    const isActive = p.id === activeProfileId;
                    return (
                        <button
                            key={p.id}
                            onClick={() => handleSelect(p.id)}
                            className={`
                flex-shrink-0 px-4 py-3 rounded-xl border transition-all text-left min-w-[140px] relative group/btn
                ${isActive
                                    ? 'border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-500 shadow-md shadow-indigo-100'
                                    : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50'
                                }
              `}
                        >
                            {isActive && (
                                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                            )}
                            <div className="font-bold text-sm text-slate-900 truncate pr-4">
                                {p.brand_name || (p.mode === 'business' ? t('widget_profile_biz') : t('widget_profile_creator'))}
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                                <span className="text-[10px] uppercase tracking-wide font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                    {p.mode === 'business' ? t('widget_profile_biz') : t('widget_profile_creator')}
                                </span>
                            </div>
                        </button>
                    );
                })}

                {/* Empty State / CTA */}
                {profiles.length === 0 && (
                    <div className="text-sm text-slate-500 italic">{t('widget_profile_empty')}</div>
                )}
            </div>

            {activeProfile && (
                <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400 flex items-center gap-2">
                    <span>🧠 {t('widget_profile_active')}</span>
                    <span className="font-semibold text-slate-600">{activeProfile.niche || "General"}</span>
                </div>
            )}
        </section>
    );
}
