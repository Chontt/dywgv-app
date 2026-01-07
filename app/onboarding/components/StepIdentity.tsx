import { BrainBuilderState, ROLES, EXP_LEVELS } from "../types";
import { useI18n } from "@/lib/i18n";

type Props = {
    data: BrainBuilderState;
    updateData: (key: keyof BrainBuilderState, value: any) => void;
};

export default function StepIdentity({ data, updateData }: Props) {
    const { t } = useI18n();

    const roleMap: Record<string, string> = {
        "Creator": "onb_role_creator",
        "Founder": "onb_role_founder",
        "Expert": "onb_role_expert",
        "Business": "onb_role_business"
    };

    const expMap: Record<string, string> = {
        "Beginner": "onb_exp_beginner",
        "Growing": "onb_exp_growing",
        "Authority": "onb_exp_authority"
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-black text-foreground">{t('onb_step1_title')}</h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-[10px] uppercase font-black tracking-widest text-muted mb-2">{t('onb_label_brand')}</label>
                    <input
                        value={data.brand_name}
                        onChange={(e) => updateData('brand_name', e.target.value)}
                        className="w-full bg-background/50 border border-border rounded-2xl px-5 py-4 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 focus:outline-none text-foreground placeholder:text-muted/40 transition-all font-bold"
                        placeholder={t('onb_placeholder_brand')}
                    />
                </div>

                <div>
                    <label className="block text-[10px] uppercase font-black tracking-widest text-muted mb-2">{t('onb_label_role')}</label>
                    <div className="grid grid-cols-2 gap-3">
                        {ROLES.map((role) => (
                            <button
                                key={role}
                                onClick={() => updateData('role', role.toLowerCase())}
                                className={`px-5 py-4 rounded-2xl border text-sm font-black uppercase tracking-widest transition-all ${data.role === role.toLowerCase()
                                    ? "bg-primary border-primary text-white shadow-bubble shadow-primary/20"
                                    : "bg-surface border-border text-muted hover:border-primary/30"
                                    }`}
                            >
                                {t(roleMap[role] || role)}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] uppercase font-black tracking-widest text-muted mb-2">{t('onb_label_exp')}</label>
                    <div className="flex gap-3">
                        {EXP_LEVELS.map((level) => (
                            <button
                                key={level}
                                onClick={() => updateData('experience_level', level.toLowerCase())}
                                className={`flex-1 px-5 py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${data.experience_level === level.toLowerCase()
                                    ? "bg-primary border-primary text-white shadow-bubble shadow-primary/20"
                                    : "bg-surface border-border text-muted hover:border-primary/30"
                                    }`}
                            >
                                {t(expMap[level] || level)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
