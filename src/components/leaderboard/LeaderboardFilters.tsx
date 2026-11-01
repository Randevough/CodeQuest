'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { CustomDropdown, Option } from '@/components/ui/CustomDropdown'

// --- Reusable Custom Select Component (Matches QuestSearch) ---
import { SearchInput } from '@/components/ui/SearchInput'

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
    const q = searchParams.get('q') || searchParams.get('query') || ''

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams)
        params.set('page', '1') // Reset page on filter change
        params.delete('query')
        if (term) {
            params.set('q', term)
        } else {
            params.delete('q')
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
            <div className="w-full sm:w-72">
                <SearchInput
                    aria-label="Search members"
                    placeholder="Search members"
                    defaultValue={q}
                    onChange={(e) => handleSearch(e.target.value)}
                    onClear={() => handleSearch('')}
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
