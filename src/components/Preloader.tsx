import { useEffect, useState } from 'react'
import { useReducedMotion } from '../hooks/useMotion'
import './preloader.css'

const lines = [
  'tech2wild.lab  boot  v2026.09',
  'probe  4x DGX Spark GB10 .......... online',
  'probe  4x RTX 3090 NVLink .......... online',
  'fabric 200GbE RoCE ................. up',
  'mount  model weights (NFS) ......... ok',
  'load   deployments / benchmarks .... ok',
  'route  agents -> local endpoints ... ok',
]

export function Preloader({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion()
  const [shown, setShown] = useState(0)
  const [progress, setProgress] = useState(0)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (reduced) { onDone(); return }
    let i = 0
    const t = setInterval(() => {
      i += 1
      setShown(i)
      setProgress(Math.min(100, Math.round((i / lines.length) * 100)))
      if (i >= lines.length) {
        clearInterval(t)
        setTimeout(() => setLeaving(true), 260)
        setTimeout(onDone, 260 + 900)
      }
    }, 150)
    return () => clearInterval(t)
  }, [reduced, onDone])

  if (reduced) return null
  return (
    <div className={`preloader ${leaving ? 'preloader--leave' : ''}`} aria-hidden>
      <div className="preloader__inner">
        <div className="preloader__mark">T2W</div>
        <div className="preloader__log mono">
          {lines.slice(0, shown).map((l, i) => <div key={i} className="preloader__line">{l}</div>)}
        </div>
        <div className="preloader__bar"><span style={{ width: `${progress}%` }} /></div>
        <div className="preloader__pct mono">{String(progress).padStart(3, '0')}%</div>
      </div>
    </div>
  )
}
