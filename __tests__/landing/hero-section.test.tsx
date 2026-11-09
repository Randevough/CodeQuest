import { readFileSync } from 'node:fs'
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { HeroSection } from '@/components/landing/HeroSection'
import { QuestDemo } from '@/components/landing/QuestDemo'
import { DifficultyPips, getDifficulty } from '@/components/landing/DifficultyPips'

describe('getDifficulty', () => {
  it('maps known difficulties to a star level and label', () => {
    expect(getDifficulty('Beginner')).toEqual({ level: 1, label: 'Beginner' })
    expect(getDifficulty('intermediate')).toEqual({ level: 2, label: 'Intermediate' })
    expect(getDifficulty('ADVANCED')).toEqual({ level: 3, label: 'Advanced' })
  })

  it('falls back to one star and keeps an unknown label', () => {
    expect(getDifficulty(undefined)).toEqual({ level: 1, label: 'Beginner' })
    expect(getDifficulty('Expert')).toEqual({ level: 1, label: 'Expert' })
  })
})

describe('DifficultyPips', () => {
  it('exposes the difficulty as an accessible label', () => {
    render(<DifficultyPips difficulty="Advanced" />)
    expect(screen.getByRole('img', { name: 'Difficulty: Advanced' })).toBeTruthy()
  })
})

describe('HeroSection', () => {
  it('renders the headline and names the club and the human review', () => {
    render(<HeroSection />)

    const headline = screen.getByRole('heading', { level: 1 })
    expect(headline.textContent).toContain('Pick a quest.')
    expect(headline.textContent).toContain('Ship the project.')

    expect(screen.getByText(/UKM Coding Cyber University/)).toBeTruthy()
    expect(screen.getByText(/club staff review it/i)).toBeTruthy()
  })

  it('never claims automated review or invented bonuses', () => {
    const { container } = render(<HeroSection />)
    const text = container.textContent ?? ''

    expect(text).not.toMatch(/automated|AI review|auto-?review/i)
    expect(text).not.toMatch(/\+\d+%|bonus/i)
    expect(text).not.toContain('\u2014')
  })

  it('points the primary action at /explore and does not push sign-up', () => {
    render(<HeroSection />)

    const primary = screen.getByRole('link', { name: 'Browse quests' })
    expect(primary.getAttribute('href')).toBe('/explore')
    expect(primary.className).toContain('btn-primary')
    expect(screen.queryByRole('link', { name: /sign up|create an account/i })).toBeNull()
  })

  it('offers an in-page "How it works" link to guests', () => {
    render(<HeroSection sessionUser={null} />)

    expect(screen.getByRole('link', { name: 'How it works' }).getAttribute('href')).toBe('#how-it-works')
  })

  it('offers the workspace to signed-in members', () => {
    render(<HeroSection sessionUser={{ name: 'Member', email: 'm@example.com', role: 'Member' }} />)

    expect(screen.getByRole('link', { name: 'Open workspace' }).getAttribute('href')).toBe('/workspace')
    expect(screen.queryByRole('link', { name: 'How it works' })).toBeNull()
  })

  it('offers the admin panel to admins, regardless of role casing', () => {
    const { unmount } = render(<HeroSection sessionUser={{ name: 'A', email: 'a@example.com', role: 'Admin' }} />)
    expect(screen.getByRole('link', { name: 'Open admin panel' }).getAttribute('href')).toBe('/admin/members')

    unmount()
    render(<HeroSection sessionUser={{ name: 'A', email: 'a@example.com', role: 'ADMIN' }} />)
    expect(screen.getByRole('link', { name: 'Open admin panel' }).getAttribute('href')).toBe('/admin/members')
  })

  it('mounts the example quest', () => {
    render(<HeroSection />)

    expect(screen.getByTestId('quest-demo')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Take this quest' })).toBeTruthy()
  })
})

describe('QuestDemo', () => {
  it('is clearly labeled as an example', () => {
    render(<QuestDemo />)

    expect(screen.getByText('Example quest')).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Campus Event Check-in' })).toBeTruthy()
    expect(screen.getByTestId('demo-points').textContent).toBe('0 / 250')
  })

  it('walks the quest from open to approved and can be reset', () => {
    render(<QuestDemo />)

    const progress = () => screen.getByRole('list', { name: 'Quest progress' })
    const current = () => progress().querySelector('[aria-current="step"]')?.textContent ?? ''

    expect(current()).toContain('Open')

    fireEvent.click(screen.getByRole('button', { name: 'Take this quest' }))
    expect(current()).toContain('Taken')
    expect(screen.getByText('2 / 3')).toBeTruthy()

    const repo = screen.getByLabelText('Repository URL') as HTMLInputElement
    expect(repo.value).toBe('https://github.com/your-name/event-checkin')

    fireEvent.click(screen.getByRole('button', { name: 'Submit repository' }))
    expect(current()).toContain('Submitted')
    expect(screen.getByText(/review it by hand/i)).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'See the review result' }))
    expect(current()).toContain('Approved')
    expect(screen.getByTestId('demo-points').textContent).toBe('250 / 250')
    expect(screen.getByText(/Example feedback/)).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Try it again' }))
    expect(current()).toContain('Open')
    expect(screen.getByTestId('demo-points').textContent).toBe('0 / 250')
    expect(screen.getByRole('button', { name: 'Take this quest' })).toBeTruthy()
  })

  it('does not allow submitting an empty repository URL', () => {
    render(<QuestDemo />)

    fireEvent.click(screen.getByRole('button', { name: 'Take this quest' }))
    const repo = screen.getByLabelText('Repository URL') as HTMLInputElement
    fireEvent.change(repo, { target: { value: '   ' } })

    expect((screen.getByRole('button', { name: 'Submit repository' }) as HTMLButtonElement).disabled).toBe(true)
  })

  it('announces the stage to assistive technology', () => {
    render(<QuestDemo />)

    expect(screen.getByRole('status').textContent).toBe('Quest is open.')
    fireEvent.click(screen.getByRole('button', { name: 'Take this quest' }))
    expect(screen.getByRole('status').textContent).toMatch(/Slot taken/)
  })
})

describe('meter width contract', () => {
  it('does not clip width-driven fills to zero', () => {
    const css = readFileSync('src/app/globals.css', 'utf8')
    const fill = css.match(/\.meter > \.meter-fill\s*\{([^}]+)\}/)?.[1] ?? ''
    expect(fill).not.toContain('clip-path:')
    expect(fill).toContain('transition: width')
  })
})
