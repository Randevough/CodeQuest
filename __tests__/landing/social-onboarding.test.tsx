import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { SquadSection } from '@/components/landing/SquadSection'
import { PlayerPebble } from '@/components/landing/PlayerPebble'
import {
  LeaderboardSection,
  FALLBACK_LEADERBOARD_PODIUM,
  BADGE_COLLECTION_14,
} from '@/components/landing/LeaderboardSection'
import { OnboardingSection } from '@/components/landing/OnboardingSection'

describe('SquadSection (Multiplayer Co-Op Party HUD)', () => {
  it('renders visual party HUD with crisp copy and tactile actions', () => {
    render(<SquadSection />)

    expect(
      screen.getByRole('heading', { name: /Kerjakan Misi Bersama Skuad Pilihanmu/i })
    ).toBeDefined()
    expect(
      screen.getByText(/Bentuk tim 2–4 developer/i)
    ).toBeDefined()

    // Party HUD Header & Multiplier
    expect(screen.getByTestId('party-slots-badge').textContent).toContain('2 dari 3 Orang')
    expect(screen.getByText(/Bonus XP Skuad \+20%/i)).toBeDefined()

    // Visual Squad Members
    expect(screen.getByText('Alex Dev')).toBeDefined()
    expect(screen.getByText('Ketua Tim')).toBeDefined()
    expect(screen.getByText('Budi Runner')).toBeDefined()
    expect(screen.getByText('Pengembang Backend')).toBeDefined()
    expect(screen.getAllByText('Siap')).toHaveLength(2)

    // Interactive Open Slot
    expect(screen.getByText(/\+ Ajak Rekan Mahasiswa Bergabung/i)).toBeDefined()

    // Tactile Action buttons
    expect(screen.getByRole('link', { name: /Buat Lobi Skuad/i })).toBeDefined()
    expect(screen.getByRole('link', { name: /Gabung Skuad/i })).toBeDefined()
  })

  it('allows inviting teammate interactively to fill squad 3/3', () => {
    render(<SquadSection />)

    const openSlotBtn = screen.getByTestId('squad-slot-3-open')
    expect(openSlotBtn).toBeDefined()
    expect(screen.getByTestId('party-slots-badge').textContent).toContain('2 dari 3 Orang')

    fireEvent.click(openSlotBtn)

    expect(screen.getByTestId('party-slots-badge').textContent).toContain('3 dari 3 Orang')
    expect(screen.getByText('Citra Code')).toBeDefined()
    expect(screen.getByText('Desainer UI')).toBeDefined()
    expect(screen.getAllByText('Siap')).toHaveLength(3)

    // Reset back to open slot
    const resetBtn = screen.getByRole('button', { name: /Reset slot/i })
    fireEvent.click(resetBtn)
    expect(screen.getByTestId('party-slots-badge').textContent).toContain('2 dari 3 Orang')
    expect(screen.getByTestId('squad-slot-3-open')).toBeDefined()
  })
})

describe('PlayerPebble Component', () => {
  it('renders user details, level, and points badge with Soft Arcade pill geometry', () => {
    render(
      <PlayerPebble
        name="Alex Developer"
        level={4}
        points={1420}
        handle="@alexdev"
      />
    )

    expect(screen.getByText('Alex Developer')).toBeDefined()
    expect(screen.getByText('(Level 4)')).toBeDefined()
    expect(screen.getByText('@alexdev')).toBeDefined()
    expect(screen.getByText('+1,420 PTS')).toBeDefined()
  })
})

describe('LeaderboardSection (Soft Arcade Podium & Badge Grid)', () => {
  it('renders top podium ranks with fallback data when empty', () => {
    render(<LeaderboardSection />)

    expect(
      screen.getByRole('heading', { name: /Papan Peringkat Kampus/i })
    ).toBeDefined()
    expect(
      screen.getByText(/Papan Peringkat Musim 1 • Top Pengembang/i)
    ).toBeDefined()
    expect(
      screen.getByText(/Musim 1 sedang berlangsung. Skor dihitung dari PR repo yang terverifikasi./i)
    ).toBeDefined()

    // Fallback Top 3 names & points (rank 1 appears in both sample pebble and rank 1 pill)
    expect(screen.getAllByText(FALLBACK_LEADERBOARD_PODIUM[0].name).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/2,150 PTS/i).length).toBe(2)
    expect(screen.getByText(FALLBACK_LEADERBOARD_PODIUM[1].name)).toBeDefined()
    expect(screen.getByText(/1,840 PTS/i)).toBeDefined()
    expect(screen.getByText(FALLBACK_LEADERBOARD_PODIUM[2].name)).toBeDefined()
    expect(screen.getByText(/1,620 PTS/i)).toBeDefined()

    // Podium ranks & badges
    expect(screen.getByText(/Juara 1/i)).toBeDefined()
    expect(screen.getByText(/Peringkat 2/i)).toBeDefined()
    expect(screen.getByText(/Peringkat 3/i)).toBeDefined()

    // Visual XP Bars on each row
    expect(screen.getByTestId('xp-bar-rank-1')).toBeDefined()
    expect(screen.getByTestId('xp-bar-rank-2')).toBeDefined()
    expect(screen.getByTestId('xp-bar-rank-3')).toBeDefined()

    // Bevel button to full leaderboard
    const fullPillButton = screen.getByRole('link', { name: /Lihat Seluruh Peringkat/i })
    expect(fullPillButton).toBeDefined()
    expect(fullPillButton.getAttribute('href')).toBe('/leaderboard')

    // 14 badges rendered
    expect(screen.getByText('14 Lencana Keahlian Terverifikasi')).toBeDefined()
    expect(BADGE_COLLECTION_14).toHaveLength(14)
    BADGE_COLLECTION_14.forEach((b) => {
      expect(screen.getByText(b.name)).toBeDefined()
    })
  })

  it('allows clicking badges to reveal requirements', () => {
    render(<LeaderboardSection />)

    const requirementBox = screen.getByTestId('badge-requirement-box')
    expect(requirementBox.textContent).toContain('Klik atau sorot lencana')

    const webWeaverBadge = screen.getByRole('button', { name: /Web Weaver/i })
    fireEvent.click(webWeaverBadge)

    expect(requirementBox.textContent).toContain('Selesaikan 5 quest Web')
  })

  it('renders custom topUsers when prop is supplied', () => {
    const customUsers = [
      { id: '1', name: 'Master Hacker', points: 9999, handle: '@hacker' },
      { id: '2', name: 'Pro Coder', points: 8888, handle: '@procoder' },
      { id: '3', name: 'Code Cadet', points: 7777, handle: '@cadet' },
    ]

    render(<LeaderboardSection topUsers={customUsers} />)

    expect(screen.getAllByText('Master Hacker').length).toBe(2)
    expect(screen.getAllByText(/9,999 PTS/i).length).toBe(2)
    expect(screen.getByText('Pro Coder')).toBeDefined()
    expect(screen.getByText(/8,888 PTS/i)).toBeDefined()
    expect(screen.getByText('Code Cadet')).toBeDefined()
    expect(screen.getByText(/7,777 PTS/i)).toBeDefined()
  })
})

describe('OnboardingSection', () => {
  it('renders guest dual CTA and starter roles', () => {
    render(<OnboardingSection isLoggedIn={false} />)

    expect(
      screen.getByRole('heading', { name: /PILIH JALUR KARIR & MULAI QUEST/i })
    ).toBeDefined()
    expect(screen.getByText(/Stasiun Pembuatan Karakter/i)).toBeDefined()
    expect(screen.getByRole('radio', { name: /Pengembang Web/i })).toBeDefined()
    expect(screen.getByRole('radio', { name: /Spesialis Backend/i })).toBeDefined()
    expect(screen.getByRole('radio', { name: /AI & Machine Learning/i })).toBeDefined()

    expect(screen.getByTestId('starter-perk-banner')).toBeDefined()
    expect(screen.getByText(/\+100 XP Starter/i)).toBeDefined()

    expect(screen.getByRole('link', { name: /Daftar Akun Mahasiswa/i }).getAttribute('href')).toBe(
      '/signup'
    )
    expect(screen.getByRole('link', { name: /Masuk ke Akun/i }).getAttribute('href')).toBe(
      '/login'
    )
  })

  it('allows selecting starter roles', () => {
    render(<OnboardingSection isLoggedIn={false} />)

    const backendRole = screen.getByRole('radio', { name: /Spesialis Backend/i })
    expect(backendRole.getAttribute('aria-checked')).toBe('false')

    fireEvent.click(backendRole)
    expect(backendRole.getAttribute('aria-checked')).toBe('true')
  })

  it('renders member CTA when logged in (Buka Workspace Saya)', () => {
    render(<OnboardingSection isLoggedIn={true} userName="CyberStudent" />)

    expect(
      screen.getByRole('heading', { name: /PILIH JALUR KARIR & MULAI QUEST/i })
    ).toBeDefined()
    const workspaceLink = screen.getByRole('link', { name: /Buka Workspace Saya/i })
    expect(workspaceLink.getAttribute('href')).toBe('/workspace')
    expect(screen.getByText(/(CyberStudent)/i)).toBeDefined()
    expect(screen.queryByRole('link', { name: /Daftar Akun Mahasiswa/i })).toBeNull()
    expect(screen.queryByRole('link', { name: /Masuk ke Akun/i })).toBeNull()
  })
})
