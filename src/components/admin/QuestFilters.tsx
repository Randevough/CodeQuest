'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition, useState, useEffect, useCallback } from 'react';


export function QuestFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [, startTransition] = useTransition();

    const initialStatus = searchParams.get('status') || 'All';
    const initialSearch = searchParams.get('q') || '';

    const [status, setStatus] = useState(initialStatus);
    const [search, setSearch] = useState(initialSearch);

    const updateParams = useCallback((updates: Record<string, string>) => {
        const params = new URLSearchParams(searchParams);
        Object.entries(updates).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });
        startTransition(() => {
            router.replace(`?${params.toString()}`, { scroll: false });
        });
    }, [searchParams, router]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== initialSearch) {
                updateParams({ q: search, page: '1' }); // Reset to page 1 on search
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search, initialSearch, updateParams]);

    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus);
        updateParams({ status: newStatus, page: '1' });
    };

    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-80 group">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-warning pointer-events-none flex items-center justify-center transition-colors">
                    <span aria-hidden="true" className="material-symbols-outlined text-[20px]">search</span>
                </span>
                <input
                    className="w-full h-10 pl-11 pr-4 rounded-[var(--radius-input)] bg-surface border border-control-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-focus/30 focus:border-focus placeholder:text-muted shadow-sm transition-all"
                    aria-label="Search quests" placeholder="Search quests..."
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center bg-surface rounded-md p-1 border border-border shadow-sm min-h-11">
                    {['All', 'Active', 'Draft'].map((s) => (
                        <button
                            key={s}
                            aria-pressed={status === s}
                            onClick={() => handleStatusChange(s)}
                            className={`px-3 h-full text-xs font-medium rounded transition-colors ${status === s
                                ? 'text-foreground  bg-surface-raised '
                                : 'text-muted  hover:text-foreground  hover:bg-surface '
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}