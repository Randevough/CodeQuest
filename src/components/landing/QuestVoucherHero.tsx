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
    <div className="w-full rounded-2xl bg-[#20283A] border-2 border-[#2E3A52] p-5 sm:p-6 shadow-[0_6px_0_#10141D] space-y-4">
      {/* Serial Stamp */}
      <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#8A94A6]">
        BOUNTY #042 • TIKET TANTANGAN
      </div>

      {/* Voucher Header / Tags */}
      <div className="flex items-center justify-between gap-2 border-b border-[#2E3A52] pb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-1 rounded-lg bg-[#141925] border border-[#2E3A52] text-[#38BDF8] text-xs font-mono font-bold tracking-wider">
            Web
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-[#141925] border border-[#2E3A52] text-[#FFAE58] text-xs font-mono font-bold tracking-wider">
            Intermediate
          </span>
        </div>
        <span className="px-3 py-1 rounded-xl bg-[#ed8936] text-[#0C0F17] text-xs font-mono font-bold border border-[#b35a15] shadow-[0_2px_0_#b35a15]">
          +350 XP
        </span>
      </div>

      {/* Quest Details */}
      <div className="space-y-2">
        <h2 className="text-lg sm:text-xl font-bold text-[#FFF3DE] tracking-tight leading-snug">
          OAuth2 SSO Service & JWT Security
        </h2>
        <p className="text-xs sm:text-sm text-[#C2C7D0] leading-relaxed">
          Bangun modul autentikasi terpusat SSO mahasiswa dengan spesifikasi OAuth2 nyata.
        </p>
      </div>

      {/* Ticket Perforation Divider */}
      <div className="border-t-2 border-dashed border-[#2E3A52] my-4 relative" aria-hidden="true" />

      {/* Ticket Metadata */}
      <div className="rounded-xl bg-[#141925] border border-[#2E3A52] p-3.5 space-y-2.5 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="text-[#8A94A6]">Kuota Mahasiswa:</span>
          <span className={`font-semibold ${step === 'available' ? 'text-[#38BDF8]' : 'text-[#FFAE58]'}`}>
            {step === 'available' ? '2/3' : '3/3 (Penuh)'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#8A94A6]">Evaluator:</span>
          <span className="font-semibold text-[#FFF3DE]">Mentor Kampus</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#8A94A6]">Deadline:</span>
          <span className="font-semibold text-[#FFF3DE]">3 Hari</span>
        </div>
      </div>

      {/* Lifecycle Actions */}
      {step === 'available' && (
        <div className="space-y-4">
          <div className="rounded-lg bg-[#141925] border border-[#2E3A52] p-2.5 font-mono text-[11px] text-[#8A94A6] space-y-1">
            <div className="text-[#38BDF8] flex items-center justify-between">
              <span>POST /api/auth/token</span>
              <span className="text-[#3DD68C]">RS256</span>
            </div>
            <p className="text-[10px] text-[#8A94A6]/80 truncate">SPEC: RFC-6749 OAuth2 Auth Code Grant</p>
          </div>

          <button
            type="button"
            onClick={handleSnatch}
            className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-[#ed8936] text-[#0C0F17] border-2 border-[#b35a15] shadow-[0_4px_0_#b35a15] hover:bg-[#f6994a] active:translate-y-[2px] active:shadow-[0_2px_0_#b35a15] transition-all motion-reduce:transform-none flex items-center justify-center gap-2"
          >
            Ambil Tiket Misi
          </button>
        </div>
      )}

      {step === 'in_progress' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="repo-url-input" className="block text-xs font-mono text-[#8A94A6]">
              URL Repositori GitHub
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A94A6]">
                <svg
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </span>
              <input
                id="repo-url-input"
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="w-full bg-[#141925] border border-[#47577A] text-[#FFF3DE] text-xs sm:text-sm font-mono pl-10 pr-3.5 py-2.5 rounded-xl focus:border-[#ed8936] focus:outline-none"
                placeholder="https://github.com/..."
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-[#ed8936] text-[#0C0F17] border-2 border-[#b35a15] shadow-[0_4px_0_#b35a15] hover:bg-[#f6994a] active:translate-y-[2px] active:shadow-[0_2px_0_#b35a15] transition-all motion-reduce:transform-none flex items-center justify-center gap-2"
          >
            <svg
              className="w-4 h-4 fill-current shrink-0"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>Kirim Repositori</span>
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
              <span className="px-2.5 py-0.5 rounded-xl bg-[#3DD68C]/20 border border-[#3DD68C] text-[#3DD68C] font-mono font-bold text-xs">
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
            Coba Siklus Misi Lain
          </button>
        </div>
      )}
    </div>
  )
}
