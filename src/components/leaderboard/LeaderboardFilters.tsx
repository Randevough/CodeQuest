'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { useState, useRef, useEffect } from 'react'

// --- Reusable Custom Select Component (Matches QuestSearch) ---
type Option = { label: string, value: string }

function CustomSelect({
    value,
    onChange,
    options,
    icon
}: {
    value: string,
    onChange: (val: string) => void,
    options: Option[],
    icon?: string
}) {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    // Handle click outside to close
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const selectedLabel = options.find(o => o.value === value)?.label || options[0].label

    return (
        <div className="relative min-w-[200px]" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between w-full px-4 py-2.5 bg-white dark:bg-surface-dark border border-slate-200 dark:border-gray-700 rounded-xl transition-all duration-200 ease-in-out text-sm font-medium text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-white/5
                ${isOpen ? 'ring-2 ring-orange-500/20 border-orange-500' : ''}`}
            >
                <div className="flex items-center gap-2">
                    {icon && <span className="material-symbols-outlined text-[18px] text-slate-400">{icon}</span>}
                    <span className="truncate">{selectedLabel}</span>
                </div>
                <span className={`material-symbols-outlined text-[20px] text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    keyboard_arrow_down
                </span>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full mt-2 right-0 w-full min-w-[200px] z-50 bg-white dark:bg-surface-dark border border-slate-100 dark:border-gray-800 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <div className="py-1 max-h-[240px] overflow-y-auto">
                        {options.map((option) => {
                            const isSelected = option.value === value
                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(option.value)
                                        setIsOpen(false)
                                    }}
                                    className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors
                                        ${isSelected
                                            ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400'
                                            : 'text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/5'
                                        }
                                    `}
                                >
                                    <span>{option.label}</span>
                                    {isSelected && (
                                        <span className="material-symbols-outlined text-[18px]">check</span>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}
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
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-slate-400 text-[20px]">search</span>
                </div>
                <input
                    className="block w-full pl-12 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl leading-5 bg-white dark:bg-surface-dark placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 sm:text-sm transition-all duration-200 ease-in-out shadow-sm"
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
