'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

export function Pagination({
    totalPages,
    currentPage: controlledPage,
    onPageChange
}: {
    totalPages: number,
    currentPage?: number,
    onPageChange?: (page: number) => void
}) {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // Use controlled page if provided, otherwise fallback to URL search params
    const currentPage = controlledPage ?? (Number(searchParams.get('page')) || 1)

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

        // 1. Beginning
        if (currentPage <= 4) {
            return [1, 2, 3, 4, 5, '...', totalPages];
        }

        // 2. End
        if (currentPage >= totalPages - 3) {
            return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        }

        // 3. Middle
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

    // Helper to render Link or Button
    const PageControl = ({ page, isActive, children, className, disabled }: any) => {
        const isEllipsis = page === '...';

        if (isEllipsis) {
            return <span className={className}>{children}</span>;
        }

        if (disabled) {
            return <span className={className}>{children}</span>;
        }

        if (onPageChange) {
            return (
                <button
                    onClick={() => onPageChange(page as number)}
                    className={className}
                    disabled={disabled}
                >
                    {children}
                </button>
            )
        }

        return (
            <Link href={createPageURL(page)} className={className}>
                {children}
            </Link>
        )
    }

    return (
        <div className="flex items-center justify-center gap-2 mt-0">
            {/* Previous Button */}
            <PageControl
                page={currentPage - 1}
                disabled={currentPage <= 1}
                className={currentPage <= 1
                    ? "px-3 py-1.5 text-sm font-medium text-gray-300 bg-gray-50 border border-gray-100 rounded-lg cursor-not-allowed dark:bg-zinc-800 dark:border-zinc-700 dark:text-gray-600"
                    : "px-3 py-1.5 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 dark:bg-zinc-800 dark:border-zinc-700 dark:text-gray-400 dark:hover:bg-zinc-700 transition-colors"
                }
            >
                Previous
            </PageControl>

            {/* Pages */}
            <div className="flex items-center gap-1">
                {allPages.map((page, index) => {
                    const pageNumber = page === '...' ? '...' : (page as number);
                    const isActive = pageNumber === currentPage;

                    return (
                        <PageControl
                            key={index}
                            page={pageNumber}
                            disabled={pageNumber === '...'}
                            className={pageNumber === '...'
                                ? "w-8 h-8 flex items-center justify-center text-gray-400"
                                : `min-w-[32px] h-8 flex items-center justify-center text-sm font-medium rounded-lg transition-all ${isActive
                                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 dark:bg-zinc-800 dark:text-gray-400 dark:border-zinc-700 dark:hover:bg-zinc-700'}`
                            }
                        >
                            {pageNumber === '...' ? '...' : pageNumber}
                        </PageControl>
                    )
                })}
            </div>

            {/* Next Button */}
            <PageControl
                page={currentPage + 1}
                disabled={currentPage >= totalPages}
                className={currentPage >= totalPages
                    ? "px-3 py-1.5 text-sm font-medium text-gray-300 bg-gray-50 border border-gray-100 rounded-lg cursor-not-allowed dark:bg-zinc-800 dark:border-zinc-700 dark:text-gray-600"
                    : "px-3 py-1.5 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 dark:bg-zinc-800 dark:border-zinc-700 dark:text-gray-400 dark:hover:bg-zinc-700 transition-colors"
                }
            >
                Next
            </PageControl>
        </div>
    )
}
