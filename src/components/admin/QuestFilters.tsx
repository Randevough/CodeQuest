'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition, useState, useEffect, useCallback } from 'react';
import { SearchInput } from '@/components/ui/SearchInput';


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
            <div className="w-full sm:w-80">
                <SearchInput
                    aria-label="Search quests"
                    placeholder="Search quests"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onClear={() => setSearch('')}
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