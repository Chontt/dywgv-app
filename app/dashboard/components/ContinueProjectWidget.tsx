"use client";

import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";

// Define Project Type (Subset)
type Project = {
    id: string;
    output_text: string | null;
    content_kind: string | null;
    updated_at?: string;
    created_at?: string;
    status?: string;
};

type ContinueProjectWidgetProps = {
    project: Project | null;
};

export default function ContinueProjectWidget({ project }: ContinueProjectWidgetProps) {
    const router = useRouter();
    const { t } = useI18n();

    if (!project) {
        return (
            <section className="bg-white/60 backdrop-blur-xl rounded-[32px] p-8 border border-white flex flex-col items-center justify-center min-h-[160px] text-center shadow-sm">
                <div className="text-slate-300 text-xs font-black uppercase tracking-[0.2em] mb-4">
                    {t('widget_continue_empty')}
                </div>
                <button
                    onClick={() => router.push("/studio")}
                    className="px-6 py-3 bg-pastel-pink/10 text-pastel-pink rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-pastel-pink/20 transition-all border border-pastel-pink/10"
                >
                    {t('widget_continue_btn_new')}
                </button>
            </section>
        );
    }

    const lastEdited = new Date(project.updated_at || project.created_at || "").toLocaleDateString();
    const summary = project.output_text ? (project.output_text.substring(0, 60) + "...") : t('widget_continue_untitled');

    return (
        <section className="bg-white/60 backdrop-blur-xl rounded-[32px] p-6 lg:p-8 border border-white relative group overflow-hidden transition-all duration-700 hover:shadow-bubble h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">{t('widget_continue_title')}</h2>
                <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest">{lastEdited}</span>
            </div>

            <div className="mb-6">
                <h3 className="text-xl font-black text-slate-800 mb-3 leading-tight truncate">
                    {summary}
                </h3>
                <div className="flex gap-2.5 mb-4">
                    <span className="px-3 py-1.5 bg-pastel-blue/10 text-pastel-blue text-[9px] font-black uppercase tracking-widest rounded-full border border-pastel-blue/10">
                        {project.content_kind?.replace(/_/g, " ") || "Content"}
                    </span>
                    <span className="px-3 py-1.5 bg-pastel-pink/10 text-pastel-pink text-[9px] font-black uppercase tracking-widest rounded-full border border-pastel-pink/10">
                        {project.status || t('widget_continue_draft')}
                    </span>
                </div>

                {/* Revenue Trigger */}
                <div className="bg-pastel-purple/5 border border-pastel-purple/10 rounded-2xl p-4 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-pastel-purple shadow-sm shrink-0">
                        <span className="text-xs">🔒</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-relaxed">
                        {t('dash_project_trigger')}
                    </p>
                </div>
            </div>

            <button
                className="w-full bg-gradient-to-r from-pastel-pink to-pastel-purple text-white rounded-[20px] py-4 font-black text-[11px] uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-bubble shadow-pastel-pink/20"
                onClick={() => router.push(`/studio?projectId=${project.id}`)}
            >
                {t('dash_btn_finish') || t('widget_continue_btn_open')}
            </button>
        </section>
    );
}
