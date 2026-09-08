import { useEffect, useState } from 'react'

const query = (q: string) => (typeof window !== 'undefined' ? window.matchMedia(q) : null)

export function useMediaQuery(q: string, initial = false) {
  const [match, setMatch] = useState(() => query(q)?.matches ?? initial)
  useEffect(() => {
    const mq = query(q)
    if (!mq) return
    const on = () => setMatch(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [q])
  return match
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')
export const useIsMobile = () => useMediaQuery('(max-width: 820px)')
export const useIsCoarse = () => useMediaQuery('(pointer: coarse)')

/** Cheap capability score: 0 = minimal effects, 1 = reduced, 2 = full. */
export function usePerfTier(): 0 | 1 | 2 {
  const reduced = useReducedMotion()
  const mobile = useIsMobile()
  const [tier, setTier] = useState<0 | 1 | 2>(2)
  useEffect(() => {
    if (reduced) return setTier(0)
    const nav = navigator as Navigator & { deviceMemory?: number; hardwareConcurrency?: number }
    const mem = nav.deviceMemory ?? 8
    const cores = nav.hardwareConcurrency ?? 8
    if (mobile || mem <= 4 || cores <= 4) setTier(1)
    else setTier(2)
  }, [reduced, mobile])
  return tier
}
