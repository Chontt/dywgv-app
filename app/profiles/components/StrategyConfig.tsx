"use client";

import { BrandProfile } from "@/types/app";
import { useI18n } from "@/lib/i18n";
import { Target, Check } from "lucide-react";

type StrategyConfigProps = {
    profile: BrandProfile;
    onChange: (updates: Partial<BrandProfile>) => void;
};

export default function StrategyConfig({ profile, onChange }: StrategyConfigProps) {
    const { t } = useI18n();
    const goals = ["Authority Leverage", "Revenue Growth", "Ecosystem Trust", "Thought Dominance"];
    const platforms = ["LinkedIn", "X / Twitter", "Podcast / Video", "Newsletter"];

    return (
        <section className="bg-surface/40 backdrop-blur-xl rounded-[48px] border border-border p-12 lg:p-16 shadow-bubble space-y-12 transition-all duration-700">
            <header className="flex items-center gap-6 border-b border-border pb-10">
                <div className="w-14 h-14 rounded-[24px] bg-secondary/10 flex items-center justify-center text-secondary shadow-inner transition-transform hover:scale-110">
                    <Target className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                    <h2 className="text-3xl font-black tracking-tight text-foreground">Revenue & <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Ecosystem</span></h2>
                    <p className="text-[10px] font-black text-muted uppercase tracking-[0.4em]">Growth & Conversion Strategic Logic</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-6">
                {/* Content Goal */}
                <div className="space-y-6">
                    <label className="text-[10px] font-black uppercase tracking-[0.5em] text-muted px-1 opacity-50">
                        Primary Strategic Objective
                    </label>
                    <div className="space-y-4">
                        {goals.map((g) => (
                            <button
                                key={g}
                                onClick={() => onChange({ content_goal: g })}
                                className={`w-full text-left px-10 py-6 rounded-[32px] border text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-500 flex items-center justify-between relative overflow-hidden group
                                    ${profile.content_goal === g
                                        ? "border-transparent bg-gradient-to-r from-primary to-secondary text-white shadow-bubble shadow-primary/20"
                                        : "border-border bg-background/50 text-muted hover:border-primary/30"
                                    }`}
                            >
                                <span className="relative z-10">{g}</span>
                                {profile.content_goal === g && <Check className="w-5 h-5 relative z-10" strokeWidth={4} />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Platform Focus */}
                <div className="space-y-6">
                    <label className="text-[10px] font-black uppercase tracking-[0.5em] text-muted px-1 opacity-50">
                        Deployment Channel
                    </label>
                    <div className="space-y-4">
                        {platforms.map((p) => (
                            <button
                                key={p}
                                onClick={() => onChange({ platform_focus: p })}
                                className={`w-full text-left px-10 py-6 rounded-[32px] border text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-500 flex items-center justify-between relative overflow-hidden group
                                    ${profile.platform_focus === p
                                        ? "border-transparent bg-gradient-to-r from-primary to-secondary text-white shadow-bubble shadow-primary/20"
                                        : "border-border bg-background/50 text-muted hover:border-primary/30"
                                    }`}
                            >
                                <span className="relative z-10">{p}</span>
                                {profile.platform_focus === p && <Check className="w-5 h-5 relative z-10" strokeWidth={4} />}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
