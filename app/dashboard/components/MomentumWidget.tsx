"use client";

import { useI18n } from "@/lib/i18n";

type MomentumWidgetProps = {
    hookCount: number;
    outlineCount: number;
};

export default function MomentumWidget({ hookCount, outlineCount }: MomentumWidgetProps) {
    const { t } = useI18n();

    return (
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                    📈 {t('dash_momentum_title')}
                </h2>
                <span className="text-xs text-slate-400 font-medium">{t('dash_momentum_week')}</span>
            </div>

            <div className="space-y-3 mb-4">
                {/* Stats */}
                <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${hookCount > 0 ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-300"}`}>
                        {hookCount > 0 ? "✓" : "•"}
                    </div>
                    <span className={`${hookCount > 0 ? "text-slate-700 font-medium" : "text-slate-400"}`}>
                        {hookCount} {t('dash_item_hooks')}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${outlineCount > 0 ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-300"}`}>
                        {outlineCount > 0 ? "✓" : "•"}
                    </div>
                    <span className={`${outlineCount > 0 ? "text-slate-700 font-medium" : "text-slate-400"}`}>
                        {outlineCount} {t('dash_item_outlines')}
                    </span>
                </div>

                {/* Locked Item */}
                <div className="flex items-center gap-3 opacity-60">
                    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
                        🔒
                    </div>
                    <span className="text-slate-500 font-medium italic">
                        {t('dash_item_locked')}
                    </span>
                </div>
            </div>

            <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-100">
                <p className="text-xs text-indigo-800 font-medium text-center">
                    "{t('dash_momentum_copy')}"
                </p>
                <p className="text-[10px] text-indigo-400 text-center mt-1">
                    {t('dash_momentum_pain')}
                </p>
            </div>
        </section>
    );
}
