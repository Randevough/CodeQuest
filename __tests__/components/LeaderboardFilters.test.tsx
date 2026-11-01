import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LeaderboardFilters } from '@/components/leaderboard/LeaderboardFilters'

const mockReplace = vi.fn()
let mockSearchParams = new URLSearchParams()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => '/leaderboard',
  useSearchParams: () => mockSearchParams,
}))

describe('LeaderboardFilters', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSearchParams = new URLSearchParams()
  })

  it('updates search query q param', async () => {
    render(<LeaderboardFilters />)
    const input = screen.getByPlaceholderText(/search members/i)

    fireEvent.change(input, { target: { value: 'hero' } })

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/leaderboard?page=1&q=hero')
    })
  })

  it('deletes q param when search cleared', async () => {
    mockSearchParams = new URLSearchParams('q=hero&page=2')
    render(<LeaderboardFilters />)
    const input = screen.getByPlaceholderText(/search members/i)

    fireEvent.change(input, { target: { value: '' } })

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/leaderboard?page=1')
    })
  })

  it('updates timeframe param on select change', async () => {
    render(<LeaderboardFilters />)
    const dropdownTrigger = screen.getByRole('combobox', { name: /timeframe/i })
    fireEvent.click(dropdownTrigger)

    const monthOption = screen.getByRole('option', { name: /this month/i })
    fireEvent.click(monthOption)

    expect(mockReplace).toHaveBeenCalledWith('/leaderboard?page=1&timeframe=month')
  })
})
