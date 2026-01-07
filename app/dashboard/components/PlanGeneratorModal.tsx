"use client";

import { useI18n } from "@/lib/i18n";
import { useState, useEffect } from "react";
import { generatePlan } from "@/app/dashboard/planner/actions";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Lock, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { getSubscriptionStatus } from "@/lib/subscription";

type PlanGeneratorModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function PlanGeneratorModal({ isOpen, onClose }: PlanGeneratorModalProps) {
    const { t, locale } = useI18n();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form States
    const [niche, setNiche] = useState("");
    const [goal, setGoal] = useState("grow_followers");
    const [platforms, setPlatforms] = useState<string[]>([]);
    const [time, setTime] = useState("30_min");
    const [style, setStyle] = useState("educational");
    const [restrictions, setRestrictions] = useState<string[]>([]);
    const [duration, setDuration] = useState<'7_day' | '30_day'>('7_day');

    const [isPremium, setIsPremium] = useState(false);

    // Fetch Subscription Status
    useEffect(() => {
        const checkSub = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const status = await getSubscriptionStatus(user.id);
                setIsPremium(status.isPro);
            }
        };
        checkSub();
    }, []);

    const handlePlatformToggle = (p: string) => {
        if (platforms.includes(p)) {
            setPlatforms(platforms.filter((i) => i !== p));
        } else {
            // Free limit: Max 1 platform
            if (!isPremium && platforms.length >= 1) {
                alert("Free plan limited to 1 platform");
                return;
            }
            setPlatforms([...platforms, p]);
        }
    };

    const handleGenerate = async () => {
        if (platforms.length === 0 || !niche.trim()) return;
        setLoading(true);

        try {
            const res = await generatePlan({
                planType: isPremium ? "PREMIUM" : "FREE",
                niche,
                goal,
                platforms,
                time,
                style,
                restrictions,
                duration,
                language: locale as 'en' | 'ja' | 'ko' | 'th',
            });

            if (res.success) {
                onClose();
                router.push(`/dashboard/planner/${res.planId}`);
            } else {
                alert(res.error || "Failed to generate plan.");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 m-auto max-w-4xl w-full h-[90vh] md:h-auto z-50 pointer-events-none flex items-center justify-center p-4"
                    >
                        <div className="bg-white rounded-[40px] shadow-2xl w-full max-h-full overflow-y-auto pointer-events-auto relative flex flex-col md:flex-row">
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors z-20"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Left Col: Visual */}
                            <div className="hidden md:block w-1/3 bg-slate-900 text-white p-10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-pastel-blue/20 blur-[80px] rounded-full -mr-20 -mt-20 pointer-events-none" />
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-pastel-purple/20 blur-[80px] rounded-full -ml-20 -mb-20 pointer-events-none" />

                                <div className="relative z-10 space-y-6 h-full flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                                            <Sparkles className="w-6 h-6 text-pastel-blue" />
                                        </div>
                                        <h2 className="text-3xl font-black tracking-tighter leading-tight">
                                            Design Your <br />
                                            <span className="text-pastel-blue">Viral Roadmap</span>
                                        </h2>
                                        <p className="text-slate-400 text-sm font-medium leading-relaxed">
                                            Our AI analyzes successful patterns to create a tailored content schedule for your niche.
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Selected Niche</div>
                                            <div className="font-bold text-white">{niche || "Not set"}</div>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Method</div>
                                            <div className="font-bold text-white flex gap-2">
                                                {platforms.length > 0 ? platforms.map(p => (
                                                    <span key={p} className="text-xs bg-white/10 px-2 py-1 rounded-md">{p}</span>
                                                )) : "No platforms"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Col: Form */}
                            <div className="flex-1 p-8 md:p-10 space-y-8 bg-white">
                                {/* Mobile Header */}
                                <div className="md:hidden space-y-2">
                                    <h2 className="text-2xl font-black text-slate-800">New Content Plan</h2>
                                    <p className="text-slate-400 text-sm">Define your strategy in seconds.</p>
                                </div>

                                {/* Niche Input */}
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-300">Niche</label>
                                    <input
                                        value={niche}
                                        onChange={(e) => setNiche(e.target.value)}
                                        placeholder="e.g. Vegan Cooking, SaaS Marketing..."
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-700 outline-none focus:border-pastel-blue focus:bg-white transition-all placeholder:text-slate-300"
                                    />
                                </div>

                                {/* Goal & Platforms Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-300">Goal</label>
                                        <select
                                            value={goal} onChange={(e) => setGoal(e.target.value)}
                                            className="w-full bg-white border border-slate-100 rounded-2xl px-4 py-4 font-bold text-slate-700 outline-none focus:border-pastel-blue transition-colors appearance-none"
                                        >
                                            <option value="grow_followers">Grow Followers</option>
                                            <option value="sell_products">Sell Products</option>
                                            <option value="build_personal_brand">Personal Brand</option>
                                            <option value="drive_traffic">Drive Traffic</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-300">Duration</label>
                                        <div className="relative">
                                            <select
                                                value={duration}
                                                onChange={(e) => {
                                                    if (e.target.value === '30_day' && !isPremium) return;
                                                    setDuration(e.target.value as '7_day' | '30_day');
                                                }}
                                                className={`w-full bg-white border border-slate-100 rounded-2xl px-4 py-4 font-bold text-slate-700 outline-none focus:border-pastel-blue transition-colors appearance-none ${!isPremium && duration !== '7_day' ? 'text-slate-400' : ''}`}
                                            >
                                                <option value="7_day">7 Days</option>
                                                <option value="30_day" disabled={!isPremium}>30 Days {isPremium ? '' : '(Pro)'}</option>
                                            </select>
                                            {!isPremium && (
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">
                                                    <Lock size={16} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Platforms */}
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-300">Platforms</label>
                                    <div className="flex flex-wrap gap-2">
                                        {["TikTok", "Instagram", "YouTube", "X", "Facebook"].map(p => (
                                            <button
                                                key={p}
                                                onClick={() => handlePlatformToggle(p)}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${platforms.includes(p)
                                                    ? "bg-slate-800 text-white border-slate-800 shadow-lg scale-105"
                                                    : "bg-white text-slate-400 border-slate-100 hover:border-slate-200"
                                                    }`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Submit */}
                                <button
                                    onClick={handleGenerate}
                                    disabled={loading || platforms.length === 0 || !niche}
                                    className={`w-full flex items-center justify-center gap-2 px-8 py-5 rounded-2xl text-white font-black text-lg transition-all ${loading || platforms.length === 0 || !niche
                                        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                        : "bg-gradient-to-r from-pastel-blue to-pastel-purple hover:shadow-lg hover:shadow-pastel-purple/50 hover:scale-[1.02] active:scale-[0.98]"
                                        }`}
                                >
                                    {loading ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <Plus className="w-6 h-6" />
                                    )}
                                    {loading ? "Generating Strategy..." : "Generate Plan"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
