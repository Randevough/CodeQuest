'use client'

import { useAdminSidebar } from "./AdminSidebarContext"
import { Menu, X } from "lucide-react"

export function MobileSidebarTrigger({ className }: { className?: string }) {
    const { toggleMobileSidebar, isMobileOpen } = useAdminSidebar()

    return (
        <button
            onClick={toggleMobileSidebar}
            aria-label="Open admin navigation"
            aria-expanded={isMobileOpen}
            className={`p-2 bg-surface rounded-md shadow-sm text-muted border border-border hover:bg-surface-raised transition-colors ${className}`}
        >
            {isMobileOpen ? <X className="w-5 h-5 text-foreground" /> : <Menu className="w-5 h-5 text-foreground" />}
        </button>
    )
}