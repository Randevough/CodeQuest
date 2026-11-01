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
                <p className="font-mono text-xl font-bold text-muted tracking-widest">-- : -- : --</p>
                <p className="text-sm text-muted mt-1.5 tracking-wide">No deadline set</p>
            </div>
        );
    }

    if (!timeLeft) return <p role="status" className="min-h-24 text-muted">Loading time remaining…</p>;

    return (
        <div role="timer" aria-label={`${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes remaining`} className="flex gap-2 tabular-nums">
            <div className="flex-1 bg-surface rounded-lg p-3 text-center border border-border">
                <span className="block text-2xl font-mono font-bold text-foreground">
                    {timeLeft.days.toString().padStart(2, '0')}
                </span>
                <span className="text-sm uppercase font-bold text-muted tracking-wider">Days</span>
            </div>
            <div className="flex items-center text-muted text-xl font-bold">:</div>
            <div className="flex-1 bg-surface rounded-lg p-3 text-center border border-border">
                <span className="block text-2xl font-mono font-bold text-foreground">
                    {timeLeft.hours.toString().padStart(2, '0')}
                </span>
                <span className="text-sm uppercase font-bold text-muted tracking-wider">Hrs</span>
            </div>
            <div className="flex items-center text-muted text-xl font-bold">:</div>
            <div className="flex-1 bg-surface rounded-lg p-3 text-center border border-border">
                <span className="block text-2xl font-mono font-bold text-foreground">
                    {timeLeft.minutes.toString().padStart(2, '0')}
                </span>
                <span className="text-sm uppercase font-bold text-muted tracking-wider">Mins</span>
            </div>
        </div>
    );
}
