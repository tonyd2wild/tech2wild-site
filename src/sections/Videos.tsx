import { useState, type MouseEvent } from 'react'
import { SectionHead } from '../components/SectionHead'
import { Reveal } from '../components/Reveal'
import { Counter } from '../components/Counter'
import { channel, thumb, videos, watchUrl, type Video } from '../data/videos'
import { useIsCoarse, useReducedMotion } from '../hooks/useMotion'
import './videos.css'

const fmtDate = (d: string) => new Date(d + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
const fmtViews = (n?: number) => n == null ? '' : n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K` : `${n}`

function Card({ v, size = 'm' }: { v: Video; size?: 'xl' | 'l' | 'm' | 's' }) {
  const coarse = useIsCoarse()
  const reduced = useReducedMotion()
  const move = (e: MouseEvent<HTMLAnchorElement>) => {
    if (coarse || reduced) return
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    e.currentTarget.style.setProperty('--rx', `${-py * 6}deg`)
    e.currentTarget.style.setProperty('--ry', `${px * 8}deg`)
    e.currentTarget.style.setProperty('--tx', `${px * -10}px`)
    e.currentTarget.style.setProperty('--ty', `${py * -10}px`)
    e.currentTarget.style.setProperty('--mx', `${(px + 0.5) * 100}%`)
    e.currentTarget.style.setProperty('--my', `${(py + 0.5) * 100}%`)
  }
  const leave = (e: MouseEvent<HTMLAnchorElement>) => { ['--rx', '--ry', '--tx', '--ty'].forEach(k => e.currentTarget.style.setProperty(k, '0')) }
  return (
    <a className={`vcard vcard--${size}`} href={watchUrl(v.id)} target="_blank" rel="noreferrer" onMouseMove={move} onMouseLeave={leave} data-cursor="play">
      <div className="vcard__media">
        <img src={thumb(v.id)} alt={v.title} loading="lazy" onError={(e) => { (e.currentTarget as HTMLImageElement).src = thumb(v.id, 'hq') }} />
        <div className="vcard__glow" />
        <span className="vcard__dur mono">{v.duration}</span>
        <span className="vcard__cat mono">{v.category}</span>
      </div>
      <div className="vcard__body">
        <div className="vcard__meta mono"><span>{fmtDate(v.date)}</span>{v.views ? <span>{fmtViews(v.views)} views</span> : null}</div>
        <h3 className="vcard__title">{v.title}</h3>
      </div>
    </a>
  )
}

export function Videos() {
  const [latest, ...rest] = videos
  const featured = rest.filter(v => v.featured).slice(0, 5)
  const strip = rest.filter(v => !featured.includes(v))
  const [showAll, setShowAll] = useState(false)

  return (
    <section id="videos" className="section videos">
      <div className="container">
        <SectionHead
          eyebrow="05 · Latest from Tech2Wild"
          lines={['THE BUILD LOG,', 'ON CAMERA.']}
          side={<>Every deployment gets documented as it happens: launch-day streams, benchmark breakdowns and the honest verdicts. <strong>Real footage from the lab, not stock renders.</strong></>}
          meta={[`${channel.videoCount} videos`, 'Founded June 2025', 'youtube.com/@tech2wild1']}
        />

        <Reveal className="videos__stats" stagger={0.08}>
          <div><span className="mono">Subscribers</span><b><Counter value={channel.subscribers} /></b></div>
          <div><span className="mono">Channel views</span><b><Counter value={channel.views} /></b></div>
          <div><span className="mono">Subs growth · 1y</span><b>+<Counter value={channel.subsGrowth1y} decimals={0} />%</b></div>
          <div><span className="mono">Views growth · 30d</span><b>+<Counter value={channel.viewsGrowth30d} decimals={0} />%</b></div>
        </Reveal>

        <div className="videos__mosaic">
          <Reveal className="videos__latest"><Card v={latest} size="xl" /></Reveal>
          <Reveal className="videos__feat" stagger={0.08}>
            {featured.map((v, i) => <Card key={v.id} v={v} size={i === 0 ? 'l' : 'm'} />)}
          </Reveal>
        </div>

        <div className="videos__strip-head">
          <span className="eyebrow eyebrow--plain">Archive</span>
          <button className="chip" onClick={() => setShowAll(s => !s)} data-cursor="toggle">{showAll ? 'Collapse' : `Show all ${strip.length}`}</button>
        </div>
        <div className={`videos__strip ${showAll ? 'is-grid' : ''}`} data-lenis-prevent>
          {strip.map(v => <Card key={v.id} v={v} size="s" />)}
        </div>

        <Reveal className="videos__cta">
          <a className="btn btn--primary" href={channel.url} target="_blank" rel="noreferrer" data-cursor="subscribe">Subscribe on YouTube <span className="arrow">↗</span></a>
        </Reveal>
      </div>
    </section>
  )
}
