import { useMemo, useState } from 'react'
import { SectionHead } from '../components/SectionHead'
import { Reveal } from '../components/Reveal'
import { labNodes, labLinks, type LabNode } from '../data/lab'
import { repoUrl } from '../data/repos'
import { watchUrl } from '../data/videos'
import './lab.css'

const kindLabel: Record<LabNode['kind'], string> = { spark: 'DGX SPARK', gpu: 'RTX 3090', fabric: 'FABRIC', control: 'CONTROL', agents: 'AGENTS' }

export function Lab() {
  const [activeId, setActiveId] = useState(labNodes[0].id)
  const [hoverId, setHoverId] = useState<string | null>(null)
  const active = useMemo(() => labNodes.find(n => n.id === activeId)!, [activeId])
  const byId = useMemo(() => Object.fromEntries(labNodes.map(n => [n.id, n])), [])
  const focus = hoverId ?? activeId

  return (
    <section id="lab" className="section lab">
      <div className="grid-bg" />
      <div className="container">
        <SectionHead
          eyebrow="01 · The Lab"
          lines={['A DATACENTER', 'THAT FITS ON', 'A DESK.']}
          side={<>Four NVIDIA DGX Sparks on a 200GbE RoCE fabric, a quad RTX 3090 rig on NVLink, and an agent layer that runs on all of it. <strong>Hover or tap a node to open its deployment sheet.</strong></>}
          meta={['4× GB10 · 512 GB unified', '4× RTX 3090 · 96 GB VRAM', '63 public recipes']}
        />

        <div className="lab__layout">
          <Reveal className="lab__map" delay={0.1}>
            <svg className="lab__links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
              {labLinks.map(([a, b]) => {
                const A = byId[a], B = byId[b]
                const hot = focus === a || focus === b
                return (
                  <g key={`${a}-${b}`}>
                    <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} className="lab__link" />
                    <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} className={`lab__flow ${hot ? 'is-hot' : ''}`} />
                  </g>
                )
              })}
            </svg>
            {labNodes.map((n) => (
              <button
                key={n.id}
                className={`lab__node lab__node--${n.kind} ${activeId === n.id ? 'is-active' : ''} ${hoverId === n.id ? 'is-hover' : ''}`}
                style={{ left: `${n.x}%`, top: `${n.y}%` }}
                onMouseEnter={() => setHoverId(n.id)}
                onMouseLeave={() => setHoverId(null)}
                onFocus={() => setHoverId(n.id)}
                onBlur={() => setHoverId(null)}
                onClick={() => setActiveId(n.id)}
                data-cursor="open"
                aria-pressed={activeId === n.id}
              >
                <span className="lab__glyph" aria-hidden />
                <span className="lab__code mono">{n.code}</span>
                <span className="lab__kind mono">{kindLabel[n.kind]}</span>
              </button>
            ))}
            <div className="lab__legend mono" aria-hidden>
              <span><i className="lab__lg lab__lg--spark" /> DGX Spark</span>
              <span><i className="lab__lg lab__lg--gpu" /> RTX 3090</span>
              <span><i className="lab__lg lab__lg--fabric" /> Fabric</span>
              <span><i className="lab__lg lab__lg--control" /> Control / Agents</span>
            </div>
          </Reveal>

          <Reveal className="lab__panel" delay={0.2}>
            <div className="lab__panel-inner" key={active.id}>
              <div className="lab__panel-head">
                <span className="chip chip--on"><span className="chip__dot" />{active.code}</span>
                <span className="mono lab__panel-kind">{kindLabel[active.kind]}</span>
              </div>
              <h3 className="display-m lab__panel-title">{active.name}</h3>
              <ul className="lab__spec mono">
                {active.spec.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
              <dl className="lab__dl">
                <div><dt>Deployed</dt><dd>{active.deployed}</dd></div>
                <div><dt>Context</dt><dd className="mono">{active.context}</dd></div>
                <div><dt>Quantization</dt><dd className="mono">{active.quant}</dd></div>
                <div><dt>Inference</dt><dd className="mono acid">{active.speed}</dd></div>
              </dl>
              <p className="lab__project">{active.project}</p>
              <div className="lab__actions">
                {active.repo && <a className="btn" href={repoUrl(active.repo)} target="_blank" rel="noreferrer" data-cursor="repo">GitHub recipe <span className="arrow">↗</span></a>}
                {active.video && <a className="btn btn--ghost" href={watchUrl(active.video)} target="_blank" rel="noreferrer" data-cursor="watch">Watch the build <span className="arrow">↗</span></a>}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
