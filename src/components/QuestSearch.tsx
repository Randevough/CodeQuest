'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { CustomDropdown, Option } from '@/components/ui/CustomDropdown'

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

export function QuestSearch() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleSearch = (formData: FormData) => {
        const params = new URLSearchParams(searchParams)
        // Reset page when searching
        params.delete('page')

        const q = formData.get('q') as string
        if (q !== null) {
            if (q) params.set('q', q)
            else params.delete('q')
        }
        router.push(`/?${params.toString()}`)
    }

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams)
        // Reset page when filtering
        params.delete('page')

        if (value && value !== 'All') {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        router.push(`/?${params.toString()}`)
    }

    // Options Data
    const difficultyOptions = [
        { label: 'All Levels', value: 'All' },
        { label: 'Beginner', value: 'Beginner' },
        { label: 'Intermediate', value: 'Intermediate' },
        { label: 'Advanced', value: 'Advanced' },
        { label: 'Exclusive', value: 'Exclusive' },
    ]

    const sortOptions = [
        { label: 'Newest', value: 'Newest' },
        { label: 'Oldest', value: 'Oldest' },
        { label: 'Points (High-Low)', value: 'Points (High-Low)' },
        { label: 'Points (Low-High)', value: 'Points (Low-High)' },
    ]

    return (
        <form
            action={(formData) => handleSearch(formData)}
            className="flex flex-col lg:flex-row lg:items-end gap-4"
        >
            {/* Search Input */}
            <div className="flex-1 min-w-0">
                <SearchInput
                    name="q"
                    aria-label="Search quests"
                    defaultValue={searchParams.get('q') || ''}
                    placeholder="Search quests"
                />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-end gap-3">
                <CustomSelect
                    value={searchParams.get('difficulty') || 'All'}
                    onChange={(val) => updateFilter('difficulty', val)}
                    options={difficultyOptions}
                    icon="filter_list"
                />

                <CustomSelect
                    value={searchParams.get('sort') || 'Newest'}
                    onChange={(val) => updateFilter('sort', val)}
                    options={sortOptions}
                    icon="sort"
                />
            </div>

            <button type="submit" className="button-primary self-end">Search</button>
        </form>
    )
}
