import { useEffect, useState } from 'react'
import { scrollToTarget } from '../hooks/useLenis'
import { channel } from '../data/videos'
import { xProfile } from '../data/posts'
import { githubUrl } from '../data/repos'
import './nav.css'

const links = [
  ['Lab', '#lab'], ['Models', '#models'], ['Benchmarks', '#benchmarks'], ['Experiments', '#experiments'], ['Videos', '#videos'], ['Feed', '#feed'], ['GitHub', '#github'],
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
          <a className="nav__cta" href={channel.url} target="_blank" rel="noreferrer" data-cursor="watch">Subscribe</a>
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
