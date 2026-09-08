import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { MagneticButton } from '../components/MagneticButton'
import { scrollToTarget } from '../hooks/useLenis'
import { usePerfTier, useReducedMotion } from '../hooks/useMotion'
import { channel } from '../data/videos'
import { fleetTotals } from '../data/lab'
import './hero.css'

const HeroScene = lazy(() => import('../three/HeroScene'))

const TAGS = ['Local AI', 'DGX Spark', 'Multi-GPU Systems', 'Open Models', 'Agentic AI', 'Benchmarks']

export function Hero({ ready }: { ready: boolean }) {
  const tier = usePerfTier()
  const reduced = useReducedMotion()
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(true)

  useEffect(() => {
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0.05 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!ready || !root.current) return
    if (reduced) {
      root.current.querySelectorAll<HTMLElement>('.reveal-line > span, .hero__fade').forEach(n => { n.style.transform = 'none'; n.style.opacity = '1' })
      return
    }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      tl.to('.hero__title .reveal-line > span', { y: 0, duration: 1.3, stagger: 0.1 }, 0.1)
        .to('.hero__fade', { opacity: 1, y: 0, duration: 1.1, stagger: 0.08 }, 0.5)
    }, root)
    return () => ctx.revert()
  }, [ready, reduced])

  return (
    <section id="top" className="hero" ref={root}>
      <div className="hero__scene" aria-hidden>
        {tier > 0 ? (
          <Suspense fallback={<div className="hero__fallback" />}>
            <HeroScene tier={tier === 2 ? 2 : 1} active={active && ready} />
          </Suspense>
        ) : <div className="hero__fallback" />}
        <div className="hero__vignette" />
      </div>

      <div className="container hero__content">
        <div className="hero__top hero__fade">
          <span className="eyebrow">Tech2Wild · Local AI Laboratory · Atlanta, GA</span>
          <span className="hero__coords mono">33.75°N 84.39°W · EST. 2025</span>
        </div>

        <h1 className="hero__title display-xl">
          <span className="reveal-line"><span>AI DOESN'T</span></span>
          <span className="reveal-line"><span>HAVE TO LIVE</span></span>
          <span className="reveal-line"><span>IN THE <em>CLOUD.</em></span></span>
        </h1>

        <div className="hero__grid">
          <p className="hero__lead lead hero__fade">
            Tech2Wild explores and builds the hardware, open models and agents that move frontier-class AI out of the datacenter and into machines you can own.
            <strong> Four DGX Sparks, four RTX 3090s, one lab, every recipe published.</strong>
          </p>
          <ul className="hero__tags hero__fade" aria-label="Focus areas">
            {TAGS.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </div>

        <div className="hero__ctas hero__fade">
          <MagneticButton href="#lab" className="btn btn--primary" onClick={(e) => { e.preventDefault(); scrollToTarget('#lab') }} cursor="explore">
            Explore the lab <span className="arrow">→</span>
          </MagneticButton>
          <MagneticButton href={channel.url} target="_blank" className="btn" cursor="watch">
            Watch Tech2Wild <span className="arrow">↗</span>
          </MagneticButton>
          <MagneticButton href="#experiments" className="btn btn--ghost" onClick={(e) => { e.preventDefault(); scrollToTarget('#experiments') }} cursor="projects">
            View projects <span className="arrow">→</span>
          </MagneticButton>
        </div>

        <div className="hero__foot hero__fade">
          <div className="hero__fleet mono">
            <span><b>{fleetTotals.sparks}×</b> DGX SPARK GB10</span>
            <span><b>{fleetTotals.gpus3090}×</b> RTX 3090 NVLINK</span>
            <span><b>{fleetTotals.unifiedMemoryGB} GB</b> UNIFIED + <b>{fleetTotals.vramGB} GB</b> VRAM</span>
            <span><b>{fleetTotals.fabric}</b> FABRIC</span>
          </div>
          <div className="hero__scroll mono" aria-hidden>
            <span>SCROLL</span><i />
          </div>
        </div>
      </div>
    </section>
  )
}
