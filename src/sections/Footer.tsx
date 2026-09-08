import { channel } from '../data/videos'
import { xProfile } from '../data/posts'
import { githubUrl, hfWeights } from '../data/repos'
import { scrollToTarget } from '../hooks/useLenis'
import './footer.css'

export function Footer() {
  return (
    <footer className="foot">
      <div className="container">
        <div className="foot__top">
          <div className="foot__cta">
            <span className="eyebrow">Get in the lab</span>
            <h2 className="display-l">THE FUTURE<br />IS LOCAL.</h2>
            <p className="lead">New recipes drop the same day the models do. Subscribe, follow the feed, or fork a repo and run it on your own hardware.</p>
            <div className="foot__btns">
              <a className="btn btn--primary" href={channel.url} target="_blank" rel="noreferrer" data-cursor="subscribe">YouTube <span className="arrow">↗</span></a>
              <a className="btn" href={xProfile.url} target="_blank" rel="noreferrer" data-cursor="follow">X · {xProfile.handle} <span className="arrow">↗</span></a>
              <a className="btn" href={githubUrl} target="_blank" rel="noreferrer" data-cursor="github">GitHub <span className="arrow">↗</span></a>
            </div>
          </div>
          <div className="foot__cols">
            <div>
              <span className="foot__h mono">Site</span>
              {[['Lab', '#lab'], ['Models', '#models'], ['Benchmarks', '#benchmarks'], ['Experiments', '#experiments'], ['Videos', '#videos'], ['Feed', '#feed'], ['GitHub', '#github'], ['Join the Lab', '#join']].map(([l, h]) => (
                <a key={h} href={h} onClick={(e) => { e.preventDefault(); scrollToTarget(h) }}>{l}</a>
              ))}
            </div>
            <div>
              <span className="foot__h mono">Elsewhere</span>
              <a href={channel.url} target="_blank" rel="noreferrer">YouTube · Tech2WiLD</a>
              <a href="https://youtube.com/tonyd2wild" target="_blank" rel="noreferrer">YouTube · Tonyd2wild</a>
              <a href={xProfile.url} target="_blank" rel="noreferrer">X · @Tech2Wild</a>
              <a href="https://x.com/ToNYD2WiLD" target="_blank" rel="noreferrer">X · @ToNYD2WiLD</a>
              <a href={githubUrl} target="_blank" rel="noreferrer">GitHub · tonyd2wild</a>
              <a href={hfWeights} target="_blank" rel="noreferrer">Hugging Face · 2wild4tv</a>
              <a href="https://discord.gg/8SvaFjJKbY" target="_blank" rel="noreferrer">Discord · 2Wild FAM</a>
            </div>
            <div>
              <span className="foot__h mono">Contact</span>
              <a href="mailto:contact@tonyd2wild.com">contact@tonyd2wild.com</a>
              <span className="foot__txt">Atlanta, GA</span>
              <span className="foot__txt">2Wild Agency</span>
            </div>
          </div>
        </div>
        <div className="foot__word" aria-hidden>
          <span>TECH</span><span className="acid">2</span><span>WILD</span>
        </div>
        <div className="foot__bottom mono">
          <span>© 2026 Tech2Wild · Tonyd2wild LLC · Building with it, not just talking about it.</span>
          <span>Numbers on this site come from published recipes and posts · Not affiliated with NVIDIA, DeepSeek, Zhipu, Alibaba or MiniMax</span>
        </div>
      </div>
    </footer>
  )
}
