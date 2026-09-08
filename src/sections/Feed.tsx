import { useEffect, useState } from 'react'
import { SectionHead } from '../components/SectionHead'
import { Reveal } from '../components/Reveal'
import { posts, xProfile } from '../data/posts'
import { useInView } from '../hooks/useInView'
import { useReducedMotion } from '../hooks/useMotion'
import './feed.css'

const tagColor: Record<string, string> = { BENCH: 'var(--acid)', LAUNCH: 'var(--ember)', HARDWARE: 'var(--sky)', OPINION: '#b98cff', RELEASE: '#3dffd5', EXPERIMENT: '#ffd23d' }
const stamp = (d: string) => new Date(d + 'T12:00:00Z').toLocaleDateString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' })

export function Feed() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 })
  const reduced = useReducedMotion()
  const [shown, setShown] = useState(reduced ? posts.length : 0)
  useEffect(() => {
    if (!inView || reduced) return
    let i = 0
    const t = setInterval(() => { i += 1; setShown(i); if (i >= posts.length) clearInterval(t) }, 260)
    return () => clearInterval(t)
  }, [inView, reduced])

  return (
    <section id="feed" className="section feed">
      <div className="grid-bg" />
      <div className="container">
        <SectionHead
          eyebrow="06 · Research Terminal"
          lines={['LIVE FROM', 'THE LAB.']}
          side={<>Selected posts from <strong>@Tech2Wild</strong> on X: bench numbers as they land, launches, hardware fixes and a few opinions on where open models are going.</>}
          meta={[`${xProfile.followers.toLocaleString()} followers`, `Joined ${xProfile.joined}`, 'x.com/Tech2Wild']}
          ember
        />
        <Reveal className="term" delay={0.1}>
          <div className="term__bar">
            <span className="term__dots"><i /><i /><i /></span>
            <span className="term__title mono">tail -f /var/log/tech2wild/x.log</span>
            <span className="term__live mono"><span className="led led--live" /> STREAMING</span>
          </div>
          <div className="term__body" ref={ref}>
            {posts.slice(0, shown).map((p) => (
              <a className="term__post" key={p.id} href={p.url} target="_blank" rel="noreferrer" data-cursor="open">
                <span className="term__stamp mono">[{stamp(p.date)}]</span>
                <span className="term__tag mono" style={{ color: tagColor[p.tag] }}>{p.tag}</span>
                <span className="term__text">{p.text}</span>
                <span className="term__arrow mono">↗</span>
              </a>
            ))}
            <div className="term__prompt mono">
              <span className="acid">tech2wild@lab</span>:<span className="ember">~</span>$ <span className="term__cursor" />
            </div>
          </div>
          <div className="term__foot mono">
            <span>{shown}/{posts.length} entries</span>
            <a href={xProfile.url} target="_blank" rel="noreferrer">Follow {xProfile.handle} ↗</a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
