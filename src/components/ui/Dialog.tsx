'use client'

import { useEffect, useId, useRef, type ReactNode } from 'react'

export function Dialog({ open, onClose, title, pending = false, children, className = '' }: {
    open: boolean
    onClose: () => void
    title: string
    pending?: boolean
    children: ReactNode
    className?: string
}) {
    const ref = useRef<HTMLDialogElement>(null)
    const titleId = useId()
    useEffect(() => {
        const dialog = ref.current
        if (!open || !dialog) return
        const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null
        const overflow = document.body.style.overflow
        dialog.showModal()
        document.body.style.overflow = 'hidden'
        return () => {
            dialog.close()
            document.body.style.overflow = overflow
            if (trigger?.isConnected) trigger.focus()
        }
    }, [open])

    return <dialog ref={ref} aria-labelledby={titleId} aria-busy={pending}
        onCancel={event => { event.preventDefault(); if (!pending) onClose() }}
        className={`m-auto w-[calc(100%-2rem)] max-w-xl max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain rounded-dialog border border-control-border bg-surface-raised p-6 text-foreground backdrop:bg-background/80 ${className}`}>
        <h2 id={titleId} className="mb-4 text-xl">{title}</h2>
        {children}
    </dialog>
}
