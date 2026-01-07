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
            <h2 className="text-xl font-black text-foreground">{t('onb_step5_title')}</h2>

            <div className="space-y-4">
                <div>
                    <label htmlFor="onb-main-platform" className="block text-[10px] uppercase font-black tracking-widest text-muted mb-2">{t('onb_label_platform')}</label>
                    <select
                        id="onb-main-platform"
                        value={data.main_platform}
                        onChange={(e) => updateData('main_platform', e.target.value)}
                        className="w-full bg-background/50 border border-border rounded-2xl px-5 py-4 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 focus:outline-none text-foreground appearance-none font-bold transition-all"
                    >
                        <option value="" disabled>{t('onb_placeholder_platform')}</option>
                        {PLATFORMS.map(p => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="onb-content-language" className="block text-[10px] uppercase font-black tracking-widest text-muted mb-2">{t('onb_label_language')}</label>
                    <select
                        id="onb-content-language"
                        value={data.content_language}
                        onChange={(e) => updateData('content_language', e.target.value)}
                        className="w-full bg-background/50 border border-border rounded-2xl px-5 py-4 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 focus:outline-none text-foreground font-bold transition-all"
                    >
                        {LANGUAGES.map(l => (
                            <option key={l.code} value={l.code}>{l.label}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-[10px] uppercase font-black tracking-widest text-muted mb-2">{t('onb_label_goal')}</label>
                    <input
                        value={data.monthly_goal}
                        onChange={(e) => updateData('monthly_goal', e.target.value)}
                        className="w-full bg-background/50 border border-border rounded-2xl px-5 py-4 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 focus:outline-none text-foreground placeholder:text-muted/40 font-bold transition-all"
                        placeholder={t('onb_placeholder_goal')}
                    />
                </div>
            </div>
        </div>
    );
}
