"use client";
import { useEffect } from "react";
import Link from "next/link";
import "./globals.css";
import { fontVariables } from "./fonts";

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error(error);
        try {
            const theme = localStorage.getItem('cq-theme');
            document.documentElement.classList.toggle('dark', theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches));
        } catch { /* Storage unavailable: readable light fallback. */ }
    }, [error]);
    return <html lang="en" className={`${fontVariables} dark`} suppressHydrationWarning><head><title>Unable to load CodeQuest</title></head><body><main className="page-container flex min-h-screen items-center py-12"><section className="mx-auto w-full max-w-2xl rounded-card border border-border bg-surface p-6 text-foreground sm:p-8" aria-labelledby="error-title"><h1 id="error-title" className="mb-4">Unable to load CodeQuest</h1><p className="mb-6 text-muted">An unexpected error interrupted loading. Try again. If it keeps happening, report the issue with the page address.</p>{error.digest && <p className="mb-6 break-words text-sm text-muted">Error reference: {error.digest}</p>}<div className="flex flex-wrap gap-4"><button type="button" onClick={reset} className="button-primary">Try again</button><Link href="/" className="button-secondary">Quest board</Link><a href="https://ig.me/m/coding.cyberuniversity" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-button border border-control-border px-4 py-2 hover:bg-surface-raised">Report on Instagram (opens new tab)</a></div></section></main></body></html>;
}
