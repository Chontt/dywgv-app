import { BrainBuilderState } from "../types";
import { useI18n } from "@/lib/i18n";

type Props = {
    data: BrainBuilderState;
    updateData: (key: keyof BrainBuilderState, value: any) => void;
};

export default function StepPositioning({ data, updateData }: Props) {
    const { t } = useI18n();
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">{t('onb_step2_title')}</h2>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs uppercase font-bold text-slate-500 mb-2">{t('onb_label_niche')}</label>
                        <input
                            value={data.niche}
                            onChange={(e) => updateData('niche', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:outline-none text-slate-900 placeholder:text-slate-400"
                            placeholder={t('onb_placeholder_niche')}
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase font-bold text-slate-500 mb-2">{t('onb_label_industry')}</label>
                        <input
                            value={data.industry}
                            onChange={(e) => updateData('industry', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:outline-none text-slate-900 placeholder:text-slate-400"
                            placeholder={t('onb_placeholder_industry')}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs uppercase font-bold text-slate-500 mb-2">{t('onb_label_value_prop')}</label>
                    <p className="text-xs text-slate-500 mb-2">{t('onb_desc_value_prop')}</p>
                    <textarea
                        value={data.value_proposition}
                        onChange={(e) => updateData('value_proposition', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:outline-none h-20 resize-none text-slate-900 placeholder:text-slate-400"
                        placeholder={t('onb_placeholder_value_prop')}
                    />
                </div>
            </div>
        </div>
    );
}
