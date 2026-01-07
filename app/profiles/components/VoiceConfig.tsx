"use client";

import { BrandProfile } from "@/types/app";
import { useI18n } from "@/lib/i18n";
import { Volume2, CircleOff, Sparkles, Zap } from "lucide-react";

type VoiceConfigProps = {
    profile: BrandProfile;
    onChange: (updates: Partial<BrandProfile>) => void;
};

export default function VoiceConfig({ profile, onChange }: VoiceConfigProps) {
    const { t } = useI18n();
    const tones = ["calm", "confident", "direct", "luxury"];
    const emojiOptions = [
        { id: "none", label: "None", icon: <CircleOff className="w-4 h-4" /> },
        { id: "minimal", label: "Minimalist", icon: <Sparkles className="w-4 h-4" /> },
        { id: "strategic", label: "Strategic", icon: <Zap className="w-4 h-4" /> },
    ];

    return (
        <section className="bg-surface/40 backdrop-blur-xl rounded-[48px] border border-border p-12 lg:p-16 shadow-bubble space-y-12 transition-all duration-700">
            <header className="flex items-center gap-6 border-b border-border pb-10">
                <div className="w-14 h-14 rounded-[24px] bg-secondary/10 flex items-center justify-center text-secondary shadow-inner transition-transform hover:scale-110">
                    <Volume2 className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                    <h2 className="text-3xl font-black tracking-tight text-foreground">Strategic <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Voice</span></h2>
                    <p className="text-[10px] font-black text-muted uppercase tracking-[0.4em]">Influence & Resonance Configuration</p>
                </div>
            </header>

            <div className="space-y-12 pt-6">
                {/* Tone Grid */}
                <div className="space-y-6">
                    <label className="text-[10px] font-black uppercase tracking-[0.5em] text-muted px-1 opacity-50">
                        Primary Auditory Archetype
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                        {tones.map((tone) => (
                            <button
                                key={tone}
                                onClick={() => onChange({ tone })}
                                className={`px-8 py-6 rounded-[28px] border text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-500 relative overflow-hidden group
                                    ${profile.tone === tone
                                        ? "border-transparent bg-gradient-to-br from-primary to-secondary text-white shadow-bubble shadow-primary/20"
                                        : "border-border bg-background/50 text-muted hover:border-primary/30"
                                    }`}
                            >
                                <span className="relative z-10">{tone}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Emoji Preference */}
                <div className="space-y-6">
                    <label className="text-[10px] font-black uppercase tracking-[0.5em] text-muted px-1 opacity-50">
                        Visual Syntax Protocols (Emojis)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {emojiOptions.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => onChange({ emoji_preference: opt.id })}
                                className={`p-8 rounded-[32px] border transition-all duration-500 text-center flex flex-col items-center gap-5 relative overflow-hidden group
                                    ${profile.emoji_preference === opt.id
                                        ? "border-primary/30 bg-surface text-foreground shadow-sm"
                                        : "border-border bg-background/40 text-muted hover:border-primary/20 hover:bg-surface/60"}
                                `}
                            >
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${profile.emoji_preference === opt.id ? "bg-primary/10 text-primary" : "bg-background text-muted group-hover:scale-110 opacity-50"}`}>
                                    {opt.icon}
                                </div>
                                <span className="text-[11px] font-black uppercase tracking-widest leading-tight">{opt.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
