"use client";

import { BrandProfile } from "@/types/app";
import { useI18n } from "@/lib/i18n";

type StrategyConfigProps = {
    profile: BrandProfile;
    onChange: (updates: Partial<BrandProfile>) => void;
};

export default function StrategyConfig({ profile, onChange }: StrategyConfigProps) {
    const { t } = useI18n();
    const goals = ["Trust", "Sales", "Growth", "Thought Leadership"];
    const platforms = ["LinkedIn", "Twitter/X", "Instagram", "Newsletter"];

    return (
        <section className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <h2 className="font-heading font-bold text-lg text-slate-900 mb-6 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center text-xs font-bold">3</span>
                {t('profile_strategy_title')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Content Goal */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        {t('strategy_goal_label')}
                    </label>
                    <p className="text-[10px] text-slate-400 mb-3">
                        {t('strategy_goal_hint')}
                    </p>
                    <div className="space-y-2">
                        {goals.map((g) => (
                            <button
                                key={g}
                                onClick={() => onChange({ content_goal: g })}
                                className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-between ${profile.content_goal === g
                                    ? "border-pink-500 bg-pink-50 text-pink-700 shadow-sm"
                                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                                    }`}
                            >
                                {g}
                                {profile.content_goal === g && <span>✓</span>}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Platform Focus */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        {t('strategy_platform_label')}
                    </label>
                    <p className="text-[10px] text-slate-400 mb-3">
                        {t('strategy_platform_hint')}
                    </p>
                    <div className="space-y-2">
                        {platforms.map((p) => (
                            <button
                                key={p}
                                onClick={() => onChange({ platform_focus: p })}
                                className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-between ${profile.platform_focus === p
                                    ? "border-slate-900 bg-slate-900 text-white shadow-md"
                                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                                    }`}
                            >
                                {p}
                                {profile.platform_focus === p && <span>✓</span>}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
