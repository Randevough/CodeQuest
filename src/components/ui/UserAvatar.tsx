"use client";

import React, { useState } from "react";
import Image from "next/image";

export interface UserAvatarProps {
    src?: string | null;
    avatar?: string | null;
    name?: string | null;
    alt?: string;
    size?: number;
    className?: string;
    imageClassName?: string;
    fallbackClassName?: string;
    unoptimized?: boolean;
}

function getInitials(name?: string | null): string {
    if (!name) return "";
    const clean = name.trim();
    if (!clean) return "";
    const words = clean.split(/\s+/).filter(Boolean);
    if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase();
    }
    return clean.slice(0, 2).toUpperCase();
}

function DefaultAvatarSvg({ className = "w-3/5 h-3/5 text-muted" }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}

export function UserAvatar({
    src,
    avatar,
    name,
    alt,
    size = 40,
    className = "",
    imageClassName = "",
    fallbackClassName = "",
    unoptimized = true,
}: UserAvatarProps) {
    const resolvedSrc = (src ?? avatar)?.trim() || null;
    const [failedSrc, setFailedSrc] = useState<string | null>(null);
    const hasError = Boolean(resolvedSrc && failedSrc === resolvedSrc);

    const initials = getInitials(name);
    const resolvedAlt = alt || name || "User Avatar";

    const getFontSizeClass = (s: number) => {
        if (s <= 28) return "text-[10px]";
        if (s <= 36) return "text-xs";
        if (s <= 48) return "text-sm";
        if (s <= 64) return "text-base";
        if (s <= 96) return "text-xl";
        return "text-3xl";
    };

    return (
        <div
            className={`relative inline-flex items-center justify-center shrink-0 rounded-full overflow-hidden bg-surface-raised border border-border select-none ${className}`}
            style={{ width: size, height: size }}
        >
            {resolvedSrc && !hasError ? (
                <Image
                    src={resolvedSrc}
                    alt={resolvedAlt}
                    width={size}
                    height={size}
                    unoptimized={unoptimized}
                    className={`w-full h-full object-cover ${imageClassName}`}
                    onError={() => setFailedSrc(resolvedSrc)}
                />
            ) : initials ? (
                <span
                    className={`font-mono font-bold text-foreground leading-none ${getFontSizeClass(size)} ${fallbackClassName}`}
                    aria-label={resolvedAlt}
                >
                    {initials}
                </span>
            ) : (
                <DefaultAvatarSvg className={`w-3/5 h-3/5 text-muted ${fallbackClassName}`} />
            )}
        </div>
    );
}
