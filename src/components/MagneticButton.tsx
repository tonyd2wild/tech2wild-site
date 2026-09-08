import { useRef, type ReactNode, type MouseEvent } from 'react'
import gsap from 'gsap'
import { useIsCoarse, useReducedMotion } from '../hooks/useMotion'

export function MagneticButton({ href, onClick, children, className = 'btn', target, cursor = 'go' }: {
  href?: string; onClick?: (e: MouseEvent<HTMLAnchorElement>) => void; children: ReactNode; className?: string; target?: string; cursor?: string
}) {
  const ref = useRef<HTMLAnchorElement>(null)
  const coarse = useIsCoarse()
  const reduced = useReducedMotion()
  const enabled = !coarse && !reduced

  const move = (e: MouseEvent) => {
    if (!enabled || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const dx = e.clientX - (r.left + r.width / 2)
    const dy = e.clientY - (r.top + r.height / 2)
    gsap.to(ref.current, { x: dx * 0.28, y: dy * 0.32, duration: 0.6, ease: 'power3.out' })
  }
  const leave = () => {
    if (!ref.current) return
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.45)' })
  }
  return (
    <a ref={ref} href={href} onClick={onClick} target={target} rel={target ? 'noreferrer' : undefined}
      className={className} onMouseMove={move} onMouseLeave={leave} data-cursor={cursor}>
      {children}
    </a>
  )
}
