import { useMemo, useState } from 'react'
import { SectionHead } from '../components/SectionHead'
import { Reveal } from '../components/Reveal'
import { Counter } from '../components/Counter'
import { deployments, familyAccent, fmtTokens, hardwareColors, type Deployment } from '../data/models'
import { useInView } from '../hooks/useInView'
import './benchmarks.css'

type Metric = 'tps' | 'peak' | 'aggregate' | 'context' | 'kv'
const metrics: { key: Metric; label: string; unit: string; get: (d: Deployment) => number | undefined; fmt: (n: number) => string }[] = [
  { key: 'tps', label: 'Decode', unit: 'tok/s', get: d => d.tps, fmt: n => n.toFixed(n % 1 ? 1 : 0) },
  { key: 'peak', label: 'Peak decode', unit: 'tok/s', get: d => d.tpsPeak ?? d.tps, fmt: n => n.toFixed(n % 1 ? 1 : 0) },
  { key: 'aggregate', label: 'Aggregate', unit: 'tok/s', get: d => d.aggregate, fmt: n => n.toFixed(0) },
  { key: 'context', label: 'Context', unit: 'tokens', get: d => d.context, fmt: fmtTokens },
  { key: 'kv', label: 'KV pool', unit: 'tokens', get: d => d.kvPool, fmt: fmtTokens },
]
const hwFilters = ['All', '2x DGX Spark', '4x DGX Spark', 'RTX 3090'] as const

function Gauge({ value, max, color, label }: { value: number; max: number; color: string; label: string }) {
  const r = 44, c = 2 * Math.PI * r
  const p = Math.min(1, value / max)
  return (
    <div className="gauge">
      <svg viewBox="0 0 110 110" width="110" height="110" aria-hidden>
        <circle cx="55" cy="55" r={r} className="gauge__track" />
        <circle cx="55" cy="55" r={r} className="gauge__fill" style={{ stroke: color, strokeDasharray: c, strokeDashoffset: c * (1 - p * 0.75) }} />
      </svg>
      <div className="gauge__val mono"><Counter value={value} decimals={value % 1 ? 1 : 0} /></div>
      <div className="gauge__label mono">{label}</div>
    </div>
  )
}

export function Benchmarks() {
  const [metric, setMetric] = useState<Metric>('tps')
  const [hw, setHw] = useState<typeof hwFilters[number]>('All')
  const [pins, setPins] = useState<string[]>(['ds4-vision-2spark', 'qwen27b-2x3090'])
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.1 })
  const m = metrics.find(x => x.key === metric)!

  const rows = useMemo(() => deployments
    .filter(d => hw === 'All' ? true : hw === 'RTX 3090' ? d.hardware.includes('3090') : d.hardware === hw)
    .map(d => ({ d, v: m.get(d) }))
    .filter((x): x is { d: Deployment; v: number } => typeof x.v === 'number')
    .sort((a, b) => b.v - a.v), [hw, m])
  const max = rows[0]?.v ?? 1

  const pin = (id: string) => setPins(p => p.includes(id) ? p.filter(x => x !== id) : p.length >= 2 ? [p[1], id] : [...p, id])
  const A = deployments.find(d => d.id === pins[0])
  const B = deployments.find(d => d.id === pins[1])
  const gaugeMax = 300

  return (
    <section id="benchmarks" className="section bench">
      <div className="grid-bg" />
      <div className="container">
        <SectionHead
          eyebrow="03 · Benchmark Lab"
          lines={['MEASURED,', 'NOT MARKETED.']}
          side={<>Rankings pull directly from the published recipes: decode speed, peak, aggregate under concurrency, context and KV pool. <strong>Pick a metric, filter by hardware, pin two rows to compare.</strong></>}
          meta={['Single-stream unless marked', 'Warm engine', 'Same prompts per lane']}
          ember
        />

        <Reveal className="bench__controls" delay={0.1}>
          <div className="bench__group">
            <span className="bench__glabel mono">Metric</span>
            {metrics.map(x => <button key={x.key} className={`chip ${metric === x.key ? 'chip--on' : ''}`} onClick={() => setMetric(x.key)} data-cursor="metric">{x.label}</button>)}
          </div>
          <div className="bench__group">
            <span className="bench__glabel mono">Hardware</span>
            {hwFilters.map(x => <button key={x} className={`chip ${hw === x ? 'chip--on' : ''}`} onClick={() => setHw(x)} data-cursor="filter">{x}</button>)}
          </div>
        </Reveal>

        <div className="bench__layout">
          <div className={`bench__rank ${inView ? 'is-on' : ''}`} ref={ref}>
            <div className="bench__rank-head mono"><span>#</span><span>Model · hardware</span><span>{m.label} ({m.unit})</span></div>
            {rows.map(({ d, v }, i) => {
              const pinned = pins.includes(d.id)
              const w = v / max
              return (
                <button key={d.id} className={`brow ${pinned ? 'is-pinned' : ''}`} onClick={() => pin(d.id)} style={{ ['--i' as string]: i, ['--accent' as string]: familyAccent[d.family] }} data-cursor={pinned ? 'unpin' : 'pin'}>
                  <span className="brow__n mono">{String(i + 1).padStart(2, '0')}</span>
                  <span className="brow__main">
                    <span className="brow__name">{d.model}</span>
                    <span className="brow__hw mono" style={{ color: hardwareColors[d.hardware] }}>{d.hardware}</span>
                    <span className="brow__quant mono">{d.quant}</span>
                  </span>
                  <span className="brow__bar"><i style={{ transform: `scaleX(${inView ? w : 0})` }} /></span>
                  <span className="brow__val mono">{inView ? <Counter value={v} format={m.fmt} /> : '0'}</span>
                </button>
              )
            })}
          </div>

          <Reveal className="bench__compare" delay={0.2}>
            <div className="bench__compare-head">
              <span className="eyebrow eyebrow--ember">Head to head</span>
              <span className="mono muted">{pins.length}/2 pinned</span>
            </div>
            {A && B ? (
              <>
                <div className="cmp__names">
                  <div style={{ ['--accent' as string]: familyAccent[A.family] }}><b>{A.model}</b><span className="mono">{A.hardware}</span></div>
                  <span className="cmp__vs mono">VS</span>
                  <div style={{ ['--accent' as string]: familyAccent[B.family] }}><b>{B.model}</b><span className="mono">{B.hardware}</span></div>
                </div>
                <div className="cmp__gauges">
                  <Gauge value={A.tps} max={gaugeMax} color={familyAccent[A.family]} label="tok/s" />
                  <Gauge value={B.tps} max={gaugeMax} color={familyAccent[B.family]} label="tok/s" />
                </div>
                <div className="cmp__rows">
                  {metrics.map(x => {
                    const a = x.get(A), b = x.get(B)
                    const mx = Math.max(a ?? 0, b ?? 0) || 1
                    return (
                      <div className="cmp__row" key={x.key}>
                        <span className="cmp__label mono">{x.label}</span>
                        <div className="cmp__bars">
                          <div className="cmp__bar"><i style={{ width: `${((a ?? 0) / mx) * 100}%`, background: familyAccent[A.family] }} /><span className="mono">{a != null ? x.fmt(a) : '—'}</span></div>
                          <div className="cmp__bar"><i style={{ width: `${((b ?? 0) / mx) * 100}%`, background: familyAccent[B.family] }} /><span className="mono">{b != null ? x.fmt(b) : '—'}</span></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="cmp__foot mono">
                  <span>{A.engine}</span><span>{B.engine}</span>
                </div>
              </>
            ) : <p className="muted">Pin two rows from the ranking to compare them.</p>}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
