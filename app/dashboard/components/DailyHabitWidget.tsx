"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n";

export type Goal = {
    id: string;
    text: string;
    completed: boolean;
};

type DailyHabitWidgetProps = {
    goals: Goal[];
    onToggle: (id: string, current: boolean) => void;
    onAdd: (text: string) => void;
    onDelete: (id: string) => void;
};

export default function DailyHabitWidget({ goals, onToggle, onAdd, onDelete }: DailyHabitWidgetProps) {
    const { t } = useI18n();
    const [newGoal, setNewGoal] = useState("");
    const completedCount = goals.filter(g => g.completed).length;
    const progress = goals.length > 0 ? (completedCount / goals.length) * 100 : 0;

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter" && newGoal.trim()) {
            onAdd(newGoal.trim());
            setNewGoal("");
        }
    }

    return (
        <aside className="rounded-3xl border border-white/60 bg-white/60 backdrop-blur-xl p-6 shadow-glass flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className="text-xl">🎯</span>
                    <h2 className="text-base font-bold font-heading text-slate-900">{t('widget_todo_title')}</h2>
                </div>
                <span className="text-xs font-bold text-slate-400">{completedCount}/{goals.length}</span>
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-6">
                <div
                    className="h-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                {goals.map((g) => (
                    <div key={g.id} className="flex items-center gap-3 group animate-fade-in">
                        <button
                            onClick={() => onToggle(g.id, g.completed)}
                            className={`w-5 h-5 flex-shrink-0 rounded-full border flex items-center justify-center transition-colors ${g.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 hover:border-indigo-400'}`}
                        >
                            {g.completed && <span className="text-white text-xs">✓</span>}
                        </button>
                        <span className={`text-sm truncate w-full ${g.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                            {g.text}
                        </span>
                        <button
                            onClick={() => onDelete(g.id)}
                            className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 ml-auto transition-opacity"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100/50">
                <input
                    className="w-full bg-slate-50 border-none rounded-xl text-sm px-4 py-3 text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    placeholder={t('widget_todo_placeholder')}
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>
        </aside>
    );
}
