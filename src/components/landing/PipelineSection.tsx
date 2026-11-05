import React from "react";

export interface PipelineStep {
  step: string;
  level: string;
  title: string;
  description: string;
  highlight: string;
}

export const PIPELINE_STEPS: PipelineStep[] = [
  {
    step: "01",
    level: "Level 1",
    title: "01. Kunci Quest",
    description: "Pilih tantangan di katalog dan amankan slot pengerjaan.",
    highlight: "Katalog dan Slot",
  },
  {
    step: "02",
    level: "Level 2",
    title: "02. Bangun Solusi",
    description: "Kembangkan kode di repositori Git mandiri atau bersama tim.",
    highlight: "Git Mandiri atau Tim",
  },
  {
    step: "03",
    level: "Level 3",
    title: "03. Kirim Repositori",
    description: "Buka pull request resmi lengkap dengan dokumentasi solusi.",
    highlight: "PR dan Dokumentasi",
  },
  {
    step: "04",
    level: "Level 4",
    title: "04. Buka Reward",
    description: "Review disetujui mentor, poin XP dan lencana langsung aktif.",
    highlight: "Mentor dan XP",
  },
];

export interface PipelineSectionProps {
  className?: string;
}

export function PipelineSection({ className = "" }: PipelineSectionProps) {
  return (
    <section
      aria-labelledby="pipeline-heading"
      className={`page-container py-12 ${className}`.trim()}
    >
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2
          id="pipeline-heading"
          className="text-2xl sm:text-4xl font-black text-[#FFF3DE] uppercase tracking-tight"
        >
          Empat Langkah Menuju Kode Terverifikasi
        </h2>
        <p className="text-[#C2C7D0] mt-3 text-sm sm:text-base leading-relaxed">
          Alur kerja repo Git nyata dengan reward XP otomatis.
        </p>
      </div>

      {/* Desktop Visual Connecting Progress Track */}
      <div
        className="hidden lg:grid grid-cols-4 gap-6 mb-6 px-2"
        aria-hidden="true"
      >
        {PIPELINE_STEPS.map((item, idx) => (
          <div key={`track-${item.step}`} className="flex items-center gap-3">
            <span className="w-3.5 h-3.5 rounded-full bg-[#FFAE58] ring-4 ring-[#FFAE58]/20 shadow-[0_0_12px_#FFAE58] flex-shrink-0" />
            <span className="text-xs font-semibold text-[#FFAE58] tracking-wide">
              {item.level}
            </span>
            {idx < PIPELINE_STEPS.length - 1 && (
              <div className="flex-1 h-0.5 bg-gradient-to-r from-[#FFAE58]/60 to-[#47577A] mx-2 rounded-full" />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {PIPELINE_STEPS.map((item) => (
          <div
            key={item.step}
            data-testid={`pipeline-step-${item.step}`}
            className="rounded-[20px] bg-[#20283A] border-2 border-[#2E3A52] p-6 flex flex-col justify-between shadow-[0_4px_0_#141925] transition-all duration-150 hover:-translate-y-1 hover:border-[#47577A]"
          >
            <div>
              {/* Warm Rounded Step Badge */}
              <div className="flex items-center justify-between mb-4">
                <div
                  data-testid={`step-badge-${item.step}`}
                  className="px-3.5 py-1 rounded-full bg-[#FFAE58] text-[#141925] flex items-center justify-center font-bold text-xs sm:text-sm shadow-[0_2px_0_#C27A29] select-none"
                >
                  {item.level}
                </div>
                <span className="text-xs font-medium text-[#8A94A6]">
                  Langkah {item.step}
                </span>
              </div>

              <h3 className="text-lg font-bold text-[#FFF3DE] mb-2 leading-snug">
                {item.title}
              </h3>

              <p className="text-sm text-[#C2C7D0] leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#2E3A52] flex items-center justify-between text-xs text-[#8A94A6]">
              <span className="text-[#FFAE58] font-semibold">
                <span aria-hidden="true">✦</span> {item.highlight}
              </span>
              <span>Langkah {item.step} dari 04</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
