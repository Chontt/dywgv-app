"use client";

import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";

// Define Project Type (Subset)
type Project = {
    id: string;
    title?: string;
    output_text: string | null;
    content_kind: string | null;
    updated_at?: string;
    created_at?: string;
    completed_at?: string | null;
    status?: string;
    form_json?: any;
};

type CompletedWidgetProps = {
    projects: Project[];
};

export default function CompletedWidget({ projects }: CompletedWidgetProps) {
    const router = useRouter();
    const { t } = useI18n();

    // Most recent first
    const sorted = [...projects].sort((a, b) => {
        const dateA = new Date(a.completed_at || (a as any).form_json?._completed_at || a.updated_at || "").getTime();
        const dateB = new Date(b.completed_at || (b as any).form_json?._completed_at || b.updated_at || "").getTime();
        return dateB - dateA;
    });

    if (sorted.length === 0) {
        return (
            <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center justify-center min-h-[140px] text-center">
                <div className="text-slate-400 text-sm">
                    <p>{t('widget_completed_empty')}</p>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-full">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">{t('widget_completed_title')} <span className="text-indigo-600 ml-1">✓</span></h2>

            <div className="space-y-3">
                {sorted.slice(0, 3).map(project => (
                    <div key={project.id} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
                        <div className="flex-1 min-w-0 pr-3">
                            <h3 className="font-bold text-slate-800 text-sm truncate mb-1">
                                {project.title || project.output_text?.substring(0, 30) || "Untitled"}
                            </h3>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                <span className="uppercase font-semibold bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                                    {project.content_kind?.replace(/_/g, " ") || "Content"}
                                </span>
                                <span>•</span>
                                <span>{new Date(project.completed_at || (project as any).form_json?._completed_at || project.updated_at || "").toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {/* Duplicate Action */}
                            <button
                                onClick={() => router.push(`/studio?projectId=${project.id}&action=duplicate`)}
                                title={t('widget_completed_btn_duplicate')}
                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                            </button>
                            {/* View Action */}
                            <button
                                onClick={() => router.push(`/studio?projectId=${project.id}`)}
                                className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:border-indigo-300 hover:text-indigo-600 transition-all"
                            >
                                {t('widget_completed_btn_view')}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {sorted.length > 3 && (
                <button className="w-full text-center text-xs font-bold text-slate-400 mt-4 hover:text-slate-600 py-2">
                    {t('dash_view_all')}
                </button>
            )}
        </section>
    );
}
