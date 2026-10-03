import type { SVGProps } from 'react'

const base = { width: 20, height: 20, viewBox: '0 0 24 24', 'aria-hidden': true, focusable: false } as const

export const HeartIcon = ({ filled, ...props }: SVGProps<SVGSVGElement> & { filled?: boolean }) => (
  <svg {...base} {...props} fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
    <path d="M12 20.5s-7.5-4.6-9.2-9.4C1.6 7.7 3.9 4.5 7.2 4.5c2 0 3.7 1.1 4.8 2.9 1.1-1.8 2.8-2.9 4.8-2.9 3.3 0 5.6 3.2 4.4 6.6-1.7 4.8-9.2 9.4-9.2 9.4z" />
  </svg>
)

export const SearchIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4.5 4.5" />
  </svg>
)

export const SunIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
  </svg>
)

export const MoonIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.2 15.3A8.5 8.5 0 0 1 8.7 3.8 8.5 8.5 0 1 0 20.2 15.3Z" />
  </svg>
)

export const PinIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props} width={16} height={16} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
    <path d="M12 21s-6.5-5.8-6.5-11a6.5 6.5 0 1 1 13 0c0 5.2-6.5 11-6.5 11z" />
    <circle cx="12" cy="10" r="2.3" />
  </svg>
)
