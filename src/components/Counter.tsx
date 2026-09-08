import { useEffect, useRef, useState } from 'react'
import { useInView } from '../hooks/useInView'
import { useReducedMotion } from '../hooks/useMotion'

export function Counter({ value, decimals = 0, suffix = '', prefix = '', duration = 1600, className = '', format }: {
  value: number; decimals?: number; suffix?: string; prefix?: string; duration?: number; className?: string; format?: (n: number) => string
}) {
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.4 })
  const reduced = useReducedMotion()
  const [n, setN] = useState(reduced ? value : 0)
  const raf = useRef(0)
  useEffect(() => {
    if (!inView) return
    if (reduced) { setN(value); return }
    const t0 = performance.now()
    const from = 0
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / duration)
      const e = 1 - Math.pow(1 - p, 4)
      setN(from + (value - from) * e)
      if (p < 1) raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf.current)
  }, [inView, value, duration, reduced])
  const text = format ? format(n) : n.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  return <span ref={ref} className={className}>{prefix}{text}{suffix}</span>
}
