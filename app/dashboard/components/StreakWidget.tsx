"use client";

import { useI18n } from "@/lib/i18n";
import { Zap, TrendingUp, Award } from "lucide-react";

type StreakWidgetProps = {
    streakDays?: number;
    authorityScore?: number; // 0-100
};

export default function StreakWidget({ streakDays = 0, authorityScore = 0 }: StreakWidgetProps) {
    const { t } = useI18n();

    // Calculate "Momentum" text based on streak
    const momentumLevel = streakDays > 7 ? t('streak_unstoppable') : streakDays > 3 ? t('streak_building') : t('streak_igniting');
    const momentumColor = streakDays > 7 ? "text-primary" : streakDays > 3 ? "text-muted" : "text-muted/60";

    return (
        <div className="bg-surface/40 dark:bg-surface-dark/5 backdrop-blur-xl rounded-[32px] p-6 border border-border shadow-sm flex flex-col justify-between relative overflow-hidden group">
            {/* Background Decor - Quiet Gradient */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors duration-700" />

            <div className="flex items-center gap-4 relative z-10">
                <div className={`w-12 h-12 rounded-2xl bg-foreground dark:bg-primary/20 flex items-center justify-center ${streakDays > 0 ? 'text-primary' : 'text-muted'}`}>
                    <Zap className="w-6 h-6 fill-current" />
                </div>
                <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">{t('streak_label')}</div>
                    <div className="text-3xl font-black text-foreground leading-none tracking-tighter">
                        {streakDays} <span className="text-xs font-bold text-muted tracking-normal ml-1">{t('streak_days_suffix')}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-5 relative z-10 pt-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">{t('streak_brand_momentum')}</div>
                        <div className={`text-xs font-black uppercase tracking-widest ${momentumColor}`}>{momentumLevel}</div>
                    </div>
                </div>

                {/* Accuracy & Authority Layer */}
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-[0.2em] text-muted">
                            <span>{t('streak_accuracy_score')}</span>
                            <span className="text-primary">{authorityScore}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
                            <div
                                className="h-full bg-foreground dark:bg-primary transition-all duration-[1500ms] ease-out"
                                style={{ width: `${authorityScore}%` }}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 pt-2 border-t border-border">
                        <Award className="w-3 h-3 text-muted/40" />
                        <p className="text-[8px] font-black text-muted/40 uppercase tracking-[0.2em]">
                            {t('streak_quiet_authority')} {Math.floor(authorityScore / 10)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
