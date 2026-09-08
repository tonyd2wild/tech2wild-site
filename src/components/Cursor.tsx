import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useIsCoarse, useReducedMotion } from '../hooks/useMotion'

export function Cursor() {
  const coarse = useIsCoarse()
  const reduced = useReducedMotion()
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<{ active: boolean; label: string }>({ active: false, label: '' })
  const enabled = !coarse && !reduced

  useEffect(() => {
    if (!enabled) { document.body.classList.remove('has-cursor'); return }
    document.body.classList.add('has-cursor')
    const qd = gsap.quickTo(dot.current, 'x', { duration: 0.08, ease: 'power3' })
    const qd2 = gsap.quickTo(dot.current, 'y', { duration: 0.08, ease: 'power3' })
    const qr = gsap.quickTo(ring.current, 'x', { duration: 0.35, ease: 'power3' })
    const qr2 = gsap.quickTo(ring.current, 'y', { duration: 0.35, ease: 'power3' })
    const ql = gsap.quickTo(label.current, 'x', { duration: 0.35, ease: 'power3' })
    const ql2 = gsap.quickTo(label.current, 'y', { duration: 0.35, ease: 'power3' })
    const move = (e: MouseEvent) => {
      qd(e.clientX); qd2(e.clientY); qr(e.clientX); qr2(e.clientY); ql(e.clientX); ql2(e.clientY)
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-cursor], a, button')
      if (t) {
        const l = t.getAttribute('data-cursor') || ''
        setState({ active: true, label: l && l !== 'go' ? l : '' })
      } else setState({ active: false, label: '' })
    }
    window.addEventListener('mousemove', move, { passive: true })
    return () => { window.removeEventListener('mousemove', move); document.body.classList.remove('has-cursor') }
  }, [enabled])

  if (!enabled) return null
  return (
    <div className={`cursor ${state.active ? 'cursor--active' : ''} ${state.label ? 'cursor--label' : ''}`} aria-hidden>
      <div ref={dot} className="cursor__dot" />
      <div ref={ring} className="cursor__ring" />
      <div ref={label} className="cursor__label">{state.label}</div>
    </div>
  )
}
