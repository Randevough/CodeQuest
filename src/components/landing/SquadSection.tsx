'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Users, UserPlus, Check } from 'lucide-react'

export function SquadSection() {
  const [invited, setInvited] = useState(false)

  return (
    <section className="soft-arcade page-container py-12" aria-labelledby="squad-section-title">
      <div className="rounded-[24px] bg-[#20283A] border-2 border-[#2E3A52] p-6 sm:p-10 shadow-[0_4px_0_#141925]">
        {/* Section Header with punchy subheadline */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <h2
            id="squad-section-title"
            className="text-2xl sm:text-3xl md:text-4xl font-black text-[#FFF3DE] tracking-tight uppercase"
          >
            Kerjakan Misi Bersama Skuad Pilihanmu
          </h2>
          <p className="text-[#C2C7D0] mt-3 text-sm sm:text-base leading-relaxed">
            Bentuk tim 2–4 developer. Bagi tugas repositori, raih bonus XP +20% bersama.
          </p>
        </div>

        {/* Visual Squad HUD */}
        <div className="max-w-2xl mx-auto rounded-2xl bg-[#141925] border-2 border-[#2E3A52] p-5 sm:p-6 shadow-[0_4px_0_rgba(20,25,37,0.5)]">
          {/* Header Squad HUD */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#2E3A52]">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3DD68C]" aria-hidden="true" />
              <span className="text-xs font-semibold text-[#FFF3DE] tracking-wide">
                Lobi Skuad: Full-Stack Runner
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-[#20283A] text-[#FFAE58] border border-[#2E3A52]">
                Lobi Terbuka
              </span>
              <span
                data-testid="party-slots-badge"
                className="text-xs font-medium px-3 py-1 rounded-full bg-[#20283A] text-[#FFAE58] border border-[#2E3A52]"
              >
                Kapasitas Skuad: {invited ? '3 dari 3 Orang' : '2 dari 3 Orang'}
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFAE58] text-[#141925] text-xs font-bold shadow-[0_2px_0_#C27A29]">
              <span>Bonus XP Skuad +20%</span>
            </div>
          </div>

          {/* Visual Squad Members */}
          <div className="py-4 space-y-3">
            {/* Slot 1: Alex Dev • Ketua Tim • Status Siap */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#20283A] border border-[#2E3A52]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#FFAE58] text-[#141925] flex items-center justify-center font-bold text-xs shadow-[0_2px_0_#C27A29]">
                  01
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#FFF3DE]">Alex Dev</span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#141925] text-[#FFAE58] border border-[#2E3A52]">
                      Ketua Tim
                    </span>
                  </div>
                  <p className="text-xs text-[#C2C7D0]">Frontend Lead</p>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-[#3DD68C]/20 text-[#3DD68C] border border-[#1F8A55]">
                Siap
              </span>
            </div>

            {/* Slot 2: Budi Runner • Pengembang Backend • Status Siap */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#20283A] border border-[#2E3A52]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#2B354D] text-[#FFF3DE] flex items-center justify-center font-bold text-xs shadow-[0_2px_0_#141925]">
                  02
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#FFF3DE]">Budi Runner</span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#141925] text-[#C2C7D0] border border-[#2E3A52]">
                      Pengembang Backend
                    </span>
                  </div>
                  <p className="text-xs text-[#C2C7D0]">Backend Engineer</p>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-[#3DD68C]/20 text-[#3DD68C] border border-[#1F8A55]">
                Siap
              </span>
            </div>

            {/* Slot 3: + Ajak Rekan Mahasiswa Bergabung (interactive click adds Citra Code • Desainer UI) */}
            {invited ? (
              <div
                data-testid="squad-slot-3-joined"
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#20283A] border border-[#3DD68C]/50 shadow-[0_2px_0_#1F8A55] transition-all animate-in fade-in duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#3DD68C] text-[#141925] flex items-center justify-center font-bold text-xs shadow-[0_2px_0_#1F8A55]">
                    03
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#FFF3DE]">Citra Code</span>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#141925] text-[#3DD68C] border border-[#1F8A55]">
                        Desainer UI
                      </span>
                    </div>
                    <p className="text-xs text-[#3DD68C]">Desainer UI bergabung</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-[#3DD68C]/20 text-[#3DD68C] border border-[#1F8A55] flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" aria-hidden="true" />
                    Siap
                  </span>
                  <button
                    type="button"
                    onClick={() => setInvited(false)}
                    className="text-xs text-[#8A94A6] hover:text-[#FFF3DE] underline ml-1 cursor-pointer"
                    aria-label="Reset slot"
                  >
                    Reset
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                data-testid="squad-slot-3-open"
                onClick={() => setInvited(true)}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border-2 border-dashed border-[#47577A] bg-[#141925]/60 hover:bg-[#141925] hover:border-[#FFAE58] text-left transition-all group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFAE58]"
                aria-label="Ajak rekan mahasiswa bergabung ke skuad"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-dashed border-[#47577A] group-hover:border-[#FFAE58] text-[#8A94A6] group-hover:text-[#FFAE58] flex items-center justify-center text-sm transition-colors">
                    <UserPlus className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#FFAE58] group-hover:text-[#FFBE76] transition-colors">
                      + Ajak Rekan Mahasiswa Bergabung
                    </div>
                    <p className="text-xs text-[#8A94A6]">Klik untuk membagikan tautan undangan lobi</p>
                  </div>
                </div>
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#20283A] text-[#C2C7D0] border border-[#2E3A52] group-hover:border-[#FFAE58]/60 transition-colors">
                  Slot Tersedia
                </span>
              </button>
            )}
          </div>

          {/* Tactile Action Buttons: Dual buttons */}
          <div className="pt-4 border-t border-[#2E3A52] flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link
              href="/explore"
              className="flex-1 inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-full bg-[#FFAE58] hover:bg-[#FFBE76] active:translate-y-0.5 text-[#141925] font-bold text-sm border-2 border-[#C27A29] shadow-[0_4px_0_#C27A29] transition-all motion-reduce:transform-none motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFF3DE] focus-visible:ring-offset-2 focus-visible:ring-offset-[#20283A]"
            >
              <span>Buat Lobi Skuad</span>
            </Link>
            <Link
              href="/explore"
              className="flex-1 inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-full bg-[#141925] hover:bg-[#2B354D] active:translate-y-0.5 text-[#FFF3DE] font-bold text-sm border-2 border-[#47577A] shadow-[0_4px_0_#0F131D] transition-all motion-reduce:transform-none motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFAE58] focus-visible:ring-offset-2 focus-visible:ring-offset-[#20283A]"
            >
              <Users className="w-4 h-4 text-[#FFAE58]" aria-hidden="true" />
              <span>Gabung Skuad</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
