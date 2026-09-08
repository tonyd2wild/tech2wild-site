import { useCallback, useEffect, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Preloader } from './components/Preloader'
import { Nav } from './components/Nav'
import { Cursor } from './components/Cursor'
import { Hero } from './sections/Hero'
import { Ticker } from './sections/Ticker'
import { Lab } from './sections/Lab'
import { Models } from './sections/Models'
import { Benchmarks } from './sections/Benchmarks'
import { Experiments } from './sections/Experiments'
import { Videos } from './sections/Videos'
import { Feed } from './sections/Feed'
import { Manifesto } from './sections/Manifesto'
import { Repos } from './sections/Repos'
import { Footer } from './sections/Footer'
import { useLenis } from './hooks/useLenis'
import { useReducedMotion } from './hooks/useMotion'

export default function App() {
  const reduced = useReducedMotion()
  const [ready, setReady] = useState(false)
  const onDone = useCallback(() => setReady(true), [])
  useLenis(!reduced)

  useEffect(() => {
    if (reduced) setReady(true)
  }, [reduced])

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    const t = setTimeout(refresh, 1200)
    document.fonts?.ready.then(refresh)
    // Any layout change below the fold (filters, expanded lists, late images) invalidates
    // ScrollTrigger's cached positions, so refresh whenever the document height changes.
    let raf = 0
    let lastH = document.documentElement.scrollHeight
    const ro = new ResizeObserver(() => {
      const h = document.documentElement.scrollHeight
      if (h === lastH) return
      lastH = h
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => ScrollTrigger.refresh())
    })
    ro.observe(document.body)
    return () => { window.removeEventListener('load', refresh); clearTimeout(t); ro.disconnect(); cancelAnimationFrame(raf) }
  }, [ready])

  return (
    <>
      {!ready && <Preloader onDone={onDone} />}
      <Nav />
      <main>
        <Hero ready={ready} />
        <Ticker />
        <Lab />
        <Models />
        <Benchmarks />
        <Experiments />
        <Videos />
        <Feed />
        <Manifesto />
        <Repos />
      </main>
      <Footer />
      <Cursor />
      <div className="noise" aria-hidden />
    </>
  )
}
