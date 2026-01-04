"use client";

import { BrandProfile } from "@/types/app";
import { useI18n } from "@/lib/i18n";

type PositioningInputProps = {
    profile: BrandProfile;
    onChange: (updates: Partial<BrandProfile>) => void;
};

export default function PositioningInput({ profile, onChange }: PositioningInputProps) {
    const { t } = useI18n();
    const impacts = ["Confident", "Inspired", "Calm", "Urgent", "Respected", "Happier"];

    return (
        <section className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm relative overflow-hidden">
            {/* Subtle premium background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full opacity-50 -mr-10 -mt-10"></div>

            <h2 className="font-heading font-bold text-lg text-slate-900 mb-6 flex items-center gap-2 relative z-10">
                <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">4</span>
                {t('profile_positioning_title')}
            </h2>

            <div className="relative z-10 space-y-6">
                {/* Positioning Statement */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        {t('positioning_title')}
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-3.5 text-slate-400 font-medium select-none">
                            &quot;{t('positioning_prefix')}&quot;
                        </span>
                        <input
                            type="text"
                            value={profile.positioning_statement || ""}
                            onChange={(e) => onChange({ positioning_statement: e.target.value })}
                            className="w-full pl-[240px] pr-4 py-3 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 placeholder-slate-300"
                            placeholder={t('positioning_placeholder')}
                        />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2">
                        {t('positioning_hint')}
                    </p>
                </div>

                {/* Emotional Impact */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                        {t('emotional_impact_label')}
                    </label>
                    <p className="text-xs text-slate-400 mb-3">
                        {t('emotional_impact_hint')}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {impacts.map((imp) => (
                            <button
                                key={imp}
                                onClick={() => onChange({ emotional_impact: imp })}
                                className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${profile.emotional_impact === imp
                                    ? "border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-200"
                                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-indigo-600"
                                    }`}
                            >
                                {imp}
                            </button>
                        ))}
                        <input
                            type="text"
                            placeholder={t('emotional_custom_placeholder')}
                            className="px-4 py-2 rounded-full border border-slate-200 bg-transparent text-sm w-24 focus:w-32 transition-all focus:border-indigo-500 outline-none"
                            onChange={(e) => {
                                if (e.target.value.length > 2) onChange({ emotional_impact: e.target.value })
                            }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
