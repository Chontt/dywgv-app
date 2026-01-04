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
            <h2 className="text-xl font-bold text-slate-900">{t('onb_step4_title')}</h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs uppercase font-bold text-slate-500 mb-2">{t('onb_label_tone')}</label>
                    <div className="grid grid-cols-2 gap-2">
                        {TONES.map((tone) => (
                            <button
                                key={tone}
                                onClick={() => updateData('voice_tone', tone)}
                                className={`px-4 py-3 rounded-xl border text-left text-sm font-medium transition-all ${data.voice_tone === tone
                                    ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/20"
                                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-400"
                                    }`}
                            >
                                {t(toneMap[tone] || tone)}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label htmlFor="onb-authority-source" className="block text-xs uppercase font-bold text-slate-500 mb-2">{t('onb_label_source')}</label>
                    <select
                        id="onb-authority-source"
                        value={data.authority_source}
                        onChange={(e) => updateData('authority_source', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:outline-none text-slate-900 appearance-none"
                    >
                        <option value="" disabled>{t('onb_placeholder_source')}</option>
                        {SOURCES.map(source => (
                            <option key={source} value={source}>{t(sourceMap[source] || source)}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}
