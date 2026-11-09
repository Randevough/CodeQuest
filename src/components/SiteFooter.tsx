import Image from 'next/image'
import Link from 'next/link'

const footerLinks = [
  { href: '/explore', label: 'Explore quests' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/about', label: 'About' },
  { href: '/login', label: 'Sign in' },
] as const

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-border bg-background py-8 text-sm text-muted">
      <div className="page-container flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <Image src="/icon-big.png" alt="" width={24} height={24} />
          <span className="font-display text-base text-foreground">CodeQuest</span>
          <span className="ml-2 text-xs">UKM Coding Cyber University</span>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-4 text-xs font-medium">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex min-h-11 items-center px-2 hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://ig.me/m/coding.cyberuniversity"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center px-2 hover:text-foreground"
          >
            Message us on Instagram
          </a>
        </nav>
      </div>
    </footer>
  )
}
