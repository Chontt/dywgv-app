import { BrainBuilderState, PLATFORMS } from "../types";
import { useI18n } from "@/lib/i18n";

type Props = {
    data: BrainBuilderState;
    updateData: (key: keyof BrainBuilderState, value: any) => void;
};

const LANGUAGES = [
    { code: "en", label: "English" },
    { code: "th", label: "Thai (ภาษาไทย)" },
    { code: "jp", label: "Japanese (日本語)" },
    { code: "ko", label: "Korean (한국어)" }
];

export default function StepStrategy({ data, updateData }: Props) {
    const { t } = useI18n();

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">{t('onb_step5_title')}</h2>

            <div className="space-y-4">
                <div>
                    <label htmlFor="onb-main-platform" className="block text-xs uppercase font-bold text-slate-500 mb-2">{t('onb_label_platform')}</label>
                    <select
                        id="onb-main-platform"
                        value={data.main_platform}
                        onChange={(e) => updateData('main_platform', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:outline-none text-slate-900"
                    >
                        <option value="" disabled>{t('onb_placeholder_platform')}</option>
                        {PLATFORMS.map(p => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="onb-content-language" className="block text-xs uppercase font-bold text-slate-500 mb-2">{t('onb_label_language')}</label>
                    <select
                        id="onb-content-language"
                        value={data.content_language}
                        onChange={(e) => updateData('content_language', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:outline-none text-slate-900"
                    >
                        {LANGUAGES.map(l => (
                            <option key={l.code} value={l.code}>{l.label}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs uppercase font-bold text-slate-500 mb-2">{t('onb_label_goal')}</label>
                    <input
                        value={data.monthly_goal}
                        onChange={(e) => updateData('monthly_goal', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:outline-none text-slate-900 placeholder:text-slate-400"
                        placeholder={t('onb_placeholder_goal')}
                    />
                </div>
            </div>
        </div>
    );
}
