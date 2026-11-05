import React from "react";
import Link from "next/link";

export interface QuestTeaser {
  id: string;
  title: string;
  description: string;
  difficulty?: string;
  category: string;
  points: number;
  maxSnatchers?: number;
}

export interface QuestBubbleProps {
  quest?: QuestTeaser;
  id?: string;
  title?: string;
  description?: string;
  difficulty?: string;
  category?: string;
  points?: number;
  maxSnatchers?: number;
  href?: string;
  className?: string;
}

export function getDifficultyStars(difficulty?: string): string {
  if (!difficulty) return "★☆☆";
  const d = difficulty.trim().toLowerCase();
  if (d === "beginner" || d === "pemula") return "★☆☆";
  if (d === "intermediate" || d === "menengah") return "★★☆";
  if (d === "advanced" || d === "mahir") return "★★★";
  return "★☆☆";
}

export function formatCategoryPill(category: string = "WEB", difficulty?: string): string {
  const cat = category.toUpperCase();
  if (!difficulty) return cat;

  const diffNormalized = difficulty.trim().toLowerCase();
  const diffMap: Record<string, string> = {
    beginner: "PEMULA",
    pemula: "PEMULA",
    intermediate: "MENENGAH",
    menengah: "MENENGAH",
    advanced: "MAHIR",
    mahir: "MAHIR",
  };

  const diffLabel = diffMap[diffNormalized] || difficulty.toUpperCase();
  return `${cat} • ${diffLabel}`;
}

export function QuestBubble({
  quest,
  id: propId,
  title: propTitle,
  description: propDescription,
  difficulty: propDifficulty,
  category: propCategory,
  points: propPoints,
  href: propHref,
  className = "",
}: QuestBubbleProps) {
  const id = quest?.id ?? propId ?? "quest";
  const title = quest?.title ?? propTitle ?? "Untitled Quest";
  const description = quest?.description ?? propDescription ?? "";
  const difficulty = quest?.difficulty ?? propDifficulty;
  const category = quest?.category ?? propCategory ?? "WEB";
  const points = quest?.points ?? propPoints ?? 0;
  const targetHref = propHref ?? (id ? `/quests/${id}` : "/explore");
  const difficultyStars = getDifficultyStars(difficulty);

  return (
    <div className={`relative isolate pt-3 group ${className}`.trim()}>
      {/* Background Tab (Dark Slate #20283A) */}
      <div
        data-testid="quest-bubble-tab"
        className="absolute inset-0 rounded-[22px] bg-[#20283A] border-2 border-[#2E3A52] -z-10"
        aria-hidden="true"
      />

      {/* Foreground Card (Warm Cream #FFF3DE) */}
      <div
        data-testid="quest-bubble-card"
        className="relative flex flex-col justify-between h-full rounded-[22px] bg-[#FFF3DE] border-2 border-[#141925] p-6 text-[#141925] shadow-[0_6px_0_rgba(20,25,37,0.45)] transition-all duration-150 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_0_rgba(20,25,37,0.45)] active:translate-y-0.5 active:shadow-[0_2px_0_rgba(20,25,37,0.45)]"
      >
        <div>
          {/* Header Row: Retro 4-point star, category pill, difficulty stars, points chip */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                data-testid="retro-star"
                className="text-[#FFAE58] text-xl font-bold select-none leading-none"
                aria-hidden="true"
              >
                ✦
              </span>
              <span
                data-testid="category-pill"
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#FFAE58] text-[#141925] tracking-wide"
              >
                {formatCategoryPill(category, difficulty)}
              </span>
              <span
                data-testid="difficulty-stars"
                className="inline-flex items-center text-xs font-mono font-bold text-[#141925] tracking-wider select-none"
                aria-label={`Kesulitan: ${difficultyStars}`}
              >
                {difficultyStars}
              </span>
            </div>

            <span
              data-testid="points-chip"
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-black bg-[#141925] text-[#FFF3DE] border border-[#2E3A52] shadow-sm shrink-0"
            >
              +{points} PTS
            </span>
          </div>

          {/* Body: Title and Description */}
          <div className="mb-6">
            <h3 className="text-xl font-black text-[#141925] mb-2 leading-snug">
              {title}
            </h3>
            <p className="text-sm text-[#141925]/85 leading-relaxed line-clamp-2">
              {description}
            </p>
          </div>
        </div>

        {/* Footer: Full pill button with tactile feel */}
        <div className="pt-2 flex items-center justify-end">
          <Link
            href={targetHref}
            className="inline-flex items-center justify-center rounded-full px-5 py-2.5 min-h-[44px] text-sm font-bold bg-[#141925] text-[#FFF3DE] border-2 border-[#141925] shadow-[0_3px_0_#2E3A52] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_4px_0_#2E3A52] active:translate-y-0.5 active:shadow-[0_1px_0_#2E3A52] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFAE58] focus-visible:ring-offset-2"
          >
            Lihat quest
          </Link>
        </div>
      </div>
    </div>
  );
}
