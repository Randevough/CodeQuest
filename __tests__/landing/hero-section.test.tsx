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
  it('renders status chip, headline, subcopy, and rule badges', () => {
    render(<HeroSection />)

    // Status Chip
    expect(screen.getByText('INSTITUSI AKTIF')).toBeTruthy()
    expect(screen.getByText('CYBER UNIVERSITY CODING CLUB')).toBeTruthy()

    // Headline
    const headline = screen.getByRole('heading', { level: 1 })
    expect(headline.textContent).toContain('KLAIM MISI KODING KAMPUS. BANGUN PROYEK NYATA.')

    // Subcopy
    expect(
      screen.getByText(
        'Bukan tutorial video pasif. Ambil tiket misi proyek, kolaborasi dalam skuad, kirim URL repositori, dan raih evaluasi mentor.'
      )
    ).toBeTruthy()

    // Rule Badges
    expect(screen.getByText('Maks. 3 Misi Aktif')).toBeTruthy()
    expect(screen.getByText('Review Mentor Kampus')).toBeTruthy()
    expect(screen.getByText('14 Lencana Keahlian')).toBeTruthy()
  })

  it('renders primary CTA pointing to /explore', () => {
    render(<HeroSection />)

    const primaryLink = screen.getByRole('link', { name: /Jelajahi Misi/i })
    expect(primaryLink.getAttribute('href')).toBe('/explore')
  })

  it('renders guest secondary CTA pointing to /login when sessionUser is null or undefined', () => {
    const { unmount } = render(<HeroSection sessionUser={null} />)

    let secondaryLink = screen.getByRole('link', { name: /Masuk Akun Kampus/i })
    expect(secondaryLink.getAttribute('href')).toBe('/login')

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

    expect(screen.getByText('OAuth2 Auth Service & JWT Security')).toBeTruthy()
    expect(screen.getByRole('button', { name: /AMBIL TIKET MISI/i })).toBeTruthy()
  })
})

describe('QuestVoucherHero Lifecycle Engine', () => {
  it('renders State 1 (Available) with telemetry and snatch button', () => {
    render(<QuestVoucherHero />)

    expect(screen.getByText('Web')).toBeTruthy()
    expect(screen.getByText('Intermediate')).toBeTruthy()
    expect(screen.getByText('+350 XP')).toBeTruthy()
    expect(screen.getByText('OAuth2 Auth Service & JWT Security')).toBeTruthy()
    expect(
      screen.getByText('Bangun modul autentikasi terpusat SSO mahasiswa dengan spesifikasi OAuth2 nyata.')
    ).toBeTruthy()

    expect(screen.getByText('Kapasitas:')).toBeTruthy()
    expect(screen.getByText('2/3 Mahasiswa')).toBeTruthy()
    expect(screen.getByText('Beban:')).toBeTruthy()
    expect(screen.getByText('0/3 Aktif')).toBeTruthy()

    expect(screen.getByRole('button', { name: /AMBIL TIKET MISI/i })).toBeTruthy()
  })

  it('transitions through complete 3-step lifecycle: snatch -> submit repo -> mentor approval -> reset', () => {
    render(<QuestVoucherHero />)

    // 1. Initial State: Click Snatch
    const snatchBtn = screen.getByRole('button', { name: /AMBIL TIKET MISI/i })
    fireEvent.click(snatchBtn)

    // 2. In Progress State
    expect(screen.getByText('3/3 (Penuh)')).toBeTruthy()
    expect(screen.getByText('1/3 Aktif')).toBeTruthy()

    const input = screen.getByLabelText(/URL Repositori GitHub/i) as HTMLInputElement
    expect(input.value).toBe('https://github.com/cyber-univ/quest-auth-jwt')

    // Modify input
    fireEvent.change(input, { target: { value: 'https://github.com/cyber-univ/my-fork' } })
    expect(input.value).toBe('https://github.com/cyber-univ/my-fork')

    // Submit repo
    const submitBtn = screen.getByRole('button', { name: /KIRIM SUBMISSION REPOSITORI/i })
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

    expect(screen.getByRole('button', { name: /AMBIL TIKET MISI/i })).toBeTruthy()
    expect(screen.getByText('2/3 Mahasiswa')).toBeTruthy()
    expect(screen.getByText('0/3 Aktif')).toBeTruthy()
  })
})
