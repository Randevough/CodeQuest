'use client'

import { useRouter, useSearchParams } from 'next/navigation'
// import { searchQuests } from '@/actions/quest' // We can't use server action directly in onChange easily without transitions or form action
// Actually, for a simple filter, we can just use router.push on change.

export function QuestSearch() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleSearch = (formData: FormData) => {
        const params = new URLSearchParams(searchParams)
        const q = formData.get('q') as string
        const difficulty = formData.get('difficulty') as string
        const sort = formData.get('sort') as string

        if (q !== null) {
            if (q) params.set('q', q)
            else params.delete('q')
        }

        if (difficulty !== null) {
            if (difficulty && difficulty !== 'All') params.set('difficulty', difficulty)
            else params.delete('difficulty')
        }

        if (sort !== null) {
            if (sort) params.set('sort', sort)
            else params.delete('sort')
        }

        router.push(`/?${params.toString()}`)
    }

    // We can also just use a simple form submission for the text input
    // And onChange for selects to trigger a submit or direct navigation

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams)
        if (value && value !== 'All') {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        router.push(`/?${params.toString()}`)
    }

    return (
        <form
            action={(formData) => handleSearch(formData)}
            className="flex flex-col md:flex-row gap-4 p-1"
        >
            <div className="relative flex-grow max-w-md">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[20px]">search</span>
                <input
                    name="q"
                    defaultValue={searchParams.get('q') || ''}
                    className="w-full pl-12 pr-4 py-2 text-sm border border-gray-200 dark:border-border-dark rounded-md bg-white dark:bg-surface-dark focus:ring-1 focus:ring-primary focus:border-primary placeholder-gray-400 text-black dark:text-white"
                    placeholder="Search quests..."
                    type="text"
                />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                {/* Difficulty Dropdown */}
                <select
                    name="difficulty"
                    defaultValue={searchParams.get('difficulty') || 'All'}
                    onChange={(e) => updateFilter('difficulty', e.target.value)}
                    className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 dark:bg-surface-dark dark:border-border-dark dark:text-gray-300 dark:hover:bg-white/5 transition-colors cursor-pointer outline-none focus:ring-1 focus:ring-primary"
                >
                    <option value="All">All Levels</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                </select>

                {/* Sort Dropdown */}
                <div className="ml-auto md:ml-0 relative">
                    <select
                        name="sort"
                        defaultValue={searchParams.get('sort') || 'Newest'}
                        onChange={(e) => updateFilter('sort', e.target.value)}
                        className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 dark:bg-surface-dark dark:border-border-dark dark:text-gray-300 dark:hover:bg-white/5 transition-colors cursor-pointer outline-none focus:ring-1 focus:ring-primary appearance-none pl-8"
                        style={{ backgroundImage: 'none' }}
                    >
                        <option value="Newest">Newest</option>
                        <option value="Oldest">Oldest</option>
                        <option value="Points (High-Low)">Points (High-Low)</option>
                        <option value="Points (Low-High)">Points (Low-High)</option>
                    </select>
                    <span className="material-symbols-outlined text-[18px] absolute left-2 top-1.5 pointer-events-none text-gray-400">sort</span>
                </div>

                <button type="submit" className="sr-only">Search</button>
            </div>
        </form>
    )
}
