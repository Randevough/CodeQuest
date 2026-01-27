'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'

// --- Reusable Custom Select Component ---
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
        <div className="relative min-w-[160px]" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between w-full px-4 py-2.5 bg-white dark:bg-surface-dark border border-slate-200 dark:border-gray-700 rounded-xl transition-all duration-200 ease-in-out text-sm font-medium text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-white/5
                ${isOpen ? 'ring-2 ring-indigo-500/20 border-indigo-500' : ''}`}
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
                <div className="absolute top-full mt-2 left-0 w-full min-w-[200px] z-50 bg-white dark:bg-surface-dark border border-slate-100 dark:border-gray-800 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
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
                                            ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
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

// --- Main Component ---

export function QuestSearch() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleSearch = (formData: FormData) => {
        const params = new URLSearchParams(searchParams)
        const q = formData.get('q') as string
        if (q !== null) {
            if (q) params.set('q', q)
            else params.delete('q')
        }
        router.push(`/?${params.toString()}`)
    }

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams)
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
            className="flex flex-col md:flex-row gap-4 p-1"
        >
            {/* Search Input */}
            <div className="relative flex items-center w-full max-w-md bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-gray-700 transition-all duration-200 ease-in-out focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 shadow-sm">
                <span className="absolute left-4 material-symbols-outlined text-slate-400 text-[20px] pointer-events-none">search</span>
                <input
                    name="q"
                    defaultValue={searchParams.get('q') || ''}
                    className="w-full pl-12 pr-4 py-2.5 bg-transparent border-none outline-none appearance-none text-sm text-slate-700 dark:text-gray-200 placeholder-slate-400"
                    placeholder="Search quests..."
                    type="text"
                    autoComplete="off"
                />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
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

            {/* Hidden submit button to allow Enter key to submit search text */}
            <button type="submit" className="sr-only">Search</button>
        </form>
    )
}
