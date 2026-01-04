"use client";

import { useI18n } from "@/lib/i18n";
import { Skeleton } from "./Skeleton";

type StatCardProps = {
    label: string;
    value: string | number;
    trend?: string;
    trendUp?: boolean;
    icon?: string;
    locked?: boolean;
    loading?: boolean;
    onClick?: () => void;
};

export default function StatCard({ label, value, trend, trendUp, locked, loading, onClick }: StatCardProps) {
    const { t } = useI18n();
    return (
        <div
            onClick={onClick}
            className={`bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 relative group transition-all ${onClick ? 'cursor-pointer hover:-translate-y-1 hover:shadow-md' : ''}`}
        >
            {locked && (
                <div className="absolute top-3 right-3 bg-slate-100 text-slate-400 p-1.5 rounded-full">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </div>
            )}

            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
                <div className={`text-3xl font-bold font-heading ${locked ? 'text-slate-300' : 'text-slate-800'}`}>
                    {loading ? <Skeleton className="h-8 w-16" /> : value}
                </div>
            </div>

            {trend && (
                <div className="flex items-center gap-1">
                    {loading ? (
                        <Skeleton className="h-3 w-20" />
                    ) : (
                        <>
                            <span className={`text-xs font-bold ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
                                {trend}
                            </span>
                            <span className="text-[10px] text-slate-400 opacity-80">{t('dash_vs_last_week')}</span>
                        </>
                    )}
                </div>
            )}

            {locked && (
                <div className="text-[10px] font-bold text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-4">
                    {t('dash_upgrade_unlock')}
                </div>
            )}
        </div>
    );
}
