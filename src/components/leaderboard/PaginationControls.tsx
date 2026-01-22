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

    return (
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <p className="text-sm text-slate-500">
                Showing <span className="font-medium text-slate-900 dark:text-white">{Math.min((page - 1) * pageSize + 1, total)}</span> to <span className="font-medium text-slate-900 dark:text-white">{Math.min(page * pageSize, total)}</span> of <span className="font-medium text-slate-900 dark:text-white">{total}</span>
            </p>
            <div className="flex gap-2">
                {hasPrev ? (
                    <Link href={`/leaderboard?page=${page - 1}`} className="px-3 py-1 text-sm border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-white/5 text-slate-900 dark:text-white">
                        Previous
                    </Link>
                ) : (
                    <button className="px-3 py-1 text-sm border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-white/5 opacity-50 cursor-not-allowed" disabled>
                        Previous
                    </button>
                )}

                {hasNext ? (
                    <Link href={`/leaderboard?page=${page + 1}`} className="px-3 py-1 text-sm border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-white/5 text-slate-900 dark:text-white">
                        Next
                    </Link>
                ) : (
                    <button className="px-3 py-1 text-sm border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-white/5 opacity-50 cursor-not-allowed" disabled>
                        Next
                    </button>
                )}
            </div>
        </div>
    )
}
