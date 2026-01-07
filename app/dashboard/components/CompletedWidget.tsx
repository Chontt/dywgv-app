"use client";

import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { Check } from "lucide-react";

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
            <section className="bg-white/40 backdrop-blur-xl rounded-[48px] p-10 border border-white flex items-center justify-center min-h-[160px] text-center shadow-sm">
                <div className="text-slate-300 text-[10px] font-black uppercase tracking-[0.3em]">
                    {t('widget_completed_empty')}
                </div>
            </section>
        );
    }

    return (
        <section className="bg-white/40 backdrop-blur-xl rounded-[48px] p-10 lg:p-12 border border-white shadow-bubble group transition-all duration-700">
            <h2 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                {t('widget_completed_title')}
                <div className="w-5 h-5 rounded-full bg-pastel-teal/20 flex items-center justify-center text-pastel-teal">
                    <Check className="w-3 h-3" />
                </div>
            </h2>

            <div className="space-y-4">
                {sorted.slice(0, 5).map(project => (
                    <div key={project.id} className="group flex items-center justify-between p-6 rounded-[32px] bg-white/60 border border-white hover:border-pastel-teal/30 hover:shadow-sm transition-all duration-500">
                        <div className="flex-1 min-w-0 pr-6">
                            <h3 className="font-black text-slate-700 text-sm truncate mb-2 uppercase tracking-wide">
                                {project.title || project.output_text?.substring(0, 30) || "Untitled Protocol"}
                            </h3>
                            <div className="flex items-center gap-3 text-[9px] font-black text-slate-300 uppercase tracking-widest">
                                <span className="bg-pastel-blue/10 px-3 py-1 rounded-full text-pastel-blue border border-pastel-blue/10">
                                    {project.content_kind?.replace(/_/g, " ") || "Content"}
                                </span>
                                <span className="text-slate-200">•</span>
                                <span>{new Date(project.completed_at || (project as any).form_json?._completed_at || project.updated_at || "").toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            {/* Duplicate Action */}
                            <button
                                onClick={() => router.push(`/studio?projectId=${project.id}&action=duplicate`)}
                                title={t('widget_completed_btn_duplicate')}
                                className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-2xl text-slate-300 hover:text-pastel-purple hover:border-pastel-purple shadow-sm transition-all"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                            </button>
                            {/* View Action */}
                            <button
                                onClick={() => router.push(`/studio?projectId=${project.id}`)}
                                className="px-6 py-2.5 bg-gradient-to-r from-pastel-pink to-pastel-purple text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-bubble shadow-pastel-pink/10 hover:scale-105 active:scale-95 transition-all"
                            >
                                {t('widget_completed_btn_view')}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {sorted.length > 5 && (
                <button
                    onClick={() => router.push('/projects')}
                    className="w-full text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mt-10 hover:text-pastel-purple transition-colors py-4 border-t border-slate-50/50"
                >
                    {t('dash_view_all')}
                </button>
            )}
        </section>
    );
}
