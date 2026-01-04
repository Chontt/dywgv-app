"use client";

import { BrandProfile } from "@/types/app";
import { useI18n } from "@/lib/i18n";

type IdentitySectionProps = {
    profile: BrandProfile;
    onChange: (updates: Partial<BrandProfile>) => void;
};

export default function IdentitySection({ profile, onChange }: IdentitySectionProps) {
    const { t } = useI18n();
    const levels = ["beginner", "growing", "authority", "elite"];

    return (
        <section className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <h2 className="font-heading font-bold text-lg text-slate-900 mb-6 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">1</span>
                {t('identity_foundation')}
            </h2>

            <div className="space-y-6">
                {/* Brand Name */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        {t('identity_name_label')}
                    </label>
                    <input
                        type="text"
                        value={profile.brand_name || ""}
                        onChange={(e) => onChange({ brand_name: e.target.value })}
                        className="w-full text-lg font-bold text-slate-900 border-none bg-slate-50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 placeholder-slate-300"
                        placeholder={t('identity_name_placeholder')}
                    />
                </div>

                {/* Role */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        {t('identity_role_label')}
                    </label>
                    <input
                        type="text"
                        value={profile.role || ""}
                        onChange={(e) => onChange({ role: e.target.value })}
                        className="w-full font-medium text-slate-700 border-none bg-slate-50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 placeholder-slate-300"
                        placeholder={t('identity_role_placeholder')}
                    />
                </div>

                {/* Authority Level */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                        {t('identity_authority_label')}
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                        {levels.map((lvl) => (
                            <button
                                key={lvl}
                                onClick={() => onChange({ authority_level: lvl })}
                                className={`px-2 py-3 rounded-xl border text-sm font-medium transition-all ${profile.authority_level === lvl
                                    ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-600"
                                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                                    }`}
                            >
                                {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                            </button>
                        ))}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 text-right">
                        {t('identity_authority_hint')}
                    </p>
                </div>
            </div>
        </section>
    );
}
