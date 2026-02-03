'use client'

import { useState, useRef, useEffect } from 'react'
import { format, isValid, parseISO } from 'date-fns'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/style.css'

interface DatePickerProps {
    value?: string | Date
    onChange: (date: Date | undefined) => void
    minDate?: Date
    placeholder?: string
}

export function DatePicker({
    value,
    onChange,
    minDate,
    placeholder = "Pick a date"
}: DatePickerProps) {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    // Handle click outside to close
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    // Parse value to Date object for DayPicker
    const selectedDate = typeof value === 'string' ? (value ? parseISO(value) : undefined) : value

    const handleSelect = (date: Date | undefined) => {
        onChange(date)
        setIsOpen(false)
    }

    const displayValue = selectedDate && isValid(selectedDate)
        ? format(selectedDate, 'MMM dd, yyyy')
        : placeholder

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between w-full h-10 px-3 rounded-md border text-sm transition-all duration-200 ease-in-out
                ${isOpen
                        ? 'ring-2 ring-orange-500/20 border-orange-500 bg-white dark:bg-slate-900'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:bg-white dark:hover:bg-slate-800'
                    }
                text-slate-700 dark:text-slate-200`}
            >
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-slate-400">calendar_today</span>
                    <span className={!selectedDate ? 'text-slate-400' : ''}>{displayValue}</span>
                </div>
            </button>

            {/* Popover */}
            {isOpen && (
                <div className="absolute top-full mt-2 left-0 z-50 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl animate-in fade-in zoom-in-95 duration-100">
                    <DayPicker
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleSelect}
                        disabled={minDate ? { before: minDate } : undefined}
                        modifiersClassNames={{
                            selected: 'bg-orange-500 text-white rounded-full',
                            today: 'text-orange-500 font-bold'
                        }}
                        styles={{
                            caption: { color: 'inherit' },
                            head_cell: { color: '#94a3b8' }, // slate-400
                            day: { color: 'inherit' }
                        }}
                        showOutsideDays
                    />
                </div>
            )}
        </div>
    )
}
