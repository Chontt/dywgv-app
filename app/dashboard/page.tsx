"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { useI18n } from "@/lib/i18n";
import { getSubscriptionStatus } from "@/lib/subscription";

// Components
import ProfileBrainWidget from "./components/ProfileBrainWidget";
import EverydayFocusWidget from "./components/EverydayFocusWidget";
import DailyGoalsWidget, { Goal } from "./components/DailyGoalsWidget";
import StreakWidget from "./components/StreakWidget";
import ProjectsWidget from "./components/ProjectsWidget";
import UpgradeCard from "./components/UpgradeCard";

import { LayoutDashboard } from "lucide-react";

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
  const [user, setUser] = useState<User | null>(null);
  const [isPro, setIsPro] = useState(false);

  // Data State
  const [profiles, setProfiles] = useState<BrandProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [projects, setProjects] = useState<ContentProject[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    async function load() {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        router.replace("/login");
        return;
      }
      const uid = auth.user.id;
      setUser(auth.user);

      // Fetch Subscription Status
      const { isPro: proStatus } = await getSubscriptionStatus(uid);
      setIsPro(proStatus);

      // 1. Load User Settings (Active Profile)
      let initialActiveId = null;
      const { data: settings } = await supabase
        .from("user_settings")
        .select("active_profile_id")
        .eq("user_id", uid)
        .maybeSingle();

      if (settings?.active_profile_id) {
        initialActiveId = settings.active_profile_id;
      }

      // 2. Load Profiles
      const { data: pData } = await supabase
        .from("brand_profiles")
        .select("id, brand_name, mode, niche, role")
        .eq("user_id", uid)
        .order("created_at", { ascending: false });

      const loadedProfiles = (pData || []) as BrandProfile[];
      setProfiles(loadedProfiles);

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

      // 4. Load Goals
      const { data: gData } = await supabase
        .from("daily_goals")
        .select("*")
        .eq("user_id", uid)
        .order("created_at", { ascending: true }); // We might want to filter by date in production
      setGoals((gData || []) as Goal[]);

      setLoading(false);
    }
    load();
  }, [router]);

  // --- Goal Handlers ---
  async function handleToggleGoal(id: string, current: boolean) {
    const next = !current;
    setGoals(prev => prev.map(g => g.id === id ? { ...g, is_completed: next } : g));
    await supabase.from("daily_goals").update({ is_completed: next }).eq("id", id);
  }

  async function handleAddGoal(text: string) {
    if (!user) return;
    const { data, error } = await supabase.from("daily_goals").insert({
      user_id: user.id,
      goal_text: text,
      is_completed: false
    }).select().single();

    if (error) {
      console.error("Error adding goal:", error);
      alert("Failed to add goal.");
    }

    if (data) {
      setGoals(prev => [...prev, data as Goal]);
    }
  }

  async function handleDeleteGoal(id: string) {
    setGoals(prev => prev.filter(g => g.id !== id));
    await supabase.from("daily_goals").delete().eq("id", id);
  }

  // --- Streak Calculation (Mock/Simple) ---
  // In a real app, calculate from daily_goals history.
  // Here we just count completed goals for "today" as a proxy for engagement logic or fetch from DB.
  // For now, let's pretend strictly based on today's goal completion count roughly mapping to days for demo.
  const completedToday = goals.filter(g => g.is_completed).length;
  const displayStreak = completedToday > 0 ? 3 : 2; // Mock "3 day streak" if active today
  const authorityScore = 42 + (completedToday * 2); // Mock score

  const draftProjects = projects.filter(p => (p.status !== 'completed' && p.form_json?._status !== 'completed'));
  const latestDraft = draftProjects.length > 0 ? draftProjects[0] : null;

  if (loading) {
    return (
      <div className="h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-primary/20 animate-pulse" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">Loading Intel...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col p-4 lg:p-6 relative">
      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-screen h-screen bg-gradient-to-br from-background to-secondary/5 -z-10" />

      {/* 1. Header */}
      <header className="flex-none mb-6 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-black tracking-tighter text-foreground flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center text-background shadow-lg">
              <LayoutDashboard className="w-4 h-4" />
            </div>
            Quiet Influence OS
          </h1>
          <p className="text-[10px] font-black text-muted uppercase tracking-[0.3em] pl-1">
            Accuracy Over Authenticity.
          </p>
        </div>

        {/* User Context */}
        <div className="flex items-center gap-4">
          {!isPro && (
            <button onClick={() => router.push('/plans')} className="hidden sm:flex text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/10 px-3 py-1.5 rounded-full transition-colors">
              Unlock Full Access
            </button>
          )}
          <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-muted shadow-sm">
            <span className="text-xs font-black">
              {user?.email?.[0].toUpperCase()}
            </span>
          </div>
        </div>
      </header>

      {/* 2. Main Fluid Grid */}
      <main className="flex-1 pb-safe max-w-[1600px] mx-auto w-full">

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {/* Col 1: Identity & Streak */}
          <div className="flex flex-col gap-6">
            <ProfileBrainWidget
              profiles={profiles}
              activeProfileId={activeProfileId}
              onSelectProfile={setActiveProfileId}
            />

            {isPro ? (
              <StreakWidget streakDays={displayStreak} authorityScore={authorityScore} />
            ) : (
              <div className="flex flex-col gap-6">
                <StreakWidget streakDays={displayStreak} authorityScore={authorityScore} />
                <UpgradeCard />
              </div>
            )}
          </div>

          {/* Col 2: Main Focus */}
          <div className="flex flex-col min-h-[400px]">
            <EverydayFocusWidget
              activeProfileId={activeProfileId}
              hasDrafts={draftProjects.length > 0}
              latestDraftId={latestDraft?.id}
              isPro={isPro}
            />
          </div>

          {/* Col 3: Habits & Projects */}
          <div className="flex flex-col gap-6">
            <DailyGoalsWidget
              goals={goals}
              onToggle={handleToggleGoal}
              onAdd={handleAddGoal}
              onDelete={handleDeleteGoal}
            />

            <ProjectsWidget
              projects={projects}
              onStatusChange={(id, status) => {
                setProjects(prev => prev.map(p => p.id === id ? { ...p, status } : p));
              }}
            />
          </div>

        </div>

      </main>
    </div>
  );
}
