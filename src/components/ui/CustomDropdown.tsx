'use client'

import { useState, useRef, useEffect } from 'react'

export type Option = { label: string, value: string }

interface CustomDropdownProps {
    value: string
    onChange: (val: string) => void
    options: Option[]
    placeholder?: string
    icon?: string
    className?: string
}

export function CustomDropdown({
    value,
    onChange,
    options,
    placeholder = 'Select Option',
    icon,
    className = ''
}: CustomDropdownProps) {
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

    const selectedOption = options.find(o => o.value === value)
    const displayLabel = selectedOption ? selectedOption.label : placeholder

    return (
        <div className={`relative ${className}`} ref={containerRef}>
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
                <div className="flex items-center gap-2 truncate">
                    {icon && <span className="material-symbols-outlined text-[18px] text-slate-400">{icon}</span>}
                    <span className={!selectedOption ? 'text-slate-400' : ''}>{displayLabel}</span>
                </div>
                <span className={`material-symbols-outlined text-[20px] text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    keyboard_arrow_down
                </span>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full mt-1 left-0 w-full z-50 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 max-h-[240px] overflow-y-auto">
                    <div className="py-1">
                        {options.map((option) => {
                            const isSelected = option.value === value
                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(option.value)
                                        setIsOpen(false)
                                    }}
                                    className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between transition-colors
                                        ${isSelected
                                            ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 font-medium'
                                            : 'text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/5'
                                        }
                                    `}
                                >
                                    <span>{option.label}</span>
                                    {isSelected && (
                                        <span className="material-symbols-outlined text-[18px]">check</span>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
