"use client";

import React, { forwardRef } from "react";

export interface SearchInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    onClear?: () => void;
    containerClassName?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
    (
        {
            value,
            defaultValue,
            onChange,
            onClear,
            placeholder = "Search...",
            className = "",
            containerClassName = "",
            disabled,
            ...props
        },
        ref
    ) => {
        const [internalVal, setInternalVal] = React.useState(defaultValue ?? "");
        const isControlled = value !== undefined;
        const currentVal = isControlled ? value : internalVal;
        const hasValue = Boolean(currentVal);

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!isControlled) {
                setInternalVal(e.target.value);
            }
            onChange?.(e);
        };

        const handleClear = () => {
            if (!isControlled) {
                setInternalVal("");
            }
            onClear?.();
        };

        return (
            <div
                className={`relative flex items-center w-full min-w-0 group ${containerClassName}`}
            >
                {/* Fixed Non-colliding Icon Slot */}
                <div
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center pointer-events-none text-muted group-focus-within:text-focus transition-colors z-10"
                    aria-hidden="true"
                >
                    <svg
                        className="w-4 h-4 shrink-0"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                        />
                    </svg>
                </div>

                {/* Input with guaranteed non-colliding padding */}
                <input
                    ref={ref}
                    type="text"
                    value={value}
                    defaultValue={defaultValue}
                    onChange={handleInputChange}
                    disabled={disabled}
                    placeholder={placeholder}
                    autoComplete="off"
                    spellCheck={false}
                    className={`w-full h-10 sm:h-11 pl-11 ${
                        onClear ? "pr-11" : "pr-4"
                    } py-2 bg-surface text-foreground placeholder:text-muted rounded-[var(--radius-input)] border border-control-border text-sm font-medium transition-all duration-fast hover:border-border focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/30 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm ${className}`}
                    {...props}
                />

                {/* Clear button if value present and onClear provided */}
                {onClear && hasValue && (
                    <button
                        type="button"
                        onClick={handleClear}
                        aria-label="Clear search query"
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-foreground transition-colors rounded-button focus:outline-none focus:ring-1 focus:ring-focus z-10"
                    >
                        <svg
                            className="w-4 h-4 shrink-0"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                )}
            </div>
        );
    }
);

SearchInput.displayName = "SearchInput";
