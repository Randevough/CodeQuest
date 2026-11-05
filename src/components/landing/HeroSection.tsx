'use client'

import React from 'react'
import Link from 'next/link'
import { QuestVoucherHero } from './QuestVoucherHero'

export interface HeroSectionProps {
  sessionUser?: {
    name?: string | null
    email?: string | null
    role?: string
  } | null
  totalActiveQuests?: number
}

export function HeroSection({
  sessionUser,
}: HeroSectionProps) {
  const isAdmin = sessionUser?.role?.toLowerCase() === 'admin'
  const secondaryCta = !sessionUser
    ? { label: 'Masuk Akun Kampus', href: '/login' }
    : isAdmin
    ? { label: 'Buka Panel Admin', href: '/admin/members' }
    : { label: 'Buka Workspace Saya', href: '/workspace' }

  return (
    <section aria-label="Hero" className="w-full py-10 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Campus Guild Intro & CTAs (Cols 1-7) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {/* Subtle Label */}
            <p className="text-xs sm:text-sm font-semibold tracking-wide uppercase text-[#8A94A6]">
              Cyber University Coding Club: Arena Proyek & Bounty Mahasiswa
            </p>

            {/* Headline */}
            <h1 className="font-sans font-black tracking-tight text-4xl sm:text-5xl lg:text-6xl text-[#FFF3DE] leading-[1.1]">
              <span className="block">Klaim Misi Kampus.</span>
              <span className="block">Bangun Karya Nyata.</span>
            </h1>

            {/* Subcopy */}
            <p className="text-base sm:text-lg text-[#C2C7D0] leading-relaxed max-w-2xl">
              Kerjakan proyek software riil di IDE lokal, kumpulkan repositori Git, dan raih review terverifikasi dari mentor Cyber University.
            </p>

            {/* Tactile CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href="/explore"
                className="btn-tactile-orange inline-flex items-center justify-center px-7 py-3 min-h-[48px] rounded-xl text-base transition-all motion-reduce:transform-none"
              >
                Jelajahi Misi
              </Link>

              <Link
                href={secondaryCta.href}
                className="btn-tactile-slate inline-flex items-center justify-center px-7 py-3 min-h-[48px] rounded-xl text-base transition-all motion-reduce:transform-none"
              >
                {secondaryCta.label}
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive Quest Voucher (Cols 8-12) */}
          <div className="lg:col-span-5 w-full">
            <QuestVoucherHero />
          </div>
        </div>
      </div>
    </section>
  )
}
