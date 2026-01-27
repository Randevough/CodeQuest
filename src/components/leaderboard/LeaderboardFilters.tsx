'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'

export function LeaderboardFilters() {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()

    // Get current filters
    const timeframe = searchParams.get('timeframe') || 'all'
    const query = searchParams.get('query') || ''

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams)
        params.set('page', '1') // Reset page on filter change
        if (term) {
            params.set('query', term)
        } else {
            params.delete('query')
        }
        replace(`${pathname}?${params.toString()}`)
    }, 300)

    const handleTimeframeChange = (newTimeframe: string) => {
        const params = new URLSearchParams(searchParams)
        params.set('page', '1')
        params.set('timeframe', newTimeframe)
        replace(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-72 group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-slate-400">search</span>
                </div>
                <input
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg leading-5 bg-white dark:bg-surface-dark placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                    placeholder="Search members..."
                    type="text"
                    defaultValue={query}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                    value={timeframe}
                    onChange={(e) => handleTimeframeChange(e.target.value)}
                    className="block w-full sm:w-48 pl-3 pr-10 py-2.5 text-base border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm rounded-lg bg-white dark:bg-surface-dark text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                    <option value="all">All Time</option>
                    <option value="year">This Year</option>
                    <option value="month">This Month</option>
                </select>
                <button className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark hover:bg-slate-50 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 transition-colors">
                    <span className="material-symbols-outlined">filter_list</span>
                </button>
            </div>
        </div>
    )
}
