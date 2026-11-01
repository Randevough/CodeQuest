import { Header } from '@/components/Header'
import Link from 'next/link'

export default function AboutPage() {
    return <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="page-container py-12 sm:py-16">
            <div className="max-w-3xl">
                <h1 className="mb-6">Build something with CodeQuest.</h1>
                <p className="text-lg text-muted mb-8">The internal quest board for Cyber University&apos;s Coding Club. Pick a club project, submit your work, and track approved contributions.</p>
                <Link href="/explore" className="min-h-11 button-primary">Browse quests</Link>
                <section className="mt-16 border-t border-border pt-8">
                    <h2 className="mb-6">From quest to contribution</h2>
                    <dl className="space-y-8">
                        <div><dt className="text-xl font-bold mb-2">Choose your quest</dt><dd className="text-muted">Read the requirements, available places, points, and deadline before joining. Your active quests appear in your workspace.</dd></div>
                        <div><dt className="text-xl font-bold mb-2">Build and submit</dt><dd className="text-muted">Use the quest requirements to guide your work, then submit your project URL for review.</dd></div>
                        <div><dt className="text-xl font-bold mb-2">Follow the review</dt><dd className="text-muted">Check your workspace for review status and feedback. If revisions are needed, update your work and resubmit. Approved quests contribute points to the leaderboard.</dd></div>
                    </dl>
                </section>
                <nav aria-label="Explore CodeQuest" className="mt-12 flex flex-wrap gap-4">
                    <Link className="button-secondary" href="/workspace">Open workspace</Link>
                    <Link className="min-h-11 inline-flex items-center underline" href="/leaderboard">View leaderboard</Link>
                </nav>
            </div>
        </main>
    </div>
}
