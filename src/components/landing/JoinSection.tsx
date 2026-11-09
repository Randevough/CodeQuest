import Link from 'next/link'

export interface JoinSectionProps {
  isLoggedIn?: boolean
  userName?: string | null
}

export function JoinSection({ isLoggedIn = false, userName }: JoinSectionProps) {
  return (
    <section id="join" aria-labelledby="join-section-title" className="page-container scroll-mt-6">
      <div className="panel mx-auto max-w-3xl space-y-6 p-8 text-center sm:p-12">
        {isLoggedIn ? (
          <>
            <h2 id="join-section-title">{userName ? `Welcome back, ${userName}` : 'Welcome back'}</h2>
            <p className="mx-auto max-w-prose text-muted">
              Your active quests, submissions and review feedback are in your workspace.
            </p>
            <div className="flex justify-center">
              <Link href="/workspace" className="btn btn-primary btn-lg">
                Open workspace
              </Link>
            </div>
          </>
        ) : (
          <>
            <h2 id="join-section-title">Join the quest board</h2>
            <p className="mx-auto max-w-prose text-muted">
              CodeQuest is built for members of UKM Coding Cyber University and is open to developers who want to
              build real projects. Creating an account includes verifying your email.
            </p>
            <div className="flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
              <Link href="/signup" className="btn btn-primary btn-lg">
                Create an account
              </Link>
              <Link href="/login" className="btn btn-secondary btn-lg">
                Sign in
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
