"use client";

import { useI18n } from "@/lib/i18n";
import { useRouter } from "next/navigation";

export default function UnlockPowerWidget() {
    const { t } = useI18n();
    const router = useRouter();

    return (
        <section className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-6 shadow-lg text-white">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                ⚡ {t('dash_unlock_title')}
            </h2>

            <div className="space-y-2 mb-6 text-sm">
                <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span className="text-slate-300">{t('dash_unlock_f1') || "Draft editing"}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span className="text-slate-300">{t('dash_unlock_f2') || "Basic content generation"}</span>
                </div>
                <div className="flex items-center gap-2 opacity-75">
                    <span className="text-slate-500">🔒</span>
                    <span className="text-slate-400">{t('dash_unlock_l1') || "Full scripts & speeches"}</span>
                </div>
                <div className="flex items-center gap-2 opacity-75">
                    <span className="text-slate-500">🔒</span>
                    <span className="text-slate-400">{t('dash_unlock_l2') || "Multiple onboarding profiles"}</span>
                </div>
                <div className="flex items-center gap-2 opacity-75">
                    <span className="text-slate-500">🔒</span>
                    <span className="text-slate-400">{t('dash_unlock_l3') || "Authority-level outputs"}</span>
                </div>
            </div>

            <button
                onClick={() => router.push('/plans')}
                className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-all hover:-translate-y-1"
            >
                {t('dash_unlock_btn')}
            </button>
            <p className="text-center text-[10px] text-slate-500 mt-3 font-medium">
                {t('dash_unlock_trigger')}
            </p>
        </section>
    );
}
