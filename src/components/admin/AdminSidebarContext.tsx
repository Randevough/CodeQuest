'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface AdminSidebarContextType {
    isMobileOpen: boolean
    toggleMobileSidebar: () => void
    closeMobileSidebar: () => void
}

const AdminSidebarContext = createContext<AdminSidebarContextType | undefined>(undefined)

export function AdminSidebarProvider({ children }: { children: ReactNode }) {
    const [isMobileOpen, setIsMobileOpen] = useState(false)

    const toggleMobileSidebar = () => setIsMobileOpen(prev => !prev)
    const closeMobileSidebar = () => setIsMobileOpen(false)

    return (
        <AdminSidebarContext.Provider value={{ isMobileOpen, toggleMobileSidebar, closeMobileSidebar }}>
            {children}
        </AdminSidebarContext.Provider>
    )
}

export function useAdminSidebar() {
    const context = useContext(AdminSidebarContext)
    if (context === undefined) {
        throw new Error('useAdminSidebar must be used within an AdminSidebarProvider')
    }
    return context
}
