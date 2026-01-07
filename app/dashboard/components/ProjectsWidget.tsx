"use client";

import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { FolderOpen, Edit2, CheckCircle, Circle } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Project = {
    id: string;
    title?: string;
    status?: string | null;
    content_kind?: string | null;
    updated_at: string;
    form_json?: any;
};

type ProjectsWidgetProps = {
    projects: Project[];
    onStatusChange?: (id: string, newStatus: 'draft' | 'completed') => void;
};

export default function ProjectsWidget({ projects, onStatusChange }: ProjectsWidgetProps) {
    const router = useRouter();
    const { t } = useI18n();
    const [localProjects, setLocalProjects] = useState(projects);

    const toggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'completed' ? 'draft' : 'completed';

        // Optimistic update
        setLocalProjects(prev => prev.map(p =>
            p.id === id ? { ...p, status: newStatus } : p
        ));

        // DB Update
        await supabase.from('content_projects').update({ status: newStatus }).eq('id', id);

        if (onStatusChange) onStatusChange(id, newStatus);
    };

    if (projects.length === 0) {
        return (
            <section className="bg-white/40 backdrop-blur-xl rounded-[32px] p-6 border border-white shadow-sm flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
                    <FolderOpen className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-slate-400">{t('projects_empty')}</p>
                <button
                    onClick={() => router.push("/studio")}
                    className="text-[10px] font-black uppercase tracking-widest text-pastel-purple hover:underline"
                >
                    {t('projects_start')} &rarr;
                </button>
            </section>
        );
    }

    return (
        <section className="bg-white/40 backdrop-blur-xl rounded-[32px] p-6 border border-white shadow-sm h-full overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] flex items-center gap-2">
                    <FolderOpen className="w-4 h-4" /> {t('projects_recent')}
                </h2>
                <button
                    onClick={() => router.push('/projects')}
                    className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-pastel-blue transition-colors"
                >
                    {t('projects_view_all')}
                </button>
            </div>

            <div className="space-y-3 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200">
                {localProjects.slice(0, 4).map((project) => { // Show max 4
                    const isCompleted = project.status === 'completed' || project.form_json?._status === 'completed';
                    const title = project.title || t('projects_untitled');
                    const kind = project.content_kind?.replace(/_/g, " ") || t('projects_draft');

                    return (
                        <div key={project.id} className="group flex items-center gap-3 p-3 rounded-[20px] bg-white/60 border border-transparent hover:border-slate-100 hover:shadow-sm transition-all">
                            <button
                                onClick={() => toggleStatus(project.id, isCompleted ? 'completed' : 'draft')}
                                className={`shrink-0 transition-colors ${isCompleted ? 'text-secondary' : 'text-muted/40 hover:text-secondary'}`}
                            >
                                {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                            </button>

                            <div className="flex-1 min-w-0">
                                <h3
                                    className={`text-xs font-bold truncate leading-tight mb-0.5 ${isCompleted ? 'text-muted' : 'text-foreground'}`}
                                    title={title}
                                >
                                    {title}
                                </h3>
                                <p className="text-[9px] font-black uppercase tracking-wider text-muted opacity-50">
                                    {kind}
                                </p>
                            </div>

                            <button
                                onClick={() => router.push(`/studio?projectId=${project.id}`)}
                                className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 opacity-0 group-hover:opacity-100 hover:bg-pastel-purple/10 hover:text-pastel-purple transition-all"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
