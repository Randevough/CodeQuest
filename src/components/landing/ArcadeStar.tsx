import React from 'react'

export interface ArcadeStarProps extends React.SVGProps<SVGSVGElement> {
  className?: string
  size?: number
  color?: string
}

// ponytail: static 4-point star path, add multi-point variants if design demands 8-point stars
export function ArcadeStar({
  className = '',
  size = 16,
  color = '#FFAE58',
  ...props
}: ArcadeStarProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={color}
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
    </svg>
  )
}
