"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PaywallModalProps {
    isOpen: boolean;
    onClose: () => void;
    featureName: string;
    limitMessage?: string; // e.g. "You've reached your daily limit of 3"
}

export function PaywallModal({ isOpen, onClose, featureName, limitMessage }: PaywallModalProps) {
    const router = useRouter();

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-10"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>

                    {/* Header Graphic */}
                    <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-500 relative flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
                        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg transform rotate-[-10deg]">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    <div className="p-8 text-center space-y-6">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                Unlock {featureName}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium">
                                {limitMessage || "This feature is available exclusively on the Authority Plan."}
                            </p>
                        </div>

                        {/* Value Props */}
                        <div className="text-left bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 space-y-3">
                            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Authority Plan Includes:</p>
                            <li className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Unlimited AI Generations
                            </li>
                            <li className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 30-Day Content Planner
                            </li>
                            <li className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Advanced Brand Voices
                            </li>
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-col gap-3">
                            <Link
                                href="/plans"
                                onClick={onClose}
                                className="w-full py-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center gap-2"
                            >
                                <Sparkles className="w-4 h-4" /> Upgrade to Authority
                            </Link>
                            <button
                                onClick={onClose}
                                className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors uppercase tracking-widest"
                            >
                                Maybe Later
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
