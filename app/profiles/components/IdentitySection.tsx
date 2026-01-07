"use client";

import { BrandProfile } from "@/types/app";
import { useI18n } from "@/lib/i18n";
import { User } from "lucide-react";

type IdentitySectionProps = {
    profile: BrandProfile;
    onChange: (updates: Partial<BrandProfile>) => void;
};

export default function IdentitySection({ profile, onChange }: IdentitySectionProps) {
    const { t } = useI18n();
    const levels = ["beginner", "growing", "authority", "elite"];

    return (
        <section className="bg-surface/40 backdrop-blur-xl rounded-[48px] border border-border p-12 lg:p-16 shadow-bubble space-y-12 transition-all duration-700">
            <header className="flex items-center gap-6 border-b border-border pb-10">
                <div className="w-14 h-14 rounded-[24px] bg-primary/10 flex items-center justify-center text-primary shadow-inner transition-transform hover:scale-110">
                    <User className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                    <h2 className="text-3xl font-black tracking-tight text-foreground">Identity <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Foundation</span></h2>
                    <p className="text-[10px] font-black text-muted uppercase tracking-[0.4em]">Core Authority Synthesis</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-6">
                {/* Brand Name */}
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.5em] text-muted px-1 opacity-50">
                        {t('identity_name_label')}
                    </label>
                    <input
                        type="text"
                        value={profile.brand_name || ""}
                        onChange={(e) => onChange({ brand_name: e.target.value })}
                        className="w-full text-xl font-black tracking-tight text-foreground bg-background/50 border border-border rounded-[28px] px-10 py-6 focus:border-primary/50 focus:ring-8 focus:ring-primary/5 transition-all outline-none shadow-sm placeholder:text-muted/20"
                        placeholder={t('identity_name_placeholder')}
                    />
                </div>

                {/* Role */}
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.5em] text-muted px-1 opacity-50">
                        {t('identity_role_label')}
                    </label>
                    <input
                        type="text"
                        value={profile.role || ""}
                        onChange={(e) => onChange({ role: e.target.value })}
                        className="w-full text-sm font-black text-foreground bg-background/50 border border-border rounded-[28px] px-10 py-6 focus:border-primary/50 focus:ring-8 focus:ring-primary/5 transition-all outline-none shadow-sm placeholder:text-muted/20"
                        placeholder={t('identity_role_placeholder')}
                    />
                </div>

                {/* Authority Level */}
                <div className="md:col-span-2 space-y-6">
                    <label className="text-[10px] font-black uppercase tracking-[0.5em] text-muted px-1 opacity-50">
                        {t('identity_authority_label')}
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                        {levels.map((lvl) => (
                            <button
                                key={lvl}
                                onClick={() => onChange({ authority_level: lvl })}
                                className={`px-8 py-6 rounded-[28px] border text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-500 relative overflow-hidden group
                                    ${profile.authority_level === lvl
                                        ? "border-transparent bg-gradient-to-br from-primary to-secondary text-white shadow-bubble shadow-primary/20"
                                        : "border-border bg-background/50 text-muted hover:border-primary/30"
                                    }`}
                            >
                                <span className="relative z-10">{lvl}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
