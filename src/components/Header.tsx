"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { ThemeToggle } from "./ThemeToggle";
import { NotificationBell } from "./NotificationBell";
import { UserAvatar } from "./ui/UserAvatar";

interface HeaderProps {
    activePage?: "explore" | "leaderboard" | "workspace";
}

const navLinks = [
    { id: "explore", href: "/explore", label: "Explore Quests" },
    { id: "leaderboard", href: "/leaderboard", label: "Leaderboard" },
    { id: "workspace", href: "/workspace", label: "My Workspace" },
] as const;

export function Header({ activePage }: HeaderProps) {
    const { data: session } = useSession();
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

    const accountRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const drawerRef = useRef<HTMLDivElement>(null);

    // Close floating account dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                accountRef.current &&
                !accountRef.current.contains(event.target as Node)
            ) {
                setIsAccountOpen(false);
            }
        }

        if (isAccountOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isAccountOpen]);

    // Handle ESC key for popover and drawer
    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                if (isAccountOpen) {
                    setIsAccountOpen(false);
                    triggerRef.current?.focus();
                }
                if (isMobileDrawerOpen) {
                    setIsMobileDrawerOpen(false);
                }
            }
        }

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isAccountOpen, isMobileDrawerOpen]);

    const closeAll = () => {
        setIsAccountOpen(false);
        setIsMobileDrawerOpen(false);
    };

    const navItemClass = (pageId: string) =>
        `flex min-h-11 items-center px-4 py-2 rounded-button text-sm font-semibold transition-colors ${
            activePage === pageId
                ? "bg-secondary text-secondary-foreground"
                : "text-muted hover:text-foreground hover:bg-surface-raised"
        }`;

    const dropdownItemClass =
        "flex items-center gap-2.5 w-full px-3 py-2 text-sm font-medium rounded-button text-foreground hover:bg-surface-raised transition-colors";

    const user = session?.user;
    const isAdmin = user?.role === "Admin";
    const userPoints = user?.points ?? 0;

    return (
        <header className="relative z-40 border-b border-border bg-surface text-foreground">
            <div className="page-container flex min-h-20 items-center justify-between gap-4 py-3">
                {/* Brand */}
                <Link
                    href="/"
                    onClick={closeAll}
                    className="flex min-h-11 shrink-0 items-center gap-2 font-display text-lg tracking-tight hover:opacity-90 transition-opacity"
                >
                    <Image
                        src="/icon-big.png"
                        alt="CodeQuest Logo"
                        width={32}
                        height={32}
                        className="shrink-0"
                    />
                    <span>CodeQuest</span>
                </Link>

                {/* Desktop Navigation */}
                <nav
                    aria-label="Main navigation"
                    className="hidden lg:flex items-center gap-1"
                >
                    {navLinks.map((link) => (
                        <Link
                            key={link.id}
                            href={link.href}
                            aria-current={activePage === link.id ? "page" : undefined}
                            className={navItemClass(link.id)}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-2">
                    {user && <NotificationBell />}
                    <ThemeToggle />

                    {/* Desktop Account Trigger & Popover */}
                    {user ? (
                        <div ref={accountRef} className="relative hidden sm:block">
                            <button
                                ref={triggerRef}
                                type="button"
                                aria-expanded={isAccountOpen}
                                aria-haspopup="menu"
                                aria-label="Account options menu"
                                onClick={() => setIsAccountOpen(!isAccountOpen)}
                                className="flex items-center gap-2.5 min-h-11 py-1.5 px-2.5 rounded-button border border-control-border bg-surface hover:bg-surface-raised focus:outline-none focus:ring-2 focus:ring-focus/40 transition-colors"
                            >
                                <UserAvatar
                                    src={user.image || user.avatar}
                                    name={user.name}
                                    size={28}
                                    className="shrink-0"
                                />
                                <span className="text-sm font-semibold text-foreground max-w-[120px] truncate">
                                    {user.name || "Account"}
                                </span>
                                <svg
                                    className={`w-4 h-4 text-muted transition-transform duration-fast ${
                                        isAccountOpen ? "rotate-180" : ""
                                    }`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>

                            {/* Floating Dropdown Popover */}
                            {isAccountOpen && (
                                <div
                                    role="menu"
                                    aria-orientation="vertical"
                                    className="absolute right-0 top-full mt-2 w-72 rounded-card bg-surface border border-border shadow-panel z-50 p-2 animate-fade-in-up"
                                >
                                    {/* User summary header */}
                                    <div className="p-3 bg-surface-raised rounded-button border border-border/60 mb-2">
                                        <div className="flex items-center gap-3">
                                            <UserAvatar
                                                src={user.image || user.avatar}
                                                name={user.name}
                                                size={40}
                                            />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-bold text-foreground truncate">
                                                    {user.name || "Adventurer"}
                                                </p>
                                                {user.email && (
                                                    <p className="text-xs text-muted truncate">
                                                        {user.email}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mt-2.5 pt-2 border-t border-border/40 flex items-center justify-between text-xs">
                                            <span className="text-muted font-medium">Points</span>
                                            <div className="flex items-center gap-1 font-mono font-bold text-foreground">
                                                <Image
                                                    src="/icon.png"
                                                    alt=""
                                                    width={14}
                                                    height={14}
                                                    className="object-contain"
                                                />
                                                <span>{userPoints.toLocaleString("en-US")} PTS</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Menu Items */}
                                    <div className="space-y-0.5">
                                        <Link
                                            href="/profile"
                                            onClick={closeAll}
                                            role="menuitem"
                                            className={dropdownItemClass}
                                        >
                                            <svg
                                                className="w-4 h-4 text-muted"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                                aria-hidden="true"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                />
                                            </svg>
                                            <span>Profile</span>
                                        </Link>

                                        {isAdmin && (
                                            <Link
                                                href="/admin/manage-quests"
                                                onClick={closeAll}
                                                role="menuitem"
                                                className={dropdownItemClass}
                                            >
                                                <svg
                                                    className="w-4 h-4 text-muted"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                                    />
                                                </svg>
                                                <span>Admin Dashboard</span>
                                            </Link>
                                        )}

                                        <Link
                                            href="/about"
                                            onClick={closeAll}
                                            role="menuitem"
                                            className={dropdownItemClass}
                                        >
                                            <svg
                                                className="w-4 h-4 text-muted"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                                aria-hidden="true"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            <span>About</span>
                                        </Link>
                                    </div>

                                    {/* Logout Divider & Action */}
                                    <div className="mt-1 pt-1 border-t border-border">
                                        <button
                                            type="button"
                                            role="menuitem"
                                            onClick={() => {
                                                closeAll();
                                                signOut({ callbackUrl: "/login" });
                                            }}
                                            className="flex items-center gap-2.5 w-full px-3 py-2 text-sm font-semibold rounded-button text-danger hover:bg-danger/10 transition-colors text-left"
                                        >
                                            <svg
                                                className="w-4 h-4 text-danger"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                                aria-hidden="true"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                                />
                                            </svg>
                                            <span>Log out</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="hidden sm:flex items-center gap-2">
                            <Link
                                href="/login"
                                className="min-h-11 inline-flex items-center justify-center px-4 py-2 rounded-button text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary-hover transition-colors shadow-sm"
                            >
                                Sign in
                            </Link>
                        </div>
                    )}

                    {/* Mobile Drawer Trigger */}
                    <button
                        type="button"
                        aria-expanded={isMobileDrawerOpen}
                        aria-controls="mobile-drawer"
                        aria-label={isMobileDrawerOpen ? "Close navigation menu" : "Open navigation menu"}
                        onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
                        className="lg:hidden flex items-center justify-center min-h-11 w-11 rounded-button border border-control-border bg-surface hover:bg-surface-raised focus:outline-none focus:ring-2 focus:ring-focus/40 transition-colors"
                    >
                        <svg
                            className="w-5 h-5 text-foreground"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            aria-hidden="true"
                        >
                            {isMobileDrawerOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            {isMobileDrawerOpen && (
                <div
                    id="mobile-drawer"
                    className="fixed inset-0 z-50 lg:hidden flex justify-end"
                >
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
                        onClick={closeAll}
                        aria-hidden="true"
                    />

                    {/* Drawer Content */}
                    <div
                        ref={drawerRef}
                        className="relative w-full max-w-sm bg-surface border-l border-border h-full flex flex-col justify-between p-6 shadow-panel overflow-y-auto z-10 animate-fade-in-up"
                    >
                        <div className="space-y-6">
                            {/* Drawer Header */}
                            <div className="flex items-center justify-between pb-4 border-b border-border">
                                <Link
                                    href="/"
                                    onClick={closeAll}
                                    className="flex items-center gap-2 font-display text-lg tracking-tight"
                                >
                                    <Image
                                        src="/icon-big.png"
                                        alt="CodeQuest Logo"
                                        width={28}
                                        height={28}
                                    />
                                    <span>CodeQuest</span>
                                </Link>
                                <button
                                    type="button"
                                    onClick={closeAll}
                                    aria-label="Close navigation drawer"
                                    className="p-2 rounded-button text-muted hover:text-foreground hover:bg-surface-raised transition-colors"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>

                            {/* User Info Card in Drawer */}
                            {user ? (
                                <div className="p-4 bg-surface-raised rounded-card border border-border">
                                    <div className="flex items-center gap-3 mb-3">
                                        <UserAvatar
                                            src={user.image || user.avatar}
                                            name={user.name}
                                            size={44}
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-bold text-foreground truncate">
                                                {user.name || "Adventurer"}
                                            </p>
                                            {user.email && (
                                                <p className="text-xs text-muted truncate">
                                                    {user.email}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                                        <span className="text-muted font-medium">EXP Points</span>
                                        <div className="flex items-center gap-1 font-mono font-bold text-foreground">
                                            <Image
                                                src="/icon.png"
                                                alt=""
                                                width={14}
                                                height={14}
                                                className="object-contain"
                                            />
                                            <span>{userPoints.toLocaleString("en-US")} PTS</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2 pb-2">
                                    <Link
                                        href="/login"
                                        onClick={closeAll}
                                        className="min-h-11 flex items-center justify-center w-full py-2.5 px-4 rounded-button bg-primary text-primary-foreground font-semibold hover:bg-primary-hover transition-colors"
                                    >
                                        Sign in
                                    </Link>
                                </div>
                            )}

                            {/* Navigation Links */}
                            <nav aria-label="Mobile menu" className="space-y-1">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.id}
                                        href={link.href}
                                        onClick={closeAll}
                                        aria-current={activePage === link.id ? "page" : undefined}
                                        className={navItemClass(link.id)}
                                    >
                                        {link.label}
                                    </Link>
                                ))}

                                {user && (
                                    <Link
                                        href="/profile"
                                        onClick={closeAll}
                                        className={navItemClass("profile")}
                                    >
                                        Profile
                                    </Link>
                                )}

                                {isAdmin && (
                                    <Link
                                        href="/admin/manage-quests"
                                        onClick={closeAll}
                                        className={navItemClass("admin")}
                                    >
                                        Admin Dashboard
                                    </Link>
                                )}

                                <Link
                                    href="/about"
                                    onClick={closeAll}
                                    className={navItemClass("about")}
                                >
                                    About
                                </Link>
                            </nav>
                        </div>

                        {/* Drawer Footer Actions */}
                        <div className="pt-6 border-t border-border space-y-3">
                            {user && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        closeAll();
                                        signOut({ callbackUrl: "/login" });
                                    }}
                                    className="flex items-center justify-center gap-2 min-h-11 w-full px-4 py-2.5 rounded-button text-sm font-semibold text-danger border border-danger/20 hover:bg-danger/10 transition-colors"
                                >
                                    <svg
                                        className="w-4 h-4 text-danger"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                        />
                                    </svg>
                                    <span>Log out</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
