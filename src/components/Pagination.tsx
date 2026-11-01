"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export interface PageControlProps {
    page: number | string; children: React.ReactNode; className?: string; disabled?: boolean;
    onPageChange?: (page: number) => void; createPageURL: (page: number | string) => string;
    current?: boolean; label?: string;
}
const PageControl = ({ page, children, className, disabled, onPageChange, createPageURL, current, label }: PageControlProps) => {
    if (page === "...") return <span aria-hidden="true" className={className}>{children}</span>;
    if (disabled) return <span aria-disabled="true" aria-label={label} className={className}>{children}</span>;
    if (onPageChange) return <button type="button" onClick={() => onPageChange(Number(page))} aria-current={current ? "page" : undefined} aria-label={label} className={className}>{children}</button>;
    return <Link href={createPageURL(page)} aria-current={current ? "page" : undefined} aria-label={label} className={className}>{children}</Link>;
};
export function Pagination({ totalPages, currentPage: controlledPage, onPageChange }: { totalPages: number; currentPage?: number; onPageChange?: (page: number) => void }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPage = controlledPage ?? (Number(searchParams.get("page")) || 1);
    const createPageURL = (page: number | string) => { const params = new URLSearchParams(searchParams); params.set("page", String(page)); return `${pathname}?${params}`; };
    if (totalPages <= 1) return null;
    const pages: (number | string)[] = [];
    for (let page = 1; page <= totalPages; page++) {
        if (page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) pages.push(page);
        else if (pages[pages.length - 1] !== "...") pages.push("...");
    }
    const base = "inline-flex min-h-11 min-w-11 items-center justify-center rounded-button border px-3 text-sm font-semibold";
    const idle = `${base} border-control-border bg-surface text-foreground hover:bg-surface-raised`;
    return <nav aria-label="Pagination" className="flex flex-wrap items-center justify-center gap-2">
        <PageControl page={currentPage - 1} disabled={currentPage <= 1} label="Previous page" className={idle} onPageChange={onPageChange} createPageURL={createPageURL}>Previous</PageControl>
        {pages.map((page, index) => <PageControl key={index} page={page} current={page === currentPage} label={page === "..." ? undefined : `Page ${page}`} className={page === currentPage ? `${base} border-secondary bg-secondary text-secondary-foreground` : page === "..." ? "px-1 text-muted" : idle} onPageChange={onPageChange} createPageURL={createPageURL}>{page}</PageControl>)}
        <PageControl page={currentPage + 1} disabled={currentPage >= totalPages} label="Next page" className={idle} onPageChange={onPageChange} createPageURL={createPageURL}>Next</PageControl>
    </nav>;
}
