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
            <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center justify-center min-h-[140px] text-center">
                <div className="text-slate-400 text-sm">
                    <p className="mb-2">{t('widget_continue_empty')}</p>
                    <button onClick={() => router.push("/studio")} className="text-indigo-600 font-bold hover:underline">{t('widget_continue_btn_new')}</button>
                </div>
            </section>
        );
    }

    const lastEdited = new Date(project.updated_at || project.created_at || "").toLocaleDateString();
    const summary = project.output_text ? (project.output_text.substring(0, 60) + "...") : t('widget_continue_untitled');

    return (
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative group overflow-hidden">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">{t('widget_continue_title')}</h2>
                <span className="text-xs text-slate-400">{t('widget_continue_last_edited')} {lastEdited}</span>
            </div>

            <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2 truncate">
                    {summary}
                </h3>
                <div className="flex gap-2 mb-3">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded-md">
                        {project.content_kind?.replace(/_/g, " ") || "Content"}
                    </span>
                    <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase rounded-md">
                        {project.status || t('widget_continue_draft')}
                    </span>
                </div>

                {/* Revenue Trigger */}
                <div className="bg-orange-50 border border-orange-100 rounded-lg p-2 flex items-start gap-2">
                    <span className="text-xs">🔒</span>
                    <p className="text-[10px] text-orange-800 font-medium leading-tight">
                        {t('dash_project_trigger')}
                    </p>
                </div>
            </div>

            <button
                className="w-full bg-slate-900 text-white rounded-xl py-3 font-bold text-sm hover:bg-slate-800 transition-all hover:shadow-lg flex items-center justify-center gap-2"
                onClick={() => router.push(`/studio?projectId=${project.id}`)}
            >
                {t('dash_btn_finish') || t('widget_continue_btn_open')}
            </button>
        </section>
    );
}
