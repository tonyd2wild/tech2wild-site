import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Reveal } from '../components/Reveal'
import { useIsMobile, useReducedMotion } from '../hooks/useMotion'
import './manifesto.css'

gsap.registerPlugin(ScrollTrigger)

const lines = [
  { t: 'OWN THE COMPUTE.', c: 'var(--ink)' },
  { t: 'RUN THE MODEL.', c: 'var(--acid)' },
  { t: 'BUILD THE AGENT.', c: 'var(--ember)' },
  { t: 'PUSH LOCAL AI FURTHER.', c: 'var(--ink)' },
]

export function Manifesto() {
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const mobile = useIsMobile()
  const pinned = !reduced && !mobile

  useEffect(() => {
    if (!pinned || !root.current) return
    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>('.mani__line')
      const tl = gsap.timeline({
        scrollTrigger: { trigger: '.mani__pin', start: 'top top', end: `+=${words.length * 90}%`, scrub: 0.6, pin: true, anticipatePin: 1 },
      })
      words.forEach((w, i) => {
        tl.fromTo(w, { opacity: 0, scale: 0.7, yPercent: 30, filter: 'blur(12px)' }, { opacity: 1, scale: 1, yPercent: 0, filter: 'blur(0px)', duration: 1, ease: 'power3.out' }, i)
        if (i < words.length - 1) tl.to(w, { opacity: 0, scale: 1.25, yPercent: -30, filter: 'blur(10px)', duration: 0.7, ease: 'power3.in' }, i + 0.75)
      })
      tl.fromTo('.mani__ring', { scale: 0.4, opacity: 0 }, { scale: 1.6, opacity: 0.35, ease: 'none', duration: words.length }, 0)
    }, root)
    return () => ctx.revert()
  }, [pinned])

  return (
    <section id="manifesto" className={`mani ${pinned ? 'mani--pinned' : 'mani--static'}`} ref={root}>
      <div className="mani__pin">
        <div className="mani__ring" aria-hidden />
        <div className="mani__stage">
          {lines.map((l, i) => <div className="mani__line" key={i} style={{ color: l.c }}>{l.t}</div>)}
        </div>
        <div className="mani__foot container">
          <Reveal className="mani__thesis">
            <span className="eyebrow">The thesis</span>
            <p className="lead">
              Powerful AI is moving out of massive cloud infrastructure and into hardware that individuals can own.
              <strong> Tech2Wild documents and experiments with that transition</strong>, one recipe, one benchmark and one crash log at a time.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
