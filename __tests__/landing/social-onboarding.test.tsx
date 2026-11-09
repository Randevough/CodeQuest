import { readFileSync } from 'node:fs'
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SquadSection } from '@/components/landing/SquadSection'
import { LeaderboardSection, BADGE_COLLECTION } from '@/components/landing/LeaderboardSection'
import { JoinSection } from '@/components/landing/JoinSection'

describe('SquadSection', () => {
  it('explains squads using only real mechanics', () => {
    const { container } = render(<SquadSection />)

    expect(screen.getByRole('heading', { name: 'Take on bigger quests as a squad' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Find a quest' }).getAttribute('href')).toBe('/explore')

    const text = container.textContent ?? ''
    expect(text).not.toMatch(/\+\d+%|bonus/i)
  })

  it('labels the lobby as an example and uses no invented people', () => {
    render(<SquadSection />)

    expect(screen.getByText('Example')).toBeTruthy()
    expect(screen.getByText('Squad leader')).toBeTruthy()
    expect(screen.queryByText(/Alex Dev|Budi Runner|Citra Code/)).toBeNull()
  })

  it('lets the visitor fill the open slot and reset the example', () => {
    render(<SquadSection />)

    expect(screen.getByTestId('party-slots-badge').textContent).toBe('2 of 3 slots filled')

    fireEvent.click(screen.getByTestId('squad-slot-open'))
    expect(screen.getByTestId('party-slots-badge').textContent).toBe('3 of 3 slots filled')
    expect(screen.queryByTestId('squad-slot-open')).toBeNull()
    expect(screen.getByText('The squad is full.')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Reset example' }))
    expect(screen.getByTestId('party-slots-badge').textContent).toBe('2 of 3 slots filled')
    expect(screen.getByTestId('squad-slot-open')).toBeTruthy()
  })
})

describe('LeaderboardSection', () => {
  const users = [
    { id: '1', name: 'Master Hacker', points: 9999, handle: '@hacker' },
    { id: '2', name: 'Pro Coder', points: 4999, handle: '@procoder' },
    { id: '3', name: 'Code Cadet', points: 1000 },
  ]

  it('renders the live top players in order with points', () => {
    render(<LeaderboardSection topUsers={users} />)

    expect(screen.getByRole('heading', { name: 'See who is leading' })).toBeTruthy()
    expect(screen.getByTestId('rank-row-1').textContent).toContain('Master Hacker')
    expect(screen.getByTestId('rank-row-1').textContent).toContain('9,999 pts')
    expect(screen.getByTestId('rank-row-2').textContent).toContain('Pro Coder')
    expect(screen.getByTestId('rank-row-3').textContent).toContain('Code Cadet')
    expect(screen.getByRole('link', { name: 'Open the full leaderboard' }).getAttribute('href')).toBe('/leaderboard')
  })

  it('shows an honest empty state with no invented players', () => {
    render(<LeaderboardSection topUsers={[]} />)

    expect(screen.getByTestId('leaderboard-empty-state')).toBeTruthy()
    expect(screen.queryByTestId('rank-row-1')).toBeNull()
    expect(screen.queryByText(/Alex Dev|Budi Runner|Citra Code/)).toBeNull()
  })

  it('shows an unavailable state when the ranking could not be loaded', () => {
    render(<LeaderboardSection topUsers={null} />)

    expect(screen.getByTestId('leaderboard-unavailable')).toBeTruthy()
    expect(screen.queryByTestId('rank-row-1')).toBeNull()
  })

  it('lists all 14 badges and reveals a requirement on selection', () => {
    render(<LeaderboardSection topUsers={[]} />)

    expect(BADGE_COLLECTION).toHaveLength(14)
    expect(screen.getByText('14 badges to unlock')).toBeTruthy()
    BADGE_COLLECTION.forEach((badge) => {
      expect(screen.getByRole('button', { name: badge.name })).toBeTruthy()
    })

    const box = screen.getByTestId('badge-requirement-box')
    expect(box.textContent).toContain('No badge selected.')

    const webWeaver = screen.getByRole('button', { name: 'Web Weaver' })
    fireEvent.click(webWeaver)
    expect(webWeaver.getAttribute('aria-pressed')).toBe('true')
    expect(box.textContent).toContain('Get 5 Web quests approved.')

    fireEvent.click(webWeaver)
    expect(box.textContent).toContain('No badge selected.')
  })
})

describe('JoinSection', () => {
  it('offers sign-up and sign-in to guests', () => {
    render(<JoinSection isLoggedIn={false} />)

    expect(screen.getByRole('heading', { name: 'Join the quest board' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Create an account' }).getAttribute('href')).toBe('/signup')
    expect(screen.getByRole('link', { name: 'Sign in' }).getAttribute('href')).toBe('/login')
  })

  it('names the club and mentions email verification, with no invented perks', () => {
    const { container } = render(<JoinSection />)
    const text = container.textContent ?? ''

    expect(text).toContain('UKM Coding Cyber University')
    expect(text).toMatch(/verifying your email/i)
    expect(text).not.toMatch(/XP|bonus|starter/i)
    expect(screen.queryByRole('radio')).toBeNull()
  })

  it('offers the workspace to signed-in members and hides sign-up', () => {
    render(<JoinSection isLoggedIn userName="Sam" />)

    expect(screen.getByRole('heading', { name: 'Welcome back, Sam' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Open workspace' }).getAttribute('href')).toBe('/workspace')
    expect(screen.queryByRole('link', { name: 'Create an account' })).toBeNull()
    expect(screen.queryByRole('link', { name: 'Sign in' })).toBeNull()
  })
})

describe('mobile navigation modal contract', () => {
  it('uses native modal focus containment, Escape, and trigger restoration', () => {
    const header = readFileSync('src/components/Header.tsx', 'utf8')
    expect(header).toContain('<dialog')
    expect(header).toContain('drawer.showModal()')
    expect(header).toContain('onCancel=')
    expect(header).toContain('drawer.close()')
    expect(header).toContain('trigger?.focus()')
  })
})
