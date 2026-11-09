export type StampVerdict = 'approved' | 'changes'

export interface StampProps {
  verdict: StampVerdict
  /** Plays the landing animation. Leave off for static uses. */
  animate?: boolean
  className?: string
}

const COPY: Record<StampVerdict, { text: string; label: string }> = {
  approved: { text: 'Approved', label: 'Approved by club staff' },
  changes: { text: 'Changes requested', label: 'Changes requested by club staff' },
}

/** The mark club staff leave on a submission. */
export function Stamp({ verdict, animate = false, className = '' }: StampProps) {
  const { text, label } = COPY[verdict]
  return (
    <span
      data-testid="stamp"
      data-verdict={verdict}
      role="img"
      aria-label={label}
      className={`stamp ${verdict === 'approved' ? 'stamp-approved' : 'stamp-changes'} ${
        animate ? 'stamp-land' : ''
      } ${className}`.trim()}
    >
      <span aria-hidden="true">{text}</span>
    </span>
  )
}
