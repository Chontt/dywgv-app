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
            <h2 className="text-xl font-bold text-slate-900">{t('onb_step1_title')}</h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs uppercase font-bold text-slate-500 mb-2">{t('onb_label_brand')}</label>
                    <input
                        value={data.brand_name}
                        onChange={(e) => updateData('brand_name', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:outline-none text-slate-900 placeholder:text-slate-400"
                        placeholder={t('onb_placeholder_brand')}
                    />
                </div>

                <div>
                    <label className="block text-xs uppercase font-bold text-slate-500 mb-2">{t('onb_label_role')}</label>
                    <div className="grid grid-cols-2 gap-2">
                        {ROLES.map((role) => (
                            <button
                                key={role}
                                onClick={() => updateData('role', role.toLowerCase())}
                                className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${data.role === role.toLowerCase()
                                    ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/20"
                                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-400"
                                    }`}
                            >
                                {t(roleMap[role] || role)}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-xs uppercase font-bold text-slate-500 mb-2">{t('onb_label_exp')}</label>
                    <div className="flex gap-2">
                        {EXP_LEVELS.map((level) => (
                            <button
                                key={level}
                                onClick={() => updateData('experience_level', level.toLowerCase())}
                                className={`flex-1 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${data.experience_level === level.toLowerCase()
                                    ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/20"
                                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-400"
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
