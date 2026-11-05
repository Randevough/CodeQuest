'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { LogIn, LayoutDashboard, CheckCircle2, UserPlus, Sparkles } from 'lucide-react'

export interface OnboardingSectionProps {
  isLoggedIn?: boolean
  userName?: string | null
}

const STARTER_ROLES = [
  {
    id: 'web',
    label: 'Pengembang Web',
    badge: 'Frontend & Fullstack',
    icon: '🌐',
  },
  {
    id: 'backend',
    label: 'Spesialis Backend',
    badge: 'API & Database',
    icon: '⚙️',
  },
  {
    id: 'ai',
    label: 'AI & Machine Learning',
    badge: 'Model & Data',
    icon: '🧠',
  },
]

export function OnboardingSection({ isLoggedIn = false, userName }: OnboardingSectionProps) {
  const [selectedRole, setSelectedRole] = useState<string>('web')

  return (
    <section className="soft-arcade page-container py-12" aria-labelledby="onboarding-section-title">
      {/* Centered action box with thick border #47577A and Soft Arcade surface */}
      <div className="relative rounded-[24px] bg-[#20283A] border-2 border-[#47577A] p-6 sm:p-10 md:p-14 text-center overflow-hidden shadow-[0_6px_0_#182030]">
        {/* Subtle Decorative Star Accents */}
        <div
          className="absolute -top-6 -left-6 text-[#FFAE58]/10 text-8xl select-none pointer-events-none"
          aria-hidden="true"
        >
          ✦
        </div>
        <div
          className="absolute -bottom-6 -right-6 text-[#FFAE58]/10 text-8xl select-none pointer-events-none"
          aria-hidden="true"
        >
          ✦
        </div>

        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          {/* Eyebrow & Headline & Subheadline */}
          <div className="space-y-3">
            <span className="inline-block text-xs font-mono font-bold uppercase tracking-wider text-[#FFAE58]">
              Stasiun Pembuatan Karakter
            </span>
            <h2
              id="onboarding-section-title"
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#FFF3DE] tracking-tight leading-snug"
            >
              PILIH JALUR KARIR & MULAI QUEST
            </h2>
            <p className="text-sm sm:text-base text-[#C2C7D0] leading-relaxed">
              Tentukan spesialisasi awalmu, dapatkan paket misi kurasi kampus, dan buktikan keahlian kodingmu di arena CodeQuest.
            </p>
          </div>

          {/* Interactive Role Selection Pills */}
          <div className="space-y-2 pt-1">
            <div className="text-xs font-mono text-[#8A94A6]">
              Pilih peran starter:
            </div>
            <div
              className="flex flex-wrap items-center justify-center gap-2.5"
              role="radiogroup"
              aria-label="Pilihan Peran Starter"
            >
              {STARTER_ROLES.map((role) => {
                const isSelected = selectedRole === role.id
                return (
                  <button
                    key={role.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setSelectedRole(role.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFAE58] ${
                      isSelected
                        ? 'bg-[#FFAE58] text-[#141925] border-2 border-[#C27A29] shadow-[0_3px_0_#C27A29] font-bold'
                        : 'bg-[#141925] text-[#C2C7D0] border-2 border-[#2E3A52] hover:border-[#47577A] hover:text-[#FFF3DE]'
                    }`}
                  >
                    <span aria-hidden="true">{role.icon}</span>
                    <span>{role.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Perk Banner */}
          <div
            data-testid="starter-perk-banner"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#141925] border border-[#FFAE58]/50 text-xs sm:text-sm text-[#FFF3DE] shadow-inner"
          >
            <Sparkles className="w-4 h-4 text-[#FFAE58] shrink-0" aria-hidden="true" />
            <span>
              Bonus Pendaftaran: Dapatkan <strong className="text-[#FFAE58] font-bold">+100 XP Starter</strong> saat akun diverifikasi.
            </span>
          </div>

          {/* Dual Pill CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-1">
            {isLoggedIn ? (
              <Link
                href="/workspace"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[48px] px-8 rounded-full bg-[#FFAE58] hover:bg-[#FFBE76] active:translate-y-0.5 text-[#141925] font-bold text-sm border-2 border-[#C27A29] shadow-[0_4px_0_#C27A29] transition-all motion-reduce:transform-none motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFF3DE] focus-visible:ring-offset-2 focus-visible:ring-offset-[#20283A]"
              >
                <LayoutDashboard className="w-4 h-4" aria-hidden="true" />
                <span>Buka Workspace Saya</span>
                {userName && <span className="text-xs font-semibold text-[#141925]">({userName})</span>}
              </Link>
            ) : (
              <Link
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[48px] px-8 rounded-full bg-[#FFAE58] hover:bg-[#FFBE76] active:translate-y-0.5 text-[#141925] font-bold text-sm border-2 border-[#C27A29] shadow-[0_4px_0_#C27A29] transition-all motion-reduce:transform-none motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFF3DE] focus-visible:ring-offset-2 focus-visible:ring-offset-[#20283A]"
              >
                <span aria-hidden="true">✦</span>
                <span>Daftar Akun Mahasiswa</span>
              </Link>
            )}

            {!isLoggedIn && (
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[48px] px-8 rounded-full bg-[#141925] hover:bg-[#2B354D] active:translate-y-0.5 text-[#FFF3DE] font-semibold text-sm border-2 border-[#2E3A52] hover:border-[#47577A] shadow-[0_4px_0_#141925] transition-all motion-reduce:transform-none motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFAE58] focus-visible:ring-offset-2 focus-visible:ring-offset-[#20283A]"
              >
                <LogIn className="w-4 h-4 text-[#C2C7D0]" aria-hidden="true" />
                <span>Masuk ke Akun</span>
              </Link>
            )}
          </div>

          {/* Catatan Kaki: Dukungan autentikasi email terverifikasi */}
          <div className="pt-4 border-t border-[#2E3A52]/60 flex flex-wrap items-center justify-center gap-4 text-xs text-[#8A94A6]">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#3DD68C]" aria-hidden="true" /> Terbuka untuk pengembang mahasiswa
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#3DD68C]" aria-hidden="true" /> Dukungan autentikasi email terverifikasi
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#FFAE58]" aria-hidden="true">✦</span> Bebas iklan &amp; kurasi langsung mentor
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
