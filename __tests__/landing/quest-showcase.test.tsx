import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { PipelineSection, PIPELINE_STEPS } from '@/components/landing/PipelineSection'
import { QuestBubble, describePlayers } from '@/components/landing/QuestBubble'
import { QuestShowcaseSection } from '@/components/landing/QuestShowcaseSection'

describe('describePlayers', () => {
  it('describes solo and multi-slot quests', () => {
    expect(describePlayers(undefined)).toBe('Solo quest')
    expect(describePlayers(1)).toBe('Solo quest')
    expect(describePlayers(4)).toBe('Up to 4 players')
  })
})

describe('PipelineSection', () => {
  it('is the in-page target for "How it works"', () => {
    const { container } = render(<PipelineSection />)

    expect(container.querySelector('section#how-it-works')).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'How a quest works' })).toBeTruthy()
  })

  it('renders all four steps in order', () => {
    render(<PipelineSection />)

    const items = within(screen.getByRole('list')).getAllByRole('listitem')
    expect(items).toHaveLength(4)

    PIPELINE_STEPS.forEach((step, index) => {
      expect(within(items[index]).getByRole('heading', { name: step.title })).toBeTruthy()
      expect(within(items[index]).getByText(step.description)).toBeTruthy()
      expect(screen.getByTestId(`step-number-${step.step}`).textContent).toBe(step.step)
    })
  })

  it('states the real rules and that review is done by a person', () => {
    render(<PipelineSection />)

    expect(screen.getByText(/up to 3 active quests/i)).toBeTruthy()
    expect(screen.getByText('Reviewed by a person')).toBeTruthy()
  })
})

describe('QuestBubble', () => {
  const sampleQuest = {
    id: 'sample-1',
    title: 'Full-Stack Task Runner',
    description: 'Build a robust background task processing pipeline.',
    category: 'Web',
    difficulty: 'Beginner',
    points: 150,
    maxSnatchers: 3,
  }

  it('renders category, difficulty, points and player count', () => {
    render(<QuestBubble quest={sampleQuest} />)

    expect(screen.getByTestId('category-chip').textContent).toBe('Web')
    expect(screen.getByRole('img', { name: 'Difficulty: Beginner' })).toBeTruthy()
    expect(screen.getByTestId('points-chip').textContent?.trim()).toBe('+150 pts')
    expect(screen.getByText('Up to 3 players')).toBeTruthy()
  })

  it('renders the title and a clamped description', () => {
    render(<QuestBubble quest={sampleQuest} />)

    expect(screen.getByRole('heading', { name: 'Full-Stack Task Runner' })).toBeTruthy()
    expect(screen.getByText(sampleQuest.description).className).toContain('line-clamp-3')
  })

  it('links to the quest page', () => {
    render(<QuestBubble quest={sampleQuest} />)

    const link = screen.getByRole('link', { name: 'View quest' })
    expect(link.getAttribute('href')).toBe('/quests/sample-1')
    expect(link.className).toContain('btn')
  })

  it('accepts individual props when no quest object is given', () => {
    render(
      <QuestBubble
        id="prop-quest"
        title="AI Evaluation Harness"
        description="Run automated benchmarks on LLMs."
        category="AI"
        difficulty="Intermediate"
        points={400}
      />
    )

    expect(screen.getByRole('heading', { name: 'AI Evaluation Harness' })).toBeTruthy()
    expect(screen.getByRole('img', { name: 'Difficulty: Intermediate' })).toBeTruthy()
    expect(screen.getByTestId('points-chip').textContent?.trim()).toBe('+400 pts')
    expect(screen.getByText('Solo quest')).toBeTruthy()
  })
})

describe('QuestShowcaseSection', () => {
  const quests = [
    { id: 'q1', title: 'Quest One', description: 'First.', category: 'Web', difficulty: 'Beginner', points: 100 },
    { id: 'q2', title: 'Quest Two', description: 'Second.', category: 'AI', difficulty: 'Advanced', points: 500 },
  ]

  it('renders live quests and a link to the full list', () => {
    render(<QuestShowcaseSection quests={quests} />)

    expect(screen.getByRole('heading', { name: 'What is on the board now' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Quest One' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Quest Two' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'See all quests' }).getAttribute('href')).toBe('/explore')
  })

  it('shows an honest empty state when there are no active quests', () => {
    render(<QuestShowcaseSection quests={[]} />)

    expect(screen.getByTestId('quests-empty-state')).toBeTruthy()
    expect(screen.getByText('No active quests right now')).toBeTruthy()
    expect(screen.queryByTestId('quest-card')).toBeNull()
  })

  it('shows an unavailable state instead of invented quests when loading failed', () => {
    render(<QuestShowcaseSection quests={null} />)

    expect(screen.getByTestId('quests-unavailable')).toBeTruthy()
    expect(screen.getByText('The quest board could not be loaded')).toBeTruthy()
    expect(screen.queryByTestId('quest-card')).toBeNull()
  })
})
