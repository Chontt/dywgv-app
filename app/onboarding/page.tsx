"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { BrainBuilderState, INITIAL_BRAIN_STATE, StrategicProfile } from "./types";
import StepIdentity from "./components/StepIdentity";
import StepPositioning from "./components/StepPositioning";
import StepAudience from "./components/StepAudience";
import StepAuthority from "./components/StepAuthority";
import StepStrategy from "./components/StepStrategy";
import StepAccuracyGap from "./components/StepAccuracyGap";
import SynthesisLoading from "./components/SynthesisLoading";
import { useI18n } from "@/lib/i18n";
// Force rebuild for missing modules

// --- Components ---
const StepIndicator = ({ current, total }: { current: number; total: number }) => (
  <div className="flex gap-2 mb-8 items-center justify-center">
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        className={`h-1.5 rounded-full transition-all duration-500 ${i <= current ? "w-8 bg-primary" : "w-4 bg-border"
          }`}
      />
    ))}
  </div>
);

export default function OnboardingPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [step, setStep] = useState(0); // 0 to 5 (6 steps)
  const [data, setData] = useState<BrainBuilderState>(INITIAL_BRAIN_STATE);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Check Auth and Existing Profile
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
          console.error("Auth Error:", error);
          router.replace("/login");
          return;
        }
        setLoading(false);
      } catch (err) {
        console.error("Unexpected Auth Error:", err);
        router.replace("/login");
      }
    };

    checkAuth();
  }, [router]);

  // Handlers
  const updateData = (key: keyof BrainBuilderState, value: any) => {
    setData((prev) => ({ ...prev, [key]: value }));
    // Clear error when user types
    if (errorMsg) setErrorMsg(null);
  };

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 0: // Identity
        if (!data.brand_name.trim()) { setErrorMsg(t('onb_err_brand')); return false; }
        if (!data.role) { setErrorMsg(t('onb_err_role')); return false; }
        if (!data.experience_level) { setErrorMsg(t('onb_err_exp')); return false; }
        return true;
      case 1: // Positioning
        if (!data.niche.trim()) { setErrorMsg(t('onb_err_niche')); return false; }
        if (!data.industry.trim()) { setErrorMsg(t('onb_err_industry')); return false; }
        if (!data.value_proposition.trim()) { setErrorMsg(t('onb_err_value_prop')); return false; }
        return true;
      case 2: // Accuracy Gap
        if (!data.accuracy_identity.trim()) { setErrorMsg(t('onb_err_accuracy_identity') || "Identity goal required"); return false; }
        if (!data.accuracy_misconception.trim()) { setErrorMsg(t('onb_err_accuracy_misconception') || "Misconception required"); return false; }
        if (!data.accuracy_one_thing.trim()) { setErrorMsg(t('onb_err_accuracy_one_thing') || "Core pillar required"); return false; }
        return true;
      case 3: // Audience
        if (!data.target_audience_demographics.trim()) { setErrorMsg(t('onb_err_audience')); return false; }
        if (!data.audience_pain.trim()) { setErrorMsg(t('onb_err_pain')); return false; }
        if (!data.audience_desire.trim()) { setErrorMsg(t('onb_err_desire')); return false; }
        return true;
      case 4: // Authority
        if (!data.voice_tone.trim()) { setErrorMsg(t('onb_err_tone')); return false; }
        if (!data.authority_source.trim()) { setErrorMsg(t('onb_err_source')); return false; }
        return true;
      case 5: // Strategy
        if (!data.main_platform) { setErrorMsg(t('onb_err_platform')); return false; }
        if (!data.monthly_goal.trim()) { setErrorMsg(t('onb_err_goal')); return false; }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((p) => Math.min(p + 1, 5));
    }
  };

  const prevStep = () => {
    setErrorMsg(null);
    setStep((p) => Math.max(p - 1, 0));
  };

  const handleFinish = async () => {
    if (!validateStep(step)) return;

    setIsSynthesizing(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      // 1. Call AI Synthesis
      console.log("Calling Synthesis API...");
      const synthesisRes = await fetch("/api/onboarding/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: data }),
      });

      if (!synthesisRes.ok) {
        const errorText = await synthesisRes.text();
        throw new Error(`Synthesis API failed: ${synthesisRes.status} ${synthesisRes.statusText} - ${errorText}`);
      }

      const profileBrain: StrategicProfile = await synthesisRes.json();
      console.log("Synthesis Complete:", profileBrain);

      // 2. Prepare DB Payload
      const payload = {
        user_id: user.id,
        brand_name: data.brand_name,
        // Robust mapping logic
        mode: (data.role === "business" || data.role === "founder") ? "business" : "creator",
        industry: data.industry,
        niche: data.niche,
        main_platform: data.main_platform,
        main_language: data.content_language,
        language: data.content_language, // Source of Truth for System

        // Synthesized text fields for existing Studio logic
        target_audience: `
PSYCHOGRAPHICS: ${profileBrain.audience.description}
CORE FEAR: ${profileBrain.audience.core_fear}
CORE DESIRE: ${profileBrain.audience.core_desire}
IDENTITY ASPIRATION: ${profileBrain.audience.identity_aspiration}
        `.trim(),

        style: `
VOICE: ${profileBrain.identity.voice_position} (${data.voice_tone})
AUTHORITY: ${profileBrain.authority.strategy}
ACCURACY PILLAR: ${profileBrain.positioning.accuracy_pillar}
EMOTIONAL GOAL: ${profileBrain.emotional_outcome.join(", ")}
        `.trim(),

        tone: data.voice_tone,
        goal: data.monthly_goal,

        // Full Strategic Brain
        strategic_profile: profileBrain,

        created_at: new Date().toISOString()
      };

      // 3. Insert into DB
      const { data: profile, error } = await supabase
        .from("brand_profiles")
        .insert(payload as any)
        .select()
        .single() as any;

      if (error) throw error;

      // 4. Set Active & Redirect
      if (profile) {
        await supabase.from("user_settings").upsert({
          user_id: user.id,
          active_profile_id: profile.id
        } as any);

        // Small delay to let the animation finish feeling "complete"
        setTimeout(() => {
          router.push(`/studio?profileId=${profile.id}`);
        }, 2000);
      }

    } catch (error: any) {
      console.error("Full Onboarding Error:", JSON.stringify(error, null, 2));
      setErrorMsg(`${t('onb_err_save')}: ${error.message || t('common_unknown_err')}.`);
      setIsSynthesizing(false);
    }
  };


  if (loading) return <div className="min-h-screen bg-background grid place-items-center text-muted">{t('common_loading')}</div>;

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Gradients - Toned down for calm/trustworthy feel */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-black bg-gradient-to-r from-foreground to-muted bg-clip-text text-transparent mb-2">
            {t('onboarding_title')}
          </h1>
          <p className="text-muted text-base">
            {isSynthesizing ? t('onboarding_subtitle_loading') : t('onboarding_subtitle_start')}
          </p>
        </header>

        {/* Hide Steps during synthesis */}
        {!isSynthesizing && <StepIndicator current={step} total={6} />}

        <div className="bg-surface/40 backdrop-blur-xl border border-border rounded-[48px] p-8 shadow-bubble min-h-[450px] flex flex-col transition-all duration-500 relative">

          {/* Error Toast inside card - Clean, no emoji */}
          {errorMsg && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-bold px-4 py-2 rounded-full z-50">
              {errorMsg}
            </div>
          )}

          {isSynthesizing ? (
            <SynthesisLoading />
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1"
                >
                  {step === 0 && <StepIdentity data={data} updateData={updateData} />}
                  {step === 1 && <StepPositioning data={data} updateData={updateData} />}
                  {step === 2 && <StepAccuracyGap data={data} updateData={updateData} />}
                  {step === 3 && <StepAudience data={data} updateData={updateData} />}
                  {step === 4 && <StepAuthority data={data} updateData={updateData} />}
                  {step === 5 && <StepStrategy data={data} updateData={updateData} />}
                </motion.div>
              </AnimatePresence>

              {/* NAV ACTIONS */}
              <div className="mt-auto pt-8 flex items-center justify-between">
                <div>
                  {step > 0 && (
                    <button onClick={prevStep} className="px-6 py-3 text-sm font-black uppercase tracking-widest text-muted hover:text-foreground transition-colors">
                      {t('onboarding_btn_back')}
                    </button>
                  )}
                </div>

                {step < 5 ? (
                  <button onClick={nextStep} className="px-10 py-4 rounded-full bg-foreground text-background dark:bg-surface dark:text-foreground font-black text-xs uppercase tracking-widest shadow-bubble transition-all hover:scale-105 active:scale-95">
                    {t('onboarding_btn_next')}
                  </button>
                ) : (
                  <button onClick={handleFinish} className="px-10 py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-black text-xs uppercase tracking-widest shadow-bubble shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                    {t('onboarding_btn_finish')}
                  </button>
                )}
              </div>
            </>
          )}

        </div>
      </div>
    </main>
  );
}
