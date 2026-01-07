"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PlannerCalendarProps = {
    plans: any[];
};

export default function PlannerCalendar({ plans }: PlannerCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 = Sun, 1 = Mon...

    // Adjust for Monday start (0 = Mon, 6 = Sun)
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const isToday = (day: number) => {
        const today = new Date();
        return day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear();
    };

    const hasPlan = (day: number) => {
        // Simple check if any plan was created on this day (based on created_at)
        // In a real app, this might check for scheduled content dates
        return plans.some(p => {
            const d = new Date(p.created_at);
            return d.getDate() === day &&
                d.getMonth() === currentDate.getMonth() &&
                d.getFullYear() === currentDate.getFullYear();
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="font-black text-slate-800 text-lg tracking-tight">
                    {monthNames[currentDate.getMonth()]} <span className="text-slate-400 font-medium">{currentDate.getFullYear()}</span>
                </h3>
                <div className="flex gap-1">
                    <button onClick={prevMonth} className="p-1 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={nextMonth} className="p-1 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                    <div key={`${d}-${i}`} className="text-[10px] font-bold text-slate-300 py-2 uppercase tracking-wider">{d}</div>
                ))}

                {/* Empty slots for previous month */}
                {Array.from({ length: adjustedFirstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="py-2" />
                ))}

                {/* Days */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const _isToday = isToday(day);
                    const _hasPlan = hasPlan(day);

                    return (
                        <div key={day} className="relative group cursor-pointer">
                            <div className={`
                                flex items-center justify-center w-8 h-8 mx-auto rounded-xl text-xs font-bold transition-all relative z-10
                                ${_isToday
                                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 scale-110'
                                    : 'text-slate-600 hover:bg-slate-50'
                                }
                            `}>
                                {day}
                                {_hasPlan && !_isToday && (
                                    <div className="absolute bottom-1 w-1 h-1 rounded-full bg-pastel-blue" />
                                )}
                            </div>
                            {_hasPlan && (
                                <div className={`absolute inset-0 rounded-xl bg-pastel-blue/10 scale-0 group-hover:scale-110 transition-transform -z-0 ${_isToday ? 'hidden' : ''}`} />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
