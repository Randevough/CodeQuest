'use client'

import { usePathname, useSearchParams, useRouter } from 'next/navigation'

export function Pagination({ totalPages }: { totalPages: number }) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const router = useRouter()
    const currentPage = Number(searchParams.get('page')) || 1

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams)
        params.set('page', pageNumber.toString())
        return `${pathname}?${params.toString()}`
    }

    const generatePagination = (currentPage: number, totalPages: number) => {
        // If <= 7 pages, show all
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        // 1. Beginning: [1, 2, 3, '...', total-1, total]
        // (Actually standard is usually: if current < 4, show 1,2,3,4,5, ..., total)
        // Let's stick to the requested "7-8 slots" and robust logic.

        // If current is near start (<= 4)
        if (currentPage <= 4) {
            return [1, 2, 3, 4, 5, '...', totalPages];
        }

        // If current is near end (>= total - 3)
        if (currentPage >= totalPages - 3) {
            return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        }

        // Middle
        return [
            1,
            '...',
            currentPage - 1,
            currentPage,
            currentPage + 1,
            '...',
            totalPages,
        ];
    };

    const allPages = generatePagination(currentPage, totalPages);

    if (totalPages <= 1) return null

    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            {/* Previous Button */}
            <button
                onClick={() => router.push(createPageURL(currentPage - 1))}
                disabled={currentPage <= 1}
                className="px-3 py-1.5 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white/5 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-white/10 transition-colors"
            >
                Previous
            </button>

            {/* Pages */}
            <div className="flex items-center gap-1">
                {allPages.map((page, index) => {
                    if (page === '...') {
                        return (
                            <span key={`ellipsis-${index}`} className="w-8 h-8 flex items-center justify-center text-gray-400">
                                ...
                            </span>
                        )
                    }

                    const pageNumber = page as number;
                    const isActive = pageNumber === currentPage

                    return (
                        <button
                            key={pageNumber}
                            onClick={() => router.push(createPageURL(pageNumber))}
                            className={`min-w-[32px] h-8 flex items-center justify-center text-sm font-medium rounded-lg transition-all
                        ${isActive
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 dark:bg-white/5 dark:text-gray-400 dark:border-gray-800 dark:hover:bg-white/10'
                                }
                    `}
                        >
                            {pageNumber}
                        </button>
                    )
                })}
            </div>

            {/* Next Button */}
            <button
                onClick={() => router.push(createPageURL(currentPage + 1))}
                disabled={currentPage >= totalPages}
                className="px-3 py-1.5 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white/5 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-white/10 transition-colors"
            >
                Next
            </button>
        </div>
    )
}
