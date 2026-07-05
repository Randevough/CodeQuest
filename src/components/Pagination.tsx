'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

export interface PageControlProps {
    page: number | string;
    isActive?: boolean;
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
    onPageChange?: (page: number) => void;
    createPageURL: (pageNumber: number | string) => string;
}

const PageControl = ({ page, isActive, children, className, disabled, onPageChange, createPageURL }: PageControlProps) => {
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



    return (
        <div className="flex items-center justify-center gap-2 mt-0">
            {/* Previous Button */}
            <PageControl
                page={currentPage - 1}
                disabled={currentPage <= 1}
                className={currentPage <= 1
                    ? 'p-2 text-slate-300 dark:text-slate-600 cursor-not-allowed pointer-events-none'
                    : 'p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors'}
                onPageChange={onPageChange}
                createPageURL={createPageURL}
            >
                <span className="material-symbols-outlined text-xl">chevron_left</span>
            </PageControl>

            {/* Pages */}
            <div className="flex gap-1">
                {allPages.map((page, i) => {
                    const isActive = page === currentPage
                    const isEllipsis = page === '...'

                    return (
                        <PageControl
                            key={i}
                            page={page}
                            isActive={isActive}
                            className={`min-w-[36px] h-[36px] px-2 flex items-center justify-center rounded-lg text-sm font-medium transition-all
                                ${isActive
                                    ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-600/20'
                                    : isEllipsis
                                        ? 'text-slate-400 dark:text-slate-500 pointer-events-none'
                                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                            onPageChange={onPageChange}
                            createPageURL={createPageURL}
                        >
                            {page}
                        </PageControl>
                    )
                })}
            </div>

            {/* Next Button */}
            <PageControl
                page={currentPage + 1}
                disabled={currentPage >= totalPages}
                className={currentPage >= totalPages
                    ? 'p-2 text-slate-300 dark:text-slate-600 cursor-not-allowed pointer-events-none'
                    : 'p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors'}
                onPageChange={onPageChange}
                createPageURL={createPageURL}
            >
                <span className="material-symbols-outlined text-xl">chevron_right</span>
            </PageControl>
        </div>
    )
}
