import { BrainBuilderState, TONES, SOURCES } from "../types";
import { useI18n } from "@/lib/i18n";

type Props = {
    data: BrainBuilderState;
    updateData: (key: keyof BrainBuilderState, value: any) => void;
};

export default function StepAuthority({ data, updateData }: Props) {
    const { t } = useI18n();

    const toneMap: Record<string, string> = {
        "Direct & Bold": "onb_tone_direct",
        "Empathetic & Soft": "onb_tone_empathetic",
        "High Energy": "onb_tone_high_energy",
        "Analytical": "onb_tone_analytical",
        "Witty": "onb_tone_witty"
    };

    const sourceMap: Record<string, string> = {
        "Results & Case Studies": "onb_source_results",
        "Logic & Research": "onb_source_logic",
        "Curation & Taste": "onb_source_curation",
        "Personal Experience": "onb_source_personal"
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-black text-foreground">{t('onb_step4_title')}</h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-[10px] uppercase font-black tracking-widest text-muted mb-2">{t('onb_label_tone')}</label>
                    <div className="grid grid-cols-2 gap-3">
                        {TONES.map((tone) => (
                            <button
                                key={tone}
                                onClick={() => updateData('voice_tone', tone)}
                                className={`px-5 py-4 rounded-2xl border text-left text-[11px] font-black uppercase tracking-widest transition-all ${data.voice_tone === tone
                                    ? "bg-primary border-primary text-white shadow-bubble shadow-primary/20"
                                    : "bg-surface border-border text-muted hover:border-primary/30"
                                    }`}
                            >
                                {t(toneMap[tone] || tone)}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label htmlFor="onb-authority-source" className="block text-[10px] uppercase font-black tracking-widest text-muted mb-2">{t('onb_label_source')}</label>
                    <div className="relative group/select">
                        <select
                            id="onb-authority-source"
                            value={data.authority_source}
                            onChange={(e) => updateData('authority_source', e.target.value)}
                            className="w-full bg-background/50 border border-border rounded-2xl px-5 py-4 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 focus:outline-none text-foreground appearance-none font-bold transition-all"
                        >
                            <option value="" disabled>{t('onb_placeholder_source')}</option>
                            {SOURCES.map(source => (
                                <option key={source} value={source}>{t(sourceMap[source] || source)}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
