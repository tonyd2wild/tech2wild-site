import { Marquee } from '../components/Marquee'
import './ticker.css'

const stats: [string, string, string][] = [
  ['DeepSeek V4 Flash', '84.3 tok/s', '1M ctx · 2× Spark'],
  ['GLM-5.3 Flash', '60.6 tok/s peak', 'DFlash2 · 2× Spark'],
  ['Qwen3.8-27B', '101 tok/s', 'real-agent · 2× 3090'],
  ['GLM-5.3 743B', '53.3 tok/s', 'Int4-Int8Mix · 4× Spark'],
  ['Laguna-S 2.1', '282 tok/s peak', 'DFlash · 4× 3090'],
  ['GLM-5.3 Flash TP4', '3.9M-token KV', '1M ctx · 4× Spark'],
  ['DeepSeek V4 TP4', '402 tok/s agg', 'c6 · 4× Spark'],
  ['Qwen3.8 Flash-Next', '70.2 tok/s peak', 'NVFP4 · 2× Spark'],
  ['MiniMax H3', '15 s video', '1× 3090 · 31 GB RAM'],
  ['2Wild Eval', '69 scenarios', '138 pts · fleet-wide'],
]

export function Ticker() {
  return (
    <div className="ticker" aria-label="Lab telemetry">
      <Marquee speed={55} items={stats.map(([m, v, n], i) => (
        <span className="ticker__item mono" key={i}>
          <span className="ticker__model">{m}</span>
          <span className="ticker__val">{v}</span>
          <span className="ticker__note">{n}</span>
        </span>
      ))} />
    </div>
  )
}
