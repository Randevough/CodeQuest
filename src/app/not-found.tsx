import Link from "next/link";
export default function NotFound() {
    return <main className="page-container flex min-h-screen items-center py-12"><section className="mx-auto w-full max-w-2xl rounded-card border border-border bg-surface p-6 text-foreground sm:p-8"><h1 className="mb-4">Page not found</h1><p className="mb-8 text-muted">This address does not match a page on CodeQuest. Check the link or return to the quest board.</p><div className="flex flex-wrap gap-4"><Link href="/" className="button-primary">Back to quest board</Link><Link href="/leaderboard" className="button-secondary">Leaderboard</Link></div></section></main>;
}
