import Link from 'next/link'
import { QuestDemo } from './QuestDemo'

export interface HeroSectionProps {
  sessionUser?: {
    name?: string | null
    email?: string | null
    role?: string
  } | null
}

export function HeroSection({ sessionUser }: HeroSectionProps) {
  const isAdmin = sessionUser?.role?.toLowerCase() === 'admin'
  const secondaryCta = !sessionUser
    ? { label: 'How it works', href: '#how-it-works' }
    : isAdmin
    ? { label: 'Open admin panel', href: '/admin/members' }
    : { label: 'Open workspace', href: '/workspace' }

  return (
    <section aria-label="Introduction" className="w-full py-6 md:py-12">
      <div className="page-container">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 space-y-7 lg:col-span-6">
            <h1>
              <span className="block text-foreground">Pick a quest.</span>
              <span className="block text-foreground dark:text-primary">Ship the project.</span>
            </h1>

            <p className="max-w-xl text-lg text-muted">
              CodeQuest is the quest board of UKM Coding Cyber University. Take a real project, build it in your
              own Git repository, and have club staff review it. Approved quests earn points and badges.
            </p>

            <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center">
              <Link href="/explore" className="btn btn-primary btn-lg">
                Browse quests
              </Link>
              <Link href={secondaryCta.href} className="btn btn-secondary btn-lg">
                {secondaryCta.label}
              </Link>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-6">
            <QuestDemo />
          </div>
        </div>
      </div>
    </section>
  )
}
