"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";
import { useI18n } from "@/lib/i18n";
import SideNav from "../dashboard/components/SideNav";
import { Plus, Trash2 } from "lucide-react";

type ContentProject = Database["public"]["Tables"]["content_projects"]["Row"] & { form_json?: any };

// Reuse simplified profile type for SideNav
type BrandProfile = {
    id: string;
    brand_name?: string | null;
    mode: "business" | "creator";
    niche?: string | null;
    role?: string;
    avatar_url?: string | null;
};

export default function ProjectsPage() {
    const { t } = useI18n();
    const router = useRouter();
    const [projects, setProjects] = useState<ContentProject[]>([]);
    const [loading, setLoading] = useState(true);

    // Auth & Sidebar Data
    const [userId, setUserId] = useState<string | null>(null);
    const [activeProfile, setActiveProfile] = useState<BrandProfile | null>(null);
    const [isPro, setIsPro] = useState(false);

    useEffect(() => {
        async function load() {
            const { data: auth } = await supabase.auth.getUser();
            if (!auth.user) {
                router.replace("/login");
                return;
            }
            setUserId(auth.user.id);

            // 1. Load Projects
            const { data, error } = await supabase
                .from("content_projects")
                .select("*, form_json")
                .eq("user_id", auth.user.id)
                .order("created_at", { ascending: false });

            if (!error) {
                setProjects((data ?? []) as ContentProject[]);
            }

            // 2. Load Active Profile (for Sidebar)
            const { data: settings } = await supabase
                .from("user_settings")
                .select("active_profile_id")
                .eq("user_id", auth.user.id)
                .maybeSingle();

            if ((settings as any)?.active_profile_id) {
                const { data: profile } = await supabase
                    .from("brand_profiles")
                    .select("id, brand_name, mode, niche") // Minimal data needed
                    .eq("id", (settings as any).active_profile_id)
                    .maybeSingle();

                if (profile) {
                    setActiveProfile(profile as BrandProfile);
                }
            }

            setLoading(false);
        }
        load();
    }, [router]);

    function openProject(projectId: string) {
        router.push("/studio?projectId=" + projectId);
    }

    async function handleDelete(e: React.MouseEvent, projectId: string) {
        e.stopPropagation();
        if (!confirm(t('confirm_delete_project') || "Are you sure you want to delete this project?")) return;

        const { error } = await supabase.from("content_projects").delete().eq("id", projectId);
        if (!error) {
            setProjects(prev => prev.filter(p => p.id !== projectId));
        } else {
            alert("Failed to delete project");
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-6 transition-colors duration-500">
                <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary animate-spin shadow-bubble opacity-20" />
                    <div className="absolute inset-0 bg-surface blur-2xl animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-background font-sans text-foreground selection:bg-primary/30 transition-colors duration-500">
            <SideNav userEmail={userId} activeProfile={activeProfile} isPro={true} />

            <main className="flex-1 lg:ml-72 min-h-screen p-8 lg:p-20 flex flex-col items-center relative overflow-hidden">
                {/* Decorative Blobs - Made Dark Mode Compatible */}
                <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full -mr-96 -mt-96 pointer-events-none z-0" />
                <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 blur-[100px] rounded-full -ml-80 -mb-80 pointer-events-none z-0" />

                <div className="max-w-6xl w-full space-y-12 relative z-10 pb-40">
                    <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border pb-12">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-[11px] font-black uppercase tracking-[0.3em] text-primary">
                                📂 {t('nav_projects')}
                            </div>
                            <h1 className="text-6xl lg:text-7xl font-black tracking-tighter text-foreground">
                                {t('lib_title')}
                            </h1>
                            <p className="text-xs font-black text-muted uppercase tracking-[0.4em] leading-relaxed max-w-xl">
                                {t('lib_subtitle')}
                            </p>
                        </div>
                        <button
                            onClick={() => router.push('/studio')}
                            className="group relative px-10 py-5 bg-gradient-to-r from-primary to-secondary text-white rounded-[28px] text-xs font-black uppercase tracking-[0.3em] shadow-bubble shadow-primary/20 hover:scale-[1.05] active:scale-95 transition-all flex items-center gap-4"
                        >
                            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> {t('lib_btn_studio')}
                        </button>
                    </header>

                    {projects.length === 0 ? (
                        <div className="bg-surface/40 backdrop-blur-xl rounded-[48px] border border-border p-20 text-center shadow-bubble flex flex-col items-center">
                            <div className="w-24 h-24 mb-8 rounded-[32px] bg-gradient-to-br from-background to-surface border border-border shadow-inner flex items-center justify-center text-4xl grayscale opacity-50">
                                📂
                            </div>
                            <h3 className="text-xl font-black text-foreground tracking-tight mb-2">{t('lib_empty_title')}</h3>
                            <p className="text-muted font-bold text-sm mb-8 max-w-md mx-auto">{t('lib_empty_desc')}</p>
                            <button
                                onClick={() => router.push("/studio")}
                                className="px-8 py-4 bg-surface border border-border rounded-full text-[11px] font-black uppercase tracking-[0.3em] text-foreground hover:bg-background transition-colors shadow-sm"
                            >
                                {t('lib_btn_studio')}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-16">
                            {/* Drafts Section */}
                            <section>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="h-px bg-slate-200 flex-1" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Active Drafts</span>
                                    <div className="h-px bg-slate-200 flex-1" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {projects.filter(p => !(p.status === 'completed' || p.form_json?._status === 'completed')).map((p) => (
                                        <div
                                            key={p.id}
                                            onClick={() => openProject(p.id)}
                                            role="button"
                                            tabIndex={0}
                                            onKeyDown={(e) => e.key === 'Enter' && openProject(p.id)}
                                            className="cursor-pointer group relative flex flex-col items-start text-left bg-white/60 backdrop-blur-md rounded-[48px] border border-white p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-500 overflow-hidden"
                                        >
                                            <div className="mb-6">
                                                <span className={`px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.2em] border shadow-sm ${p.mode === 'business'
                                                    ? 'bg-pastel-blue/10 text-pastel-blue border-pastel-blue/20'
                                                    : 'bg-pastel-purple/10 text-pastel-purple border-pastel-purple/20'
                                                    }`}>
                                                    {p.content_kind?.replace('_', ' ') || "Draft"}
                                                </span>
                                            </div>

                                            <h3 className="font-heading font-black text-slate-800 text-2xl mb-4 line-clamp-2 leading-tight group-hover:text-pastel-purple transition-colors duration-300">
                                                {p.title || "Untitled Project"}
                                            </h3>

                                            <p className="text-sm font-bold text-slate-400 line-clamp-3 leading-relaxed mb-8">
                                                {p.output_text || "No content generated yet..."}
                                            </p>

                                            <div className="w-full pt-6 border-t border-slate-100/50 flex items-center justify-between mt-auto">
                                                <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">
                                                    {new Date(p.updated_at || "").toLocaleDateString()}
                                                </span>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={(e) => handleDelete(e, p.id)}
                                                        className="p-2 -mr-2 text-slate-300 hover:text-red-400 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Completed Section */}
                            {projects.some(p => p.status === 'completed' || p.form_json?._status === 'completed') && (
                                <section>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="h-px bg-slate-200 flex-1" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-pastel-green">Completed Intel</span>
                                        <div className="h-px bg-slate-200 flex-1" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {projects.filter(p => p.status === 'completed' || p.form_json?._status === 'completed').map((p) => (
                                            <div
                                                key={p.id}
                                                className="group relative flex flex-col items-start text-left bg-slate-50/50 rounded-[48px] border border-slate-100 p-8 opacity-80 hover:opacity-100 transition-opacity"
                                            >
                                                <div className="absolute top-8 right-8 w-8 h-8 rounded-full bg-pastel-green text-white flex items-center justify-center shadow-sm">
                                                    ✓
                                                </div>

                                                <h3 className="font-heading font-black text-slate-400 text-xl mb-2 line-clamp-1">
                                                    {p.title || "Untitled Project"}
                                                </h3>
                                                <p className="text-xs font-bold text-slate-300 mb-6">Published on {new Date(p.updated_at).toLocaleDateString()}</p>

                                                <div className="mt-auto flex gap-4 w-full">
                                                    <button
                                                        onClick={() => openProject(p.id)}
                                                        className="flex-1 py-3 rounded-xl border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white hover:text-pastel-purple hover:border-pastel-purple/30 transition-all"
                                                    >
                                                        View / Edit
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
