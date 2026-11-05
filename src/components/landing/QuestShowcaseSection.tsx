"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { QuestBubble, QuestTeaser } from "./QuestBubble";

export const FALLBACK_TEASERS: QuestTeaser[] = [
  {
    id: "CQ-01",
    title: "Web Task Runner",
    description: "Bangun pipeline pemrosesan tugas latar belakang dengan webhook dan monitoring status worker.",
    difficulty: "Intermediate",
    category: "Web",
    points: 250,
    maxSnatchers: 3,
  },
  {
    id: "CQ-02",
    title: "AI Benchmark Suite",
    description: "Buat harness evaluasi LLM otomatis yang memeriksa latensi token dan skor akurasi.",
    difficulty: "Advanced",
    category: "AI",
    points: 400,
    maxSnatchers: 2,
  },
  {
    id: "CQ-03",
    title: "Mobile Campus Scanner",
    description: "Kembangkan alat presensi acara mobile dengan validasi QR offline dan sinkronisasi peringatan.",
    difficulty: "Beginner",
    category: "Mobile",
    points: 150,
    maxSnatchers: 4,
  },
];

export const CATEGORY_FILTERS = ["SEMUA", "WEB", "AI", "MOBILE"] as const;
export type CategoryFilterType = (typeof CATEGORY_FILTERS)[number];

export interface QuestShowcaseSectionProps {
  quests?: QuestTeaser[];
  className?: string;
}

export function QuestShowcaseSection({
  quests,
  className = "",
}: QuestShowcaseSectionProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryFilterType>("SEMUA");

  const displayQuests =
    quests !== undefined ? quests : FALLBACK_TEASERS;

  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryFilterType, number> = {
      SEMUA: displayQuests.length,
      WEB: 0,
      AI: 0,
      MOBILE: 0,
    };
    for (const q of displayQuests) {
      const cat = q.category?.trim().toUpperCase() as CategoryFilterType;
      if (cat && cat in counts && cat !== "SEMUA") {
        counts[cat] = (counts[cat] || 0) + 1;
      }
    }
    return counts;
  }, [displayQuests]);

  const filteredQuests = useMemo(() => {
    if (activeCategory === "SEMUA") return displayQuests;
    return displayQuests.filter(
      (q) => q.category?.trim().toUpperCase() === activeCategory
    );
  }, [displayQuests, activeCategory]);

  return (
    <section
      aria-labelledby="quest-showcase-heading"
      className={`page-container py-12 ${className}`.trim()}
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <span className="inline-block text-xs font-mono font-bold uppercase tracking-wider text-[#FFAE58] mb-2">
            KATALOG MISI PILIHAN
          </span>
          <h2
            id="quest-showcase-heading"
            className="text-2xl sm:text-4xl font-black text-[#FFF3DE] uppercase tracking-tight"
          >
            Tantangan Nyata yang Menunggu Diselesaikan
          </h2>
          <p className="text-[#C2C7D0] mt-2 text-sm sm:text-base leading-relaxed">
            Dari otomasi webhook hingga benchmarking model AI dan aplikasi mobile kampus.
          </p>
        </div>

        <Link
          href="/explore"
          className="inline-flex min-h-[44px] items-center gap-2 text-sm font-bold text-[#FFAE58] hover:text-[#FFBE76] transition-colors font-mono uppercase shrink-0"
        >
          Lihat Semua Quest
        </Link>
      </div>

      {displayQuests.length === 0 ? (
        <div
          data-testid="quests-empty-state"
          className="rounded-[22px] bg-[#20283A] border-2 border-[#2E3A52] p-8 sm:p-12 text-center text-[#C2C7D0] max-w-xl mx-auto shadow-[0_4px_0_#141925]"
        >
          <p className="text-base sm:text-lg font-bold text-[#FFF3DE] mb-2 font-display">
            Belum ada quest aktif musim ini
          </p>
          <p className="text-xs sm:text-sm text-[#C2C7D0] mb-4">
            Nantikan rilis tantangan software berikutnya atau submit proposal quest dari workspace.
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center justify-center rounded-full px-5 py-2.5 min-h-[44px] text-xs font-bold bg-[#FFAE58] text-[#141925] border-2 border-[#C27A29] shadow-[0_3px_0_#C27A29]"
          >
            Lihat Arsip Quest
          </Link>
        </div>
      ) : (
        <>
          {/* Interactive Client Category Filter Pills */}
          <div
            className="flex flex-wrap items-center gap-2.5 mb-8"
            role="group"
            aria-label="Filter kategori quest"
          >
            {CATEGORY_FILTERS.map((cat) => {
              const isActive = activeCategory === cat;
              const count = categoryCounts[cat] ?? 0;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  aria-pressed={isActive}
                  data-testid={`filter-pill-${cat.toLowerCase()}`}
                  className={`rounded-full px-4 py-1.5 text-xs font-mono tracking-wider transition-all duration-150 cursor-pointer ${
                    isActive
                      ? "bg-[#FFAE58] text-[#141925] font-bold shadow-[0_2px_0_#C27A29]"
                      : "bg-[#20283A] text-[#C2C7D0] border border-[#2E3A52] hover:text-[#FFF3DE]"
                  }`}
                >
                  [ {cat} ({count}) ]
                </button>
              );
            })}
          </div>

          {/* 3-column desktop / 1-column mobile layout */}
          {filteredQuests.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {filteredQuests.map((quest) => (
                <QuestBubble key={quest.id} quest={quest} />
              ))}
            </div>
          ) : (
            <div className="rounded-[22px] bg-[#20283A] border-2 border-[#2E3A52] p-8 text-center text-[#C2C7D0]">
              <p className="text-sm font-mono">Tidak ada quest untuk kategori ini.</p>
            </div>
          )}
        </>
      )}
    </section>
  );
}
