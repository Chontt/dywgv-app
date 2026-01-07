"use client";

import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { useState, useEffect } from "react";
import { Skeleton, SkeletonText } from "./Skeleton";
import { Target, AlertTriangle, Play, FileEdit, Shield, Sparkles } from "lucide-react";
import { getDailyGuidance } from "@/app/dashboard/actions/core";

type EverydayFocusWidgetProps = {
    activeProfileId: string | null;
    hasDrafts: boolean;
    latestDraftId?: string | null;
    isPro?: boolean;
    onPlanWeek?: () => void;
};

type StrategyData = {
    role: string;
    focus_action: string;
    reason: string;
    anti_goal?: string;
    emotion?: string;
    ten_minute_plan?: {
        step_1: string;
        step_2: string;
        step_3: string;
    };
    recommended_content?: any;
};

export default function EverydayFocusWidget({ activeProfileId, hasDrafts, latestDraftId, isPro }: EverydayFocusWidgetProps) {
    const router = useRouter();
    const { t, locale } = useI18n();
    const [strategy, setStrategy] = useState<StrategyData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (activeProfileId) {
            async function fetchDaily() {
                try {
                    setLoading(true);
                    const guidance = await getDailyGuidance();

                    if (guidance && guidance.raw_json) {
                        const s = guidance.raw_json.strategist;
                        setStrategy({
                            role: guidance.role,
                            focus_action: guidance.focus_action,
                            reason: s.reason,
                            anti_goal: s.anti_goal,
                            emotion: guidance.emotion,
                            ten_minute_plan: s.ten_minute_plan,
                            recommended_content: s.recommended_content
                        });
                    }
                } catch (e) {
                    console.error("Failed to load strategy", e);
                } finally {
                    setLoading(false);
                }
            }
            fetchDaily();
        }
    }, [activeProfileId]);

    function handleGenerate() {
        if (!activeProfileId || !strategy?.recommended_content) return;

        const rc = strategy.recommended_content;
        const params = new URLSearchParams();
        params.set("profileId", activeProfileId);
        params.set("mode", "create");
        params.set("preset", "everyday");
        params.set("role", strategy.role);
        params.set("emotion", strategy.emotion || "Confident");
        params.set("intent", strategy.reason);
        if (strategy.anti_goal) {
            params.set("anti_goal", strategy.anti_goal);
        }

        // Map AI output to Studio params
        if (rc) {
            params.set("platform", rc.platform || "Instagram");
            params.set("kind", rc.content_type || "post");
            params.set("topic", strategy.focus_action);
            params.set("hook_angle", rc.angle || "Education");
        }

        router.push(`/studio?${params.toString()}`);
    }

    return (
        <section className="bg-surface/40 dark:bg-white/5 backdrop-blur-xl rounded-[48px] p-6 lg:p-8 border border-border shadow-bubble text-foreground relative overflow-hidden flex flex-col justify-center group transition-all duration-700">
            {/* Soft Pastel Blobs - Unisex Refinement */}
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary/5 rounded-full blur-[100px] group-hover:bg-primary/10 transition-colors duration-1000 animate-blob"></div>
            <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-secondary/5 rounded-full blur-[100px] group-hover:bg-secondary/10 transition-colors duration-1000 animate-blob animation-delay-2000"></div>

            <div className="relative z-10 w-full space-y-10">
                {/* Identity Tag */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[20px] bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-sm border border-white/20">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div className="space-y-0.5">
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">{t('core_active_identity')}</div>
                            <div className="text-xs font-black uppercase tracking-widest text-foreground/70">
                                {loading ? <Skeleton className="h-3 w-24 bg-surface" /> : (strategy?.role || t('core_fallback_role'))}
                            </div>
                        </div>
                    </div>

                    {!isPro && !loading && (
                        <div className="text-[9px] bg-secondary/10 text-secondary px-4 py-2 rounded-full border border-secondary/20 font-black uppercase tracking-widest">
                            {t('core_basic_briefing')}
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <div className="space-y-6">
                    <div className="inline-block">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2">{t('core_strategic_focus')}</p>
                        <div className="h-0.5 w-full bg-primary/20 rounded-full" />
                    </div>

                    <h2 className="text-4xl lg:text-5xl font-black tracking-tighter leading-[1.05] max-w-3xl text-foreground">
                        {loading ? (
                            <div className="space-y-3">
                                <Skeleton className="h-12 w-full bg-surface" />
                                <Skeleton className="h-12 w-2/3 bg-surface" />
                            </div>
                        ) : (
                            strategy?.focus_action || t('core_fallback_focus')
                        )}
                    </h2>

                    <div className="flex flex-col md:flex-row gap-10 pt-4">
                        {/* Rationale */}
                        <div className="flex-[1.5] space-y-3">
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">{t('core_rationale')}</div>
                            {loading ? (
                                <SkeletonText lines={2} className="opacity-10" />
                            ) : (
                                <p className="text-base font-medium text-muted leading-relaxed italic border-l-2 border-primary/20 pl-6">
                                    "{strategy?.reason || t('core_fallback_reason')}"
                                </p>
                            )}
                        </div>

                        {/* Anti-Goal (Premium) */}
                        {!loading && strategy?.anti_goal && (
                            <div className="flex-1 space-y-3">
                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400 dark:text-red-500/50">{t('core_execution_guardrail')}</div>
                                <div className="flex items-start gap-3 p-5 rounded-[28px] bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 shadow-sm">
                                    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                    <p className="text-xs font-black text-red-500/80 leading-relaxed uppercase tracking-widest">
                                        {t('core_avoid')} <span className="text-red-600 dark:text-red-400">{strategy?.anti_goal}</span>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 10-Minute Training Mode */}
                    {!loading && strategy?.ten_minute_plan && (
                        <div className="pt-6 space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">{t('core_training_title')}</div>
                                <div className="h-px flex-1 bg-border" />
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-foreground dark:bg-surface rounded-full shadow-lg">
                                    <Sparkles className="w-3 h-3 text-accent" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-background dark:text-foreground">{t('core_quiet_power')}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { step: "01", time: "2m", label: t('core_step_decide'), text: strategy.ten_minute_plan.step_1, color: "from-primary/10 to-primary/5" },
                                    { step: "02", time: "5m", label: t('core_step_draft'), text: strategy.ten_minute_plan.step_2, color: "from-secondary/10 to-secondary/5" },
                                    { step: "03", time: "3m", label: t('core_step_publish'), text: strategy.ten_minute_plan.step_3, color: "from-accent/15 to-accent/5" }
                                ].map((item, i) => (
                                    <div key={i} className={`p-4 rounded-3xl bg-gradient-to-br ${item.color} border border-border shadow-sm space-y-2`}>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[9px] font-black text-muted tracking-widest uppercase">{item.label}</span>
                                            <span className="text-[9px] font-black text-muted/60">{item.time}</span>
                                        </div>
                                        <p className="text-xs font-bold text-foreground leading-tight">
                                            {item.text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-6 pt-8 border-t border-border">
                    <button
                        onClick={handleGenerate}
                        disabled={loading || !strategy}
                        className="w-full sm:w-auto px-10 py-5 rounded-[28px] bg-gradient-to-r from-primary to-secondary text-white font-black text-xs uppercase tracking-widest hover:scale-105 transition-all flex items-center justify-center gap-3 shadow-bubble shadow-primary/20 active:scale-95 disabled:opacity-20"
                    >
                        <Play className="w-4 h-4 fill-current" />
                        {t('core_btn_execute')}
                    </button>

                    {hasDrafts && (
                        <button
                            onClick={() => router.push('/projects')}
                            className="w-full sm:w-auto flex items-center justify-center gap-3 group px-6 py-4 rounded-2xl hover:bg-surface transition-all"
                        >
                            <FileEdit className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted group-hover:text-primary transition-colors">
                                {t('core_btn_resume_draft')}
                            </span>
                        </button>
                    )}

                    <button
                        onClick={() => router.push("/dashboard/planner")}
                        className="w-full sm:w-auto flex items-center justify-center gap-3 group px-6 py-4 rounded-2xl hover:bg-surface transition-all ml-auto"
                    >
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted group-hover:text-secondary transition-colors">
                            {t('core_plan_week')} &rarr;
                        </span>
                    </button>
                </div>
            </div>
        </section >
    );
}
