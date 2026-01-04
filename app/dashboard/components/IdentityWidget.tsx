"use client";

import { useI18n } from "@/lib/i18n";
import { useRouter } from "next/navigation";

type IdentityWidgetProps = {
    profiles: any[];
    activeProfileId: string | null;
};

export default function IdentityWidget({ profiles, activeProfileId }: IdentityWidgetProps) {
    const { t } = useI18n();
    const router = useRouter();

    const activeProfile = profiles.find(p => p.id === activeProfileId);

    return (
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
                👤 {t('dash_id_title')}
            </h2>

            <div className="mb-6">
                <p className="text-xs text-slate-400 mb-1">{t('dash_id_current')}</p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <h3 className="font-bold text-slate-800">
                        {activeProfile?.role || t('dash_id_mode_growing')}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                        {activeProfile?.brand_name || "Untitled Profile"}
                    </p>
                </div>
            </div>

            <div className="mb-6">
                <p className="text-xs text-indigo-400 font-bold mb-1 uppercase tracking-wide">{t('dash_id_unlocked')}</p>
                <div className="space-y-2">
                    <p className="text-sm font-serif italic text-slate-600 border-l-2 border-indigo-200 pl-3">
                        {t('dash_id_features')}
                    </p>
                </div>
            </div>

            <div className="bg-slate-900 rounded-xl p-4 text-white">
                <p className="text-sm font-medium leading-relaxed">
                    &quot;{t('dash_id_copy')}&quot;
                </p>
            </div>

            <button
                onClick={() => router.push('/dashboard/profiles')}
                className="w-full mt-4 text-xs font-bold text-slate-400 hover:text-slate-600"
            >
                {t('dash_manage_profiles')}
            </button>
        </section>
    );
}
