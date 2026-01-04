import { BrainBuilderState } from "../types";
import { useI18n } from "@/lib/i18n";

type Props = {
    data: BrainBuilderState;
    updateData: (key: keyof BrainBuilderState, value: any) => void;
};

export default function StepAudience({ data, updateData }: Props) {
    const { t } = useI18n();

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">{t('onb_step3_title')}</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-xs uppercase font-bold text-slate-500 mb-2">{t('onb_label_audience')}</label>
                    <input
                        value={data.target_audience_demographics}
                        onChange={(e) => updateData('target_audience_demographics', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:outline-none text-slate-900 placeholder:text-slate-400"
                        placeholder={t('onb_placeholder_audience')}
                    />
                </div>
                <div>
                    <label className="block text-xs uppercase font-bold text-slate-500 mb-2">{t('onb_label_pain')}</label>
                    <input
                        value={data.audience_pain}
                        onChange={(e) => updateData('audience_pain', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:outline-none text-slate-900 placeholder:text-slate-400"
                        placeholder={t('onb_placeholder_pain')}
                    />
                </div>
                <div>
                    <label className="block text-xs uppercase font-bold text-slate-500 mb-2">{t('onb_label_desire')}</label>
                    <input
                        value={data.audience_desire}
                        onChange={(e) => updateData('audience_desire', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:outline-none text-slate-900 placeholder:text-slate-400"
                        placeholder={t('onb_placeholder_desire')}
                    />
                </div>
            </div>
        </div>
    );
}
