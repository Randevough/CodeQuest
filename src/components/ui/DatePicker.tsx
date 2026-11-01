"use client";
import { format, isValid } from "date-fns";
import { useState } from "react";

interface DatePickerProps {
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
    disabled,
    "aria-label": label,
    "aria-labelledby": labelledBy,
}: DatePickerProps) {
    const dateValue = value instanceof Date ? (isValid(value) ? format(value, "yyyy-MM-dd") : "") : value || "";
    const [initialValue] = useState(dateValue);
    const minimum = minDate && isValid(minDate) ? format(minDate, "yyyy-MM-dd") : undefined;
    // Existing historical deadlines remain valid; newly selected dates obey minimum.
    const unchangedHistorical = dateValue === initialValue && minimum && dateValue < minimum;

    return (
        <input
            type="date"
            id={id}
            name={name}
            disabled={disabled}
            value={dateValue}
            min={unchangedHistorical ? undefined : minimum}
            aria-label={labelledBy ? undefined : label || placeholder}
            aria-labelledby={labelledBy}
            className={`w-full min-w-0 rounded-[var(--radius-input)] border border-control-border bg-surface text-foreground px-3.5 py-2 text-sm font-medium shadow-sm transition-all duration-fast hover:border-border focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/30 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer ${className}`}
            onChange={(event) => {
                const selected = event.target.value;
                if (selected && minimum && selected < minimum) return;
                onChange(selected ? new Date(`${selected}T00:00:00`) : undefined);
            }}
        />
    );
}
