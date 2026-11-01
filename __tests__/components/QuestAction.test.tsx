import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QuestAction } from '@/components/QuestAction'
import { toast } from 'sonner'
import * as questActions from '@/actions/quest'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
  usePathname: () => '/quests/1',
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

vi.mock('@/actions/quest', () => ({
  joinQuest: vi.fn(),
  submitQuest: vi.fn(),
}))

describe('QuestAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('updates input value with controlled state', () => {
    render(<QuestAction questId="quest-1" isSnatched={true} userStatus={null} />)
    const input = screen.getByLabelText(/project repository url/i) as HTMLInputElement
    expect(input.value).toBe('')

    fireEvent.change(input, { target: { value: 'https://github.com/test/repo' } })
    expect(input.value).toBe('https://github.com/test/repo')
  })

  it('shows toast error when submitting empty URL', async () => {
    render(<QuestAction questId="quest-1" isSnatched={true} userStatus={null} />)
    const button = screen.getByRole('button', { name: /submit quest/i })

    fireEvent.click(button)

    expect(toast.error).toHaveBeenCalledWith('Please enter a URL')
    expect(questActions.submitQuest).not.toHaveBeenCalled()
  })

  it('shows toast error when URL has invalid protocol', async () => {
    render(<QuestAction questId="quest-1" isSnatched={true} userStatus={null} />)
    const input = screen.getByLabelText(/project repository url/i)
    const button = screen.getByRole('button', { name: /submit quest/i })

    fireEvent.change(input, { target: { value: 'javascript:alert(1)' } })
    fireEvent.click(button)

    expect(toast.error).toHaveBeenCalledWith('Please enter a valid HTTP/HTTPS URL')
    expect(questActions.submitQuest).not.toHaveBeenCalled()

    fireEvent.change(input, { target: { value: 'not-a-url' } })
    fireEvent.click(button)

    expect(toast.error).toHaveBeenCalledWith('Please enter a valid HTTP/HTTPS URL')
    expect(questActions.submitQuest).not.toHaveBeenCalled()
  })

  it('submits valid http/https URL', async () => {
    vi.mocked(questActions.submitQuest).mockResolvedValueOnce({ success: true })

    render(<QuestAction questId="quest-1" isSnatched={true} userStatus={null} />)
    const input = screen.getByLabelText(/project repository url/i)
    const button = screen.getByRole('button', { name: /submit quest/i })

    fireEvent.change(input, { target: { value: 'https://github.com/test/repo' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(questActions.submitQuest).toHaveBeenCalledWith('quest-1', 'https://github.com/test/repo')
      expect(toast.success).toHaveBeenCalledWith('Quest Submitted! Retrieval Drones dispatched.')
    })
  })
})
