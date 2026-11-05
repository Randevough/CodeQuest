import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { TactileHeroEngine } from '@/components/landing/TactileHeroEngine'

describe('TactileHeroEngine Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  it('renders container with tactile aesthetic tokens and HUD header', () => {
    render(<TactileHeroEngine autoPlay={false} />)

    const container = screen.getByTestId('tactile-hero-engine')
    expect(container.className).toContain('bg-[#20283A]')
    expect(container.className).toContain('border-[#2E3A52]')
    expect(container.className).toContain('shadow-[0_6px_0_#10141D]')

    expect(screen.getByText('GIT ENGINE v1.4 • MISI #042')).toBeTruthy()
    expect(screen.getByText('DIJEDA')).toBeTruthy()
  })

  it('renders SVG commit graph lanes and commit nodes', () => {
    const { container } = render(<TactileHeroEngine autoPlay={false} />)

    const svg = container.querySelector('svg[role="img"]')
    expect(svg).toBeTruthy()
    expect(svg?.getAttribute('viewBox')).toBe('0 0 440 100')

    expect(screen.getByText('main')).toBeTruthy()
    expect(screen.getByText('quest')).toBeTruthy()
    expect(screen.getByTestId('node-q1')).toBeTruthy()
    expect(screen.getByTestId('node-q2')).toBeTruthy()
    expect(screen.getByTestId('node-m2')).toBeTruthy()
    expect(screen.getByTestId('node-m3')).toBeTruthy()
  })

  it('renders 4 phase navigation tabs with accessible roles', () => {
    render(<TactileHeroEngine autoPlay={false} />)

    const tabs = screen.getAllByRole('tab')
    expect(tabs).toHaveLength(4)
    expect(tabs[0].textContent).toBe('01. Klaim')
    expect(tabs[1].textContent).toBe('02. Solusi')
    expect(tabs[2].textContent).toBe('03. Review')
    expect(tabs[3].textContent).toBe('04. Reward')
    expect(tabs[0].getAttribute('aria-selected')).toBe('true')
    expect(tabs[1].getAttribute('aria-selected')).toBe('false')
  })

  it('displays Phase 0 (Snatch & Branch) command and active orange node', () => {
    render(<TactileHeroEngine initialPhase={0} autoPlay={false} />)

    expect(screen.getByText('git checkout -b quest/042-sso')).toBeTruthy()
    expect(screen.getByText("Switched to a new branch 'quest/042-sso'")).toBeTruthy()
    expect(screen.getByText('[bounty] Misi #042 SSO & JWT diklaim mahasiswa')).toBeTruthy()
    expect(screen.getByText('quest/042-sso')).toBeTruthy()

    const q1 = screen.getByTestId('node-q1')
    expect(q1.getAttribute('fill')).toBe('#ed8936')
    expect(q1.getAttribute('stroke')).toBe('#b35a15')
  })

  it('displays Phase 1 (Test & Verify) with passing vitest suite and emerald node', () => {
    render(<TactileHeroEngine initialPhase={1} autoPlay={false} />)

    expect(screen.getByText('npm test -- --run')).toBeTruthy()
    expect(screen.getByText('PASS tests/sso-token.test.ts (4 passed)')).toBeTruthy()
    expect(screen.getByText('PASS tests/jwt-rs256.test.ts (4 passed)')).toBeTruthy()
    expect(screen.getByText('Tests: 8 passed, 8 total (100% coverage)')).toBeTruthy()
    expect(screen.getByText('Vitest • 8/8 Passed')).toBeTruthy()

    const q2 = screen.getByTestId('node-q2')
    expect(q2.getAttribute('fill')).toBe('#3DD68C')
  })

  it('displays Phase 2 (PR & Mentor Review) with mentor stamp card', () => {
    render(<TactileHeroEngine initialPhase={2} autoPlay={false} />)

    expect(screen.getByText('gh pr create --fill && gh pr merge --auto')).toBeTruthy()
    expect(screen.getByText('✓ Disetujui Mentor Kampus (@mentor-cyber)')).toBeTruthy()

    const mentorStamp = screen.getByTestId('mentor-stamp-card')
    expect(mentorStamp).toBeTruthy()
    expect(screen.getByText('✓ DISETUJUI MENTOR KAMPUS')).toBeTruthy()
    expect(
      screen.getByText('"Arsitektur token aman dan implementasi refresh token bersih."')
    ).toBeTruthy()

    const m2 = screen.getByTestId('node-m2')
    expect(m2.getAttribute('fill')).toBe('#3DD68C')
  })

  it('displays Phase 3 (XP Reward Payout) with +350 XP badge and level progression', () => {
    render(<TactileHeroEngine initialPhase={3} autoPlay={false} />)

    expect(screen.getByText('cyber-quest payout --claim 042')).toBeTruthy()
    expect(screen.getByText('✓ +350 XP berhasil ditransfer ke profil')).toBeTruthy()

    const payoutCard = screen.getByTestId('reward-payout-card')
    expect(payoutCard).toBeTruthy()
    expect(screen.getByText('+350 XP')).toBeTruthy()
    expect(screen.getByText('Level 3 → Level 4')).toBeTruthy()
    expect(screen.getByText('3.500 / 3.500 XP (100%)')).toBeTruthy()

    const m3 = screen.getByTestId('node-m3')
    expect(m3.getAttribute('fill')).toBe('#ed8936')
  })

  it('allows manual clicking between phase tabs', () => {
    render(<TactileHeroEngine initialPhase={0} autoPlay={false} />)

    const tabs = screen.getAllByRole('tab')

    // Click Phase 2 tab
    fireEvent.click(tabs[2])
    expect(tabs[2].getAttribute('aria-selected')).toBe('true')
    expect(tabs[0].getAttribute('aria-selected')).toBe('false')
    expect(screen.getByTestId('mentor-stamp-card')).toBeTruthy()

    // Click Phase 3 tab
    fireEvent.click(tabs[3])
    expect(tabs[3].getAttribute('aria-selected')).toBe('true')
    expect(screen.getByTestId('reward-payout-card')).toBeTruthy()

    // Click back to Phase 1 tab
    fireEvent.click(tabs[1])
    expect(tabs[1].getAttribute('aria-selected')).toBe('true')
    expect(screen.getByText('Vitest • 8/8 Passed')).toBeTruthy()
  })

  it('toggles playback using Play/Pause button in HUD header', () => {
    render(<TactileHeroEngine autoPlay={true} />)

    const toggleBtn = screen.getByRole('button', { name: /Jeda animasi/i })
    expect(screen.getByText('SIKLUS OTOMATIS')).toBeTruthy()

    // Pause
    fireEvent.click(toggleBtn)
    expect(screen.getByText('DIJEDA')).toBeTruthy()
    expect(screen.getByRole('button', { name: /Putar animasi/i })).toBeTruthy()

    // Play
    const playBtn = screen.getByRole('button', { name: /Putar animasi/i })
    fireEvent.click(playBtn)
    expect(screen.getByText('SIKLUS OTOMATIS')).toBeTruthy()
    expect(screen.getByRole('button', { name: /Jeda animasi/i })).toBeTruthy()
  })

  it('automatically advances phases every cycle interval when playing', () => {
    vi.useFakeTimers()

    render(<TactileHeroEngine initialPhase={0} autoPlay={true} cycleIntervalMs={2500} />)

    expect(screen.getByText('git checkout -b quest/042-sso')).toBeTruthy()

    // Advance 2500ms -> Phase 1
    act(() => {
      vi.advanceTimersByTime(2500)
    })
    expect(screen.getByText('npm test -- --run')).toBeTruthy()

    // Advance 2500ms -> Phase 2
    act(() => {
      vi.advanceTimersByTime(2500)
    })
    expect(screen.getByTestId('mentor-stamp-card')).toBeTruthy()

    // Advance 2500ms -> Phase 3
    act(() => {
      vi.advanceTimersByTime(2500)
    })
    expect(screen.getByTestId('reward-payout-card')).toBeTruthy()

    // Advance 2500ms -> Loop back to Phase 0
    act(() => {
      vi.advanceTimersByTime(2500)
    })
    expect(screen.getByText('git checkout -b quest/042-sso')).toBeTruthy()

    vi.useRealTimers()
  })

  it('does not advance phase when paused', () => {
    vi.useFakeTimers()

    render(<TactileHeroEngine initialPhase={0} autoPlay={false} cycleIntervalMs={2500} />)

    expect(screen.getByText('git checkout -b quest/042-sso')).toBeTruthy()

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    // Still at phase 0
    expect(screen.getByText('git checkout -b quest/042-sso')).toBeTruthy()

    vi.useRealTimers()
  })

  it('pauses auto-play if prefers-reduced-motion is active', () => {
    const matchMediaMock = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('prefers-reduced-motion: reduce'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    vi.stubGlobal('matchMedia', matchMediaMock)

    render(<TactileHeroEngine autoPlay={true} />)

    expect(screen.getByText('DIJEDA')).toBeTruthy()
    expect(screen.getByRole('button', { name: /Putar animasi/i })).toBeTruthy()
  })
})
