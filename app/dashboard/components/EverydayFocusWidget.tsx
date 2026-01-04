"use client";

import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { useState, useEffect } from "react";
import { Skeleton, SkeletonText } from "./Skeleton";

type EverydayFocusWidgetProps = {
    activeProfileId: string | null;
    hasDrafts: boolean;
    latestDraftId?: string | null;
    isPro?: boolean;
};

type GeneratedStrategy = {
    role: string;
    emotion: string;
    focus_action: string;
    reason: string;
    anti_goal?: string;
    recommended_content?: {
        platform: string;
        content_kind: string;
        video_length_sec: number;
        format: string;
        topic: string;
        hook_angle: string;
        cta: string;
        parts_to_generate: string[];
    };
};

export default function EverydayFocusWidget({ activeProfileId, hasDrafts, latestDraftId, isPro }: EverydayFocusWidgetProps) {
    const router = useRouter();
    const { t, locale } = useI18n();
    const [strategy, setStrategy] = useState<GeneratedStrategy | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (activeProfileId) {
            async function fetchDaily() {
                try {
                    setLoading(true);
                    const res = await fetch("/api/dashboard/generate", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            userName: "User", // TODO: Get name
                            profileData: { role: "Creator" }, // TODO: Pass actual profile
                            recentActivity: hasDrafts ? "Drafts existing" : "No recent activity",
                            calendarContext: {
                                date: new Date().toDateString(),
                                day: new Date().toLocaleDateString('en-US', { weekday: 'long' })
                            },
                            planTier: isPro ? "pro" : "free",
                            language: locale
                        })
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setStrategy(data);
                    }
                } catch (e) {
                    console.error("Failed to load strategy", e);
                } finally {
                    setLoading(false);
                }
            }
            fetchDaily();
        }
    }, [activeProfileId, hasDrafts, isPro]);

    function handleGenerate() {
        if (!activeProfileId || !strategy?.recommended_content) return;

        // Construct Deep Link for Studio
        const params = new URLSearchParams();
        params.set("profileId", activeProfileId);
        params.set("mode", "create");
        params.set("preset", "everyday");

        // Strategy Params
        params.set("role", strategy.role);
        params.set("emotion", strategy.emotion);
        params.set("intent", strategy.reason); // "intent" maps to reason logic
        if (strategy.anti_goal) {
            params.set("anti_goal", strategy.anti_goal);
        }

        // Content Params
        const rc = strategy.recommended_content;
        params.set("platform", rc.platform);
        params.set("kind", rc.content_kind);
        params.set("format", rc.format);
        params.set("topic", rc.topic);
        params.set("hook_angle", rc.hook_angle);
        params.set("length", String(rc.video_length_sec));

        router.push(`/studio?${params.toString()}`);
    }

    return (
        <section className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden min-h-[300px] flex flex-col justify-center">
            {/* Background glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl"></div>

            <div className="relative z-10 w-full">

                {/* Header: Role & Date */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-indigo-300 font-bold uppercase tracking-wider text-xs">
                        {loading ? (
                            <Skeleton className="h-3 w-24 bg-indigo-500/20" />
                        ) : (
                            <span>🎯 {strategy?.role?.toUpperCase() || "STRATEGIST"}</span>
                        )}
                    </div>
                    {isPro && (loading ? <Skeleton className="h-5 w-32 bg-red-500/10" /> : strategy?.anti_goal && (
                        <div className="text-[10px] bg-red-500/10 text-red-300 px-2 py-1 rounded border border-red-500/20">
                            Avoid: {strategy.anti_goal}
                        </div>
                    ))}
                </div>

                {/* Main Focus */}
                <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-3 text-white leading-tight">
                    {loading ? (
                        <Skeleton className="h-8 w-3/4 bg-slate-700/50 mb-4" />
                    ) : (
                        strategy?.focus_action || "Loading your daily briefing..."
                    )}
                </h2>

                {/* Why it Matters */}
                {loading ? (
                    <div className="border-l-2 border-indigo-500/30 pl-3 mb-6">
                        <SkeletonText lines={2} className="opacity-20" />
                    </div>
                ) : strategy?.reason && (
                    <p className="text-slate-400 text-sm mb-6 max-w-xl border-l-2 border-indigo-500/30 pl-3">
                        <span className="text-indigo-400 font-semibold text-xs uppercase block mb-1">Strategy Note:</span>
                        {strategy.reason}
                    </p>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <button
                        onClick={handleGenerate}
                        disabled={loading || !strategy}
                        className="bg-white text-slate-900 px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-all hover:-translate-y-1 shadow-lg shadow-white/10 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="text-lg">✨</span> {t('dash_btn_start_new') || "Generate Content"}
                    </button>

                    {hasDrafts && (
                        <button
                            onClick={() => router.push('/dashboard?view=drafts')}
                            className="bg-slate-800/50 text-white border border-slate-600 px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                        >
                            <span className="text-lg">📝</span> {t('dash_btn_continue_draft') || "Continue Draft"}
                        </button>
                    )}
                </div>

                {/* Momentum / Tip */}
                <div className="mt-6 flex items-center gap-4 text-xs text-slate-500 font-medium">
                    {loading ? (
                        <Skeleton className="h-3 w-40 bg-slate-700/50" />
                    ) : (
                        strategy?.recommended_content && (
                            <span className="flex items-center gap-1">
                                <span className="text-indigo-400">Recommendation:</span>
                                {strategy.recommended_content.platform} • {strategy.recommended_content.format}
                            </span>
                        )
                    )}
                </div>
            </div>
        </section>
    );
}
