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
            <h2 className="text-xl font-black text-foreground">{t('onb_step2_title')}</h2>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] uppercase font-black tracking-widest text-muted mb-2">{t('onb_label_niche')}</label>
                        <input
                            value={data.niche}
                            onChange={(e) => updateData('niche', e.target.value)}
                            className="w-full bg-background/50 border border-border rounded-2xl px-5 py-4 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 focus:outline-none text-foreground placeholder:text-muted/40 transition-all font-bold"
                            placeholder={t('onb_placeholder_niche')}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase font-black tracking-widest text-muted mb-2">{t('onb_label_industry')}</label>
                        <input
                            value={data.industry}
                            onChange={(e) => updateData('industry', e.target.value)}
                            className="w-full bg-background/50 border border-border rounded-2xl px-5 py-4 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 focus:outline-none text-foreground placeholder:text-muted/40 transition-all font-bold"
                            placeholder={t('onb_placeholder_industry')}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-[10px] uppercase font-black tracking-widest text-muted mb-2">{t('onb_label_value_prop')}</label>
                    <p className="text-[11px] font-medium text-muted mb-3 italic">{t('onb_desc_value_prop')}</p>
                    <textarea
                        value={data.value_proposition}
                        onChange={(e) => updateData('value_proposition', e.target.value)}
                        className="w-full bg-background/50 border border-border rounded-2xl px-5 py-4 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 focus:outline-none h-24 resize-none text-foreground placeholder:text-muted/40 transition-all font-bold"
                        placeholder={t('onb_placeholder_value_prop')}
                    />
                </div>
            </div>
        </div>
    );
}
