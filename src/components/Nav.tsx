import { useEffect, useState } from 'react'
import { scrollToTarget } from '../hooks/useLenis'
import { channel } from '../data/videos'
import { xProfile } from '../data/posts'
import { githubUrl } from '../data/repos'
import './nav.css'

const links = [
  ['Lab', '#lab'], ['Models', '#models'], ['Benchmarks', '#benchmarks'], ['Experiments', '#experiments'], ['Videos', '#videos'], ['Feed', '#feed'], ['GitHub', '#github'], ['Join', '#join'],
]

export function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [time, setTime] = useState('')

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => {
    const fmt = () => setTime(new Date().toLocaleTimeString('en-US', { hour12: false, timeZone: 'America/New_York' }))
    fmt(); const t = setInterval(fmt, 1000); return () => clearInterval(t)
  }, [])
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : '' }, [open])

  const go = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault(); setOpen(false); scrollToTarget(target)
  }

  return (
    <>
      <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
        <a href="#top" className="nav__logo" onClick={(e) => go(e, '#top')} aria-label="Tech2Wild home">
          <span className="nav__mark">T2W</span>
          <span className="nav__word">TECH<span>2</span>WILD</span>
        </a>
        <nav className="nav__links" aria-label="Sections">
          {links.map(([l, h]) => <a key={h} href={h} onClick={(e) => go(e, h)}>{l}</a>)}
        </nav>
        <div className="nav__right">
          <div className="nav__status mono"><span className="led led--live" /> LAB ONLINE · ATL {time}</div>
          <div className="nav__ctas">
            <a className="nav__cta nav__cta--x" href={xProfile.url} target="_blank" rel="noreferrer" data-cursor="follow" aria-label="Follow @Tech2Wild on X">
              <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden><path fill="currentColor" d="M18.9 2H22l-7.2 8.3L23.3 22h-6.6l-5.2-6.8L5.6 22H2.4l7.7-8.8L1.6 2h6.8l4.7 6.2L18.9 2zm-1.2 18h1.8L7.2 3.9H5.3L17.7 20z"/></svg>
              Follow
            </a>
            <a className="nav__cta nav__cta--yt" href={channel.url} target="_blank" rel="noreferrer" data-cursor="watch" aria-label="Subscribe to Tech2WiLD on YouTube">
              <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden><path fill="currentColor" d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z"/></svg>
              Subscribe
            </a>
          </div>
          <button className={`nav__burger ${open ? 'is-open' : ''}`} onClick={() => setOpen(v => !v)} aria-label="Menu" aria-expanded={open}>
            <span /><span />
          </button>
        </div>
      </header>
      <div className={`menu ${open ? 'menu--open' : ''}`} aria-hidden={!open}>
        <div className="menu__links">
          {links.map(([l, h], i) => <a key={h} href={h} style={{ transitionDelay: `${i * 40}ms` }} onClick={(e) => go(e, h)}>{l}</a>)}
        </div>
        <div className="menu__foot mono">
          <a href={channel.url} target="_blank" rel="noreferrer">YouTube</a>
          <a href={xProfile.url} target="_blank" rel="noreferrer">X</a>
          <a href={githubUrl} target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </div>
    </>
  )
}
