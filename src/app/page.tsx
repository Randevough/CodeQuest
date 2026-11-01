import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/Header'
import { prisma } from '@/lib/db'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'CodeQuest — Gamified Coding Platform for Cyber University',
  description: 'Level up your developer journey through real-world software quests, student squads, verified code reviews, and competitive campus leaderboards.',
}

interface QuestTeaser {
  id: string
  title: string
  description: string
  difficulty: string
  category: string
  points: number
  maxSnatchers: number
}

const FALLBACK_TEASERS: QuestTeaser[] = [
  {
    id: 'CQ-01',
    title: 'Full-Stack Task Runner',
    description: 'Build a background task processing pipeline with webhooks and worker status monitoring',
    difficulty: 'Intermediate',
    category: 'Web',
    points: 250,
    maxSnatchers: 3,
  },
  {
    id: 'CQ-02',
    title: 'AI Prompt Benchmark Suite',
    description: 'Create an automated LLM evaluation harness checking token latency and accuracy scores',
    difficulty: 'Advanced',
    category: 'AI',
    points: 400,
    maxSnatchers: 2,
  },
  {
    id: 'CQ-03',
    title: 'Campus Agenda Scanner',
    description: 'Develop a mobile event check-in tool with offline QR validation and alert sync',
    difficulty: 'Beginner',
    category: 'Mobile',
    points: 150,
    maxSnatchers: 4,
  },
]

async function getFeaturedQuests(): Promise<QuestTeaser[]> {
  try {
    const quests = await prisma.quest.findMany({
      where: { status: 'Active' },
      take: 3,
      orderBy: { points: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        difficulty: true,
        category: true,
        points: true,
        maxSnatchers: true,
      },
    })

    if (quests.length > 0) {
      return quests.map((q) => ({
        id: q.id,
        title: q.title,
        description: q.description,
        difficulty: q.difficulty,
        category: q.category,
        points: q.points,
        maxSnatchers: q.maxSnatchers,
      }))
    }
  } catch {
    // Database offline or query error, use authentic fallbacks
  }
  return FALLBACK_TEASERS
}

export default async function LandingPage() {
  const featuredQuests = await getFeaturedQuests()

  return (
    <div className="min-h-screen flex flex-col relative text-foreground [overflow-x:clip]">
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow space-y-16 sm:space-y-24 py-8 sm:py-12">
          {/* ── HERO SECTION ── */}
          <section className="page-container" aria-label="Hero">
            <div className="arcade-grid-bg rounded-card border border-border p-6 sm:p-12 md:p-16 bg-surface/70 relative overflow-hidden">
              {/* Ambient glows */}
              <div
                className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-secondary/20 blur-3xl pointer-events-none"
                aria-hidden="true"
              />
              <div
                className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-primary/15 blur-3xl pointer-events-none"
                aria-hidden="true"
              />

              <div className="max-w-3xl relative z-10">
                {/* Status Badges */}
                <div className="flex flex-wrap items-center gap-2.5 mb-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-primary/15 text-foreground border border-primary/40 shadow-sm">
                    <span className="material-symbols-outlined text-[15px] text-primary" aria-hidden="true">
                      sports_esports
                    </span>
                    SEASON 1 ACTIVE
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-surface-raised text-muted border border-border shadow-sm">
                    <span className="material-symbols-outlined text-[15px] text-focus" aria-hidden="true">
                      school
                    </span>
                    CYBER UNIVERSITY CODING CLUB
                  </span>
                </div>

                {/* Main Headline */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-foreground uppercase tracking-tight mb-6 leading-none">
                  LEVEL UP YOUR CODE
                </h1>

                {/* Direct, human subheadline */}
                <p className="text-base sm:text-xl text-muted font-medium mb-8 max-w-2xl leading-relaxed">
                  The internal quest platform for student developers. Claim real campus software bounties, build in collaborative squads, and earn verified guild points.
                </p>

                {/* Primary CTAs */}
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href="/explore"
                    className="button-primary text-sm uppercase tracking-wider"
                  >
                    <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                      explore
                    </span>
                    Explore Quests
                  </Link>

                  <Link
                    href="/signup"
                    className="button-secondary text-sm uppercase tracking-wider"
                  >
                    <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                      person_add
                    </span>
                    Join CodeQuest
                  </Link>

                  <Link
                    href="/leaderboard"
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-button border border-control-border bg-surface px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-foreground hover:bg-surface-raised transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                      leaderboard
                    </span>
                    Leaderboard
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* ── HOW CODEQUEST WORKS (3 REAL STEPS) ── */}
          <section className="page-container" aria-labelledby="workflow-heading">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-block text-xs font-mono font-bold uppercase tracking-wider text-primary mb-2">
                MISSION PIPELINE
              </span>
              <h2 id="workflow-heading" className="text-2xl sm:text-4xl font-black text-foreground uppercase">
                How CodeQuest Works
              </h2>
              <p className="text-muted mt-2">
                Three straightforward steps from selecting a challenge to shipping verified code
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="arcade-panel rounded-card p-6 bg-surface flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-button bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-mono font-black text-lg mb-4">
                    01
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Snatch a Quest</h3>
                  <p className="text-sm text-muted leading-relaxed">
                    Browse active bounties across Web, AI, and Mobile tracks. Review requirements, deadline, and points before claiming your slot.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border flex items-center text-xs font-mono text-muted">
                  <span className="material-symbols-outlined text-[16px] text-focus mr-1.5" aria-hidden="true">
                    touch_app
                  </span>
                  Single or multi-slot squads
                </div>
              </div>

              {/* Step 2 */}
              <div className="arcade-panel rounded-card p-6 bg-surface flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-button bg-secondary/30 border border-secondary/50 flex items-center justify-center text-secondary-foreground font-mono font-black text-lg mb-4">
                    02
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Build &amp; Submit</h3>
                  <p className="text-sm text-muted leading-relaxed">
                    Collaborate with squad peers or fly solo. Implement the feature on GitHub, write automated tests, and submit your pull request link.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border flex items-center text-xs font-mono text-muted">
                  <span className="material-symbols-outlined text-[16px] text-warning mr-1.5" aria-hidden="true">
                    code
                  </span>
                  Git repository workflow
                </div>
              </div>

              {/* Step 3 */}
              <div className="arcade-panel rounded-card p-6 bg-surface flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-button bg-success/20 border border-success/40 flex items-center justify-center text-success font-mono font-black text-lg mb-4">
                    03
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Earn EXP &amp; Badges</h3>
                  <p className="text-sm text-muted leading-relaxed">
                    Club mentors review code quality and acceptance criteria. Approved submissions yield points, unlock badges, and elevate your standing.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border flex items-center text-xs font-mono text-muted">
                  <span className="material-symbols-outlined text-[16px] text-success mr-1.5" aria-hidden="true">
                    verified
                  </span>
                  Peer-reviewed verification
                </div>
              </div>
            </div>
          </section>

          {/* ── QUEST DISCOVERY TEASER ── */}
          <section className="page-container" aria-labelledby="featured-quests-heading">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="inline-block text-xs font-mono font-bold uppercase tracking-wider text-focus mb-1">
                  LIVE BOUNTY TEASER
                </span>
                <h2 id="featured-quests-heading" className="text-2xl sm:text-3xl font-black uppercase text-foreground">
                  Featured Quests
                </h2>
                <p className="text-sm text-muted mt-1">
                  A glimpse of software bounties waiting on the board
                </p>
              </div>

              <Link
                href="/explore"
                className="inline-flex min-h-[44px] items-center gap-2 text-sm font-bold text-primary hover:text-primary-hover transition-colors font-mono uppercase"
              >
                View all quests
                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                  arrow_forward
                </span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredQuests.map((quest) => (
                <div
                  key={quest.id}
                  className="rounded-card border border-border bg-surface p-6 flex flex-col justify-between hover:border-control-border transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase bg-surface-raised border border-border text-muted">
                        {quest.category}
                      </span>
                      <span className="text-sm font-black text-primary font-mono tabular-nums">
                        +{quest.points} PTS
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {quest.title}
                    </h3>
                    <p className="text-sm text-muted line-clamp-2 leading-relaxed">
                      {quest.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-xs font-mono text-muted">
                      Difficulty: {quest.difficulty}
                    </span>
                    <Link
                      href={`/quests/${quest.id}`}
                      className="text-xs font-bold text-focus hover:underline"
                    >
                      Inspect Quest
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── SQUAD COLLABORATION SPOTLIGHT ── */}
          <section className="page-container" aria-labelledby="collaboration-heading">
            <div className="rounded-card border border-border bg-surface-raised p-8 sm:p-12 relative overflow-hidden">
              <div className="max-w-2xl relative z-10 space-y-4">
                <span className="inline-block text-xs font-mono font-bold uppercase tracking-wider text-warning">
                  MULTIPLAYER SQUADS
                </span>
                <h2 id="collaboration-heading" className="text-2xl sm:text-4xl font-black text-foreground uppercase">
                  Code Together in Real Squads
                </h2>
                <p className="text-muted text-base leading-relaxed">
                  Real software engineering is collaborative. CodeQuest quests feature multi-snatcher capacity, enabling squads of up to 5 developers to tackle complex architectures, divide components, and ship together.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-muted">
                    <span className="material-symbols-outlined text-[18px] text-success" aria-hidden="true">
                      check_circle
                    </span>
                    Shared Git repositories
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-muted">
                    <span className="material-symbols-outlined text-[18px] text-success" aria-hidden="true">
                      check_circle
                    </span>
                    Distributed task ownership
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-muted">
                    <span className="material-symbols-outlined text-[18px] text-success" aria-hidden="true">
                      check_circle
                    </span>
                    Equal point distribution upon approval
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── FINAL CALL TO ACTION ── */}
          <section className="page-container text-center py-6 sm:py-12" aria-label="Get started">
            <div className="max-w-xl mx-auto space-y-6">
              <h2 className="text-3xl sm:text-4xl font-black text-foreground uppercase">
                Ready to Join the Guild?
              </h2>
              <p className="text-muted leading-relaxed">
                Register with your Cyber University student email to snatch available coding missions, join developer squads, and climb the verified leaderboard.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/signup"
                  className="button-primary text-sm uppercase tracking-wider"
                >
                  Create Student Account
                </Link>
                <Link
                  href="/login"
                  className="button-secondary text-sm uppercase tracking-wider"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </section>
        </main>

        {/* ── FOOTER ── */}
        <footer className="border-t border-border bg-surface py-8 text-sm text-muted">
          <div className="page-container flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Image src="/icon-big.png" alt="" width={24} height={24} />
              <span className="font-display text-base text-foreground">CodeQuest</span>
              <span className="text-xs text-muted ml-2">Cyber University Coding Club</span>
            </div>
            <div className="flex items-center gap-6 text-xs font-medium">
              <Link href="/explore" className="hover:text-foreground transition-colors">
                Explore Quests
              </Link>
              <Link href="/leaderboard" className="hover:text-foreground transition-colors">
                Leaderboard
              </Link>
              <Link href="/about" className="hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="/login" className="hover:text-foreground transition-colors">
                Sign In
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
