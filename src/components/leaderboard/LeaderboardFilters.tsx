'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { CustomDropdown, Option } from '@/components/ui/CustomDropdown'

// --- Reusable Custom Select Component (Matches QuestSearch) ---
function CustomSelect({ value, onChange, options, icon }: {
    value: string, onChange: (value: string) => void, options: Option[], icon?: string
}) {
    const label = icon === 'sort' ? 'Sort quests' : icon === 'filter_list' ? 'Difficulty' : 'Timeframe'
    return (
        <div className="flex min-w-0 flex-1 flex-col gap-1 text-sm text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</span>
            <CustomDropdown
                value={value}
                onChange={onChange}
                options={options}
                aria-label={label}
            />
        </div>
    )
}

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

    const timeframeOptions = [
        { label: 'All Time', value: 'all' },
        { label: 'This Year', value: 'year' },
        { label: 'This Month', value: 'month' },
    ]

    return (
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-72 group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none material-symbols-outlined text-muted text-[20px]">
                    search
                </span>
                <input
                    className="block w-full pl-12 pr-4 py-2.5 border border-control-border rounded-[var(--radius-input)] break-words leading-5 bg-surface placeholder-muted focus:outline-none focus:ring-2 focus:ring-focus/30 focus:border-focus sm:text-sm transition-all duration-fast ease-in-out"
                    aria-label="Search members"
                    placeholder="Search members..."
                    type="text"
                    defaultValue={query}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>
            <div className="w-full sm:w-auto">
                <CustomSelect
                    value={timeframe}
                    onChange={handleTimeframeChange}
                    options={timeframeOptions}
                    icon="calendar_today"
                />
            </div>
        </div>
    )
}
