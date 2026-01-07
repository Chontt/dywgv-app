"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { CheckCircle, Circle, Plus, Trash2, Zap } from "lucide-react";

export type Goal = {
    id: string;
    goal_text: string;
    is_completed: boolean;
};

type DailyGoalsWidgetProps = {
    goals: Goal[];
    onToggle: (id: string, current: boolean) => void;
    onAdd: (text: string) => void;
    onDelete: (id: string) => void;
};

export default function DailyGoalsWidget({ goals, onToggle, onAdd, onDelete }: DailyGoalsWidgetProps) {
    const { t } = useI18n();
    const [inputs, setInputs] = useState<{ [key: number]: string }>({});

    // Enforce max 3 goals
    const displayGoals = goals.slice(0, 3);
    const completedCount = goals.filter(g => g.is_completed).length;
    // Progress based on 3 daily wins
    const progress = (completedCount / 3) * 100;

    const handleInputChange = (index: number, value: string) => {
        setInputs(prev => ({ ...prev, [index]: value }));
    };

    const handleInputSubmit = (index: number) => {
        const val = inputs[index];
        if (val && val.trim()) {
            onAdd(val.trim());
            setInputs(prev => ({ ...prev, [index]: "" }));
        }
    };

    return (
        <aside className="bg-surface/40 dark:bg-white/5 backdrop-blur-xl p-6 lg:p-8 flex flex-col h-full space-y-4 rounded-[48px] border border-border shadow-bubble group transition-all duration-700">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[20px] bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary shadow-inner transition-transform group-hover:scale-110 duration-500">
                        <Zap className="w-6 h-6 fill-current" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">Daily Momentum</p>
                        <h2 className="text-lg font-black uppercase tracking-widest text-foreground">3 Small Wins</h2>
                    </div>
                </div>
                <div className="text-[10px] font-black text-secondary bg-secondary/10 px-4 py-2 rounded-full border border-secondary/20 uppercase tracking-widest">
                    {completedCount} / 3
                </div>
            </div>

            {/* Modern Progress Indicator */}
            <div className="space-y-3">
                <div className="flex justify-between items-end px-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">Progress</p>
                    <p className="text-[10px] font-black text-secondary tracking-[0.1em]">{Math.round(progress)}%</p>
                </div>
                <div className="h-2 w-full bg-background/50 rounded-full overflow-hidden border border-border shadow-inner">
                    <div
                        className="h-full bg-gradient-to-r from-secondary to-primary transition-all duration-1000 ease-out"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                </div>
            </div>

            {/* 3 Slots */}
            <div className="space-y-4 flex-1">
                {Array.from({ length: 3 }).map((_, i) => {
                    const goal = displayGoals[i];

                    if (goal) {
                        return (
                            <div key={goal.id} className="group flex items-center gap-4 p-5 rounded-[32px] bg-surface/60 dark:bg-white/5 border border-border hover:border-secondary/20 hover:shadow-sm transition-all duration-500">
                                <button
                                    onClick={() => onToggle(goal.id, goal.is_completed)}
                                    className={`transition-all duration-500 ${goal.is_completed ? 'text-secondary' : 'text-muted hover:text-secondary'}`}
                                >
                                    {goal.is_completed ? (
                                        <CheckCircle className="w-6 h-6" />
                                    ) : (
                                        <Circle className="w-6 h-6" />
                                    )}
                                </button>
                                <span className={`text-sm font-bold leading-relaxed flex-1 ${goal.is_completed ? 'text-muted line-through opacity-60' : 'text-foreground'}`}>
                                    {goal.goal_text}
                                </span>
                                <button
                                    onClick={() => onDelete(goal.id)}
                                    className="opacity-0 group-hover:opacity-100 text-muted hover:text-red-400 transition-all p-1.5"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        );
                    } else {
                        return (
                            <div key={`input-${i}`} className="group relative flex items-center">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted/30 pointer-events-none">
                                    <span className="text-[10px] font-black opacity-50">0{i + 1}</span>
                                </div>
                                <input
                                    className="w-full bg-background/50 border border-border rounded-[32px] text-xs font-bold pl-12 pr-12 py-5 text-foreground placeholder:text-muted/50 focus:bg-surface focus:ring-4 focus:ring-secondary/5 transition-all outline-none border-dashed"
                                    placeholder="Type to add win..."
                                    value={inputs[i] || ""}
                                    onChange={(e) => handleInputChange(i, e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleInputSubmit(i)}
                                    onBlur={() => handleInputSubmit(i)}
                                />
                                <button
                                    onClick={() => handleInputSubmit(i)}
                                    className={`absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all ${inputs[i]?.trim() ? 'text-secondary bg-secondary/10 hover:bg-secondary/20' : 'text-slate-200 pointer-events-none'}`}
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        );
                    }
                })}
            </div>
        </aside>
    );
}
