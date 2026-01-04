"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n";
import { getSubscriptionStatus } from "@/lib/subscription";
import EverydayFocusWidget from "./components/EverydayFocusWidget";
import ContinueProjectWidget from "./components/ContinueProjectWidget";
import CompletedWidget from "./components/CompletedWidget";
import SideNav from "./components/SideNav";
import StatCard from "./components/StatCard";

// Types
type BrandProfile = {
  id: string;
  brand_name?: string | null;
  mode: "business" | "creator";
  niche?: string | null;
  role?: string;
};

type ContentProject = {
  id: string;
  title?: string;
  output_text: string | null;
  content_kind: string | null;
  status?: string;
  updated_at: string;
  created_at: string;
  completed_at?: string | null;
  form_json?: any;
};

export default function DashboardPage() {
  const router = useRouter();
  const { t } = useI18n();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null); // Changed from userId to user object
  const [isPro, setIsPro] = useState(false); // Changed from plan to isPro, default to false

  // Data State
  const [profiles, setProfiles] = useState<BrandProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [projects, setProjects] = useState<ContentProject[]>([]);

  useEffect(() => {
    async function load() {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        router.replace("/login");
        return;
      }
      const uid = auth.user.id;
      setUser(auth.user); // Set the full user object

      // Fetch Subscription Status (Real Check)
      const { isPro: proStatus } = await getSubscriptionStatus(uid);
      setIsPro(proStatus);

      // 1. Load User Settings (Active Profile)
      let initialActiveId = null;
      const { data: settings } = await supabase
        .from("user_settings")
        .select("active_profile_id")
        .eq("user_id", uid)
        .maybeSingle();

      const settingsData = settings as any;
      if (settingsData?.active_profile_id) {
        initialActiveId = settingsData.active_profile_id;
      }

      // 2. Load Profiles
      const { data: pData } = await supabase
        .from("brand_profiles")
        .select("id, brand_name, mode, niche") // Include 'role' if avail
        .eq("user_id", uid)
        .order("created_at", { ascending: false });

      const loadedProfiles = (pData || []) as BrandProfile[];
      setProfiles(loadedProfiles);

      // Fallback active profile
      if (!initialActiveId && loadedProfiles.length > 0) {
        initialActiveId = loadedProfiles[0].id;
      }
      setActiveProfileId(initialActiveId);

      // 3. Load Projects
      const { data: prData } = await supabase
        .from("content_projects")
        .select("*, form_json")
        .eq("user_id", uid)
        .order("updated_at", { ascending: false })
        .limit(10);
      setProjects((prData || []) as ContentProject[]);

      setLoading(false);
    }
    load();
  }, [router]);

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400">Loading...</div>;
  }

  // --- Derived State ---
  const completedProjects = projects.filter(p => p.status === 'completed' || p.form_json?._status === 'completed');
  const draftProjects = projects.filter(p => (p.status !== 'completed' && p.form_json?._status !== 'completed'));

  const latestDraft = draftProjects.length > 0 ? draftProjects[0] : null;
  const hasDrafts = draftProjects.length > 0;

  // Stats
  const hookCount = projects.length;
  const outlineCount = projects.filter(p => p.output_text && p.output_text.length > 50).length;

  // Inject Avatar for Pro Demo
  // isPro is now managed by state from DB check
  const activeProfile = profiles.find(p => p.id === activeProfileId);
  const displayProfile = activeProfile ? {
    ...activeProfile,
    avatar_url: isPro ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" : null
  } : null;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">

      {/* Fixed Sidebar */}
      <SideNav userEmail={user?.email || ""} activeProfile={displayProfile} isPro={isPro} />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        <div className="p-8 max-w-7xl mx-auto space-y-8">

          {/* Header (Minimal) */}
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-heading font-bold text-slate-900">Dashboard</h1>
              {process.env.NODE_ENV === 'development' && (
                <p className="text-xs text-slate-400 font-medium mt-1 cursor-pointer hover:text-indigo-500 select-none" onClick={() => setIsPro(!isPro)}>
                  {/* Hidden Toggle Trigger */}
                  {t('dash_view_click_switch')} {isPro ? t('dash_view_pro') : t('dash_view_free')}
                </p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t('dash_plan_label')}</p>
                <p className={`text-sm font-bold ${isPro ? 'text-indigo-600' : 'text-slate-700'}`}>
                  {isPro ? t('dash_plan_pro') : t('dash_plan_free')}
                </p>
              </div>
              {isPro && (
                <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-indigo-200">
                  PRO
                </div>
              )}
            </div>
          </header>

          {/* Top Row: Stats + Upgrade (Grid 4) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              label={t('dash_item_hooks') || "Hooks"}
              value={hookCount}
              trend="+12%"
              trendUp={true}
            />
            <StatCard
              label={t('dash_item_outlines') || "Outlines"}
              value={outlineCount}
              trend={outlineCount > 0 ? "+5%" : "0%"}
              trendUp={true}
            />
            <StatCard
              label={t('dash_item_locked') || "Scripts"}
              value="1.5k"
              locked={!isPro}
              onClick={() => !isPro && router.push('/plans')}
            />

            {/* Conditional 4th Card: Upgrade (Free) vs Revenue (Pro) */}
            {!isPro ? (
              <div className="bg-gradient-to-br from-indigo-100 to-purple-50 rounded-3xl p-6 flex flex-col justify-center relative overflow-hidden group cursor-pointer border border-indigo-200" onClick={() => router.push('/plans')}>
                <div className="relative z-10">
                  <h3 className="font-bold text-indigo-900 mb-1 leading-tight">{t('dash_unlock_title')}</h3>
                  <p className="text-xs text-indigo-600 mb-3">{t('dash_unlock_btn')}</p>
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-lg group-hover:scale-110 transition-transform">
                    &rarr;
                  </div>
                </div>
                <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full border-4 border-indigo-200/50"></div>
                <div className="absolute -right-8 top-8 w-24 h-24 rounded-full border-4 border-purple-200/50"></div>
              </div>
            ) : (
              <StatCard
                label="Hours Saved"
                value="42h"
                trend="+12h"
                trendUp={true}
              />
            )}
          </div>

          {/* Middle Row: Today Focus */}
          <div>
            <EverydayFocusWidget activeProfileId={activeProfileId} hasDrafts={hasDrafts} latestDraftId={latestDraft?.id} isPro={isPro} />
          </div>

          {/* Bottom Row: Projects Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Drafts */}
            <div>
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="font-bold text-lg text-slate-800">{t('widget_continue_header_draft')}</h3>
                <button onClick={() => router.push('/projects')} className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors">{t('dash_view_all')} &rarr;</button>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-full">
                <ContinueProjectWidget project={latestDraft} />
                {draftProjects.length > 1 && (
                  <div className="mt-6 space-y-3 pt-6 border-t border-slate-50">
                    {draftProjects.slice(1, 4).map(p => (
                      <div key={p.id} className="flex items-center justify-between group cursor-pointer" onClick={() => router.push(`/studio?projectId=${p.id}`)}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-[10px] text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">✎</div>
                          <div>
                            <p className="text-sm font-medium text-slate-700 group-hover:text-indigo-700 transition-colors truncate max-w-[150px]">{p.title || "Untitled"}</p>
                            <p className="text-[10px] text-slate-400">{new Date(p.updated_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <span className="text-xs text-slate-300 group-hover:text-indigo-400">&rarr;</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Completed */}
            <div>
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="font-bold text-lg text-slate-800">{t('widget_completed_title')}</h3>
              </div>
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-full">
                <CompletedWidget projects={completedProjects} />
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
