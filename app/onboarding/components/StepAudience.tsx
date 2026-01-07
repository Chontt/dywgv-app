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
            <h2 className="text-xl font-black text-foreground">{t('onb_step3_title')}</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-[10px] uppercase font-black tracking-widest text-muted mb-2">{t('onb_label_audience')}</label>
                    <input
                        value={data.target_audience_demographics}
                        onChange={(e) => updateData('target_audience_demographics', e.target.value)}
                        className="w-full bg-background/50 border border-border rounded-2xl px-5 py-4 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 focus:outline-none text-foreground placeholder:text-muted/40 transition-all font-bold"
                        placeholder={t('onb_placeholder_audience')}
                    />
                </div>
                <div>
                    <label className="block text-[10px] uppercase font-black tracking-widest text-muted mb-2">{t('onb_label_pain')}</label>
                    <input
                        value={data.audience_pain}
                        onChange={(e) => updateData('audience_pain', e.target.value)}
                        className="w-full bg-background/50 border border-border rounded-2xl px-5 py-4 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 focus:outline-none text-foreground placeholder:text-muted/40 transition-all font-bold"
                        placeholder={t('onb_placeholder_pain')}
                    />
                </div>
                <div>
                    <label className="block text-[10px] uppercase font-black tracking-widest text-muted mb-2">{t('onb_label_desire')}</label>
                    <input
                        value={data.audience_desire}
                        onChange={(e) => updateData('audience_desire', e.target.value)}
                        className="w-full bg-background/50 border border-border rounded-2xl px-5 py-4 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 focus:outline-none text-foreground placeholder:text-muted/40 transition-all font-bold"
                        placeholder={t('onb_placeholder_desire')}
                    />
                </div>
            </div>
        </div>
    );
}
