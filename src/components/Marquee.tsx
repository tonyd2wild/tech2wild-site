import type { ReactNode } from 'react'
import './marquee.css'

export function Marquee({ items, speed = 40, reverse = false, className = '' }: { items: ReactNode[]; speed?: number; reverse?: boolean; className?: string }) {
  const track = [...items, ...items]
  return (
    <div className={`marquee ${className}`} style={{ ['--dur' as string]: `${speed}s`, ['--dir' as string]: reverse ? 'reverse' : 'normal' }}>
      <div className="marquee__track">
        {track.map((it, i) => <div className="marquee__item" key={i} aria-hidden={i >= items.length}>{it}</div>)}
      </div>
    </div>
  )
}
