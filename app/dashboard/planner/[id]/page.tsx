"use client";

import { useI18n } from "@/lib/i18n";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { updatePlanContent, deletePlan } from "../actions";
import { ArrowLeft, Trash2, CheckCircle, Circle, Edit2, Save, X, Calendar, BarChart2, LayoutGrid, List } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function PlanDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { t } = useI18n();
    const router = useRouter();
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [plan, setPlan] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [editingTask, setEditingTask] = useState<{ day: number, platform: string, field: string } | null>(null);
    const [editValue, setEditValue] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        const fetchPlan = async () => {
            const { data, error } = await supabase
                .from('plans')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error("Error fetching plan:", error);
                setErrorMsg(error.message);
            }
            if (data) setPlan(data);
            setLoading(false);
        };
        fetchPlan();
    }, [id]);

    const toggleComplete = async (dayIndex: number, platformIndex: number, currentStatus: boolean) => {
        if (!plan) return;
        const newContent = JSON.parse(JSON.stringify(plan.content));
        if (newContent.plan && newContent.plan[dayIndex]) {
            newContent.plan[dayIndex].completed = !currentStatus;
            setPlan({ ...plan, content: newContent });
            await updatePlanContent(plan.id, newContent);
        }
    };

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this plan?")) {
            await deletePlan(id);
            router.push("/dashboard/planner");
        }
    };

    // Editing handlers (simplified for brevity, logic remains same)
    const startEditing = (index: number, field: string, currentValue: string) => {
        setEditingTask({ day: index, platform: 'all', field });
        setEditValue(currentValue);
    };

    const saveEdit = (index: number) => {
        if (!plan) return;
        const newContent = JSON.parse(JSON.stringify(plan.content));
        if (newContent.plan[index]) {
            newContent.plan[index][editingTask!.field] = editValue;
            setPlan({ ...plan, content: newContent });
        }
        setEditingTask(null);
    };

    const handleSaveChanges = async () => {
        if (!plan) return;
        try {
            await updatePlanContent(id, plan.content);
            alert("Plan saved successfully!");
        } catch (e) { console.error(e); alert("Failed to save."); }
    };


    if (loading) return <div className="h-screen flex items-center justify-center text-muted font-black uppercase tracking-widest bg-background">Loading Strategy...</div>;
    if (!plan) return <div className="p-12 text-center text-foreground font-black">Plan not found</div>;

    const { content } = plan;

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-background">
            {/* Header - Fixed */}
            <header className="flex-none px-8 py-5 flex items-center justify-between bg-surface border-b border-border backdrop-blur-xl z-20">
                <div className="flex items-center gap-6">
                    <Link href="/dashboard/planner" className="w-10 h-10 rounded-2xl bg-background border border-border flex items-center justify-center text-muted hover:text-foreground hover:border-primary/30 transition-all">
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/10">
                                {plan.type === '7_day' ? '7-Day Sprint' : '30-Day Marathon'}
                            </div>
                            <span className="text-[10px] font-black text-muted uppercase tracking-widest opacity-40">
                                {new Date(plan.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        <h1 className="text-xl font-black text-foreground tracking-tight leading-none truncate max-w-md">
                            {content.strategy_summary}
                        </h1>
                    </div>
                </div>

                {/* View Toggle (Desktop) */}
                <div className="hidden lg:flex items-center gap-2 bg-background p-1 rounded-2xl border border-border">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-surface text-foreground shadow-sm border border-border' : 'text-muted hover:text-foreground'}`}
                        title="List View"
                    >
                        <List size={16} />
                    </button>
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-surface text-foreground shadow-sm border border-border' : 'text-muted hover:text-foreground'}`}
                        title="Grid View"
                    >
                        <LayoutGrid size={16} />
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSaveChanges}
                        className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background dark:bg-surface dark:text-foreground rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg"
                    >
                        <Save size={16} /> <span className="hidden sm:inline">Save Changes</span>
                    </button>
                    <button onClick={handleDelete} className="w-10 h-10 rounded-xl border border-border text-muted hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 flex items-center justify-center transition-all">
                        <Trash2 size={18} />
                    </button>
                </div>
            </header>

            {/* Split View Content */}
            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">

                {/* Left: Content Area */}
                <div className="flex-1 overflow-y-auto p-4 lg:p-8 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">

                    {viewMode === 'list' ? (
                        <div className="space-y-4">
                            {content.plan.map((item: any, index: number) => (
                                <div key={index} className={`group relative bg-surface rounded-[40px] p-6 border transition-all duration-500 ${item.completed ? 'border-border/50 opacity-50' : 'border-border hover:border-primary/20 hover:shadow-bubble hover:shadow-primary/5 shadow-sm'}`}>
                                    <div className="flex items-start gap-5">
                                        <button
                                            onClick={() => toggleComplete(index, 0, item.completed)}
                                            className={`shrink-0 w-7 h-7 mt-1 rounded-full flex items-center justify-center transition-all ${item.completed ? 'bg-secondary text-white' : 'bg-background border border-border text-muted hover:text-primary hover:border-primary/30'}`}
                                        >
                                            {item.completed ? <CheckCircle size={14} /> : <Circle size={14} />}
                                        </button>

                                        <div className="flex-1 min-w-0 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className="px-3 py-1 rounded-xl bg-background border border-border text-[9px] font-black uppercase tracking-widest text-muted">Day {item.day}</span>
                                                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{item.platform}</span>
                                                </div>
                                                <span className="text-[10px] font-black text-muted uppercase tracking-widest opacity-40">{item.best_time}</span>
                                            </div>

                                            <div>
                                                {editingTask?.day === index && editingTask.field === 'angle' ? (
                                                    <div className="flex gap-2">
                                                        <input
                                                            autoFocus
                                                            value={editValue}
                                                            onChange={(e) => setEditValue(e.target.value)}
                                                            className="w-full text-base font-bold text-foreground border-b-2 border-primary outline-none bg-transparent py-1"
                                                        />
                                                        <button onClick={() => saveEdit(index)} className="text-secondary hover:scale-110 transition-transform"><CheckCircle size={20} /></button>
                                                    </div>
                                                ) : (
                                                    <h3
                                                        onClick={() => !item.completed && startEditing(index, 'angle', item.angle)}
                                                        className={`text-base font-black text-foreground leading-snug cursor-pointer group-hover:text-primary transition-colors ${item.completed ? 'line-through opacity-50' : ''}`}
                                                    >
                                                        {item.angle}
                                                    </h3>
                                                )}

                                                {editingTask?.day === index && editingTask.field === 'content_type' ? (
                                                    <input
                                                        value={editValue}
                                                        onChange={(e) => setEditValue(e.target.value)}
                                                        onBlur={() => saveEdit(index)}
                                                        className="w-full text-xs text-muted mt-1 outline-none bg-transparent"
                                                    />
                                                ) : (
                                                    <p onClick={() => !item.completed && startEditing(index, 'content_type', item.content_type)} className="text-[11px] font-black uppercase tracking-widest text-muted mt-1 cursor-pointer hover:text-foreground opacity-50 hover:opacity-100">
                                                        {item.content_type}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="h-20" />
                        </div>
                    ) : (
                        // GRID VIEW
                        <div className="space-y-12">
                            {/* Group by Platforms */}
                            {Array.from(new Set(content.plan.map((i: any) => i.platform))).map((platform: any) => (
                                <div key={platform} className="space-y-6">
                                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted pl-3 border-l-4 border-primary">{platform}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {content.plan.filter((i: any) => i.platform === platform).map((item: any, idx: number) => {
                                            // Find original index
                                            const originalIndex = content.plan.indexOf(item);
                                            return (
                                                <div key={idx} className={`bg-surface rounded-[32px] p-6 border transition-all duration-500 ${item.completed ? 'border-border/50 opacity-50' : 'border-border hover:border-primary/20 shadow-sm'}`}>
                                                    <div className="flex justify-between items-start mb-4">
                                                        <span className="px-3 py-1 bg-background border border-border rounded-xl text-[9px] font-black uppercase tracking-widest text-muted">Day {item.day}</span>
                                                        <button onClick={() => toggleComplete(originalIndex, 0, item.completed)} className="transition-transform hover:scale-110">
                                                            {item.completed ? <CheckCircle size={18} className="text-secondary" /> : <Circle size={18} className="text-border hover:text-primary" />}
                                                        </button>
                                                    </div>
                                                    <p className={`text-sm font-black text-foreground leading-tight ${item.completed ? 'line-through opacity-50' : ''}`}>{item.angle}</p>
                                                    <p className="text-[10px] font-black text-muted mt-3 uppercase tracking-widest opacity-40">{item.content_type}</p>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                            <div className="h-20" />
                        </div>
                    )}
                </div>

                {/* Right: Fixed Stats Panel */}
                <aside className="hidden lg:flex w-[400px] flex-col h-full border-l border-border bg-surface/30 backdrop-blur-xl p-8 overflow-y-auto">
                    <h3 className="font-black text-foreground text-xs uppercase tracking-[0.2em] mb-8">Strategy Overview</h3>

                    <div className="space-y-6">
                        <div className="p-8 rounded-[40px] bg-background border border-border space-y-4 shadow-inner">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                                    <BarChart2 size={24} />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-1 opacity-50">Core Focus</div>
                                    <div className="font-black text-foreground text-sm leading-tight">{content.energy_note}</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 rounded-[40px] bg-background border border-border space-y-4 shadow-inner">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary shadow-sm">
                                    <Calendar size={24} />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-1 opacity-50">Frequency</div>
                                    <div className="font-black text-foreground text-sm leading-tight">{content.posting_frequency}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-10 border-t border-border">
                        <div className="flex justify-between mb-4">
                            <div className="text-[10px] font-black text-muted uppercase tracking-[0.2em] opacity-50">Momentum</div>
                            <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                                {Math.round((content.plan.filter((i: any) => i.completed).length / content.plan.length) * 100)}%
                            </div>
                        </div>
                        <div className="h-3 w-full bg-background border border-border rounded-full overflow-hidden p-0.5">
                            <div
                                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000 shadow-sm"
                                style={{ width: `${(content.plan.filter((i: any) => i.completed).length / content.plan.length) * 100}%` }}
                            />
                        </div>
                        <div className="flex justify-between mt-4 text-[10px] font-black text-muted uppercase tracking-widest opacity-40">
                            <span>{content.plan.filter((i: any) => i.completed).length} items done</span>
                            <span>{content.plan.length} total</span>
                        </div>
                    </div>
                </aside>

            </div>
        </div>
    );
}
