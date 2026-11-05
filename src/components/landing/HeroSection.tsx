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
    <section aria-label="Hero" className="w-full py-8 md:py-14 lg:py-16">
      <div className="page-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Campus Guild Intro & CTAs (Cols 1-7) */}
          <div className="min-w-0 lg:col-span-7 space-y-6 sm:space-y-8">
            {/* Subtle Label */}
            <p className="text-xs sm:text-sm font-semibold tracking-wide uppercase text-[#8A94A6]">
              Cyber University Coding Club: Arena Proyek & Bounty Mahasiswa
            </p>

            {/* Headline */}
            <h1 className="font-sans font-black tracking-tight text-3xl sm:text-4xl lg:text-5xl leading-[1.15] break-normal [hyphens:none]">
              <span className="block text-[#FFF3DE]">Klaim Misi Kampus.</span>
              <span className="block text-[#ed8936]">Bangun Karya Nyata.</span>
            </h1>

            {/* Subcopy */}
            <p className="text-base sm:text-lg text-[#C2C7D0] leading-relaxed max-w-2xl">
              Kerjakan proyek software riil di IDE lokal, kumpulkan repositori Git, dan raih review terverifikasi dari mentor Cyber University.
            </p>

            {/* Tactile CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href="/explore"
                className="inline-flex items-center justify-center px-7 py-3 min-h-[48px] rounded-xl text-base font-bold bg-[#ed8936] text-[#0C0F17] border-2 border-[#b35a15] shadow-[0_4px_0_#b35a15] hover:bg-[#f6994a] active:translate-y-[2px] active:shadow-[0_2px_0_#b35a15] transition-all motion-reduce:transform-none"
              >
                Jelajahi Misi
              </Link>

              <Link
                href={secondaryCta.href}
                className="inline-flex items-center justify-center px-7 py-3 min-h-[48px] rounded-xl text-base font-semibold bg-[#20283A] text-[#FFF3DE] border-2 border-[#47577A] shadow-[0_4px_0_#10141D] hover:bg-[#2B354D] active:translate-y-[2px] active:shadow-[0_2px_0_#10141D] transition-all motion-reduce:transform-none"
              >
                {secondaryCta.label}
              </Link>
            </div>

            {/* Micro-Proof Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-[#8A94A6] font-medium">
              <span className="inline-flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-[#3DD68C] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Git Repo Mandiri
              </span>
              <span className="inline-flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-[#3DD68C] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Review Mentor 1-on-1
              </span>
              <span className="inline-flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-[#3DD68C] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Reward XP Resmi
              </span>
            </div>
          </div>

          {/* Right Column: Interactive Quest Voucher (Cols 8-12) */}
          <div className="min-w-0 lg:col-span-5 w-full">
            <QuestVoucherHero />
          </div>
        </div>
      </div>
    </section>
  )
}
