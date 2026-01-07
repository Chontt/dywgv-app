"use client";

import { useI18n } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { deletePlan, getPlans } from "./actions";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Lock, CheckCircle, Search, Bell, Settings, Calendar as CalendarIcon, Filter, Trash2 } from "lucide-react";
import Link from "next/link";
import PlanGeneratorModal from "@/app/dashboard/components/PlanGeneratorModal";
import PlannerCalendar from "./components/PlannerCalendar";

export default function PlannerPage() {
    const { t } = useI18n();
    const router = useRouter();
    // Subscription State
    const [isPro, setIsPro] = useState(false);

    // Core Planner State
    const [plans, setPlans] = useState<any[]>([]);
    const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all'); // Restoring deleted state

    useEffect(() => {
        // Simple check via existing API or helper (Client side helper works)
        const checkSub = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                // We can import getSubscriptionStatus or call /api/me. 
                // Let's call /api/me for robustness or rewrite simple check
                const { data } = await supabase.from('subscriptions').select('status').eq('user_id', user.id).in('status', ['active', 'trialing']).maybeSingle();
                setIsPro(!!data);
            }
        };
        checkSub();

        const fetchPlans = async () => {
            const userPlans = await getPlans();
            setPlans(userPlans);
        };
        fetchPlans();
    }, [isGeneratorOpen]);

    const filteredPlans = plans.filter(plan => {
        if (filter === 'all') return true;
        const progress = plan.content?.plan?.length ? (plan.content.plan.filter((i: any) => i.completed).length / plan.content.plan.length) : 0;
        if (filter === 'active') return progress < 1;
        if (filter === 'completed') return progress >= 1;
        return true;
    });

    const handleDelete = async (e: React.MouseEvent, planId: string) => {
        e.preventDefault(); // Prevent navigation
        if (!confirm("Are you sure you want to delete this plan?")) return;

        try {
            await deletePlan(planId);
            setPlans(plans.filter(p => p.id !== planId));
        } catch (error) {
            console.error("Failed to delete plan", error);
            alert("Failed to delete plan");
        }
    };


    return (
        <div className="h-screen flex flex-col overflow-hidden bg-background">
            {/* Modal */}
            <PlanGeneratorModal isOpen={isGeneratorOpen} onClose={() => setIsGeneratorOpen(false)} />

            {/* Top Bar (Planner Specific) */}
            <header className="flex-none px-8 py-6 flex items-center justify-between bg-surface border-b border-border">
                <div className="flex items-center gap-10">
                    <h1 className="text-2xl font-black tracking-tighter text-foreground">My Plans</h1>

                    {/* Filters */}
                    <div className="hidden md:flex items-center gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${filter === 'all' ? 'bg-background border border-border text-foreground' : 'bg-surface border border-transparent text-muted hover:text-foreground'}`}
                        >
                            All Plans
                        </button>
                        <button
                            onClick={() => setFilter('active')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${filter === 'active' ? 'bg-background border border-border text-foreground' : 'bg-surface border border-transparent text-muted hover:text-foreground'}`}
                        >
                            Active
                        </button>
                        <button
                            onClick={() => setFilter('completed')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${filter === 'completed' ? 'bg-background border border-border text-foreground' : 'bg-surface border border-transparent text-muted hover:text-foreground'}`}
                        >
                            Completed
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsGeneratorOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background dark:bg-surface dark:text-foreground rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg"
                    >
                        <Plus className="w-4 h-4" /> New Plan
                    </button>
                </div>
            </header >

            <main className="flex-1 overflow-hidden flex">
                {/* Left Column: Plan List */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                    {filteredPlans.length === 0 ? (
                        <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-[32px] bg-background">
                            <p className="text-muted font-bold mb-4 opacity-50">No plans found.</p>
                            {filter === 'all' && (
                                <button
                                    onClick={() => setIsGeneratorOpen(true)}
                                    className="px-6 py-3 bg-surface border border-border text-foreground rounded-xl font-black text-sm hover:border-primary transition-colors"
                                >
                                    Create First Plan
                                </button>
                            )}
                        </div>
                    ) : (
                        filteredPlans.map((plan) => (
                            <Link
                                href={`/dashboard/planner/${plan.id}`}
                                key={plan.id}
                                className="group block bg-surface rounded-[40px] p-6 border border-border shadow-sm hover:shadow-bubble hover:shadow-primary/5 hover:-translate-y-1 transition-all relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="flex items-center gap-6">
                                    {/* Icon / Thumbnail */}
                                    <div className="w-24 h-24 rounded-[32px] bg-background border border-border flex items-center justify-center shrink-0 group-hover:bg-primary/5 transition-colors">
                                        <div className="text-center space-y-1">
                                            <div className={`text-[10px] font-black uppercase tracking-widest ${plan.type === '7_day' ? 'text-primary' : 'text-secondary'}`}>
                                                {plan.type === '7_day' ? '7D' : '30D'}
                                            </div>
                                            <div className="font-black text-2xl text-muted group-hover:text-foreground transition-colors">
                                                {new Date(plan.created_at).getDate()}
                                            </div>
                                            <div className="text-[9px] font-bold uppercase text-muted opacity-50">
                                                {new Date(plan.created_at).toLocaleString('default', { month: 'short' })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0 py-2">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="px-3 py-1 rounded-full bg-background border border-border text-[10px] font-black uppercase tracking-widest text-muted group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/10 transition-colors">
                                                {plan.inputs?.niche || "Strategy"}
                                            </span>
                                            <button
                                                onClick={(e) => handleDelete(e, plan.id)}
                                                className="p-2 -mr-2 text-muted/30 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors z-20 relative"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <h3 className="text-xl font-black text-foreground mb-2 truncate group-hover:text-primary transition-colors">
                                            {plan.title || "Untitled Content Plan"}
                                        </h3>
                                        <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-muted opacity-60">
                                            <span className="flex items-center gap-1.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                {plan.inputs?.platforms?.length || 0} Platforms
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                                {plan.inputs?.goal?.replace(/_/g, ' ') || "Growth"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action / Progress */}
                                    <div className="hidden sm:flex flex-col items-end gap-3 min-w-[120px]">
                                        <div className="text-right">
                                            <div className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-1 opacity-50">Progress</div>
                                            <div className="font-black text-lg text-foreground">
                                                {Math.round((plan.content?.plan?.filter((i: any) => i.completed).length / (plan.content?.plan?.length || 1)) * 100)}%
                                            </div>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors shadow-sm">
                                            <CheckCircle className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>

                {/* Right Column: Sidebar (Calendar & Stats) */}
                <aside className="w-[360px] bg-surface/40 backdrop-blur-xl border-l border-border p-8 hidden xl:flex flex-col gap-10 overflow-y-auto">

                    {/* Calendar Widget */}
                    <PlannerCalendar plans={plans} />

                    {/* Online Users / Quick Stats equivalent */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="font-black text-foreground uppercase tracking-widest text-xs">Quick Stats</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 rounded-3xl bg-background border border-border">
                                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                                    <Filter className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="text-sm font-black text-foreground">Total Plans</div>
                                    <div className="text-[10px] font-bold text-muted uppercase tracking-widest opacity-60">{filteredPlans.length} Visible</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-3xl bg-background border border-border">
                                <div className="w-10 h-10 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary shadow-inner">
                                    <CheckCircle className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="text-sm font-black text-foreground">Completion Rate</div>
                                    <div className="text-[10px] font-bold text-muted uppercase tracking-widest opacity-60">85% Avg.</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Promo Card - Conditionally Rendered */}
                    {!isPro && (
                        <div className="mt-auto bg-gradient-to-br from-primary to-secondary rounded-[40px] p-8 text-white relative overflow-hidden shadow-bubble shadow-primary/20">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-10 -mt-10 blur-2xl" />
                            <h4 className="font-black text-xl mb-2 relative z-10 tracking-tight">Authority Elite</h4>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80 mb-6 leading-relaxed relative z-10">
                                Unlock 30-day plans & templates.
                            </p>
                            <Link href="/plans" className="block text-center w-full py-4 bg-white text-primary rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-white/95 hover:scale-[1.02] active:scale-95 transition-all relative z-10 shadow-lg">
                                Upgrade Now
                            </Link>
                        </div>
                    )}

                </aside>
            </main>
        </div >
    );
}
