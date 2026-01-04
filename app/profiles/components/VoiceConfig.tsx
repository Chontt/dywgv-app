"use client";

import { BrandProfile } from "@/types/app";
import { useI18n } from "@/lib/i18n";

type VoiceConfigProps = {
    profile: BrandProfile;
    onChange: (updates: Partial<BrandProfile>) => void;
};

export default function VoiceConfig({ profile, onChange }: VoiceConfigProps) {
    const { t } = useI18n();
    const tones = ["calm", "confident", "bold", "luxury", "friendly"];
    const emojiOptions = ["none", "minimal", "allowed"];

    return (
        <section className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <h2 className="font-heading font-bold text-lg text-slate-900 mb-6 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">2</span>
                {t('profile_voice_title')}
            </h2>

            <div className="space-y-6">
                {/* Tone */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        {t('voice_tone_label')}
                    </label>
                    <p className="text-[10px] text-slate-400 mb-3">
                        {t('voice_tone_hint')}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {tones.map((t) => (
                            <button
                                key={t}
                                onClick={() => onChange({ niche: t })}
                                className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${profile.niche === t
                                    ? "border-purple-600 bg-purple-50 text-purple-700 shadow-sm"
                                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                                    }`}
                            >
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Emoji Preference */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                            {t('voice_emoji_label')}
                        </label>
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                            {t('voice_emoji_hint')}
                        </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {emojiOptions.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => onChange({ emoji_preference: opt })}
                                className={`py-3 rounded-xl border text-sm font-medium transition-all flex flex-col items-center gap-1 ${profile.emoji_preference === opt
                                    ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm"
                                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                                    }`}
                            >
                                <span className="text-lg">
                                    {opt === 'none' ? '🚫' : opt === 'minimal' ? '✨' : '🎉🔥🚀'}
                                </span>
                                {opt.charAt(0).toUpperCase() + opt.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
