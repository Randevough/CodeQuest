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
        <div className="px-6 py-4 border-t border-border flex items-center justify-between">
            <p className="text-sm text-muted hidden sm:block">
                Showing <span className="font-medium text-foreground">{Math.min((page - 1) * pageSize + 1, total)}</span> to <span className="font-medium text-foreground">{Math.min(page * pageSize, total)}</span> of <span className="font-medium text-foreground">{total}</span>
            </p>

            <div className="flex items-center gap-2 justify-center w-full sm:w-auto">
                <Link
                    href={`/leaderboard?page=${page - 1}`}
                    className={`inline-flex min-h-11 items-center px-3 py-1.5 text-sm border border-border rounded-lg transition-colors
                        ${!hasPrev
                            ? 'bg-surface  cursor-not-allowed pointer-events-none'
                            : 'bg-surface hover:bg-surface-raised text-foreground'
                        }`}
                    aria-disabled={!hasPrev}
                    tabIndex={hasPrev ? 0 : -1}
                >
                    Previous
                </Link>

                <div className="hidden sm:flex items-center gap-1">
                    {getPageNumbers().map((p, i) => (
                        p === '...' ? (
                            <span key={`ellipsis-${i}`} className="px-2 text-muted">...</span>
                        ) : (
                            <Link
                                key={p}
                                aria-current={Number(p) === page ? 'page' : undefined}
                                href={`/leaderboard?page=${p}`}
                                className={`min-w-11 min-h-11 flex items-center justify-center text-sm font-medium rounded-lg transition-colors
                                    ${Number(p) === page
                                        ? 'bg-secondary text-secondary-foreground  '
                                        : 'bg-surface text-muted border border-border hover:bg-surface-raised'
                                    }`}
                            >
                                {p}
                            </Link>
                        )
                    ))}
                </div>

                <Link
                    href={`/leaderboard?page=${page + 1}`}
                    className={`inline-flex min-h-11 items-center px-3 py-1.5 text-sm border border-border rounded-lg transition-colors
                        ${!hasNext
                            ? 'bg-surface  cursor-not-allowed pointer-events-none'
                            : 'bg-surface hover:bg-surface-raised text-foreground'
                        }`}
                    aria-disabled={!hasNext}
                    tabIndex={hasNext ? 0 : -1}
                >
                    Next
                </Link>
            </div>
        </div>
    )
}
