"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
    ChevronDownIcon,
    CloseIcon,
    InfoIcon,
    LogOutIcon,
    MenuIcon,
    ShieldCheckIcon,
    UserIcon,
} from "@/components/ui/ArcadeIcons";
import { ThemeToggle } from "./ThemeToggle";
import { NotificationBell } from "./NotificationBell";
import { UserAvatar } from "./ui/UserAvatar";

interface HeaderProps {
    activePage?: "explore" | "leaderboard" | "workspace";
    /** Kept for existing call sites. The header now looks the same everywhere. */
    isLanding?: boolean;
}

const navLinks = [
    { id: "explore", href: "/explore", label: "Explore quests" },
    { id: "leaderboard", href: "/leaderboard", label: "Leaderboard" },
    { id: "workspace", href: "/workspace", label: "My workspace" },
] as const;

export function Header({ activePage }: HeaderProps) {
    const { data: session } = useSession();
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

    const accountRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const drawerRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
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

    useEffect(() => {
        const drawer = drawerRef.current;
        if (!isMobileDrawerOpen || !drawer) return;
        const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        const overflow = document.body.style.overflow;
        drawer.showModal();
        document.body.style.overflow = "hidden";
        return () => {
            drawer.close();
            document.body.style.overflow = overflow;
            if (trigger?.isConnected) trigger?.focus();
        };
    }, [isMobileDrawerOpen]);

    const closeAll = () => {
        setIsAccountOpen(false);
        setIsMobileDrawerOpen(false);
    };

    const navItemClass = (pageId: string) =>
        `flex min-h-11 items-center px-4 py-2 rounded-button text-sm font-semibold transition-colors ${
            activePage === pageId
                ? "bg-surface-raised text-foreground shadow-[inset_0_-3px_0_var(--color-primary)]"
                : "text-muted hover:text-foreground hover:bg-surface-raised"
        }`;

    const dropdownItemClass =
        "flex items-center gap-2.5 w-full px-3 py-2 min-h-11 text-sm font-medium rounded-button text-foreground hover:bg-surface-raised transition-colors";

    const user = session?.user;
    const isAdmin = user?.role === "Admin";
    const userPoints = user?.points ?? 0;

    return (
        <header className="relative z-dropdown border-b-2 border-border bg-background text-foreground">
            <div className="page-container flex min-h-20 items-center justify-between gap-4 py-3">
                <Link
                    href="/"
                    onClick={closeAll}
                    className="flex min-h-11 shrink-0 items-center gap-2 font-display text-lg hover:opacity-90 transition-opacity"
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

                <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-1">
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

                <div className="flex items-center gap-2">
                    {user && <NotificationBell />}
                    <ThemeToggle />

                    {user ? (
                        <div ref={accountRef} className="relative hidden sm:block">
                            <button
                                ref={triggerRef}
                                type="button"
                                aria-expanded={isAccountOpen}
                                aria-haspopup="menu"
                                aria-label="Account options menu"
                                onClick={() => setIsAccountOpen(!isAccountOpen)}
                                className="flex items-center gap-2.5 min-h-11 py-1.5 px-2.5 rounded-button border-2 border-control-border bg-surface text-foreground hover:bg-surface-raised"
                            >
                                <UserAvatar
                                    src={user.image || user.avatar}
                                    name={user.name}
                                    size={28}
                                    className="shrink-0"
                                />
                                <span className="text-sm font-semibold max-w-[120px] truncate">
                                    {user.name || "Account"}
                                </span>
                                <ChevronDownIcon
                                    className={`size-4 text-muted transition-transform duration-fast ${
                                        isAccountOpen ? "rotate-180" : ""
                                    }`}
                                />
                            </button>

                            {isAccountOpen && (
                                <div
                                    role="menu"
                                    aria-orientation="vertical"
                                    className="absolute right-0 top-full mt-2 w-72 rounded-card border-2 border-border bg-surface text-foreground shadow-panel z-overlay p-2 animate-fade-in-up"
                                >
                                    <div className="p-3 rounded-button border-2 border-border bg-inset mb-2">
                                        <div className="flex items-center gap-3">
                                            <UserAvatar
                                                src={user.image || user.avatar}
                                                name={user.name}
                                                size={40}
                                            />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-bold truncate">
                                                    {user.name || "Adventurer"}
                                                </p>
                                                {user.email && (
                                                    <p className="text-xs text-muted truncate">{user.email}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mt-2.5 pt-2 border-t-2 border-border flex items-center justify-between text-xs">
                                            <span className="text-muted font-medium">Points</span>
                                            <span className="chip chip-amber font-mono tabular-nums">
                                                <Image
                                                    src="/icon.png"
                                                    alt=""
                                                    width={14}
                                                    height={14}
                                                    className="object-contain"
                                                />
                                                {userPoints.toLocaleString("en-US")} PTS
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-0.5">
                                        <Link href="/profile" onClick={closeAll} role="menuitem" className={dropdownItemClass}>
                                            <UserIcon className="size-4 text-muted" />
                                            <span>Profile</span>
                                        </Link>

                                        {isAdmin && (
                                            <Link
                                                href="/admin/manage-quests"
                                                onClick={closeAll}
                                                role="menuitem"
                                                className={dropdownItemClass}
                                            >
                                                <ShieldCheckIcon className="size-4 text-muted" />
                                                <span>Admin dashboard</span>
                                            </Link>
                                        )}

                                        <Link href="/about" onClick={closeAll} role="menuitem" className={dropdownItemClass}>
                                            <InfoIcon className="size-4 text-muted" />
                                            <span>About</span>
                                        </Link>
                                    </div>

                                    <div className="mt-1 pt-1 border-t-2 border-border">
                                        <button
                                            type="button"
                                            role="menuitem"
                                            onClick={() => {
                                                closeAll();
                                                signOut({ callbackUrl: "/login" });
                                            }}
                                            className="flex items-center gap-2.5 w-full px-3 py-2 text-sm font-semibold rounded-button text-danger hover:bg-danger/10 transition-colors text-left"
                                        >
                                            <LogOutIcon className="size-4" />
                                            <span>Log out</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="hidden sm:flex items-center gap-3">
                            <Link href="/login" className="btn btn-ghost btn-sm">
                                Sign in
                            </Link>
                            <Link href="/signup" className="btn btn-primary btn-sm">
                                Sign up
                            </Link>
                        </div>
                    )}

                    <button
                        type="button"
                        aria-expanded={isMobileDrawerOpen}
                        aria-controls="mobile-drawer"
                        aria-label={isMobileDrawerOpen ? "Close navigation menu" : "Open navigation menu"}
                        onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
                        className="lg:hidden flex items-center justify-center min-h-11 w-11 rounded-button border-2 border-control-border bg-surface text-foreground hover:bg-surface-raised"
                    >
                        {isMobileDrawerOpen ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
                    </button>
                </div>
            </div>

            {isMobileDrawerOpen && (
                <dialog
                    ref={drawerRef}
                    id="mobile-drawer"
                    onCancel={(event) => { event.preventDefault(); closeAll(); }}
                    aria-label="Navigation menu"
                    className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none border-0 bg-transparent p-0 text-foreground z-modal lg:hidden open:flex justify-end"
                >
                    <div
                        className="fixed inset-0 bg-background/85"
                        onClick={closeAll}
                        aria-hidden="true"
                    />

                    <div
                        className="relative w-full max-w-sm bg-surface border-l-2 border-border h-full flex flex-col justify-between p-6 overflow-y-auto z-10 animate-fade-in-up"
                    >
                        <div className="space-y-6">
                            <div className="flex items-center justify-between pb-4 border-b-2 border-border">
                                <Link href="/" onClick={closeAll} className="flex items-center gap-2 font-display text-lg">
                                    <Image src="/icon-big.png" alt="CodeQuest Logo" width={28} height={28} />
                                    <span>CodeQuest</span>
                                </Link>
                                <button
                                    type="button"
                                    onClick={closeAll}
                                    aria-label="Close navigation drawer"
                                    className="flex items-center justify-center rounded-button text-muted hover:text-foreground hover:bg-surface-raised transition-colors"
                                >
                                    <CloseIcon className="size-5" />
                                </button>
                            </div>

                            {user ? (
                                <div className="p-4 bg-inset rounded-card border-2 border-border">
                                    <div className="flex items-center gap-3 mb-3">
                                        <UserAvatar src={user.image || user.avatar} name={user.name} size={44} />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-bold text-foreground truncate">
                                                {user.name || "Adventurer"}
                                            </p>
                                            {user.email && (
                                                <p className="text-xs text-muted truncate">{user.email}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="pt-2 border-t-2 border-border flex items-center justify-between text-xs">
                                        <span className="text-muted font-medium">Points</span>
                                        <span className="chip chip-amber font-mono tabular-nums">
                                            <Image
                                                src="/icon.png"
                                                alt=""
                                                width={14}
                                                height={14}
                                                className="object-contain"
                                            />
                                            {userPoints.toLocaleString("en-US")} PTS
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3 pb-2">
                                    <Link href="/login" onClick={closeAll} className="btn btn-secondary">
                                        Sign in
                                    </Link>
                                    <Link href="/signup" onClick={closeAll} className="btn btn-primary">
                                        Sign up
                                    </Link>
                                </div>
                            )}

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
                                    <Link href="/profile" onClick={closeAll} className={navItemClass("profile")}>
                                        Profile
                                    </Link>
                                )}

                                {isAdmin && (
                                    <Link href="/admin/manage-quests" onClick={closeAll} className={navItemClass("admin")}>
                                        Admin dashboard
                                    </Link>
                                )}

                                <Link href="/about" onClick={closeAll} className={navItemClass("about")}>
                                    About
                                </Link>
                            </nav>
                        </div>

                        <div className="pt-6 border-t-2 border-border space-y-3">
                            {user && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        closeAll();
                                        signOut({ callbackUrl: "/login" });
                                    }}
                                    className="flex items-center justify-center gap-2 min-h-11 w-full px-4 py-2.5 rounded-button text-sm font-semibold text-danger border-2 border-danger/30 hover:bg-danger/10 transition-colors"
                                >
                                    <LogOutIcon className="size-4" />
                                    <span>Log out</span>
                                </button>
                            )}
                        </div>
                    </div>
                </dialog>
            )}
        </header>
    );
}
