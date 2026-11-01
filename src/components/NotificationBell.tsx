"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
    getNotifications,
    getUnreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
} from "@/actions/notification";

interface NotificationItem {
    id: string;
    type: string;
    message: string;
    read: boolean;
    link?: string | null;
    createdAt: Date;
}

export function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    const fetchUnread = async () => {
        try {
            const count = await getUnreadNotificationCount();
            setUnreadCount(count);
        } catch {
            // non-fatal
        }
    };

    const loadNotifications = async () => {
        setLoading(true);
        try {
            const res = await getNotifications(10);
            if (res.success && res.data) {
                setNotifications(res.data as unknown as NotificationItem[]);
            }
        } catch {
            // non-fatal
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUnread();
        const interval = setInterval(fetchUnread, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isOpen) {
            loadNotifications();
        }
    }, [isOpen]);

    // Handle outside click and Escape
    useEffect(() => {
        if (!isOpen) return;

        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }

        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") {
                setIsOpen(false);
                triggerRef.current?.focus();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    const handleMarkAsRead = async (id: string) => {
        await markNotificationRead(id);
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
    };

    const handleMarkAllRead = async () => {
        await markAllNotificationsRead();
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
    };

    return (
        <div ref={containerRef} className="relative">
            <button
                ref={triggerRef}
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-expanded={isOpen}
                aria-haspopup="dialog"
                aria-label={`Notifications, ${unreadCount} unread`}
                className="relative flex h-11 w-11 items-center justify-center rounded-button border border-control-border bg-surface text-foreground transition-all duration-fast hover:border-border hover:bg-surface-raised focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/30"
            >
                <svg
                    className="h-5 w-5 text-muted hover:text-foreground"
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
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                </svg>

                {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 font-mono text-[11px] font-bold text-on-primary shadow-sm">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div
                    role="dialog"
                    aria-label="Notifications panel"
                    className="absolute right-0 top-full mt-2 z-50 w-80 sm:w-96 rounded-card border border-border bg-surface-raised p-4 shadow-panel animate-fade-in-up"
                >
                    <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
                        <div className="flex items-center gap-2">
                            <span className="font-display text-sm tracking-wide text-foreground">
                                NOTIFICATIONS
                            </span>
                            {unreadCount > 0 && (
                                <span className="rounded-full bg-primary/20 px-2 py-0.5 font-mono text-xs font-semibold text-primary">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button
                                type="button"
                                onClick={handleMarkAllRead}
                                className="text-xs font-semibold text-focus hover:underline"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-80 overflow-y-auto space-y-2 styled-scrollbar">
                        {loading && notifications.length === 0 ? (
                            <div className="py-8 text-center text-xs text-muted">
                                Loading notifications...
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="py-8 text-center text-xs text-muted">
                                No notifications yet
                            </div>
                        ) : (
                            notifications.map((item) => (
                                <div
                                    key={item.id}
                                    className={`group flex items-start justify-between gap-3 rounded-button border p-3 text-xs transition-colors ${
                                        item.read
                                            ? "border-border/40 bg-surface/40 text-muted"
                                            : "border-border bg-surface text-foreground font-medium shadow-sm"
                                    }`}
                                >
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <p className="leading-snug break-words">
                                            {item.message}
                                        </p>
                                        <div className="flex items-center gap-2 text-[10px] text-muted">
                                            <span>
                                                {new Date(item.createdAt).toLocaleDateString(undefined, {
                                                    month: "short",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                            {item.link && (
                                                <Link
                                                    href={item.link}
                                                    onClick={() => {
                                                        if (!item.read) handleMarkAsRead(item.id);
                                                        setIsOpen(false);
                                                    }}
                                                    className="text-focus hover:underline font-semibold"
                                                >
                                                    View
                                                </Link>
                                            )}
                                        </div>
                                    </div>

                                    {!item.read && (
                                        <button
                                            type="button"
                                            onClick={() => handleMarkAsRead(item.id)}
                                            aria-label="Mark notification read"
                                            className="shrink-0 text-muted hover:text-focus transition-colors p-1"
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
