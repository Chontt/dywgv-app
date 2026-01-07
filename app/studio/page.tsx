"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n";
import { Database } from "@/types/supabase";
import { getSubscriptionStatus } from "@/lib/subscription";
import { usePlan } from "@/lib/hooks/usePlan";
import { Shield, ChevronLeft, PenTool, Zap, Check, Lock, Sparkles } from "lucide-react";

// --- Types & Config ---
type ContentKind =
  | "business_post"
  | "business_video"
  | "creator_post"
  | "creator_video";

const CONTENT_KINDS = {
  business: [
    { id: "business_post", label: "kind_business_post" },
    { id: "business_video", label: "kind_business_video" },
  ],
  creator: [
    { id: "creator_post", label: "kind_creator_post" },
    { id: "creator_video", label: "kind_creator_video" },
  ],
};

const FORM_CONFIGS: Record<string, { key: string; label: string; placeholder: string; type?: "textarea"; isAdvanced?: boolean }[]> = {
  business_post: [
    { key: "topic", label: "sf_topic_label", placeholder: "sf_topic_placeholder" },
    { key: "target_audience", label: "sf_target_label", placeholder: "sf_target_placeholder" },
    { key: "goal", label: "sf_goal_label", placeholder: "sf_goal_placeholder" },
    { key: "identity", label: "sf_identity_label", placeholder: "sf_identity_placeholder", isAdvanced: true },
    { key: "perception_goal", label: "sf_perception_label", placeholder: "sf_perception_placeholder", isAdvanced: true },
    { key: "authority_angle", label: "sf_authority_label", placeholder: "sf_authority_placeholder", isAdvanced: true },
    { key: "details", label: "sf_details_label", placeholder: "sf_details_placeholder", type: "textarea" },
    { key: "conversion_path", label: "sf_conversion_label", placeholder: "sf_conversion_placeholder", isAdvanced: true },
  ],
  business_video: [
    { key: "topic", label: "sf_video_topic_label", placeholder: "sf_video_topic_placeholder" },
    { key: "goal", label: "sf_goal_label", placeholder: "sf_goal_placeholder" },
    { key: "hook", label: "sf_hook_label", placeholder: "sf_hook_placeholder" },
    { key: "visual_proof_asset", label: "sf_visual_proof_label", placeholder: "sf_visual_proof_placeholder", isAdvanced: true },
    { key: "cta_path", label: "sf_cta_path_label", placeholder: "sf_cta_path_placeholder", isAdvanced: true },
    { key: "distribution_notes", label: "sf_distribution_label", placeholder: "sf_distribution_placeholder", isAdvanced: true },
  ],
  creator_post: [
    { key: "topic", label: "sf_caption_topic_label", placeholder: "sf_caption_topic_placeholder" },
    { key: "mood", label: "sf_mood_label", placeholder: "sf_mood_placeholder" },
    { key: "context", label: "sf_context_label", placeholder: "sf_context_placeholder", type: "textarea" },
    { key: "identity", label: "sf_identity_label", placeholder: "sf_identity_placeholder", isAdvanced: true },
    { key: "series_name", label: "sf_series_label", placeholder: "sf_series_placeholder", isAdvanced: true },
    { key: "follow_reason", label: "sf_follow_label", placeholder: "sf_follow_placeholder", isAdvanced: true },
    { key: "share_reason", label: "sf_share_label", placeholder: "sf_share_placeholder", isAdvanced: true },
  ],
  creator_video: [
    { key: "topic", label: "sf_video_topic_label", placeholder: "sf_video_topic_placeholder" },
    { key: "hook", label: "sf_hook_label", placeholder: "sf_hook_placeholder" },
    { key: "outline", label: "sf_outline_label", placeholder: "sf_outline_placeholder", type: "textarea" },
    { key: "status_play", label: "sf_status_label", placeholder: "sf_status_placeholder", isAdvanced: true },
    { key: "distribution_notes", label: "sf_distribution_label", placeholder: "sf_distribution_placeholder", isAdvanced: true },
  ],
};

function StudioContent() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();

  // IDs
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);

  // Data State
  const [profile, setProfile] = useState<any>(null);
  const [isPro, setIsPro] = useState(false);

  // UI State
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<"creator" | "business">("creator");
  const [contentKind, setContentKind] = useState<ContentKind>("creator_video");
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);

  // Form
  const [form, setForm] = useState<Record<string, string>>({});
  const [selectedParts, setSelectedParts] = useState<string[]>(["part_hook", "part_outline"]);
  const [editableResult, setEditableResult] = useState("");

  // Initial Load
  useEffect(() => {
    async function init() {
      const qProfileId = searchParams.get("profileId");
      const qProjectId = searchParams.get("projectId");

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }

      // Check Subscription
      const { isPro: proStatus } = await getSubscriptionStatus(user.id);
      setIsPro(proStatus);

      if (qProjectId) {
        setCurrentProjectId(qProjectId);
        const { data: project } = await supabase
          .from("content_projects")
          .select("*")
          .eq("id", qProjectId)
          .maybeSingle();

        if (project) {
          const p = project as any;
          setEditableResult(p.output_text || "");
          setForm((p.form_json as Record<string, string>) || {});
          setContentKind(p.content_kind as ContentKind);
          setMode(p.mode === "creator" ? "creator" : "business");
          if (p.profile_id) {
            setActiveProfileId(p.profile_id);
            await loadProfile(p.profile_id);
          }
        }
      } else {
        let targetProfileId = qProfileId;
        if (!targetProfileId) {
          const { data: settings } = await supabase.from("user_settings").select("active_profile_id").eq("user_id", user.id).maybeSingle();
          if ((settings as any)?.active_profile_id) targetProfileId = (settings as any).active_profile_id;
        }

        if (targetProfileId) {
          setActiveProfileId(targetProfileId);
          await loadProfile(targetProfileId);

          // Handle Presets (e.g., from Everyday Focus)
          if (searchParams.get("preset") === "everyday") {
            const topic = searchParams.get("topic") || "";
            const role = searchParams.get("role") || "";
            const intent = searchParams.get("intent") || "";
            const emotion = searchParams.get("emotion") || "";
            const antiGoal = searchParams.get("anti_goal") || "";
            const kind = searchParams.get("kind") as ContentKind;
            const parts = searchParams.get("parts")?.split(",") || [];

            if (kind) setContentKind(kind);

            setForm(prev => ({
              ...prev,
              topic,
              everyday_role: role,
              goal: intent,
              perception_goal: emotion,
              _anti_goal: antiGoal
            }));

            if (parts.length > 0) {
              setSelectedParts(parts.filter(p => !p.startsWith('part_')).map(p => `part_${p}`));
            }
          }
        } else {
          router.replace("/onboarding");
          return;
        }
      }
      setLoading(false);
    }

    async function loadProfile(pid: string) {
      const { data } = await supabase.from("brand_profiles").select("*").eq("id", pid).maybeSingle();
      if (data) {
        const d = data as any;
        setProfile(d);
        if (!searchParams.get("projectId")) {
          setMode(d.mode === "creator" ? "creator" : "business");
          setContentKind(d.mode === "creator" ? "creator_video" : "business_post");
        }
      }
    }

    init();
  }, [router, searchParams]);

  // Actions
  async function handleGenerate() {
    if (selectedParts.length === 0) {
      alert("Select at least one content part.");
      return;
    }
    setGenerating(true);

    try {
      const partKeyToText: Record<string, string> = {
        part_hook: "HOOK",
        part_outline: "OUTLINE",
        part_script: "FULL SCRIPT",
        part_caption: "CAPTION",
        part_hashtags: "HASHTAGS"
      };

      const finalParts = selectedParts.map(k => partKeyToText[k]);

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          contentKind,
          form,
          profile,
          length: form.length || "medium",
          authorityLevel: form.authority_level || "Expert",
          parts: finalParts
        }),
      });

      if (!res.ok) {
        if (res.status === 402) {
          alert("Daily limit reached. Upgrade to Revenue System plan.");
          router.push('/plans');
          return;
        }
        throw new Error("Generation failed");
      }

      const data = await res.json();
      setEditableResult(prev => {
        const separator = prev ? "\n\n" : "";
        return prev + separator + data.content;
      });

    } catch (error) {
      console.error(error);
      alert("System sync error. Try again.");
    } finally {
      setGenerating(false);
    }
  }

  async function handleSave(status: "draft" | "completed" = "draft") {
    if (!editableResult) return;
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !activeProfileId) {
      setSaving(false);
      return;
    }

    const payload = {
      user_id: user.id,
      profile_id: activeProfileId,
      mode,
      content_kind: contentKind,
      form_json: { ...form, _status: status },
      output_text: editableResult,
      title: form["topic"] || "Untitled Intel",
      updated_at: new Date().toISOString(),
    };

    if (currentProjectId) {
      await supabase.from("content_projects").update(payload as any).eq("id", currentProjectId);
      if (status === "completed") router.push("/dashboard");
    } else {
      const { data, error } = await supabase.from("content_projects").insert(payload as any).select().single() as any;
      if (data && !error) {
        setCurrentProjectId(data.id);
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set("projectId", data.id);
        window.history.pushState({}, "", newUrl);
        if (status === "completed") router.push("/dashboard");
      }
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <img src="/logo.png" alt="DYWGV" className="w-20 h-20 opacity-20 animate-pulse transition-transform duration-1000 scale-110" />
          <div className="absolute inset-0 bg-primary/20 blur-2xl animate-pulse rounded-full" />
        </div>
        <div className="space-y-2 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted">Synchronizing Creative Space</p>
          <div className="h-0.5 w-24 bg-border mx-auto rounded-full overflow-hidden">
            <div className="h-full bg-primary w-1/2 animate-[shimmer_2s_infinite]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background flex flex-col lg:flex-row text-foreground selection:bg-primary/30 transition-colors duration-700">

      {/* Sidebar - Control Panel */}
      <aside className="w-full lg:w-[480px] bg-surface/40 backdrop-blur-2xl border-r border-border flex flex-col h-auto lg:h-screen lg:sticky lg:top-0 overflow-y-auto lg:overflow-hidden z-40 shrink-0">

        <div className="p-8 border-b border-border flex items-center justify-between">
          <Link href="/dashboard" className="group flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-muted hover:text-primary transition-colors">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Command Center
          </Link>
          <div className="px-5 py-2 bg-secondary/10 rounded-full border border-secondary/20 text-[11px] font-black uppercase tracking-[0.4em] text-secondary">
            {mode === 'creator' ? 'Creator Suite' : 'Strategic Engine'}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 lg:p-10 space-y-12 custom-scrollbar lg:max-h-[calc(100vh-140px)]">

          <header className="space-y-4">
            <div className="w-12 h-1 bg-gradient-to-r from-primary to-secondary rounded-full" />
            <h1 className="text-5xl font-black tracking-tighter text-foreground">Creative <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Studio</span></h1>
            <p className="text-[11px] font-black text-muted uppercase tracking-[0.4em]">Active Identity: <span className="text-secondary">{profile?.brand_name || "Primary"}</span></p>
          </header>

          {/* Archetype Grid */}
          <section className="space-y-6">
            <label className="text-[11px] font-black uppercase tracking-[0.5em] text-muted">Structural Archetype</label>
            <div className="grid grid-cols-2 gap-5">
              {CONTENT_KINDS[mode].map((k) => (
                <button
                  key={k.id}
                  onClick={() => setContentKind(k.id as ContentKind)}
                  className={`p-6 rounded-[32px] border transition-all text-left space-y-4 relative overflow-hidden group
                    ${contentKind === k.id ? 'border-transparent bg-gradient-to-br from-primary to-secondary text-white shadow-bubble shadow-primary/20' : 'border-border bg-surface hover:border-primary/30 text-muted'}
                  `}
                >
                  <PenTool className={`w-6 h-6 relative z-10 ${contentKind === k.id ? 'text-white' : 'text-primary'}`} />
                  <p className="text-xs font-black uppercase tracking-widest leading-tight relative z-10">{t(k.label)}</p>
                </button>
              ))}
            </div>
          </section>

          {/* Strategic Calibration */}
          <section className="space-y-6">
            <label className="text-[11px] font-black uppercase tracking-[0.5em] text-muted">Strategic Calibration</label>

            {/* Authority Level */}
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted">
                <span>Authority Level</span>
                <span className="text-primary">{form.authority_level || "Balanced"}</span>
              </div>
              <input
                type="range"
                min="1" max="3" step="1"
                value={form.authority_level === "Elite" ? 3 : form.authority_level === "Expert" ? 2 : 1}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  const label = val === 3 ? "Elite" : val === 2 ? "Expert" : "Relatable";
                  setForm({ ...form, authority_level: label });
                }}
                className="w-full h-2 bg-background dark:bg-white/5 rounded-full appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[9px] font-bold text-muted/50 uppercase">
                <span>Relatable</span>
                <span>Expert</span>
                <span>Elite</span>
              </div>
            </div>

            {/* Content Length */}
            <div className="grid grid-cols-3 gap-2">
              {['Short', 'Medium', 'Long'].map((l) => (
                <button
                  key={l}
                  onClick={() => setForm({ ...form, length: l.toLowerCase() })}
                  className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all ${(form.length || 'medium') === l.toLowerCase()
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-surface text-muted border-border hover:border-primary/30'
                    }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </section>

          {/* Form Stack */}
          <section className="space-y-10">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-black uppercase tracking-[0.5em] text-muted">Creative Context</label>
              <button
                onClick={() => setIsAdvancedMode(!isAdvancedMode)}
                className={`text-xs font-black uppercase tracking-[0.2em] px-5 py-2 rounded-full border transition-all ${isAdvancedMode ? 'bg-primary text-white border-transparent shadow-sm' : 'bg-surface text-muted border-border hover:bg-surface/80 hover:border-primary/50'}`}
              >
                {isAdvancedMode ? 'Deep Context Active' : 'Basic Input'}
              </button>
            </div>

            <div className="space-y-8">
              {FORM_CONFIGS[contentKind]?.filter(f => isAdvancedMode || !f.isAdvanced).map((field) => (
                <div key={field.key} className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[11px] font-black uppercase tracking-[0.3em] text-muted">{t(field.label)}</label>
                    {field.isAdvanced && <Zap className="w-3.5 h-3.5 text-primary animate-pulse" />}
                  </div>
                  {field.type === "textarea" ? (
                    <textarea
                      className="w-full bg-surface dark:bg-white/5 border border-border rounded-[24px] p-6 text-base font-bold text-foreground placeholder:text-muted/50 focus:bg-surface focus:border-primary/50 focus:ring-8 focus:ring-primary/5 transition-all outline-none resize-none shadow-sm"
                      rows={4}
                      placeholder={t(field.placeholder)}
                      value={form[field.key] || ""}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    />
                  ) : (
                    <input
                      type="text"
                      className="w-full bg-surface dark:bg-white/5 border border-border rounded-[20px] px-6 py-5 text-base font-bold text-foreground placeholder:text-muted/50 focus:bg-surface focus:border-primary/50 focus:ring-8 focus:ring-primary/5 transition-all outline-none shadow-sm"
                      placeholder={t(field.placeholder)}
                      value={form[field.key] || ""}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    />
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Part Selection */}
          <section className="space-y-6 pt-12 border-t border-border">
            <label className="text-[11px] font-black uppercase tracking-[0.5em] text-muted">Output Focus</label>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: "part_hook", label: "Hooks", color: "primary" },
                { id: "part_outline", label: "Outlines", color: "secondary" },
                { id: "part_script", label: "Scripts", pro: true, color: "primary" },
                { id: "part_caption", label: "Intel", color: "secondary" }
              ].map((part) => {
                const isSelected = selectedParts.includes(part.id);
                const locked = part.pro && !isPro;
                return (
                  <button
                    key={part.id}
                    disabled={locked}
                    onClick={() => isSelected ? setSelectedParts(selectedParts.filter(p => p !== part.id)) : setSelectedParts([...selectedParts, part.id])}
                    className={`group flex items-center gap-3 p-5 rounded-[24px] border transition-all text-left relative overflow-hidden
                          ${isSelected ? 'bg-surface border-border text-foreground shadow-sm' : 'bg-background border-transparent text-muted'}
                          ${locked ? 'opacity-30 cursor-not-allowed grayscale' : 'hover:bg-surface hover:border-border'}
                        `}
                  >
                    <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${isSelected ? 'bg-gradient-to-br from-primary to-secondary border-transparent' : 'bg-surface border-border'}`}>
                      {isSelected && <Check className="w-4 h-4 text-white" strokeWidth={4} />}
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">{part.label}</span>
                    {locked && <Lock className="w-3.5 h-3.5 absolute right-5 top-1/2 -translate-y-1/2" />}
                  </button>
                );
              })}
            </div>
          </section>

        </div>

        {/* Action Footer */}
        <div className="p-8 border-t border-border bg-surface/60 backdrop-blur-xl">
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full bg-gradient-to-r from-primary to-secondary text-white py-6 rounded-[28px] text-xs font-black uppercase tracking-[0.4em] shadow-bubble shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-50 group"
          >
            {generating ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />}
            {generating ? 'Transmuting Logic' : 'Establish Alignment'}
          </button>
        </div>

      </aside>

      {/* Main Execution Area (Editor) */}
      <section className="flex-1 min-h-[500px] lg:min-h-screen p-4 lg:p-16 flex flex-col gap-10">

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-3.5 h-3.5 rounded-full ${saving ? 'bg-accent animate-pulse shadow-bubble shadow-accent/40' : 'bg-secondary shadow-bubble shadow-secondary/20'}`}></div>
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-muted">{saving ? 'Syncing to Archive...' : 'Workspace Synchronized'}</p>
          </div>
          <div className="flex items-center gap-5">
            <button
              onClick={() => handleSave("draft")}
              className="px-10 py-4 bg-surface border border-border rounded-full text-[11px] font-black uppercase tracking-[0.3em] text-muted hover:text-primary hover:border-primary/30 transition-all shadow-sm"
            >
              {saving ? 'Syncing...' : 'Save Draft'}
            </button>
            <button
              onClick={() => handleSave("completed")}
              className="px-12 py-4 bg-foreground text-background dark:bg-surface dark:text-foreground rounded-full text-[11px] font-black uppercase tracking-[0.3em] hover:opacity-90 active:scale-95 transition-all shadow-bubble flex items-center gap-3 border border-transparent"
            >
              <Check className="w-4 h-4" strokeWidth={3} /> Mark as Done
            </button>
          </div>
        </div>

        <div className="flex-1 bg-surface border border-border rounded-[64px] shadow-bubble flex flex-col overflow-hidden relative group transition-all duration-700 hover:border-primary/20">
          {/* Soft Accents in Editor */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 blur-[100px] pointer-events-none" />

          <textarea
            className="flex-1 w-full bg-transparent p-6 lg:p-24 text-base lg:text-lg font-medium leading-[2.2] text-foreground dark:text-gray-100 focus:outline-none resize-none placeholder:text-muted/50 tracking-tight transition-all"
            placeholder="Awaiting your creative transmission..."
            value={editableResult}
            onChange={(e) => setEditableResult(e.target.value)}
          />

          {generating && (
            <div className="absolute inset-0 bg-surface/80 backdrop-blur-2xl flex flex-col items-center justify-center z-50 space-y-10">
              <div className="relative">
                <div className="w-40 h-40 rounded-full border-2 border-primary/10 animate-ping" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <img src="/logo.png" className="w-24 h-24 animate-float drop-shadow-2xl" alt="Generating" />
                </div>
              </div>
              <div className="text-center space-y-3">
                <p className="text-[14px] font-black uppercase tracking-[1em] text-primary animate-pulse ml-[1em]">Establishing Authority</p>
                <p className="text-[10px] font-black text-muted uppercase tracking-[0.5em]">Creative Intelligence Engine Active</p>
              </div>
            </div>
          )}
        </div>

      </section>
    </main>
  );
}

export default function StudioPage() {
  return (
    <Suspense fallback={<div className="h-screen w-screen grid place-items-center">Loading...</div>}>
      <StudioContent />
    </Suspense>
  );
}
