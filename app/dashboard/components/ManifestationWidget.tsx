"use client";

import { useI18n } from "@/lib/i18n";
import { Sparkles, Quote, ArrowRight, BookMarked } from "lucide-react";

type ManifestationWidgetProps = {
    manifestation: string;
    emotion: string;
};

export default function ManifestationWidget({ manifestation, emotion }: ManifestationWidgetProps) {
    const { t } = useI18n();

    return (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 lg:p-8 rounded-[48px] text-white relative overflow-hidden shadow-2xl border border-white/5 h-full flex flex-col justify-between group">

            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-pastel-purple/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 animate-pulse-slow pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-pastel-blue/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

            {/* Header */}
            <div className="relative z-10 flex justify-between items-start">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
                        <Sparkles className="w-3 h-3 text-pastel-yellow" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-pastel-yellow">{t('core_manifestation_title')}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-400 pl-1 uppercase tracking-widest">{emotion} {t('core_manifestation_mode')}</p>
                </div>
                <Quote className="w-10 h-10 text-white/5 rotate-180" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 space-y-6 my-auto">
                <h2 className="text-2xl lg:text-3xl font-medium leading-relaxed tracking-tight text-white/90">
                    "{manifestation}"
                </h2>
            </div>

            {/* Actions */}
            <div className="relative z-10 pt-8 border-t border-white/10 flex flex-col gap-3">
                <button className="w-full group/btn flex items-center justify-between bg-white text-slate-900 px-6 py-4 rounded-[24px] font-bold text-sm hover:bg-slate-100 transition-all">
                    <span>{t('core_btn_turn_content')}</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
                <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-slate-300 px-4 py-3 rounded-[20px] text-xs font-bold uppercase tracking-wider transition-all border border-white/5">
                        <BookMarked className="w-4 h-4" /> {t('core_btn_save_journey')}
                    </button>
                </div>
            </div>
        </div>
    );
}
