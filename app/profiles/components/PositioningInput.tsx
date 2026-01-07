"use client";

import { BrandProfile } from "@/types/app";
import { useI18n } from "@/lib/i18n";
import { Shield } from "lucide-react";

type PositioningInputProps = {
    profile: BrandProfile;
    onChange: (updates: Partial<BrandProfile>) => void;
};

export default function PositioningInput({ profile, onChange }: PositioningInputProps) {
    const { t } = useI18n();
    const impacts = ["Respect", "Intelligence", "Authority", "Trust", "Clarity", "Leverage"];

    return (
        <section className="bg-surface/40 backdrop-blur-xl rounded-[48px] border border-border p-12 lg:p-16 shadow-bubble space-y-12 transition-all duration-700">
            <header className="flex items-center gap-6 border-b border-border pb-10">
                <div className="w-14 h-14 rounded-[24px] bg-secondary/10 flex items-center justify-center text-secondary shadow-inner transition-transform hover:scale-110">
                    <Shield className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                    <h2 className="text-3xl font-black tracking-tight text-foreground">Market <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Positioning</span></h2>
                    <p className="text-[10px] font-black text-muted uppercase tracking-[0.4em]">Belief Systems & Authority Framing</p>
                </div>
            </header>

            <div className="space-y-12 pt-6">
                {/* Positioning Statement */}
                <div className="space-y-6">
                    <label className="text-[10px] font-black uppercase tracking-[0.5em] text-muted px-1 opacity-50">
                        {t('positioning_title')}
                    </label>
                    <div className="relative">
                        <textarea
                            value={profile.positioning_statement || ""}
                            onChange={(e) => onChange({ positioning_statement: e.target.value })}
                            className="w-full bg-background/50 border border-border rounded-[40px] p-10 text-[15px] font-bold text-foreground placeholder:text-muted/10 focus:border-secondary/50 focus:ring-8 focus:ring-secondary/5 transition-all outline-none leading-[2] resize-none shadow-sm"
                            rows={5}
                            placeholder={t('positioning_placeholder')}
                        />
                    </div>
                </div>

                {/* Emotional Impact */}
                <div className="space-y-6">
                    <label className="text-[10px] font-black uppercase tracking-[0.5em] text-muted px-1 opacity-50">
                        Target Perception Protocol
                    </label>
                    <div className="flex flex-wrap gap-4">
                        {impacts.map((imp) => (
                            <button
                                key={imp}
                                onClick={() => onChange({ emotional_impact: imp })}
                                className={`px-10 py-5 rounded-[24px] border text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-500 relative overflow-hidden group
                                    ${profile.emotional_impact === imp
                                        ? "border-transparent bg-gradient-to-r from-primary to-secondary text-white shadow-bubble shadow-primary/20"
                                        : "border-border bg-background/50 text-muted hover:border-secondary/30 hover:shadow-sm"
                                    }`}
                            >
                                <span className="relative z-10">{imp}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
