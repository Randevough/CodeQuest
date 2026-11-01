"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps { activePage?: "explore" | "leaderboard" | "workspace" }
const links = [ ["explore", "/", "Explore Quests"], ["leaderboard", "/leaderboard", "Leaderboard"], ["workspace", "/workspace", "My Workspace"]] as const;

export function Header({ activePage }: HeaderProps) {
    const [open, setOpen] = useState(false);
    const trigger = useRef<HTMLButtonElement>(null);
    const { data: session } = useSession();
    const item = "flex min-h-11 items-center rounded-button px-4 py-2 text-sm font-semibold hover:bg-surface-raised";
    const close = () => setOpen(false);
    const navigation = links.map(([page, href, label]) => <Link key={page} href={href} onClick={close} aria-current={activePage === page ? "page" : undefined} className={`${item} ${activePage === page ? "bg-secondary text-secondary-foreground hover:bg-secondary-hover" : "text-muted"}`}>{label}</Link>);
    const account = <>
        {session?.user ? <>
            <div className="px-4 py-3 text-sm break-words"><p className="font-bold">{session.user.name || "Your account"}</p>{session.user.email && <p className="text-muted">{session.user.email}</p>}<p className="text-muted tabular-nums">{session.user.points ?? 0} points</p></div>
            <Link href="/profile" onClick={close} className={item}>Profile</Link>
        </> : <Link href="/login" onClick={close} className={item}>Sign in</Link>}
        <Link href="/about" onClick={close} className={item}>About</Link>
        {session?.user?.role === "Admin" && <Link href="/admin/manage-quests" onClick={close} className={item}>Admin Dashboard</Link>}
        {session?.user && <button type="button" className={`${item} w-full text-danger`} onClick={() => { close(); signOut({ callbackUrl: "/login" }); }}>Log out</button>}
    </>;
    return <header className="relative z-50 border-b border-border bg-surface text-foreground" onKeyDown={event => { if (event.key === "Escape" && open) { close(); trigger.current?.focus(); } }}>
        <div className="page-container flex min-h-20 items-center justify-between gap-3 py-3">
            <Link href="/" className="flex min-h-11 shrink-0 items-center gap-2 font-display text-lg"><Image src="/icon-big.png" alt="" width={32} height={32} />CodeQuest</Link>
            <nav aria-label="Main navigation" className="hidden xl:flex items-center gap-2">{navigation}</nav>
            <div className="flex items-center gap-2"><ThemeToggle /><button ref={trigger} type="button" aria-expanded={open} aria-controls="header-menu" className="min-h-11 border border-control-border bg-surface px-3 hover:bg-surface-raised" onClick={() => setOpen(!open)}><span className="xl:hidden">{open ? "Close" : "Menu"}</span><span className="hidden xl:inline">Account</span></button></div>
        </div>
        {open && <div id="header-menu" className="page-container border-t border-border pb-4"><nav aria-label="Mobile navigation" className="grid gap-2 pt-4 xl:hidden">{navigation}</nav><nav aria-label="Account navigation" className="ml-auto max-w-md pt-2">{account}</nav></div>}
    </header>;
}
