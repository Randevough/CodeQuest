"use client";

import { useState, useRef, useEffect } from "react";
import {
    format,
    isValid,
    parseISO,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    setYear,
    setMonth,
    isBefore,
    startOfDay,
} from "date-fns";

export interface DatePickerProps {
    value?: string | Date;
    onChange: (date: Date | undefined) => void;
    minDate?: Date;
    placeholder?: string;
    id?: string;
    name?: string;
    className?: string;
    "aria-label"?: string;
    "aria-labelledby"?: string;
    disabled?: boolean;
}

export function DatePicker({
    value,
    onChange,
    minDate,
    placeholder = "Pick a date",
    id,
    name,
    className = "",
    disabled = false,
    "aria-label": label,
    "aria-labelledby": labelledBy,
}: DatePickerProps) {
    const parseValue = (val?: string | Date): Date | undefined => {
        if (!val) return undefined;
        if (val instanceof Date) return isValid(val) ? val : undefined;
        const parsed = parseISO(val);
        return isValid(parsed) ? parsed : undefined;
    };

    const selectedDate = parseValue(value);
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState<Date>(() => selectedDate || minDate || new Date());

    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    // Outside click & Escape key dismissal
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
                triggerRef.current?.focus();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    const handleSelectDay = (day: Date) => {
        if (disabled) return;
        const normalizedMin = minDate ? startOfDay(minDate) : undefined;
        if (normalizedMin && isBefore(day, normalizedMin)) return;

        onChange(day);
        setIsOpen(false);
        triggerRef.current?.focus();
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(undefined);
        triggerRef.current?.focus();
    };

    const formattedValue = selectedDate && isValid(selectedDate) ? format(selectedDate, "yyyy-MM-dd") : "";

    // Calendar grid calculations
    const monthStart = startOfMonth(viewDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday start
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    const currentYear = viewDate.getFullYear();
    const currentMonth = viewDate.getMonth();
    const normalizedMin = minDate ? startOfDay(minDate) : undefined;
    const today = startOfDay(new Date());

    const yearOptions = Array.from({ length: 15 }, (_, i) => currentYear - 5 + i);
    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    return (
        <div ref={containerRef} className="relative w-full">
            {/* Hidden form input for standard form serialization */}
            {name && (
                <input
                    type="hidden"
                    name={name}
                    value={formattedValue}
                    disabled={disabled}
                />
            )}

            {/* Trigger Button */}
            <div className="relative flex items-center">
                <button
                    ref={triggerRef}
                    id={id}
                    type="button"
                    disabled={disabled}
                    aria-haspopup="dialog"
                    aria-expanded={isOpen}
                    aria-label={labelledBy ? undefined : label || placeholder}
                    aria-labelledby={labelledBy}
                    onClick={() => {
                        if (disabled) return;
                        setIsOpen((prev) => {
                            if (!prev && selectedDate && isValid(selectedDate)) {
                                setViewDate(selectedDate);
                            }
                            return !prev;
                        });
                    }}
                    className={`w-full min-w-0 flex items-center justify-between text-left rounded-[var(--radius-input)] border border-control-border bg-surface text-foreground px-3.5 py-2 text-sm font-medium shadow-sm transition-all duration-fast hover:border-border focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/30 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
                >
                    <span className="flex items-center gap-2 truncate">
                        <svg
                            className="w-4 h-4 text-muted shrink-0"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <span className={formattedValue ? "text-foreground font-mono" : "text-muted"}>
                            {formattedValue || placeholder}
                        </span>
                    </span>

                    {formattedValue && !disabled && (
                        <span
                            role="button"
                            tabIndex={0}
                            aria-label="Clear date"
                            onClick={handleClear}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    handleClear(e as unknown as React.MouseEvent);
                                }
                            }}
                            className="p-1 -mr-1 text-muted hover:text-foreground transition-colors rounded-button focus:outline-none focus:ring-1 focus:ring-focus"
                        >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </span>
                    )}
                </button>
            </div>

            {/* Accessible Calendar Dropdown Popover */}
            {isOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Calendar date picker"
                    className="absolute left-0 top-full mt-2 z-50 w-72 rounded-card border border-border bg-surface-raised p-4 shadow-panel animate-fade-in-up"
                >
                    {/* Header: Month/Year navigation */}
                    <div className="flex items-center justify-between mb-3 gap-2">
                        <button
                            type="button"
                            aria-label="Previous month"
                            onClick={() => setViewDate((prev) => subMonths(prev, 1))}
                            className="p-1.5 rounded-button border border-control-border bg-surface text-muted hover:text-foreground hover:bg-surface-raised transition-colors focus:outline-none focus:ring-2 focus:ring-focus"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                            {/* Month Select */}
                            <select
                                aria-label="Month"
                                value={currentMonth}
                                onChange={(e) => setViewDate((prev) => setMonth(prev, Number(e.target.value)))}
                                className="bg-surface text-foreground font-semibold px-2 py-1 rounded-input border border-control-border text-xs focus:outline-none focus:ring-1 focus:ring-focus"
                            >
                                {monthNames.map((m, idx) => (
                                    <option key={m} value={idx}>
                                        {m}
                                    </option>
                                ))}
                            </select>

                            {/* Year Select */}
                            <select
                                aria-label="Year"
                                value={currentYear}
                                onChange={(e) => setViewDate((prev) => setYear(prev, Number(e.target.value)))}
                                className="bg-surface text-foreground font-semibold px-2 py-1 rounded-input border border-control-border text-xs focus:outline-none focus:ring-1 focus:ring-focus"
                            >
                                {yearOptions.map((y) => (
                                    <option key={y} value={y}>
                                        {y}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="button"
                            aria-label="Next month"
                            onClick={() => setViewDate((prev) => addMonths(prev, 1))}
                            className="p-1.5 rounded-button border border-control-border bg-surface text-muted hover:text-foreground hover:bg-surface-raised transition-colors focus:outline-none focus:ring-2 focus:ring-focus"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Day-of-week header */}
                    <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-mono font-bold uppercase text-muted mb-1.5">
                        <span>Su</span>
                        <span>Mo</span>
                        <span>Tu</span>
                        <span>We</span>
                        <span>Th</span>
                        <span>Fr</span>
                        <span>Sa</span>
                    </div>

                    {/* Date Grid */}
                    <div className="grid grid-cols-7 gap-1" role="grid">
                        {calendarDays.map((day) => {
                            const isCurrentMonth = isSameMonth(day, viewDate);
                            const isSelected = selectedDate && isSameDay(day, selectedDate);
                            const isTodayDate = isSameDay(day, today);
                            const isPastMin = normalizedMin ? isBefore(day, normalizedMin) : false;
                            const isDayDisabled = isPastMin;

                            return (
                                <button
                                    key={day.toISOString()}
                                    type="button"
                                    disabled={isDayDisabled}
                                    onClick={() => handleSelectDay(day)}
                                    className={`h-8 w-8 text-xs font-mono rounded-[8px] flex items-center justify-center transition-all ${
                                        isSelected
                                            ? "bg-primary text-on-primary font-bold shadow-primary"
                                            : isTodayDate
                                            ? "border border-focus text-focus font-bold bg-surface"
                                            : isCurrentMonth
                                            ? "text-foreground hover:bg-surface"
                                            : "text-muted/40 hover:bg-surface/50"
                                    } ${isDayDisabled ? "opacity-30 cursor-not-allowed hover:bg-transparent" : "cursor-pointer"}`}
                                >
                                    {format(day, "d")}
                                </button>
                            );
                        })}
                    </div>

                    {/* Footer: Quick Actions */}
                    <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between text-xs">
                        <button
                            type="button"
                            onClick={() => handleSelectDay(new Date())}
                            className="text-focus hover:underline font-semibold"
                        >
                            Today
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="text-muted hover:text-foreground font-semibold"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
