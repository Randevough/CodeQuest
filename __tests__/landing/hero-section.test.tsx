import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { HeroSection } from '@/components/landing/HeroSection'
import { QuestVoucherHero } from '@/components/landing/QuestVoucherHero'
import { ArcadeStar } from '@/components/landing/ArcadeStar'

describe('ArcadeStar Primitive', () => {
  it('renders 4-point star SVG with default props', () => {
    const { container } = render(<ArcadeStar data-testid="star-icon" />)
    const svg = container.querySelector('svg')

    expect(svg).toBeTruthy()
    expect(svg?.getAttribute('width')).toBe('16')
    expect(svg?.getAttribute('height')).toBe('16')
    expect(svg?.getAttribute('fill')).toBe('#FFAE58')
    expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24')

    const path = svg?.querySelector('path')
    expect(path?.getAttribute('d')).toBe(
      'M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z'
    )
  })

  it('accepts custom size, color, and className', () => {
    const { container } = render(
      <ArcadeStar size={24} color="#3DD68C" className="custom-star-class" />
    )
    const svg = container.querySelector('svg')

    expect(svg?.getAttribute('width')).toBe('24')
    expect(svg?.getAttribute('height')).toBe('24')
    expect(svg?.getAttribute('fill')).toBe('#3DD68C')
    expect(svg?.getAttribute('class')).toContain('custom-star-class')
  })
})

describe('HeroSection Component', () => {
  it('renders subtle campus club label, headline, and subcopy', () => {
    render(<HeroSection />)

    // Subtle label (no pill badge, no em dash)
    expect(
      screen.getByText('Cyber University Coding Club: Arena Proyek & Bounty Mahasiswa')
    ).toBeTruthy()

    // Headline with clean copy and modern font
    const headline = screen.getByRole('heading', { level: 1 })
    expect(headline.textContent).toContain('Klaim Misi Kampus.')
    expect(headline.textContent).toContain('Bangun Karya Nyata.')
    expect(headline.className).toContain('font-sans')
    expect(headline.className).toContain('font-black')

    // Micro-proof chips
    expect(screen.getByText('Git Repo Mandiri')).toBeTruthy()
    expect(screen.getByText('Review Mentor 1-on-1')).toBeTruthy()
    expect(screen.getByText('Reward XP Resmi')).toBeTruthy()

    // Subcopy
    expect(
      screen.getByText(
        'Kerjakan proyek software riil di IDE lokal, kumpulkan repositori Git, dan raih review terverifikasi dari mentor Cyber University.'
      )
    ).toBeTruthy()

    // Floating pills removed
    expect(screen.queryByText('Maks. 3 Misi Aktif')).toBeNull()
    expect(screen.queryByText('Review Mentor Kampus')).toBeNull()
    expect(screen.queryByText('14 Lencana Keahlian')).toBeNull()
  })

  it('renders primary CTA pointing to /explore with rounded-xl', () => {
    render(<HeroSection />)

    const primaryLink = screen.getByRole('link', { name: /Jelajahi Misi/i })
    expect(primaryLink.getAttribute('href')).toBe('/explore')
    expect(primaryLink.className).toContain('rounded-xl')
    expect(primaryLink.className).not.toContain('rounded-full')
  })

  it('renders guest secondary CTA pointing to /login when sessionUser is null or undefined', () => {
    const { unmount } = render(<HeroSection sessionUser={null} />)

    let secondaryLink = screen.getByRole('link', { name: /Masuk Akun Kampus/i })
    expect(secondaryLink.getAttribute('href')).toBe('/login')
    expect(secondaryLink.className).toContain('rounded-xl')

    unmount()
    render(<HeroSection />)
    secondaryLink = screen.getByRole('link', { name: /Masuk Akun Kampus/i })
    expect(secondaryLink.getAttribute('href')).toBe('/login')
  })

  it('renders member secondary CTA pointing to /workspace when logged in as Member', () => {
    render(
      <HeroSection
        sessionUser={{ name: 'Budi Runner', email: 'budi@cyber.ac.id', role: 'Member' }}
      />
    )

    const memberLink = screen.getByRole('link', { name: /Buka Workspace Saya/i })
    expect(memberLink.getAttribute('href')).toBe('/workspace')
    expect(memberLink.className).toContain('rounded-xl')
    expect(screen.queryByRole('link', { name: /Masuk Akun Kampus/i })).toBeNull()
  })

  it('renders admin secondary CTA pointing to /admin/members when logged in as Admin', () => {
    const { unmount } = render(
      <HeroSection
        sessionUser={{ name: 'Admin Club', email: 'admin@cyber.ac.id', role: 'Admin' }}
      />
    )

    let adminLink = screen.getByRole('link', { name: /Buka Panel Admin/i })
    expect(adminLink.getAttribute('href')).toBe('/admin/members')
    expect(adminLink.className).toContain('rounded-xl')

    // Also handles uppercase 'ADMIN'
    unmount()
    render(
      <HeroSection
        sessionUser={{ name: 'Admin Upper', email: 'admin@cyber.ac.id', role: 'ADMIN' }}
      />
    )

    adminLink = screen.getByRole('link', { name: /Buka Panel Admin/i })
    expect(adminLink.getAttribute('href')).toBe('/admin/members')
  })

  it('mounts interactive QuestVoucherHero on the right column', () => {
    render(<HeroSection />)

    expect(screen.getByText('OAuth2 SSO Service & JWT Security')).toBeTruthy()
    expect(screen.getByRole('button', { name: /Ambil Tiket Misi/i })).toBeTruthy()
  })

  it('mounts TactileHeroEngine on desktop container', () => {
    render(<HeroSection />)

    expect(screen.getByTestId('tactile-hero-engine')).toBeTruthy()
    expect(screen.getByText('GIT ENGINE v1.4 • MISI #042')).toBeTruthy()
  })
})

describe('QuestVoucherHero Lifecycle Engine', () => {
  it('renders State 1 (Available) with clean metadata and ticket action', () => {
    render(<QuestVoucherHero />)

    expect(screen.getByText('BOUNTY #042 • TIKET TANTANGAN')).toBeTruthy()
    expect(screen.getByText('POST /api/auth/token')).toBeTruthy()
    expect(screen.getByText('RS256')).toBeTruthy()
    expect(screen.getByText('SPEC: RFC-6749 OAuth2 Auth Code Grant')).toBeTruthy()

    expect(screen.getByText('Web')).toBeTruthy()
    expect(screen.getByText('Intermediate')).toBeTruthy()
    expect(screen.getByText('+350 XP')).toBeTruthy()
    expect(screen.getByText('OAuth2 SSO Service & JWT Security')).toBeTruthy()
    expect(
      screen.getByText('Bangun modul autentikasi terpusat SSO mahasiswa dengan spesifikasi OAuth2 nyata.')
    ).toBeTruthy()

    expect(screen.getByText('Kuota Mahasiswa:')).toBeTruthy()
    expect(screen.getByText('2/3')).toBeTruthy()
    expect(screen.getByText('Evaluator:')).toBeTruthy()
    expect(screen.getByText('Mentor Kampus')).toBeTruthy()
    expect(screen.getByText('Deadline:')).toBeTruthy()
    expect(screen.getByText('3 Hari')).toBeTruthy()

    expect(screen.getByRole('button', { name: /Ambil Tiket Misi/i })).toBeTruthy()
  })

  it('transitions through complete 3-step lifecycle: snatch -> submit repo -> mentor approval -> reset', () => {
    render(<QuestVoucherHero />)

    // 1. Initial State: Click Snatch
    const snatchBtn = screen.getByRole('button', { name: /Ambil Tiket Misi/i })
    fireEvent.click(snatchBtn)

    // 2. In Progress State
    expect(screen.getByText('3/3 (Penuh)')).toBeTruthy()
    expect(screen.getByText('Mentor Kampus')).toBeTruthy()
    expect(screen.getByText('3 Hari')).toBeTruthy()

    const input = screen.getByLabelText(/URL Repositori GitHub/i) as HTMLInputElement
    expect(input.value).toBe('https://github.com/cyber-univ/quest-auth-jwt')

    // Modify input
    fireEvent.change(input, { target: { value: 'https://github.com/cyber-univ/my-fork' } })
    expect(input.value).toBe('https://github.com/cyber-univ/my-fork')

    // Submit repo
    const submitBtn = screen.getByRole('button', { name: /Kirim Repositori/i })
    fireEvent.click(submitBtn)

    // 3. Approved & XP Credited State
    expect(screen.getByText(/✓ DISETUJUI MENTOR KAMPUS/i)).toBeTruthy()
    expect(
      screen.getByText(/"Arsitektur token aman dan implementasi refresh token bersih."/)
    ).toBeTruthy()
    expect(screen.getByRole('button', { name: /Coba Siklus Misi Lain/i })).toBeTruthy()

    // 4. Reset back to State 1
    const resetBtn = screen.getByRole('button', { name: /Coba Siklus Misi Lain/i })
    fireEvent.click(resetBtn)

    expect(screen.getByRole('button', { name: /Ambil Tiket Misi/i })).toBeTruthy()
    expect(screen.getByText('2/3')).toBeTruthy()
  })
})
