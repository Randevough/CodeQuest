'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition, useState, useEffect } from 'react';


export function QuestFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const initialStatus = searchParams.get('status') || 'All';
    const initialSearch = searchParams.get('q') || '';

    const [status, setStatus] = useState(initialStatus);
    const [search, setSearch] = useState(initialSearch);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== initialSearch) {
                updateParams({ q: search, page: '1' }); // Reset to page 1 on search
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const updateParams = (updates: Record<string, string>) => {
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
    };

    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus);
        updateParams({ status: newStatus, page: '1' });
    };

    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-80 group">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 material-symbols-outlined text-[20px] transition-colors">search</span>
                <input
                    className="w-full h-9 pl-10 pr-4 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 placeholder:text-slate-400 shadow-sm transition-all"
                    placeholder="Search quests..."
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center bg-white dark:bg-slate-800 rounded-md p-1 border border-slate-200 dark:border-slate-700 shadow-sm h-9">
                    {['All', 'Active', 'Draft'].map((s) => (
                        <button
                            key={s}
                            onClick={() => handleStatusChange(s)}
                            className={`px-3 h-full text-xs font-medium rounded transition-colors ${status === s
                                ? 'text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-700'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800'
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
