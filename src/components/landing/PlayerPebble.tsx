import React from 'react'

export interface PlayerPebbleProps {
  name: string
  level?: number | string
  points: number
  handle?: string
  className?: string
}

export function PlayerPebble({
  name,
  level = 4,
  points,
  handle,
  className = '',
}: PlayerPebbleProps) {
  const formattedPoints = points.toLocaleString('en-US')

  return (
    <div
      className={`w-full rounded-full bg-[#20283A] hover:bg-[#2B354D] border-[1.5px] border-[#2E3A52] hover:border-[#47577A] px-4 py-2.5 flex items-center justify-between transition-colors ${className}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Avatar Sirkular: w-10 h-10, background raised #2B354D, border 2px #FFAE58, teks cq */}
        <div
          className="w-10 h-10 rounded-full bg-[#2B354D] border-2 border-[#FFAE58] flex items-center justify-center shrink-0 text-[#FFF3DE] font-mono text-xs font-bold"
          aria-hidden="true"
        >
          <span>cq</span>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-sm font-semibold text-[#FFF3DE] truncate">{name}</span>
            <span className="text-xs text-[#C2C7D0] shrink-0 font-normal">
              (Level {level})
            </span>
          </div>
          {handle && (
            <div className="text-[11px] font-mono text-[#8A94A6] truncate">{handle}</div>
          )}
        </div>
      </div>

      {/* Chip Poin: Full pill chip di ujung kanan, background #141925, teks #FFAE58 monospace bold */}
      <div className="rounded-full bg-[#141925] px-3 py-1 shrink-0 ml-3">
        <span className="font-mono text-xs font-bold text-[#FFAE58]">
          +{formattedPoints} PTS
        </span>
      </div>
    </div>
  )
}
