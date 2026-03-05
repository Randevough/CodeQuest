'use client';

import { useEffect, useState } from 'react';

export function QuestTimer({ deadline }: { deadline: Date | null }) {
    const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number } | null>(null);

    useEffect(() => {
        if (!deadline) return;

        const calculateTimeLeft = () => {
            const now = new Date();
            const difference = new Date(deadline).getTime() - now.getTime();

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                setTimeLeft({ days, hours, minutes });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0 });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 60000); // Update every minute

        return () => clearInterval(timer);
    }, [deadline]);

    if (!deadline) {
        return (
            <div className="text-center py-2">
                <p className="font-mono text-xl font-bold text-slate-300 dark:text-slate-600 tracking-widest">-- : -- : --</p>
                <p className="text-xs text-slate-400 mt-1.5 tracking-wide">No deadline set</p>
            </div>
        );
    }

    if (!timeLeft) return null; // Loading state

    return (
        <div className="flex gap-2">
            <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 text-center border border-slate-100 dark:border-slate-800">
                <span className="block text-2xl font-mono font-bold text-slate-900 dark:text-white">
                    {timeLeft.days.toString().padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Days</span>
            </div>
            <div className="flex items-center text-slate-300 dark:text-slate-600 text-xl font-bold">:</div>
            <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 text-center border border-slate-100 dark:border-slate-800">
                <span className="block text-2xl font-mono font-bold text-slate-900 dark:text-white">
                    {timeLeft.hours.toString().padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Hrs</span>
            </div>
            <div className="flex items-center text-slate-300 dark:text-slate-600 text-xl font-bold">:</div>
            <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 text-center border border-slate-100 dark:border-slate-800">
                <span className="block text-2xl font-mono font-bold text-slate-900 dark:text-white">
                    {timeLeft.minutes.toString().padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Mins</span>
            </div>
        </div>
    );
}
