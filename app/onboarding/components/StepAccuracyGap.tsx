import { BrainBuilderState } from "../types";
import { useI18n } from "@/lib/i18n";

type Props = {
    data: BrainBuilderState;
    updateData: (key: keyof BrainBuilderState, value: any) => void;
};

export default function StepAccuracyGap({ data, updateData }: Props) {
    const { t } = useI18n();
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-black text-foreground">{t('onb_step3_accuracy_title')}</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-[10px] uppercase font-black tracking-widest text-muted mb-2">{t('onb_label_accuracy_identity')}</label>
                    <input
                        value={data.accuracy_identity}
                        onChange={(e) => updateData('accuracy_identity', e.target.value)}
                        className="w-full bg-background/50 border border-border rounded-2xl px-5 py-4 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 focus:outline-none text-foreground placeholder:text-muted/40 transition-all font-bold"
                        placeholder={t('onb_placeholder_accuracy_identity')}
                    />
                </div>
                <div>
                    <label className="block text-[10px] uppercase font-black tracking-widest text-muted mb-2">{t('onb_label_accuracy_misconception')}</label>
                    <textarea
                        value={data.accuracy_misconception}
                        onChange={(e) => updateData('accuracy_misconception', e.target.value)}
                        className="w-full bg-background/50 border border-border rounded-2xl px-5 py-4 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 focus:outline-none h-24 resize-none text-foreground placeholder:text-muted/40 transition-all font-bold"
                        placeholder={t('onb_placeholder_accuracy_misconception')}
                    />
                </div>
                <div>
                    <label className="block text-[10px] uppercase font-black tracking-widest text-muted mb-2">{t('onb_label_accuracy_one_thing')}</label>
                    <input
                        value={data.accuracy_one_thing}
                        onChange={(e) => updateData('accuracy_one_thing', e.target.value)}
                        className="w-full bg-background/50 border border-border rounded-2xl px-5 py-4 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 focus:outline-none text-foreground placeholder:text-muted/40 transition-all font-bold"
                        placeholder={t('onb_placeholder_accuracy_one_thing')}
                    />
                </div>
            </div>
        </div>
    );
}
