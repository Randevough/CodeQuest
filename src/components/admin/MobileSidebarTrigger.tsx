'use client'

import { useAdminSidebar } from "./AdminSidebarContext"

export function MobileSidebarTrigger({ className }: { className?: string }) {
    const { toggleMobileSidebar, isMobileOpen } = useAdminSidebar()

    return (
        <button
            onClick={toggleMobileSidebar}
            className={`p-2 bg-white dark:bg-slate-800 rounded-md shadow-sm text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${className}`}
        >
            <span className="material-symbols-outlined">{isMobileOpen ? 'close' : 'menu'}</span>
        </button>
    )
}
