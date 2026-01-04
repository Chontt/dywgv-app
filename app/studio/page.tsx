"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n";
import { Database } from "@/types/supabase";
import { getSubscriptionStatus } from "@/lib/subscription";
import { usePlan } from "@/lib/hooks/usePlan";

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

  // Gating Logic
  const { isPro: isProFromPlan, limits, usage, refreshPlan } = usePlan();
  const effectiveIsPro = isProFromPlan ?? false;

  // Form
  const [form, setForm] = useState<Record<string, string>>({});
  const [selectedParts, setSelectedParts] = useState<string[]>(["part_script", "part_caption"]);
  const [editableResult, setEditableResult] = useState("");

  // Initial Load
  useEffect(() => {
    async function init() {
      const qProfileId = searchParams.get("profileId");
      const qProjectId = searchParams.get("projectId");

      // --- NEW: Everyday Generator Params ---
      const preset = searchParams.get("preset");
      const qRole = searchParams.get("role");
      const qEmotion = searchParams.get("emotion");
      const qIntent = searchParams.get("intent");
      const qFormat = searchParams.get("format");
      const qTopic = searchParams.get("topic");
      const qHook = searchParams.get("hook_angle");
      const qLength = searchParams.get("length");

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }

      // Check Subscription
      const { isPro: proStatus } = await getSubscriptionStatus(user.id);
      setIsPro(proStatus);

      // Logic: If Project ID exists, load it. If not, load Profile (param or default).

      if (qProjectId) {
        // --- EDIT MODE ---
        setCurrentProjectId(qProjectId);
        const { data: project } = await supabase
          .from("content_projects")
          .select("*")
          .eq("id", qProjectId)
          .eq("user_id", user.id)
          .maybeSingle();

        if (project) {
          const p = project as any;
          // DUPLICATION LOGIC
          if (searchParams.get("action") === "duplicate") {
            // New Project Mode but pre-filled
            setEditableResult(p.output_text || "");
            setForm((p.form_json as Record<string, string>) || {});
            setContentKind(p.content_kind as ContentKind);

            // Set mode
            const projMode = p.mode === "creator" ? "creator" : "business";
            setMode(projMode);

            if (p.profile_id) {
              setActiveProfileId(p.profile_id);
              await loadProfile(p.profile_id);
            }
            // Do NOT set currentProjectId -> logic falls through to "New" state on Save
          } else {
            // Normal Edit Mode
            setEditableResult(p.output_text || "");
            setForm((p.form_json as Record<string, string>) || {});
            setContentKind(p.content_kind as ContentKind);

            const projMode = p.mode === "creator" ? "creator" : "business";
            setMode(projMode);

            if (p.profile_id) {
              setActiveProfileId(p.profile_id);
              await loadProfile(p.profile_id);
            }
            // @ts-ignore
            await supabase.from("content_projects").update({ last_opened_at: new Date().toISOString() } as any).eq("id", qProjectId);
          }
        }
      } else {
        // --- NEW MODE ---
        let targetProfileId = qProfileId;

        // If no param, try user settings
        if (!targetProfileId) {
          const { data: settings } = await supabase.from("user_settings").select("active_profile_id").eq("user_id", user.id).maybeSingle();
          const s = settings as any;
          if (s?.active_profile_id) targetProfileId = s.active_profile_id;
        }

        if (targetProfileId) {
          setActiveProfileId(targetProfileId);
          await loadProfile(targetProfileId);

          // PRE-FILL LOGIC for Everyday Generator
          if (preset === "everyday") {
            // 1. Set Role/Emotion/Intent -> Logic implies we pass these to API later. 
            // We can store them in form for now or separate state if needed.
            // But simpler is to put them in the "context" or specific fields if they exist.
            // Or, we just use the 'form' state since that's what we send to generate API.

            const newForm: Record<string, string> = { ...form };
            if (qTopic) newForm["topic"] = qTopic;
            if (qHook) newForm["hook"] = qHook;
            // Map Everyday params to Form fields where possible, or add hidden fields?
            // Actually, 'role', 'emotion', 'intent' are strategic context. 
            // The API accepts 'profile' object, but maybe we should inject these into 'form' 
            // even if they aren't visible inputs, OR update the visual inputs if they match.

            setForm(newForm);

            // 2. Set Content Kind/Format
            if (qFormat && qFormat.includes("video")) {
              setMode("creator");
              setContentKind("creator_video");
            } else if (qFormat && qFormat.includes("post")) {
              setMode("business"); // Simplification
              setContentKind("business_post");
            }
          }

        } else {
          // No profile -> Onboarding
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
        // Only set mode from profile if we are NOT in edit mode (or let project override profile mode? Project wins usually)
        // Actually, if we are loading project, we already set mode.
        // If in new mode, we set mode from profile.
        if (!searchParams.get("projectId")) {
          setMode(d.mode === "creator" ? "creator" : "business");
          setContentKind(d.mode === "creator" ? "creator_video" : "business_post");
        }
      }
    }

    init();
  }, [router, searchParams]);

  const handleToggleAdvanced = () => {
    if (!effectiveIsPro && !isAdvancedMode) {
      if (confirm(t('studio_pro_required_generic') || "This feature is for Authority Plan users. Upgrade now?")) {
        window.open('/plans', '_blank');
      }
      return;
    }
    setIsAdvancedMode(!isAdvancedMode);
  };

  // Actions
  async function handleGenerate() {
    setGenerating(true);

    // Auto-save logic (create draft if new) - Optional, but let's stick to explicit save for now or generate first.
    // The plan says "append".

    try {
      if (!effectiveIsPro && usage && usage.generationsToday >= (limits?.generationsPerDay || 3)) {
        if (confirm(t('studio_limit_reached') || "You've reached your daily limit for Free Plan. Upgrade to Authority for unlimited generations?")) {
          window.open('/plans', '_blank');
        }
        return;
      }

      const partKeyToText: Record<string, string> = {
        part_hook: "Hooks",
        part_outline: "Outline",
        part_story: "Story Structure",
        part_script: "Full Script",
        part_caption: "Caption & Hashtags"
      };

      let finalPartsToReq = selectedParts;
      if (!effectiveIsPro) {
        // Force basic parts for free users even if they bypass UI
        finalPartsToReq = selectedParts.filter(p => p === "part_hook" || p === "part_caption");
        if (finalPartsToReq.length === 0) finalPartsToReq = ["part_hook"];
      }

      const finalParts = finalPartsToReq.length > 0
        ? finalPartsToReq.map(k => partKeyToText[k])
        : ["Full script"];

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          contentKind,
          form,
          profile,
          length: "medium",
          parts: finalParts
        }),
      });

      if (res.status === 402) {
        if (confirm(t('studio_limit_reached') || "Limit reached. Upgrade?")) {
          window.open('/plans', '_blank');
        }
        return;
      }

      if (!res.ok) throw new Error("Generation failed");
      const data = await res.json();

      // Refresh plan usage count
      refreshPlan?.();

      // Append Logic
      setEditableResult(prev => {
        const separator = prev ? "\n\n---\n\n" : "";
        return prev + separator + data.content;
      });

    } catch (error) {
      console.error(error);
      alert(t('studio_error_msg') || "Failed to generate.");
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

    if (!effectiveIsPro && usage && usage.totalProjects >= (limits?.projectsLimit || 5) && !currentProjectId) {
      if (confirm(t('studio_project_limit') || "Project limit reached. Upgrade to Authority for unlimited projects?")) {
        window.open('/plans', '_blank');
      }
      setSaving(false);
      return;
    }

    const payload = {
      user_id: user.id,
      profile_id: activeProfileId,
      mode,
      content_kind: contentKind,
      form_json: { ...form, _status: status, _completed_at: status === 'completed' ? new Date().toISOString() : null },
      output_text: editableResult,
      title: form["topic"] || "Untitled Project",
      // status: status, -- Column might not exist
      updated_at: new Date().toISOString(),
      // ...(status === "completed" ? { completed_at: new Date().toISOString() } : {}) -- Column might not exist
    };

    if (currentProjectId) {
      // UPDATE
      // @ts-ignore
      await supabase.from("content_projects").update(payload as any).eq("id", currentProjectId);
      if (status === "completed") {
        alert(t('studio_msg_completed') || "Project Completed!");
        router.push("/dashboard"); // Return to dashboard on completion for closure
      }
    } else {
      // @ts-ignore
      // INSERT
      const { data, error } = await supabase.from("content_projects").insert(payload as any).select().single() as any;
      if (error) {
        console.error("Save Project Error:", JSON.stringify(error, null, 2));
        alert(`Failed to save project: ${error.message || "Unknown error"}. Check console.`);
      }
      if (data && !error) {
        setCurrentProjectId(data.id);
        // Update URL without reload
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set("projectId", data.id);
        newUrl.searchParams.delete("profileId"); // Clean url
        window.history.pushState({}, "", newUrl);

        if (status === "completed") {
          alert(t('studio_msg_completed') || "Project Completed!");
          router.push("/dashboard");
        } else {
          // Toast or subtle feedback for draft
          // alert("Draft saved"); 
        }
      }
    }

    setSaving(false);
  }

  if (loading) {
    return <div className="min-h-screen grid place-items-center bg-slate-50 text-slate-400">Loading Studio...</div>;
  }

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">

      {/* Sidebar */}
      <aside className="w-full md:w-[450px] bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 overflow-hidden">

        {/* Nav Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <Link href="/dashboard" className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1">
            {t('studio_back_to_hub')}
          </Link>
          <div className="text-[10px] font-bold px-2 py-1 bg-slate-100 rounded text-slate-500 uppercase">
            {mode === 'creator' ? t('studio_mode_creator') : t('studio_mode_business')}
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-8">

          {/* Header */}
          <div>
            <h1 className="font-heading text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {t('studio_title')} {effectiveIsPro ? "" : <span className="text-[10px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded ml-2 uppercase tracking-widest">Quick</span>}
            </h1>
            <p className="text-xs text-slate-500 mt-1 italic font-medium">
              {profile?.business_name ? `${t('studio_profile_for')} ${profile.business_name}` : t('studio_profile_fallback')}
            </p>
          </div>

          {/* Plan Upgrade Banner for Free Users */}
          {!effectiveIsPro && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between group">
              <div>
                <p className="text-xs font-bold text-indigo-900 leading-tight">Authority Access Required</p>
                <p className="text-[10px] text-indigo-600 mt-0.5">Upgrade for full scripts, strategy tools, and unlimited projects.</p>
              </div>
              <Link href="/plans" className="shrink-0 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-md group-hover:scale-105 transition-transform">
                Upgrade
              </Link>
            </div>
          )}

          {/* Content Archetype */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3 block">
              {t('studio_archetype_label')}
            </label>
            <div className="grid grid-cols-2 gap-3">
              {CONTENT_KINDS[mode].map((k) => (
                <button
                  key={k.id}
                  onClick={() => setContentKind(k.id as ContentKind)}
                  className={`
                       relative p-3 rounded-2xl border-2 text-left transition-all group overflow-hidden
                       ${contentKind === k.id
                      ? "border-indigo-500 bg-indigo-50/50"
                      : "border-slate-100 bg-white hover:border-indigo-200"
                    }
                    `}
                >
                  <div className="relative z-10">
                    <span className={`text-xs font-bold ${contentKind === k.id ? 'text-indigo-700' : 'text-slate-600'}`}>
                      {t(k.label)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Toggle Premium */}
          <div
            onClick={handleToggleAdvanced}
            className={`cursor-pointer rounded-xl border border-slate-200 p-3 flex items-center justify-between transition-colors ${isAdvancedMode ? 'bg-indigo-50 border-indigo-200' : 'bg-white hover:border-indigo-200'}`}
          >
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold ${isAdvancedMode ? 'text-indigo-700' : 'text-slate-700'}`}>
                {isAdvancedMode ? t('studio_mode_switch_premium') : t('studio_mode_switch_quick')}
              </span>
            </div>
            <div className={`w-8 h-4 rounded-full relative transition-colors ${isAdvancedMode ? 'bg-indigo-500' : 'bg-slate-300'}`}>
              <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${isAdvancedMode ? 'left-4.5' : 'left-0.5'}`} />
            </div>
          </div>

          {/* Form Inputs */}
          <div className="animate-fade-in space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              {t('studio_inputs_label')}
            </label>
            {FORM_CONFIGS[contentKind]
              ?.filter(f => isAdvancedMode || !f.isAdvanced)
              .map((field) => (
                <div key={field.key} className={field.isAdvanced ? "animate-slide-in-right" : ""}>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                    {t(field.label) !== field.label ? t(field.label) : field.label}
                    {field.isAdvanced && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-600 font-bold uppercase tracking-wide">Pro</span>}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      className="w-full rounded-xl border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                      rows={3}
                      placeholder={t(field.placeholder) !== field.placeholder ? t(field.placeholder) : field.placeholder}
                      value={form[field.key] || ""}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    />
                  ) : (
                    <input
                      type="text"
                      className="w-full rounded-xl border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                      placeholder={t(field.placeholder) !== field.placeholder ? t(field.placeholder) : field.placeholder}
                      value={form[field.key] || ""}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    />
                  )}
                </div>
              ))}
          </div>

          {/* Parts Selector */}
          <div className="pt-4 border-t border-slate-100">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3 block">
              {t('studio_output_parts_label')}
            </label>
            <div className="flex flex-wrap gap-2">
              {["part_hook", "part_outline", "part_script", "part_caption", "part_story"].map((partKey) => {
                const isSelected = selectedParts.includes(partKey);
                return (
                  <button
                    key={partKey}
                    onClick={() => isSelected ? setSelectedParts(selectedParts.filter(p => p !== partKey)) : setSelectedParts([...selectedParts, partKey])}
                    className={`text-xs font-semibold py-1.5 px-3 rounded-lg border transition-all ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
                  >
                    {t(partKey)}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Generate Btn */}
        <div className="p-4 border-t border-slate-100 bg-white sticky bottom-0 z-10">
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full rounded-xl bg-slate-900 py-3 text-sm font-bold text-white shadow-xl shadow-indigo-500/20 hover:bg-slate-800 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {generating ? t('studio_generating') : t('studio_btn_generate')}
          </button>
        </div>

      </aside>

      {/* Main Editor */}
      <section className="flex-1 bg-slate-100/50 p-4 md:p-8 flex flex-col h-screen overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${saving ? 'bg-indigo-500 animate-pulse' : 'bg-emerald-500'}`}></div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {saving ? t('studio_saving') : t('studio_ready')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSave("draft")}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all"
            >
              {saving ? t('studio_saving') : t('studio_btn_save_draft')}
            </button>
            <button
              onClick={() => handleSave("completed")}
              className="px-6 py-2 bg-indigo-600 border border-indigo-600 rounded-xl text-xs font-bold text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all flex items-center gap-2"
            >
              <span>✓</span> {t('studio_btn_mark_completed')}
            </button>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col relative">
          <textarea
            className="flex-1 w-full bg-transparent p-8 text-base md:text-lg leading-relaxed text-slate-700 focus:outline-none resize-none placeholder:text-slate-300 font-medium font-mono"
            placeholder={t('studio_output_placeholder')}
            value={editableResult}
            onChange={(e) => setEditableResult(e.target.value)}
          />
          {generating && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl animate-spin mx-auto mb-4 shadow-lg shadow-indigo-300"></div>
                <p className="font-bold text-slate-800 animate-pulse">{t('studio_thinking_text')}</p>
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
