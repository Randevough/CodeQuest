import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import LeaderboardPage from '@/app/leaderboard/page'
import * as userActions from '@/actions/user'

vi.mock('@/actions/user', () => ({
  getLeaderboardUsers: vi.fn(),
  getLeaderboardStanding: vi.fn().mockResolvedValue(null),
}))

vi.mock('@/components/Header', () => ({
  Header: () => <header data-testid="header" />,
}))

vi.mock('@/components/leaderboard/LeaderboardFilters', () => ({
  LeaderboardFilters: () => <div data-testid="filters" />,
}))

vi.mock('@/components/leaderboard/UserStanding', () => ({
  UserStanding: () => <div data-testid="standing" />,
}))

describe('LeaderboardPage', () => {
  it('renders matching query empty state when no users found', async () => {
    vi.mocked(userActions.getLeaderboardUsers).mockResolvedValueOnce({
      users: [],
      total: 0,
    })

    const ui = await LeaderboardPage({
      searchParams: Promise.resolve({ q: 'UnknownWizard' }),
    })
    render(ui)

    expect(screen.getByText("No adventurers found matching 'UnknownWizard'")).toBeDefined()
  })

  it('renders default empty state when query is not provided and no users exist', async () => {
    vi.mocked(userActions.getLeaderboardUsers).mockResolvedValueOnce({
      users: [],
      total: 0,
    })

    const ui = await LeaderboardPage({
      searchParams: Promise.resolve({}),
    })
    render(ui)

    expect(screen.getByText('No ranked members to show yet.')).toBeDefined()
  })
})
