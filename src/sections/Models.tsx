import { useMemo, useState, type MouseEvent } from 'react'
import { SectionHead } from '../components/SectionHead'
import { Reveal } from '../components/Reveal'
import { Counter } from '../components/Counter'
import { deployments, familyAccent, fmtTokens, type Deployment } from '../data/models'
import { repoUrl } from '../data/repos'
import { watchUrl } from '../data/videos'
import { useInView } from '../hooks/useInView'
import { useIsCoarse, useReducedMotion } from '../hooks/useMotion'
import './models.css'

const filters = ['All', 'DGX Spark', 'RTX 3090', 'Live now'] as const
type Filter = typeof filters[number]
const MAX_TPS = 300

function Card({ d, on }: { d: Deployment; on: boolean }) {
  const coarse = useIsCoarse()
  const reduced = useReducedMotion()
  const tilt = (e: MouseEvent<HTMLElement>) => {
    if (coarse || reduced) return
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    e.currentTarget.style.setProperty('--rx', `${-py * 7}deg`)
    e.currentTarget.style.setProperty('--ry', `${px * 9}deg`)
    e.currentTarget.style.setProperty('--mx', `${(px + 0.5) * 100}%`)
    e.currentTarget.style.setProperty('--my', `${(py + 0.5) * 100}%`)
  }
  const reset = (e: MouseEvent<HTMLElement>) => { e.currentTarget.style.setProperty('--rx', '0deg'); e.currentTarget.style.setProperty('--ry', '0deg') }
  const accent = familyAccent[d.family]
  return (
    <article className="mcard" onMouseMove={tilt} onMouseLeave={reset} style={{ ['--accent' as string]: accent }}>
      <div className="mcard__inner">
        <header className="mcard__head">
          <span className="mcard__family mono">{d.family}</span>
          <span className={`mcard__status mono`}><span className={`led led--${d.status.toLowerCase()}`} />{d.status}</span>
        </header>
        <h3 className="mcard__title">{d.model}</h3>
        {d.highlight && <p className="mcard__hl">{d.highlight}</p>}
        <dl className="mcard__grid mono">
          <div><dt>Params</dt><dd>{d.params}{d.active ? <small> · {d.active} active</small> : null}</dd></div>
          <div><dt>Quant</dt><dd>{d.quant}</dd></div>
          <div><dt>Hardware</dt><dd className="mcard__hw">{d.hardware}</dd></div>
          <div><dt>Engine</dt><dd>{d.engine}</dd></div>
        </dl>
        <div className="mcard__tps">
          <div className="mcard__tps-row">
            <span className="mono muted">Decode</span>
            <span className="mcard__tps-val mono"><Counter value={d.tps} decimals={d.tps % 1 ? 1 : 0} /> <small>tok/s</small></span>
          </div>
          <div className="bar"><span style={{ transform: `scaleX(${on ? Math.min(1, d.tps / MAX_TPS) : 0})` }} /></div>
          {d.tpsPeak && <div className="bar bar--peak"><span style={{ transform: `scaleX(${on ? Math.min(1, d.tpsPeak / MAX_TPS) : 0})` }} /></div>}
          <div className="mcard__tps-note mono">{d.tpsPeak ? `${d.tpsNote} · peak ${d.tpsPeak}` : d.tpsNote}</div>
        </div>
        <div className="mcard__tel mono">
          <div><span>CTX</span><b>{fmtTokens(d.context)}</b></div>
          <div><span>KV POOL</span><b>{d.kvPool ? fmtTokens(d.kvPool) : '—'}</b></div>
          <div><span>AGG</span><b>{d.aggregate ? `${d.aggregate}` : '—'}</b></div>
          <div><span>★</span><b>{d.stars}</b></div>
        </div>
        <p className="mcard__spec mono">{d.spec}</p>
        <footer className="mcard__foot">
          <a href={repoUrl(d.repo)} target="_blank" rel="noreferrer" className="mcard__link mono" data-cursor="repo">GitHub ↗</a>
          {d.video && <a href={watchUrl(d.video)} target="_blank" rel="noreferrer" className="mcard__link mono" data-cursor="watch">Video ↗</a>}
        </footer>
      </div>
    </article>
  )
}

export function Models() {
  const [f, setF] = useState<Filter>('All')
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.05 })
  const list = useMemo(() => deployments.filter(d =>
    f === 'All' ? true : f === 'Live now' ? d.status === 'LIVE' : d.hardware.includes(f === 'DGX Spark' ? 'Spark' : '3090')
  ), [f])

  return (
    <section id="models" className="section models">
      <div className="container">
        <SectionHead
          eyebrow="02 · Deployments"
          lines={['MODELS THAT', 'RUN AT HOME.']}
          side={<>Every card is a model Tech2Wild has actually served on lab hardware, with the quantization, engine and measured decode speed from the published recipe. <strong>Numbers are single-stream unless marked.</strong></>}
          meta={[`${deployments.length} deployments`, '7 model families', 'vLLM · SGLang · llama.cpp · ExLlamaV3']}
        />
        <Reveal className="models__filters" delay={0.1}>
          {filters.map(x => (
            <button key={x} className={`chip ${f === x ? 'chip--on' : ''}`} onClick={() => setF(x)} data-cursor="filter">{x}</button>
          ))}
          <span className="models__count mono">{list.length} shown</span>
        </Reveal>
        <div className={`models__grid ${inView ? 'is-on' : ''}`} ref={ref}>
          {list.map((d) => <Card key={d.id} d={d} on={inView} />)}
        </div>
      </div>
    </section>
  )
}
