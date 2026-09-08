import type { ReactNode } from 'react'
import { RevealLines, Reveal } from './Reveal'

export function SectionHead({ eyebrow, lines, side, meta, ember = false, size = 'display-l' }: {
  eyebrow: string; lines: ReactNode[]; side?: ReactNode; meta?: string[]; ember?: boolean; size?: 'display-l' | 'display-xl' | 'display-m'
}) {
  return (
    <div className="sh">
      <div>
        <Reveal><span className={`eyebrow ${ember ? 'eyebrow--ember' : ''}`}>{eyebrow}</span></Reveal>
        <RevealLines as="h2" className={`sh__title ${size}`} lines={lines} />
      </div>
      {(side || meta) && (
        <Reveal className="sh__side" delay={0.15}>
          {side && <p className="lead">{side}</p>}
          {meta && <div className="sh__meta">{meta.map((m, i) => <span key={i}>{m}</span>)}</div>}
        </Reveal>
      )}
    </div>
  )
}
