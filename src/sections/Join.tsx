import { useEffect, useRef, useState, type FormEvent } from 'react'
import { SectionHead } from '../components/SectionHead'
import { Reveal } from '../components/Reveal'
import { JOIN_ENDPOINT, TURNSTILE_SITE_KEY, githubOrgUrl, discordInvite } from '../data/config'
import { useReducedMotion } from '../hooks/useMotion'
import './join.css'

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string
      reset: (id?: string) => void
      remove: (id: string) => void
    }
  }
}

const HARDWARE = ['DGX Spark', 'RTX 3090', 'RTX 4090', 'RTX 5090', 'Other NVIDIA', 'Apple Silicon', 'None yet']
const LANES: [string, string][] = [
  ['Spark recipes', 'vLLM / SGLang on GB10, TP2–TP4, NVFP4 and KV work'],
  ['3090 recipes', 'Ampere lane: AutoRound, GGUF, DFlash2, NVLink rigs'],
  ['Tools & dashboards', 'Sparky, latency monitors, fleet telemetry'],
  ['Agents & harness', 'DeepSeek Harness plugins, OpenClaw, vision sidecars'],
  ['Eval & benchmarks', 'The 69-scenario eval, new scenarios, fair comparisons'],
  ['Video & content', 'Launch-day streams, breakdowns, thumbnails, editing'],
]
const HOURS = ['<5', '5-10', '10-20', '20+']

type State = {
  name: string; email: string; x: string; github: string
  hardware: string[]; hardwareNotes: string; lanes: string[]
  link: string; hours: string; why: string; consent: boolean; website: string
}
const initial: State = { name: '', email: '', x: '', github: '', hardware: [], hardwareNotes: '', lanes: [], link: '', hours: '', why: '', consent: false, website: '' }

function useTurnstile(enabled: boolean) {
  const box = useRef<HTMLDivElement>(null)
  const [token, setToken] = useState('')
  const widget = useRef<string | null>(null)
  useEffect(() => {
    if (!enabled || !box.current) return
    let cancelled = false
    const render = () => {
      if (cancelled || !box.current || !window.turnstile || widget.current) return
      widget.current = window.turnstile.render(box.current, {
        sitekey: TURNSTILE_SITE_KEY, theme: 'dark', appearance: 'interaction-only',
        callback: (t: string) => setToken(t), 'expired-callback': () => setToken(''), 'error-callback': () => setToken(''),
      })
    }
    if (window.turnstile) render()
    else {
      const id = 'cf-turnstile-script'
      if (!document.getElementById(id)) {
        const s = document.createElement('script')
        s.id = id; s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'; s.async = true; s.defer = true
        document.head.appendChild(s)
      }
      const t = setInterval(() => { if (window.turnstile) { clearInterval(t); render() } }, 150)
      return () => { cancelled = true; clearInterval(t) }
    }
    return () => { cancelled = true }
  }, [enabled])
  const reset = () => { setToken(''); if (widget.current && window.turnstile) window.turnstile.reset(widget.current) }
  return { box, token, reset }
}

export function Join() {
  const [s, setS] = useState<State>(initial)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [bad, setBad] = useState<string[]>([])
  const [armed, setArmed] = useState(false)
  const reduced = useReducedMotion()
  const { box, token, reset } = useTurnstile(armed)
  const root = useRef<HTMLElement>(null)

  // Only load the Turnstile script once the form is near the viewport.
  useEffect(() => {
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setArmed(true); io.disconnect() } }, { rootMargin: '600px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const set = <K extends keyof State>(k: K, v: State[K]) => setS((p) => ({ ...p, [k]: v }))
  const toggle = (k: 'hardware' | 'lanes', v: string) => setS((p) => ({ ...p, [k]: p[k].includes(v) ? p[k].filter((x) => x !== v) : [...p[k], v] }))
  const is = (f: string) => (bad.includes(f) ? 'is-bad' : '')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (busy) return
    setErr(null); setBad([])
    if (!token) { setErr('Give the bot check a second, then try again.'); setBad(['turnstile']); return }
    setBusy(true)
    try {
      const r = await fetch(JOIN_ENDPOINT, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...s, turnstile: token }) })
      const data = (await r.json().catch(() => ({}))) as { ok?: boolean; id?: string; error?: string; fields?: string[] }
      if (r.ok && data.ok) { setDone(data.id ?? 'ok'); return }
      setErr(data.error ?? `Something went wrong (${r.status}).`)
      setBad(data.fields ?? [])
      reset()
    } catch {
      setErr('Network error. Try again in a moment.')
      reset()
    } finally { setBusy(false) }
  }

  return (
    <section id="join" className="section join" ref={root}>
      <div className="grid-bg" />
      <div className="container">
        <SectionHead
          eyebrow="08 · Join the Lab"
          lines={['BUILD THE', 'RECIPES', 'WITH US.']}
          side={<>Too many models drop for one person to deploy, benchmark and document them all. Tech2Wild is opening the lab to collaborators who want to push local AI forward in the open. <strong>You bring a lane and some hours. We bring the fleet, the eval harness and the audience.</strong></>}
          meta={['GitHub org: Tech2Wild', 'Discord: 2Wild FAM', 'Every recipe stays public']}
        />

        <div className="join__layout">
          <Reveal className="join__side" stagger={0.08}>
            <div className="join__step"><span className="join__n mono">01</span><div><b>Apply</b><p>Two minutes. Your X and GitHub handles are the application; the rest is context.</p></div></div>
            <div className="join__step"><span className="join__n mono">02</span><div><b>Vetting</b><p>Your public GitHub gets scored automatically (age, activity, local-AI relevance) and a human looks at both profiles. No résumés.</p></div></div>
            <div className="join__step"><span className="join__n mono">03</span><div><b>Invite</b><p>Approved builders land in a lane team in the <a href={githubOrgUrl} target="_blank" rel="noreferrer">Tech2Wild GitHub org</a> and a role in the <a href={discordInvite} target="_blank" rel="noreferrer">Discord</a>. Recipes ship under your name.</p></div></div>
            <div className="join__step"><span className="join__n mono">04</span><div><b>Ship</b><p>Pick an open lane, run the model, post the numbers from the eval harness, open the PR. Tony reviews and merges.</p></div></div>
            <ul className="join__lanes mono">
              {LANES.map(([l, d]) => <li key={l}><b>{l}</b><span>{d}</span></li>)}
            </ul>
          </Reveal>

          <Reveal className="join__card" delay={0.1}>
            {done ? (
              <div className="join__done">
                <span className="eyebrow">Application received</span>
                <h3 className="display-m">You're in the queue.</h3>
                <p>Reference <span className="mono acid">{done}</span>. We review in batches and reply by email; join the <a href={discordInvite} target="_blank" rel="noreferrer">Discord</a> in the meantime and say hi in #introductions.</p>
              </div>
            ) : (
              <form className="join__form" onSubmit={submit} noValidate>
                <div className="join__row2">
                  <label className={is('name')}><span>Name</span><input value={s.name} onChange={(e) => set('name', e.target.value)} maxLength={80} autoComplete="name" required /></label>
                  <label className={is('email')}><span>Email</span><input type="email" value={s.email} onChange={(e) => set('email', e.target.value)} maxLength={120} autoComplete="email" required /></label>
                </div>
                <div className="join__row2">
                  <label className={is('x')}><span>X handle</span><div className="join__prefix"><i>@</i><input value={s.x} onChange={(e) => set('x', e.target.value.replace(/^@/, ''))} maxLength={40} placeholder="yourhandle" required /></div></label>
                  <label className={is('github')}><span>GitHub username</span><div className="join__prefix"><i>github.com/</i><input value={s.github} onChange={(e) => set('github', e.target.value.replace(/^@/, ''))} maxLength={60} placeholder="you" required /></div></label>
                </div>

                <fieldset className={is('hardware')}>
                  <legend>Hardware you own</legend>
                  <div className="join__chips">
                    {HARDWARE.map((h) => <button type="button" key={h} className={`chip ${s.hardware.includes(h) ? 'chip--on' : ''}`} onClick={() => toggle('hardware', h)} aria-pressed={s.hardware.includes(h)}>{h}</button>)}
                  </div>
                  <input className="join__notes" value={s.hardwareNotes} onChange={(e) => set('hardwareNotes', e.target.value)} maxLength={300} placeholder="Counts and details, e.g. 2× 3090 NVLink, 64 GB RAM, 1× Spark" />
                </fieldset>

                <fieldset className={is('lanes')}>
                  <legend>Lanes you want to work in <em>required</em></legend>
                  <div className="join__chips">
                    {LANES.map(([l]) => <button type="button" key={l} className={`chip ${s.lanes.includes(l) ? 'chip--on' : ''}`} onClick={() => toggle('lanes', l)} aria-pressed={s.lanes.includes(l)}>{l}</button>)}
                  </div>
                </fieldset>

                <div className="join__row2">
                  <label className={is('link')}><span>Something you built <em>optional</em></span><input type="url" value={s.link} onChange={(e) => set('link', e.target.value)} maxLength={300} placeholder="https://" /></label>
                  <label className={is('hours')}><span>Hours per week</span>
                    <select value={s.hours} onChange={(e) => set('hours', e.target.value)}>
                      <option value="">Pick one</option>
                      {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </label>
                </div>

                <label className={is('why')}><span>Why the lab, and what would you ship first? <em>required</em></span>
                  <textarea value={s.why} onChange={(e) => set('why', e.target.value)} maxLength={1200} rows={4} required />
                  <small className="mono">{s.why.length}/1200</small>
                </label>

                <label className={`join__consent ${is('consent')}`}>
                  <input type="checkbox" checked={s.consent} onChange={(e) => set('consent', e.target.checked)} required />
                  <span>I'm okay with Tech2Wild reviewing my public GitHub and X profiles and contacting me by email about the lab.</span>
                </label>

                {/* honeypot */}
                <label className="join__hp" aria-hidden="true"><input tabIndex={-1} autoComplete="off" value={s.website} onChange={(e) => set('website', e.target.value)} name="website" /></label>

                <div className={`join__turnstile ${is('turnstile')}`}><div ref={box} /></div>

                {err && <p className="join__err" role="alert">{err}</p>}

                <div className="join__actions">
                  <button type="submit" className="btn btn--primary" disabled={busy} data-cursor="send">{busy ? 'Sending…' : 'Apply to the lab'} <span className="arrow">→</span></button>
                  <span className="mono muted">{reduced ? '' : 'Stored on Cloudflare. No newsletter, no spam.'}</span>
                </div>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
