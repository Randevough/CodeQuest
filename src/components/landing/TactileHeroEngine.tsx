'use client'

import React, { useState, useEffect } from 'react'

export type EnginePhase = 0 | 1 | 2 | 3

export interface TactileHeroEngineProps {
  initialPhase?: EnginePhase
  autoPlay?: boolean
  cycleIntervalMs?: number
  className?: string
}

interface PhaseContent {
  id: EnginePhase
  tabLabel: string
  title: string
  branch: string
  command: string
  statusTag: string
  outputs: Array<{ text: string; type: 'info' | 'success' | 'highlight' | 'muted' }>
}

const PHASES: PhaseContent[] = [
  {
    id: 0,
    tabLabel: '01. Klaim',
    title: 'Snatch & Branch',
    branch: 'quest/042-sso',
    command: 'git checkout -b quest/042-sso',
    statusTag: 'git:checkout',
    outputs: [
      { text: "Switched to a new branch 'quest/042-sso'", type: 'info' },
      { text: '[bounty] Misi #042 SSO & JWT diklaim mahasiswa', type: 'highlight' },
      { text: 'Tracking origin/main... Branch siap dikerjakan di IDE lokal', type: 'muted' },
    ],
  },
  {
    id: 1,
    tabLabel: '02. Solusi',
    title: 'Test & Verify',
    branch: 'quest/042-sso',
    command: 'npm test -- --run',
    statusTag: 'npm:test',
    outputs: [
      { text: 'PASS tests/sso-token.test.ts (4 passed)', type: 'success' },
      { text: 'PASS tests/jwt-rs256.test.ts (4 passed)', type: 'success' },
      { text: 'Tests: 8 passed, 8 total (100% coverage)', type: 'highlight' },
    ],
  },
  {
    id: 2,
    tabLabel: '03. Review',
    title: 'PR & Mentor Review',
    branch: 'main',
    command: 'gh pr create --fill && gh pr merge --auto',
    statusTag: 'gh:review',
    outputs: [
      { text: 'Pull Request #42: RFC-6749 Auth Code Grant', type: 'info' },
      { text: '✓ Disetujui Mentor Kampus (@mentor-cyber)', type: 'success' },
      { text: 'Merged commit f409 landed on branch main', type: 'highlight' },
    ],
  },
  {
    id: 3,
    tabLabel: '04. Reward',
    title: 'XP Reward Payout',
    branch: 'main',
    command: 'cyber-quest payout --claim 042',
    statusTag: 'bounty:payout',
    outputs: [
      { text: 'Verifikasi kriptografis: Valid (0x9f4a...e1)', type: 'info' },
      { text: '✓ +350 XP berhasil ditransfer ke profil', type: 'highlight' },
      { text: 'Level naik: Level 3 -> Level 4 (Guild Rank up)', type: 'success' },
    ],
  },
]

export function TactileHeroEngine({
  initialPhase = 0,
  autoPlay = true,
  cycleIntervalMs = 2500,
  className = '',
}: TactileHeroEngineProps) {
  const [currentPhase, setCurrentPhase] = useState<EnginePhase>(initialPhase)
  const [isPlaying, setIsPlaying] = useState<boolean>(() => {
    if (!autoPlay) return false
    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      return false
    }
    return true
  })

  // Detect and honor prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches) {
      setIsPlaying(false)
    }

    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsPlaying(false)
      }
    }

    mediaQuery.addEventListener?.('change', handler)
    return () => {
      mediaQuery.removeEventListener?.('change', handler)
    }
  }, [])

  // Auto-looping cycle (10s total cycle: 2.5s per phase)
  useEffect(() => {
    if (!isPlaying) return

    const timer = setInterval(() => {
      setCurrentPhase((prev) => ((prev + 1) % 4) as EnginePhase)
    }, cycleIntervalMs)

    return () => clearInterval(timer)
  }, [isPlaying, cycleIntervalMs])

  const activeContent = PHASES[currentPhase]

  return (
    <div
      data-testid="tactile-hero-engine"
      className={`w-full min-w-0 rounded-2xl bg-[#20283A] border-2 border-[#2E3A52] p-5 sm:p-6 shadow-[0_6px_0_#10141D] space-y-4 select-none ${className}`}
    >
      {/* HUD Header */}
      <div className="flex items-center justify-between gap-3 border-b border-[#2E3A52] pb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#8A94A6] truncate">
            GIT ENGINE v1.4 • MISI #042
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-mono font-semibold border ${
              isPlaying
                ? 'bg-[#141925] text-[#3DD68C] border-[#2E3A52]'
                : 'bg-[#141925] text-[#FFAE58] border-[#2E3A52]'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isPlaying ? 'bg-[#3DD68C] animate-pulse' : 'bg-[#FFAE58]'
              }`}
              aria-hidden="true"
            />
            {isPlaying ? 'SIKLUS OTOMATIS' : 'DIJEDA'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsPlaying((p) => !p)}
          aria-label={isPlaying ? 'Jeda animasi' : 'Putar animasi'}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#141925] border border-[#2E3A52] text-xs font-mono font-semibold text-[#C2C7D0] hover:text-[#FFF3DE] hover:border-[#47577A] active:translate-y-[1px] transition-all motion-reduce:transform-none shrink-0"
        >
          {isPlaying ? (
            <>
              <svg
                className="w-3 h-3 text-[#FFAE58]"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
              <span>Jeda</span>
            </>
          ) : (
            <>
              <svg
                className="w-3 h-3 text-[#3DD68C]"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <polygon points="6 4 18 12 6 20 6 4" />
              </svg>
              <span>Putar</span>
            </>
          )}
        </button>
      </div>

      {/* SVG Commit Graph */}
      <div className="rounded-xl bg-[#10141D] border border-[#2E3A52] p-3 overflow-hidden">
        <svg
          viewBox="0 0 440 100"
          className="w-full h-auto"
          role="img"
          aria-label="Visualisasi alur commit Git"
        >
          {/* Lane Labels */}
          <text
            x="12"
            y="32"
            fill="#8A94A6"
            className="font-mono text-[9px] font-bold"
            dominantBaseline="middle"
          >
            main
          </text>
          <text
            x="12"
            y="72"
            fill={currentPhase >= 0 ? '#FFAE58' : '#8A94A6'}
            className="font-mono text-[9px] font-bold"
            dominantBaseline="middle"
          >
            quest
          </text>

          {/* Main Track Background Line */}
          <line
            x1="55"
            y1="32"
            x2="415"
            y2="32"
            stroke="#2E3A52"
            strokeWidth="2.5"
            strokeDasharray="4 3"
          />

          {/* Branch Path: from M1 (115, 32) down to Q1 (185, 72) */}
          <path
            d="M 115 32 C 145 32, 155 72, 185 72"
            fill="none"
            stroke={currentPhase >= 0 ? '#ed8936' : '#2E3A52'}
            strokeWidth="2.5"
            className="transition-colors duration-300"
          />

          {/* Quest Branch Line: Q1 (185, 72) to Q2 (255, 72) */}
          <line
            x1="185"
            y1="72"
            x2="255"
            y2="72"
            stroke={currentPhase >= 1 ? '#3DD68C' : '#2E3A52'}
            strokeWidth="2.5"
            className="transition-colors duration-300"
          />

          {/* Merge Path: Q2 (255, 72) up to M2 (325, 32) */}
          <path
            d="M 255 72 C 285 72, 295 32, 325 32"
            fill="none"
            stroke={currentPhase >= 2 ? '#3DD68C' : '#2E3A52'}
            strokeWidth="2.5"
            strokeDasharray={currentPhase >= 2 ? 'none' : '3 3'}
            className="transition-colors duration-300"
          />

          {/* Main forward line: M2 (325, 32) to M3 (385, 32) */}
          <line
            x1="325"
            y1="32"
            x2="385"
            y2="32"
            stroke={currentPhase >= 2 ? '#3DD68C' : '#2E3A52'}
            strokeWidth="2.5"
            className="transition-colors duration-300"
          />

          {/* Node M0: Origin base commit */}
          <circle cx="65" cy="32" r="5" fill="#141925" stroke="#47577A" strokeWidth="2" />
          <text
            x="65"
            y="18"
            fill="#8A94A6"
            textAnchor="middle"
            className="font-mono text-[8px]"
          >
            v1.0
          </text>

          {/* Node M1: Fork base commit */}
          <circle cx="115" cy="32" r="5" fill="#141925" stroke="#47577A" strokeWidth="2" />
          <text
            x="115"
            y="18"
            fill="#8A94A6"
            textAnchor="middle"
            className="font-mono text-[8px]"
          >
            v1.1
          </text>

          {/* Node Q1: Snatch & Branch Commit */}
          {currentPhase === 0 && (
            <circle
              cx="185"
              cy="72"
              r="10"
              fill="none"
              stroke="#ed8936"
              strokeWidth="1.5"
              opacity="0.75"
              className="animate-ping"
            />
          )}
          <circle
            data-testid="node-q1"
            cx="185"
            cy="72"
            r="6.5"
            fill={currentPhase >= 0 ? '#ed8936' : '#141925'}
            stroke={currentPhase >= 0 ? '#b35a15' : '#2E3A52'}
            strokeWidth="2.5"
            className="transition-colors duration-300"
          />
          <text
            x="185"
            y="90"
            fill={currentPhase >= 0 ? '#FFAE58' : '#8A94A6'}
            textAnchor="middle"
            className="font-mono text-[8px] font-bold"
          >
            c1e4
          </text>

          {/* Node Q2: Test Passing Commit */}
          {currentPhase === 1 && (
            <circle
              cx="255"
              cy="72"
              r="10"
              fill="none"
              stroke="#3DD68C"
              strokeWidth="1.5"
              opacity="0.75"
              className="animate-ping"
            />
          )}
          <circle
            data-testid="node-q2"
            cx="255"
            cy="72"
            r="6.5"
            fill={currentPhase >= 1 ? '#3DD68C' : '#141925'}
            stroke={currentPhase >= 1 ? '#1D9B5D' : '#2E3A52'}
            strokeWidth="2.5"
            className="transition-colors duration-300"
          />
          <text
            x="255"
            y="90"
            fill={currentPhase >= 1 ? '#3DD68C' : '#8A94A6'}
            textAnchor="middle"
            className="font-mono text-[8px] font-bold"
          >
            8a20
          </text>

          {/* Node M2: PR Merge Commit */}
          {currentPhase === 2 && (
            <circle
              cx="325"
              cy="32"
              r="10"
              fill="none"
              stroke="#3DD68C"
              strokeWidth="1.5"
              opacity="0.75"
              className="animate-ping"
            />
          )}
          <circle
            data-testid="node-m2"
            cx="325"
            cy="32"
            r="6.5"
            fill={currentPhase >= 2 ? '#3DD68C' : '#141925'}
            stroke={currentPhase >= 2 ? '#1D9B5D' : '#2E3A52'}
            strokeWidth="2.5"
            className="transition-colors duration-300"
          />
          <text
            x="325"
            y="18"
            fill={currentPhase >= 2 ? '#3DD68C' : '#8A94A6'}
            textAnchor="middle"
            className="font-mono text-[8px] font-bold"
          >
            f409
          </text>

          {/* Node M3: Reward Settlement HEAD */}
          {currentPhase === 3 && (
            <circle
              cx="385"
              cy="32"
              r="10"
              fill="none"
              stroke="#ed8936"
              strokeWidth="1.5"
              opacity="0.75"
              className="animate-ping"
            />
          )}
          <circle
            data-testid="node-m3"
            cx="385"
            cy="32"
            r="6.5"
            fill={currentPhase === 3 ? '#ed8936' : '#141925'}
            stroke={currentPhase === 3 ? '#b35a15' : '#2E3A52'}
            strokeWidth="2.5"
            className="transition-colors duration-300"
          />
          <text
            x="385"
            y="18"
            fill={currentPhase === 3 ? '#FFAE58' : '#8A94A6'}
            textAnchor="middle"
            className="font-mono text-[8px] font-bold"
          >
            HEAD
          </text>
        </svg>
      </div>

      {/* Mini Console */}
      <div className="rounded-xl bg-[#0C0F17] border border-[#2E3A52] p-3 font-mono text-xs space-y-2">
        <div className="flex items-center justify-between text-[11px] text-[#8A94A6] border-b border-[#2E3A52]/60 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]/80 inline-block" />
            <span className="ml-1.5 text-[#8A94A6] truncate">bash: ~/cyber-quest/042</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-[#141925] border border-[#2E3A52] text-[#38BDF8] text-[10px] font-bold">
            {activeContent.statusTag}
          </span>
        </div>

        {/* Command line */}
        <div className="flex items-center gap-2 text-[#FFF3DE]">
          <span className="text-[#ed8936] font-bold select-none">$</span>
          <span className="font-semibold text-xs tracking-tight text-[#FFF3DE]">
            {activeContent.command}
          </span>
        </div>

        {/* Console outputs */}
        <div className="space-y-1 pt-1 min-h-[56px]">
          {activeContent.outputs.map((out, idx) => {
            let color = 'text-[#C2C7D0]'
            if (out.type === 'success') color = 'text-[#3DD68C] font-semibold'
            else if (out.type === 'highlight') color = 'text-[#FFAE58] font-semibold'
            else if (out.type === 'info') color = 'text-[#38BDF8]'
            else if (out.type === 'muted') color = 'text-[#8A94A6]'
            return (
              <div key={idx} className={`text-[11px] leading-relaxed truncate ${color}`}>
                {out.text}
              </div>
            )
          })}
        </div>
      </div>

      {/* Phase Dynamic Visual Extras */}
      {currentPhase === 0 && (
        <div className="rounded-xl bg-[#141925] border border-[#2E3A52] p-3 space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between">
            <span className="text-[#8A94A6]">Bounty Terpilih:</span>
            <span className="font-semibold text-[#FFAE58]">#042 OAuth2 SSO & JWT</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#8A94A6]">Cabang Git:</span>
            <span className="font-semibold text-[#38BDF8]">quest/042-sso</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#8A94A6]">Evaluator:</span>
            <span className="font-semibold text-[#FFF3DE]">Mentor Kampus (1-on-1)</span>
          </div>
        </div>
      )}

      {currentPhase === 1 && (
        <div className="rounded-xl bg-[#141925] border border-[#2E3A52] p-3 space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between">
            <span className="text-[#8A94A6]">Suite Pengujian:</span>
            <span className="font-semibold text-[#3DD68C]">Vitest • 8/8 Passed</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#8A94A6]">Spesifikasi:</span>
            <span className="font-semibold text-[#FFF3DE]">RFC-6749 Auth Code Grant</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#8A94A6]">Enkripsi JWT:</span>
            <span className="font-semibold text-[#38BDF8]">RS256 Public Key</span>
          </div>
        </div>
      )}

      {currentPhase === 2 && (
        <div
          data-testid="mentor-stamp-card"
          className="rounded-xl bg-[#141925] border-2 border-[#3DD68C]/50 p-3 flex items-start gap-3 shadow-[0_2px_0_#10141D]"
        >
          <div className="w-8 h-8 rounded-lg bg-[#3DD68C]/15 border border-[#3DD68C] flex items-center justify-center shrink-0 text-[#3DD68C] font-bold text-sm">
            ✓
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#3DD68C]">
                ✓ DISETUJUI MENTOR KAMPUS
              </span>
              <span className="text-[10px] font-mono text-[#8A94A6]">@mentor-cyber</span>
            </div>
            <p className="text-xs text-[#FFF3DE] italic font-medium leading-relaxed">
              "Arsitektur token aman dan implementasi refresh token bersih."
            </p>
          </div>
        </div>
      )}

      {currentPhase === 3 && (
        <div
          data-testid="reward-payout-card"
          className="rounded-xl bg-[#141925] border border-[#2E3A52] p-3 space-y-2.5 shadow-[0_2px_0_#10141D]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-lg bg-[#20283A] border border-[#2E3A52] text-xs font-mono font-semibold text-[#8A94A6]">
                Level Mahasiswa
              </span>
              <span className="text-xs font-mono font-bold text-[#FFAE58]">Level 3 → Level 4</span>
            </div>
            <span className="px-3 py-1 rounded-xl bg-[#ed8936] text-[#0C0F17] text-xs font-mono font-black border border-[#b35a15] shadow-[0_2px_0_#b35a15]">
              +350 XP
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono text-[#8A94A6]">
              <span>Progress XP Guild</span>
              <span className="text-[#3DD68C] font-bold">3.500 / 3.500 XP (100%)</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#0C0F17] border border-[#2E3A52] overflow-hidden">
              <div className="h-full bg-[#ed8936] w-full" />
            </div>
          </div>
        </div>
      )}

      {/* Interactive Phase Control Tabs */}
      <div
        className="grid grid-cols-4 gap-2 pt-1"
        role="tablist"
        aria-label="Tahapan Misi Git"
      >
        {PHASES.map((p) => {
          const isActive = currentPhase === p.id
          return (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`${p.tabLabel}: ${p.title}`}
              onClick={() => setCurrentPhase(p.id)}
              className={`py-2 px-1.5 sm:px-2 rounded-xl text-xs font-mono transition-all motion-reduce:transform-none text-center truncate ${
                isActive
                  ? 'bg-[#ed8936] text-[#0C0F17] font-bold border-2 border-[#b35a15] shadow-[0_2px_0_#b35a15]'
                  : 'bg-[#141925] text-[#8A94A6] hover:text-[#FFF3DE] hover:bg-[#20283A] border border-[#2E3A52] font-semibold active:translate-y-[1px]'
              }`}
            >
              {p.tabLabel}
            </button>
          )
        })}
      </div>
    </div>
  )
}
