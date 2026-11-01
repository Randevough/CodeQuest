"use client";

export type Option = { label: string; value: string };

interface CustomDropdownProps {
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    placeholder?: string;
    icon?: string;
    className?: string;
    id?: string;
    name?: string;
    "aria-label"?: string;
    "aria-labelledby"?: string;
    disabled?: boolean;
}

export function CustomDropdown({
    value,
    onChange,
    options,
    placeholder = "Select option",
    className = "",
    id,
    name,
    disabled,
    "aria-label": label,
    "aria-labelledby": labelledBy,
}: CustomDropdownProps) {
    return (
        <div className={`relative inline-block w-full min-w-0 ${className}`}>
            <select
                id={id}
                name={name}
                disabled={disabled}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                aria-label={labelledBy ? undefined : label || placeholder}
                aria-labelledby={labelledBy}
                className="w-full appearance-none rounded-[var(--radius-input)] border border-control-border bg-surface text-foreground py-2 pl-3.5 pr-9 text-sm font-medium shadow-sm transition-all duration-fast hover:border-border focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/30 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                style={{ backgroundImage: "none" }}
            >
                {!options.some((option) => option.value === value) && (
                    <option value="" disabled className="bg-surface text-muted">
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option key={option.value} value={option.value} className="bg-surface text-foreground">
                        {option.label}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-muted">
                <svg
                    className="h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                    />
                </svg>
            </div>
        </div>
    );
}
