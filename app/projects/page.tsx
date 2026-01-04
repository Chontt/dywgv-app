"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";
import { useI18n } from "@/lib/i18n";
import SideNav from "../dashboard/components/SideNav";

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
                    // Inject Demo Avatar logic if needed, or keeping it simple
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

    if (loading) {
        return (
            <div className="min-h-screen grid place-items-center bg-slate-50 text-slate-400">Loading...</div>
        );
    }

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Sidebar (Assume Pro for consistency or pass false? Let's pass true for the 'amazing' feel) */}
            <SideNav userEmail={userId} activeProfile={activeProfile} isPro={true} />

            <main className="flex-1 lg:ml-64 min-h-screen bg-slate-50 p-8">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-8 flex items-end justify-between">
                        <div>
                            <h1 className="font-heading text-3xl font-bold text-slate-900">
                                {t('lib_title')}
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                {t('lib_subtitle')}
                            </p>
                        </div>
                        <button
                            onClick={() => router.push('/studio')}
                            className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all hover:-translate-y-0.5"
                        >
                            + {t('lib_btn_studio')}
                        </button>
                    </header>

                    {projects.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
                            <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-3xl mb-4">📂</div>
                            <h3 className="text-lg font-semibold text-slate-900">{t('lib_empty_title')}</h3>
                            <button
                                onClick={() => router.push("/studio")}
                                className="mt-6 rounded-full bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-300 hover:bg-slate-800 transition-transform active:scale-95"
                            >
                                {t('lib_btn_studio')}
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => openProject(p.id)}
                                    className="group relative flex flex-col items-start text-left rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                                >
                                    {(p.status === 'completed' || p.form_json?._status === 'completed') && (
                                        <div className="absolute top-4 right-4 text-green-500 font-bold text-lg">
                                            ✓
                                        </div>
                                    )}

                                    <div className="mb-4">
                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${p.mode === 'business'
                                            ? 'bg-indigo-50 text-indigo-700'
                                            : 'bg-purple-50 text-purple-700'
                                            }`}>
                                            {p.content_kind?.replace('_', ' ') || "Draft"}
                                        </span>
                                    </div>

                                    <h3 className="font-heading font-bold text-slate-800 text-lg mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                                        {p.title || "Untitled Project"}
                                    </h3>

                                    <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed mb-4">
                                        {p.output_text || "No content generated yet..."}
                                    </p>

                                    <div className="w-full pt-4 border-t border-slate-50 flex items-center justify-between mt-auto">
                                        <span className="text-xs text-slate-400 font-medium">
                                            {new Date(p.updated_at || "").toLocaleDateString()}
                                        </span>
                                        <span className="text-xs text-indigo-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                            Open &rarr;
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
