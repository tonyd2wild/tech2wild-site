import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SectionHead } from '../components/SectionHead'
import { Reveal, RevealLines } from '../components/Reveal'
import { experiments, type Experiment } from '../data/experiments'
import { repoUrl } from '../data/repos'
import { thumb, watchUrl } from '../data/videos'
import { useReducedMotion } from '../hooks/useMotion'
import './experiments.css'

gsap.registerPlugin(ScrollTrigger)

function Procedural({ accent, seed }: { accent: string; seed: number }) {
  const bars = Array.from({ length: 28 }, (_, i) => {
    const h = 20 + Math.abs(Math.sin(i * 1.7 + seed) * 60) + (i % 5 === 0 ? 15 : 0)
    return h
  })
  return (
    <svg className="exp__proc" viewBox="0 0 280 120" preserveAspectRatio="none" aria-hidden>
      {bars.map((h, i) => <rect key={i} x={i * 10} y={120 - h} width="6" height={h} fill={accent} opacity={0.25 + (i % 3) * 0.2} />)}
      <polyline points={bars.map((h, i) => `${i * 10 + 3},${120 - h - 8}`).join(' ')} fill="none" stroke={accent} strokeWidth="1" opacity=".6" />
    </svg>
  )
}

function Visual({ e, i }: { e: Experiment; i: number }) {
  return (
    <div className="exp__visual" style={{ ['--accent' as string]: e.accent }}>
      <div className="exp__visual-inner">
        {e.video ? (
          <a href={watchUrl(e.video)} target="_blank" rel="noreferrer" data-cursor="watch" className="exp__thumb">
            <img src={thumb(e.video)} alt="" loading="lazy" data-parallax onError={(ev) => { (ev.currentTarget as HTMLImageElement).src = thumb(e.video!, 'hq') }} />
            <span className="exp__play mono">▶ WATCH</span>
          </a>
        ) : (
          <div className="exp__abstract" data-parallax><Procedural accent={e.accent} seed={i} /></div>
        )}
        <div className="exp__corner mono">EXP-{e.n}</div>
      </div>
    </div>
  )
}

export function Experiments() {
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (reduced || !root.current) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
        gsap.fromTo(el, { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } })
      })
    }, root)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section id="experiments" className="section exp" ref={root}>
      <div className="container">
        <SectionHead
          eyebrow="04 · Experiments from the Lab"
          lines={['THINGS THAT', "WEREN'T SUPPOSED", 'TO RUN HERE.']}
          side={<>Each experiment is a published recipe with a measured result: the hardware, the model, what broke, and what it took to make it work. <strong>All numbers come from the repo READMEs and posts.</strong></>}
          meta={['7 featured', '63 repos total', 'Every one reproducible']}
        />
        <div className="exp__list">
          {experiments.map((e, i) => (
            <article className={`exp__item ${i % 2 ? 'exp__item--flip' : ''}`} key={e.slug} style={{ ['--accent' as string]: e.accent }}>
              <div className="exp__side">
                <Reveal><div className="exp__n mono">{e.n}</div></Reveal>
                <Reveal delay={0.05}><div className="exp__kicker mono">{e.kicker}</div></Reveal>
              </div>
              <div className="exp__body">
                <RevealLines as="h3" className="exp__title display-m" lines={[e.title]} />
                <Reveal className="exp__meta mono" delay={0.1}>
                  <span><b>HARDWARE</b>{e.hardware}</span>
                  <span><b>MODEL</b>{e.model}</span>
                </Reveal>
                <Reveal delay={0.15}><p className="exp__text">{e.body}</p></Reveal>
                <Reveal className="exp__results" stagger={0.06} delay={0.2}>
                  {e.results.map((r) => (
                    <div className="exp__result" key={r.label}>
                      <span className="exp__rlabel mono">{r.label}</span>
                      <span className="exp__rval">{r.value}</span>
                    </div>
                  ))}
                </Reveal>
                <Reveal className="exp__links" delay={0.25}>
                  {e.repo && <a className="btn" href={repoUrl(e.repo)} target="_blank" rel="noreferrer" data-cursor="repo">GitHub <span className="arrow">↗</span></a>}
                  {e.video && <a className="btn btn--ghost" href={watchUrl(e.video)} target="_blank" rel="noreferrer" data-cursor="watch">YouTube <span className="arrow">↗</span></a>}
                  {e.post && <a className="btn btn--ghost" href={e.post} target="_blank" rel="noreferrer" data-cursor="post">Post on X <span className="arrow">↗</span></a>}
                  {e.hf && <a className="btn btn--ghost" href={e.hf} target="_blank" rel="noreferrer" data-cursor="weights">Weights <span className="arrow">↗</span></a>}
                </Reveal>
              </div>
              <Reveal className="exp__media" delay={0.1}><Visual e={e} i={i} /></Reveal>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
