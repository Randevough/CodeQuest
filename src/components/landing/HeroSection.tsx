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
          {/* Left Column: Campus Guild Marquee & CTAs (Cols 1-7) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {/* Status Chip */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#20283A] border border-[#2E3A52] text-xs sm:text-sm font-medium shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#3DD68C] shrink-0" aria-hidden="true" />
              <span className="font-bold text-[#FFF3DE] tracking-wide">
                INSTITUSI AKTIF
              </span>
              <span className="text-[#47577A] font-bold" aria-hidden="true">
                |
              </span>
              <span className="text-[#C2C7D0] tracking-wide">
                CYBER UNIVERSITY CODING CLUB
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#FFF3DE] tracking-tight leading-[1.15] font-display">
              KLAIM MISI KODING KAMPUS. BANGUN PROYEK NYATA.
            </h1>

            {/* Subcopy */}
            <p className="text-base sm:text-lg text-[#C2C7D0] leading-relaxed max-w-2xl">
              Bukan tutorial video pasif. Ambil tiket misi proyek, kolaborasi dalam skuad, kirim URL repositori, dan raih evaluasi mentor.
            </p>

            {/* Tactile CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href="/explore"
                className="btn-tactile-orange inline-flex items-center justify-center px-7 py-3 min-h-[48px] rounded-full text-base transition-all motion-reduce:transform-none"
              >
                Jelajahi Misi
              </Link>

              <Link
                href={secondaryCta.href}
                className="btn-tactile-slate inline-flex items-center justify-center px-7 py-3 min-h-[48px] rounded-full text-base transition-all motion-reduce:transform-none"
              >
                {secondaryCta.label}
              </Link>
            </div>

            {/* Rule Badges */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#20283A] border border-[#2E3A52] text-xs font-semibold text-[#FFF3DE] shadow-sm select-none">
                Maks. 3 Misi Aktif
              </span>
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#20283A] border border-[#2E3A52] text-xs font-semibold text-[#FFF3DE] shadow-sm select-none">
                Review Mentor Kampus
              </span>
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#20283A] border border-[#2E3A52] text-xs font-semibold text-[#FFF3DE] shadow-sm select-none">
                14 Lencana Keahlian
              </span>
            </div>
          </div>

          {/* Right Column: Interactive Quest Voucher & Snatch Engine (Cols 8-12) */}
          <div className="lg:col-span-5 w-full">
            <QuestVoucherHero />
          </div>
        </div>
      </div>
    </section>
  )
}
