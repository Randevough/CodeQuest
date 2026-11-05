'use client'

import React, { useState } from 'react'

export type QuestLifecycleStep = 'available' | 'in_progress' | 'approved'

export interface QuestVoucherHeroProps {
  initialStep?: QuestLifecycleStep
}

export function QuestVoucherHero({ initialStep = 'available' }: QuestVoucherHeroProps) {
  const [step, setStep] = useState<QuestLifecycleStep>(initialStep)
  const [repoUrl, setRepoUrl] = useState('https://github.com/cyber-univ/quest-auth-jwt')

  const handleSnatch = () => {
    setStep('in_progress')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep('approved')
  }

  const handleReset = () => {
    setStep('available')
    setRepoUrl('https://github.com/cyber-univ/quest-auth-jwt')
  }

  return (
    <div className="w-full rounded-2xl bg-[#20283A] border-2 border-[#2E3A52] p-5 sm:p-6 shadow-[0_6px_0_#10141D] space-y-5">
      {/* HUD Header */}
      <div className="flex items-center justify-between gap-2 border-b border-[#2E3A52] pb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-1 rounded bg-[#141925] border border-[#2E3A52] text-[#38BDF8] text-xs font-mono font-bold tracking-wider">
            Web
          </span>
          <span className="px-2.5 py-1 rounded bg-[#141925] border border-[#2E3A52] text-[#FFAE58] text-xs font-mono font-bold tracking-wider">
            Intermediate
          </span>
        </div>
        <span className="px-3 py-1 rounded-full bg-[#ed8936] text-[#0C0F17] text-xs font-mono font-bold shadow-sm">
          +350 XP
        </span>
      </div>

      {/* Quest Details */}
      <div className="space-y-2">
        <h2 className="text-lg sm:text-xl font-bold text-[#FFF3DE] tracking-tight leading-snug">
          OAuth2 Auth Service & JWT Security
        </h2>
        <p className="text-xs sm:text-sm text-[#C2C7D0] leading-relaxed">
          Bangun modul autentikasi terpusat SSO mahasiswa dengan spesifikasi OAuth2 nyata.
        </p>
      </div>

      {/* System Telemetry */}
      <div className="rounded-xl bg-[#141925] border border-[#2E3A52] p-3.5 space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="text-[#8A94A6]">Kapasitas:</span>
          <span className={`font-semibold ${step === 'available' ? 'text-[#38BDF8]' : 'text-[#FFAE58]'}`}>
            {step === 'available' ? '2/3 Mahasiswa' : '3/3 (Penuh)'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#8A94A6]">Beban:</span>
          <span className="font-semibold text-[#FFF3DE]">
            {step === 'available' ? '0/3 Aktif' : '1/3 Aktif'}
          </span>
        </div>
      </div>

      {/* Lifecycle Actions */}
      {step === 'available' && (
        <button
          type="button"
          onClick={handleSnatch}
          className="btn-tactile-orange w-full py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center tracking-wide motion-reduce:transform-none"
        >
          [ AMBIL TIKET MISI ]
        </button>
      )}

      {step === 'in_progress' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="repo-url-input" className="block text-xs font-mono text-[#8A94A6]">
              URL Repositori GitHub
            </label>
            <input
              id="repo-url-input"
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="w-full bg-[#141925] border border-[#47577A] text-[#FFF3DE] text-xs sm:text-sm font-mono px-3.5 py-2.5 rounded-lg focus:border-[#ed8936] focus:outline-none"
              placeholder="https://github.com/..."
              required
            />
          </div>
          <button
            type="submit"
            className="btn-tactile-orange w-full py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center tracking-wide motion-reduce:transform-none"
          >
            [ KIRIM SUBMISSION REPOSITORI ]
          </button>
        </form>
      )}

      {step === 'approved' && (
        <div className="space-y-4">
          <div className="rounded-xl bg-[#141925] border-2 border-[#3DD68C] p-4 space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-[#3DD68C] font-mono font-bold text-xs sm:text-sm tracking-wide flex items-center gap-1.5">
                ✓ DISETUJUI MENTOR KAMPUS
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#3DD68C]/20 border border-[#3DD68C] text-[#3DD68C] font-mono font-bold text-xs">
                +350 XP
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#C2C7D0] italic leading-relaxed">
              &quot;Arsitektur token aman dan implementasi refresh token bersih.&quot;
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="btn-tactile-slate w-full py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center tracking-wide motion-reduce:transform-none"
          >
            [ Coba Siklus Misi Lain ]
          </button>
        </div>
      )}
    </div>
  )
}
