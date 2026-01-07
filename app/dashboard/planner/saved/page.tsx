import { getPlans } from "../actions";
import Link from "next/link";
import { CheckCircle, ArrowLeft, Trash2, Calendar, Clock } from "lucide-react";

// Force dynamic since we're fetching user data
export const dynamic = 'force-dynamic';

export default async function SavedPlansPage() {
    const plans = await getPlans();

    return (
        <div className="max-w-5xl mx-auto p-8 lg:p-12 space-y-8 bg-background min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter text-foreground">
                        Saved <span className="text-primary">Plans</span>
                    </h1>
                    <p className="text-muted font-bold opacity-60 uppercase tracking-widest text-[10px] mt-1">Your strategy archive.</p>
                </div>
                <Link href="/dashboard/planner" className="flex items-center gap-2 text-muted hover:text-foreground transition-all font-black text-[10px] uppercase tracking-[0.2em] bg-surface border border-border px-6 py-3 rounded-2xl shadow-sm hover:shadow-md">
                    <ArrowLeft size={14} /> New Plan
                </Link>
            </div>

            {/* Plans Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {plans.length === 0 ? (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-border rounded-[48px] bg-surface/40 backdrop-blur-xl">
                        <p className="text-muted font-black uppercase tracking-widest text-xs mb-4 opacity-40">No saved plans yet.</p>
                        <Link href="/dashboard/planner" className="text-primary font-black uppercase tracking-[0.3em] text-[11px] hover:scale-105 transition-transform inline-block">
                            Create your first plan
                        </Link>
                    </div>
                ) : (
                    plans.map((plan: any) => (
                        <Link
                            key={plan.id}
                            href={`/dashboard/planner/${plan.id}`}
                            className="bg-surface p-8 rounded-[48px] border border-border shadow-sm hover:shadow-bubble hover:shadow-primary/5 hover:-translate-y-2 transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[40px] rounded-full -mr-10 -mt-10 pointer-events-none group-hover:bg-primary/10 transition-colors" />

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest ${plan.type === '7_day' ? 'bg-primary/10 text-primary border border-primary/10' : 'bg-secondary/10 text-secondary border border-secondary/10'}`}>
                                        {plan.type === '7_day' ? '7 Days' : '30 Days'}
                                    </span>
                                    <span className="text-[10px] font-black text-muted flex items-center gap-1.5 opacity-40 uppercase tracking-widest">
                                        <Calendar size={12} />
                                        {new Date(plan.created_at).toLocaleDateString()}
                                    </span>
                                </div>

                                <h3 className="font-black text-xl text-foreground mb-4 group-hover:text-primary transition-colors line-clamp-2 leading-tight tracking-tight">
                                    {plan.title || plan.content?.strategy_summary || "Untitled Plan"}
                                </h3>

                                <div className="flex flex-wrap gap-2 mb-8">
                                    {plan.inputs?.platforms?.slice(0, 3).map((p: string) => (
                                        <span key={p} className="text-[9px] uppercase font-black tracking-widest text-muted bg-background border border-border px-3 py-1.5 rounded-xl">{p}</span>
                                    ))}
                                    {plan.inputs?.platforms?.length > 3 && (
                                        <span className="text-[9px] uppercase font-black tracking-widest text-muted bg-background border border-border px-3 py-1.5 rounded-xl">+{plan.inputs.platforms.length - 3}</span>
                                    )}
                                </div>

                                <div className="flex items-center gap-3 text-muted text-[10px] font-black uppercase tracking-[0.2em] pt-6 border-t border-border opacity-60">
                                    <CheckCircle className="w-4 h-4 text-primary" />
                                    {plan.content?.plan?.filter((i: any) => i.completed).length || 0} / {plan.content?.plan?.length || 0} Tasks
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
