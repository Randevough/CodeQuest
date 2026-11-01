"use client";

import { useEffect, useRef, useState, useId } from "react";

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
    icon,
    className = "",
    id,
    name,
    disabled,
    "aria-label": label,
    "aria-labelledby": labelledBy,
}: CustomDropdownProps) {
    const generatedId = useId();
    const dropdownId = id || generatedId;
    const listboxId = `${dropdownId}-listbox`;

    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const listboxRef = useRef<HTMLUListElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    // Close on outside click
    useEffect(() => {
        if (!isOpen) return;

        function handleClickOutside(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const openDropdown = () => {
        if (disabled) return;
        const index = options.findIndex((opt) => opt.value === value);
        setFocusedIndex(index >= 0 ? index : 0);
        setIsOpen(true);
    };

    // Scroll active item into view
    useEffect(() => {
        if (isOpen && focusedIndex >= 0 && listboxRef.current) {
            const items = listboxRef.current.children;
            if (items[focusedIndex]) {
                (items[focusedIndex] as HTMLElement).scrollIntoView({
                    block: "nearest",
                });
            }
        }
    }, [focusedIndex, isOpen]);

    function handleKeyDown(e: React.KeyboardEvent) {
        if (disabled) return;

        switch (e.key) {
            case "Enter":
            case " ":
                e.preventDefault();
                if (isOpen) {
                    if (focusedIndex >= 0 && options[focusedIndex]) {
                        onChange(options[focusedIndex].value);
                        setIsOpen(false);
                        triggerRef.current?.focus();
                    }
                } else {
                    openDropdown();
                }
                break;

            case "ArrowDown":
            case "ArrowUp":
                e.preventDefault();
                if (!isOpen) {
                    openDropdown();
                } else {
                    setFocusedIndex((prev) =>
                        e.key === "ArrowDown"
                            ? (prev < options.length - 1 ? prev + 1 : 0)
                            : (prev > 0 ? prev - 1 : options.length - 1)
                    );
                }
                break;

            case "Escape":
                e.preventDefault();
                setIsOpen(false);
                triggerRef.current?.focus();
                break;

            case "Tab":
                if (isOpen) {
                    setIsOpen(false);
                }
                break;

            case "Home":
                if (isOpen) {
                    e.preventDefault();
                    setFocusedIndex(0);
                }
                break;

            case "End":
                if (isOpen) {
                    e.preventDefault();
                    setFocusedIndex(options.length - 1);
                }
                break;
        }
    }

    return (
        <div
            ref={containerRef}
            className={`relative inline-block w-full min-w-0 ${className}`}
        >
            {/* Native hidden input for form submissions */}
            {name && <input type="hidden" name={name} value={value} />}

            {/* Custom Trigger */}
            <button
                ref={triggerRef}
                id={dropdownId}
                type="button"
                disabled={disabled}
                onClick={() => !disabled && (isOpen ? setIsOpen(false) : openDropdown())}
                onKeyDown={handleKeyDown}
                role="combobox"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                aria-controls={listboxId}
                aria-label={labelledBy ? undefined : label || placeholder}
                aria-labelledby={labelledBy}
                className="w-full min-h-[44px] flex items-center justify-between gap-2.5 rounded-[var(--radius-input)] border border-control-border bg-surface text-foreground px-3.5 py-2 text-sm font-medium shadow-sm transition-all duration-fast hover:border-border focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/30 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
                <div className="flex items-center gap-2 truncate min-w-0">
                    {icon && (
                        <span
                            className="material-symbols-outlined text-[18px] text-muted shrink-0"
                            aria-hidden="true"
                        >
                            {icon}
                        </span>
                    )}
                    <span
                        className={`truncate ${
                            selectedOption ? "text-foreground font-semibold" : "text-muted"
                        }`}
                    >
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                </div>

                {/* Animated Theme-aligned Chevron */}
                <svg
                    className={`h-4 w-4 shrink-0 text-muted transition-transform duration-fast ${
                        isOpen ? "rotate-180 text-focus" : ""
                    }`}
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
            </button>

            {/* Custom Popover Surface */}
            {isOpen && (
                <div className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-card border border-border bg-surface-raised p-1.5 shadow-panel max-h-60 overflow-y-auto styled-scrollbar animate-fade-in-up">
                    <ul
                        ref={listboxRef}
                        id={listboxId}
                        role="listbox"
                        aria-label={label || placeholder}
                        tabIndex={-1}
                        className="space-y-0.5 outline-none"
                    >
                        {options.map((option, idx) => {
                            const isSelected = option.value === value;
                            const isFocused = idx === focusedIndex;

                            return (
                                <li
                                    key={option.value}
                                    id={`${dropdownId}-option-${idx}`}
                                    role="option"
                                    aria-selected={isSelected}
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                        triggerRef.current?.focus();
                                    }}
                                    onMouseEnter={() => setFocusedIndex(idx)}
                                    className={`flex items-center justify-between px-3 py-2 text-sm rounded-button cursor-pointer transition-colors duration-fast select-none ${
                                        isSelected
                                            ? "bg-primary text-on-primary font-bold shadow-sm"
                                            : isFocused
                                            ? "bg-surface text-foreground font-semibold"
                                            : "text-muted hover:text-foreground hover:bg-surface/60"
                                    }`}
                                >
                                    <span className="truncate">{option.label}</span>
                                    {isSelected && (
                                        <svg
                                            className="w-4 h-4 shrink-0 ml-2"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}
