import { useMemo, useState } from 'react'
import { SectionHead } from '../components/SectionHead'
import { Reveal } from '../components/Reveal'
import { githubProfile, githubUrl, hfWeights, repoUrl, repos, type RepoLane } from '../data/repos'
import './repos.css'

const lanes: ('All' | RepoLane)[] = ['All', 'DGX Spark', 'RTX 3090', 'Tools', 'Agents']
const langColor: Record<string, string> = { Python: '#4fa3ff', Shell: '#c8ff3d', JavaScript: '#ffd23d', HTML: '#ff7a1a', Docker: '#3dffd5', Markdown: '#a3a39b' }

export function Repos() {
  const [lane, setLane] = useState<typeof lanes[number]>('All')
  const [open, setOpen] = useState<string | null>(null)
  const list = useMemo(() => repos.filter(r => lane === 'All' || r.lane === lane), [lane])
  const totalStars = repos.reduce((a, r) => a + r.stars, 0)

  return (
    <section id="github" className="section repos">
      <div className="container">
        <SectionHead
          eyebrow="07 · Open Source"
          lines={['RECIPES,', 'NOT SECRETS.']}
          side={<>Every deployment in the lab ships as a reproducible repository: Docker images, launch flags, the patches that made it boot and the benchmarks that prove it. <strong>Fork it, run it, argue with the numbers.</strong></>}
          meta={[`${githubProfile.publicRepos} public repos`, `${totalStars.toLocaleString()}+ stars on the recipes shown`, githubProfile.location]}
        />

        <Reveal className="console" delay={0.1}>
          <div className="console__bar">
            <span className="console__path mono">github.com/tonyd2wild <span className="muted">— {list.length} of {repos.length} indexed</span></span>
            <div className="console__tabs">
              {lanes.map(l => <button key={l} className={`console__tab mono ${lane === l ? 'is-on' : ''}`} onClick={() => setLane(l)} data-cursor="filter">{l}</button>)}
            </div>
          </div>
          <div className="console__head mono">
            <span>Repository</span><span>Model</span><span>Hardware</span><span>Type</span><span>★</span>
          </div>
          <ul className="console__list">
            {list.map((r, i) => (
              <li key={r.name} className={`crow ${open === r.name ? 'is-open' : ''}`} style={{ ['--i' as string]: i }}>
                <a href={repoUrl(r.name)} target="_blank" rel="noreferrer" className="crow__main" onMouseEnter={() => setOpen(r.name)} onFocus={() => setOpen(r.name)} data-cursor="repo">
                  <span className="crow__name mono"><i style={{ background: langColor[r.lang] ?? '#6b6b66' }} />{r.name}</span>
                  <span className="crow__model">{r.model}</span>
                  <span className="crow__hw mono">{r.hardware}</span>
                  <span className="crow__type mono">{r.type}</span>
                  <span className="crow__stars mono">{r.stars}</span>
                </a>
                <div className="crow__desc"><p>{r.desc}</p><span className="mono">{r.lang} · pushed {r.pushed}</span></div>
              </li>
            ))}
          </ul>
          <div className="console__foot">
            <a className="btn" href={githubUrl} target="_blank" rel="noreferrer" data-cursor="github">All {githubProfile.publicRepos} repositories <span className="arrow">↗</span></a>
            <a className="btn btn--ghost" href={hfWeights} target="_blank" rel="noreferrer" data-cursor="weights">GLM-5.3 Int4-Int8Mix weights on Hugging Face <span className="arrow">↗</span></a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
