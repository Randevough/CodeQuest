import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Pagination } from '@/components/Pagination'
import { QuestTimer } from '@/components/QuestTimer'
import { QuestCard } from '@/components/QuestCard'
import { Header } from '@/components/Header'
import { useSession, signOut } from 'next-auth/react'

vi.mock('next-auth/react', () => ({
    useSession: vi.fn(),
    signOut: vi.fn(),
}))

vi.mock('@/components/ThemeToggle', () => ({
    ThemeToggle: () => <div data-testid="theme-toggle" />
}))

vi.mock('next/image', () => ({
    default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
        // eslint-disable-next-line @next/next/no-img-element
        return <img alt={props.alt || ''} {...props} />
    }
}))

vi.mock('next/navigation', () => ({
    usePathname: () => '/explore',
    useSearchParams: () => new URLSearchParams(),
}))


describe('UI Components', () => {
    describe('Pagination', () => {
        it('should return null when totalPages <= 1', () => {
            const { container } = render(<Pagination totalPages={1} />)
            expect(container.firstChild).toBeNull()
        })

        it('should render page controls and trigger onPageChange when clicked', () => {
            const onPageChange = vi.fn()
            render(<Pagination totalPages={5} currentPage={2} onPageChange={onPageChange} />)

            const page3Button = screen.getByRole('button', { name: '3' })
            expect(page3Button).toBeDefined()

            fireEvent.click(page3Button)
            expect(onPageChange).toHaveBeenCalledWith(3)
        })

        it('should disable previous button on the first page', () => {
            const onPageChange = vi.fn()
            render(<Pagination totalPages={3} currentPage={1} onPageChange={onPageChange} />)

            // When disabled, PageControl renders span
            const prevIcon = screen.getByText('chevron_left')
            expect(prevIcon.parentElement?.tagName).toBe('SPAN')
        })
    })

    describe('QuestTimer', () => {
        it('should render placeholder when deadline is null', () => {
            render(<QuestTimer deadline={null} />)
            expect(screen.getByText('-- : -- : --')).toBeDefined()
            expect(screen.getByText('No deadline set')).toBeDefined()
        })

        it('should render countdown numbers when deadline is in the future', () => {
            const future = new Date(Date.now() + 1000 * 60 * 60 * 25) // 1 day and 1 hour
            render(<QuestTimer deadline={future} />)

            expect(screen.getByText('Days')).toBeDefined()
            expect(screen.getByText('Hrs')).toBeDefined()
            expect(screen.getByText('Mins')).toBeDefined()
        })

        it('should render zeroed numbers when deadline is in the past', () => {
            const past = new Date(Date.now() - 1000 * 60 * 60)
            render(<QuestTimer deadline={past} />)

            const zeros = screen.getAllByText('00')
            expect(zeros.length).toBe(3)
        })
    })

    describe('QuestCard', () => {
        it('should render quest metadata, title, and points badge', () => {
            const mockQuest = {
                id: 'q-card-1',
                title: 'Build TypeScript Parser',
                description: 'A deep dive into abstract syntax trees',
                difficulty: 'Intermediate',
                category: 'Web',
                points: 250,
                maxSnatchers: 3,
                deadline: null,
                _count: { snatches: 1 }
            }

            render(<QuestCard quest={mockQuest} isSnatched={false} />)

            expect(screen.getByText('Build TypeScript Parser')).toBeDefined()
            expect(screen.getByText('Intermediate')).toBeDefined()
            expect(screen.getByText('Web')).toBeDefined()
            expect(screen.getByText('250 pts')).toBeDefined()
            expect(screen.getByRole('link', { name: 'View Details' })).toBeDefined()
        })

        it('should indicate when quest is full', () => {
            const fullQuest = {
                id: 'q-card-full',
                title: 'High Demand Quest',
                description: 'Already claimed',
                difficulty: 'Beginner',
                category: 'AI',
                points: 100,
                maxSnatchers: 1,
                deadline: null,
                _count: { snatches: 1 }
            }

            render(<QuestCard quest={fullQuest} isSnatched={false} />)
            expect(screen.getByRole('link', { name: 'Full' })).toBeDefined()
        })
    })

    describe('Header', () => {
        const mockUseSession = vi.mocked(useSession)

        it('should render brand and standard nav links for guest users', () => {
            mockUseSession.mockReturnValue({
                data: null,
                status: 'unauthenticated',
                update: vi.fn(),
            })

            render(<Header activePage="explore" />)

            expect(screen.getByText('CodeQuest')).toBeDefined()
            expect(screen.getByText('Explore Quests')).toBeDefined()
            expect(screen.getByText('Leaderboard')).toBeDefined()
            expect(screen.getByText('My Workspace')).toBeDefined()
            expect(screen.queryByText('Admin Dashboard')).toBeNull()
        })

        it('should render admin link and points for authenticated admin user', () => {
            mockUseSession.mockReturnValue({
                data: {
                    user: {
                        name: 'Admin Tester',
                        email: 'admin@codequest.dev',
                        role: 'Admin',
                        points: 990,
                        avatar: null,
                        image: null,
                        bio: null,
                        githubUrl: null,
                        linkedinUrl: null,
                    },
                    expires: '9999-12-31',
                },
                status: 'authenticated',
                update: vi.fn(),
            })

            render(<Header activePage="workspace" />)

            expect(screen.getAllByText('Admin Dashboard').length).toBeGreaterThan(0)
            expect(screen.getByText('990 pts')).toBeDefined()

            const profileBtn = screen.getByLabelText('Open profile menu')
            fireEvent.click(profileBtn)

            expect(screen.getByText('Admin Tester')).toBeDefined()
            expect(screen.getByText('admin@codequest.dev')).toBeDefined()

            const logoutBtn = screen.getByText('Log out')
            fireEvent.click(logoutBtn)
            expect(signOut).toHaveBeenCalledWith({ callbackUrl: '/login' })
        })
    })
})

