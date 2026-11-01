'use client'

import { useAdminSidebar } from "./AdminSidebarContext"

export function MobileSidebarTrigger({ className }: { className?: string }) {
    const { toggleMobileSidebar, isMobileOpen } = useAdminSidebar()

    return (
        <button
            onClick={toggleMobileSidebar}
            aria-label="Open admin navigation"
            aria-expanded={isMobileOpen}
            className={`p-2 bg-surface  rounded-md shadow-sm text-muted  border border-border  hover:bg-surface  transition-colors ${className}`}
        >
            <span aria-hidden="true" className="material-symbols-outlined">{isMobileOpen ? 'close' : 'menu'}</span>
        </button>
    )
}