import { useEffect, useRef, type ReactNode, type ElementType } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../hooks/useMotion'

gsap.registerPlugin(ScrollTrigger)

/** Line-by-line masked reveal for display headings. Each child string/element becomes one line. */
export function RevealLines({ lines, as: Tag = 'h2', className = '', delay = 0, start = 'top 85%' }: {
  lines: ReactNode[]; as?: ElementType; className?: string; delay?: number; start?: string
}) {
  const ref = useRef<HTMLElement | null>(null)
  const reduced = useReducedMotion()
  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    const spans = el.querySelectorAll<HTMLElement>('.reveal-line > span')
    const ctx = gsap.context(() => {
      gsap.to(spans, {
        y: 0, duration: 1.2, ease: 'power4.out', stagger: 0.09, delay,
        scrollTrigger: { trigger: el, start, once: true },
      })
    })
    return () => ctx.revert()
  }, [reduced, delay, start])
  return (
    <Tag ref={ref as never} className={className}>
      {lines.map((l, i) => (
        <span className="reveal-line" key={i}><span>{l}</span></span>
      ))}
    </Tag>
  )
}

/** Fade-up for blocks; stagger children when `stagger` is set. */
export function Reveal({ children, className = '', stagger = 0, delay = 0, y = 26, start = 'top 88%', as: Tag = 'div' }: {
  children: ReactNode; className?: string; stagger?: number; delay?: number; y?: number; start?: string; as?: ElementType
}) {
  const ref = useRef<HTMLElement | null>(null)
  const reduced = useReducedMotion()
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced) { el.querySelectorAll<HTMLElement>('.will-reveal').forEach(c => { c.style.opacity = '1'; c.style.transform = 'none' }); el.classList.remove('will-reveal'); return }
    const targets = stagger ? Array.from(el.children) : [el]
    if (!stagger) el.classList.add('will-reveal')
    else Array.from(el.children).forEach(c => c.classList.add('will-reveal'))
    const ctx = gsap.context(() => {
      gsap.to(targets, {
        opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger, delay,
        scrollTrigger: { trigger: el, start, once: true },
      })
    })
    return () => ctx.revert()
  }, [reduced, stagger, delay, y, start])
  return <Tag ref={ref as never} className={className}>{children}</Tag>
}
