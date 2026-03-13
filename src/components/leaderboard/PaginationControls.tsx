import Link from 'next/link'

interface PaginationControlsProps {
    page: number
    pageSize: number
    total: number
}

export function PaginationControls({ page, pageSize, total }: PaginationControlsProps) {
    const totalPages = Math.ceil(total / pageSize)
    const hasNext = page < totalPages
    const hasPrev = page > 1

    // Generate page numbers to show
    const getPageNumbers = () => {
        const pages = []
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            if (page <= 4) {
                // Near start: 1 2 3 4 5 ... 10
                for (let i = 1; i <= 5; i++) pages.push(i)
                pages.push('...')
                pages.push(totalPages)
            } else if (page >= totalPages - 3) {
                // Near end: 1 ... 6 7 8 9 10
                pages.push(1)
                pages.push('...')
                for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i)
            } else {
                // Middle: 1 ... 4 5 6 ... 10
                pages.push(1)
                pages.push('...')
                for (let i = page - 1; i <= page + 1; i++) pages.push(i)
                pages.push('...')
                pages.push(totalPages)
            }
        }
        return pages
    }

    return (
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <p className="text-sm text-slate-500 hidden sm:block">
                Showing <span className="font-medium text-slate-900 dark:text-white">{Math.min((page - 1) * pageSize + 1, total)}</span> to <span className="font-medium text-slate-900 dark:text-white">{Math.min(page * pageSize, total)}</span> of <span className="font-medium text-slate-900 dark:text-white">{total}</span>
            </p>

            <div className="flex items-center gap-2 justify-center w-full sm:w-auto">
                <Link
                    href={`/leaderboard?page=${page - 1}`}
                    className={`px-3 py-1.5 text-sm border border-slate-200 dark:border-slate-700 rounded-lg transition-colors
                        ${!hasPrev
                            ? 'bg-slate-50 dark:bg-zinc-800 opacity-50 cursor-not-allowed pointer-events-none'
                            : 'hover:bg-slate-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-slate-300'
                        }`}
                    aria-disabled={!hasPrev}
                >
                    Previous
                </Link>

                <div className="hidden sm:flex items-center gap-1">
                    {getPageNumbers().map((p, i) => (
                        p === '...' ? (
                            <span key={`ellipsis-${i}`} className="px-2 text-slate-400">...</span>
                        ) : (
                            <Link
                                key={p}
                                href={`/leaderboard?page=${p}`}
                                className={`min-w-[32px] h-[32px] flex items-center justify-center text-sm font-medium rounded-lg transition-colors
                                    ${Number(p) === page
                                        ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                                        : 'bg-white dark:bg-zinc-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-zinc-700'
                                    }`}
                            >
                                {p}
                            </Link>
                        )
                    ))}
                </div>

                <Link
                    href={`/leaderboard?page=${page + 1}`}
                    className={`px-3 py-1.5 text-sm border border-slate-200 dark:border-slate-700 rounded-lg transition-colors
                        ${!hasNext
                            ? 'bg-slate-50 dark:bg-zinc-800 opacity-50 cursor-not-allowed pointer-events-none'
                            : 'hover:bg-slate-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-slate-300'
                        }`}
                    aria-disabled={!hasNext}
                >
                    Next
                </Link>
            </div>
        </div>
    )
}
