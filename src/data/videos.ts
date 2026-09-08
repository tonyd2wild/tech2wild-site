export interface Video {
  id: string
  title: string
  date: string
  category: 'DeepSeek' | 'GLM' | 'Qwen' | 'Hardware' | 'Agents' | 'Benchmarks' | 'Video Gen' | 'Opinion' | 'Live'
  duration: string
  views?: number
  featured?: boolean
}

export const thumb = (id: string, q: 'maxres' | 'hq' = 'maxres') =>
  `https://i.ytimg.com/vi/${id}/${q === 'maxres' ? 'maxresdefault' : 'hqdefault'}.jpg`

export const watchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`

// Snapshot: 2026-09-08 (vidIQ / YouTube public data)
export const videos: Video[] = [
  { id: 'RcNAu_Bpn8s', title: 'Qwen 3.8 Flash Might Be the BEST Local AI Model Right Now! | DGX Spark + RTX 3090 Tested', date: '2026-09-07', category: 'Benchmarks', duration: '16:27', views: 11415, featured: true },
  { id: 'fT_0qigwaXQ', title: 'NVIDIA Just Turned Your House Into an AI Cluster… This Is HUGE', date: '2026-09-03', category: 'Hardware', duration: '20:27', views: 10629, featured: true },
  { id: 'ZGcgwWtJHks', title: 'Claude Fable 5.1 Is HERE — Better Than Opus 5? First Tests + Benchmarks', date: '2026-09-01', category: 'Opinion', duration: '15:55', views: 9466 },
  { id: '0EIt9SdD8is', title: 'DeepSeek V4 Flash Vision Is OPEN — The New 2-Spark KING?', date: '2026-09-01', category: 'DeepSeek', duration: '13:57', views: 6991, featured: true },
  { id: 'bD1jCH5c32g', title: 'GLM 5.3 Flash Is the NEW 2-Spark KING?! vs Qwen 3.8 Flash Next', date: '2026-08-29', category: 'Benchmarks', duration: '20:50', views: 14649, featured: true },
  { id: 'z8xlSd1d99A', title: 'Qwen 3.8 Flash Next Might Be the 2-Spark KING... GLM 5.3 Has Competition!', date: '2026-08-27', category: 'Qwen', duration: '13:09', views: 10578 },
  { id: 'yBQtPbTRJKQ', title: "GLM 5.3 Flash JUST DROPPED... And It's Almost As Good As MAX?!", date: '2026-08-26', category: 'GLM', duration: '10:41', views: 8138 },
  { id: '53_C0MM7MHU', title: 'Qwen 3.8 Flash-Next + GLM 5.3 Flash LAUNCH DAY! Deploying BOTH LIVE', date: '2026-08-26', category: 'Live', duration: '5:45:45', views: 5658 },
  { id: 'GroG5VaVyd4', title: 'Apple NEW M5 Just Changed Local AI FOREVER... Qwen 3.8 Flash NEXT Drops Tomorrow', date: '2026-08-25', category: 'Hardware', duration: '18:06', views: 11654 },
  { id: 'tj5Vm-fhrec', title: 'What Is OX ALPHA?! GLM 5.3 Flash, New Qwen 3.8 Midsize Model, Kimi K3.1 + DeepSeek Vision', date: '2026-08-21', category: 'Opinion', duration: '13:33', views: 4511 },
  { id: 'ZAPhT8KLLv0', title: 'Hermes Desktop App Just Changed EVERYTHING - New Bot Mode Update', date: '2026-08-19', category: 'Agents', duration: '21:30', views: 5180 },
  { id: 'd31KL5Fc-EM', title: 'Qwen 3.8 27B Is BEATING GPT-5.6… LOCAL Models BEATING Frontier Models At HOME!', date: '2026-08-17', category: 'Benchmarks', duration: '16:03', views: 7050, featured: true },
  { id: 'mYx-bhBcwrU', title: 'Qwen3.8 27B Is Basically Opus-Level AI Running at Home', date: '2026-08-14', category: 'Qwen', duration: '17:48', views: 10287 },
  { id: 'yiXSK7WvSv0', title: "DeepSeek Just Dropped Its Own Harness… And It's FAST! | LOCAL ChatGPT", date: '2026-08-13', category: 'Agents', duration: '11:43', views: 6364 },
  { id: 'P9yd6RRLMAE', title: 'Local AI vs Cloud AI: Which One Is Better?', date: '2026-08-11', category: 'Opinion', duration: '20:27', views: 2496 },
  { id: 'AkXuUL_35gI', title: 'Qwen 3.8 27B Could Be the Biggest Local AI Model of 2026', date: '2026-08-06', category: 'Qwen', duration: '17:34', views: 12540 },
  { id: 'ysD2aR7kKpA', title: 'The BEST Open Weights Video Model Runs on ONE RTX 3090 - MiniMax H3', date: '2026-08-04', category: 'Video Gen', duration: '12:56', views: 6941, featured: true },
  { id: 'wq-HVi8olFg', title: 'Alibaba Just Saved Local AI… Qwen 3.8 27B Is OPEN', date: '2026-08-03', category: 'Qwen', duration: '14:49', views: 13450 },
  { id: 'xtm4QYCpmv4', title: 'DeepSeek V4 Flash 0731 Just DROPPED and Is a HUGE Win for Local AI (2 DGX Sparks!)', date: '2026-07-31', category: 'DeepSeek', duration: '11:19', views: 12264 },
  { id: 'hLge7d8og9Q', title: '4 RTX 3090s + Dual NVLink: My Ultimate Local AI Setup', date: '2026-07-27', category: 'Hardware', duration: '13:05', views: 4479, featured: true },
  { id: 'Jaw0MZ-XSuE', title: 'Is This the BEST Local Model for One DGX Spark?', date: '2026-07-22', category: 'Hardware', duration: '12:12', views: 5058 },
  { id: 'PHkHpYANSMg', title: '54GB to 3.9GB?! 1-Bit Models Just Changed Local AI', date: '2026-07-14', category: 'Opinion', duration: '7:42', views: 4339 },
  { id: 'UCzCy-3Jplg', title: '1 DGX Spark vs 4 RTX 3090s: Which Should You Buy?', date: '2026-07-13', category: 'Hardware', duration: '10:51', views: 5178 },
  { id: 'FmfaGPBwUV4', title: 'I Got DeepSeek V4 Flash Running at 60 tok/s Locally', date: '2026-07-08', category: 'DeepSeek', duration: '16:22', views: 6296 },
  { id: 'nbHOBvLlypY', title: "I'm Running a Frontier-Level AI Model at Home… GLM 5.2 on 4 DGX Sparks", date: '2026-07-06', category: 'GLM', duration: '11:33', views: 9754, featured: true },
  { id: '-eqhFe9jNA4', title: "What I'm Running Local AI Models on 4 DGX Sparks + Quad RTX 3090s", date: '2026-06-24', category: 'Hardware', duration: '16:57', views: 8683 },
  { id: 'oRMFtuzLyok', title: 'I Built a QUAD 3090 AI Rig + 3 DGX Sparks… This Got Out of Hand', date: '2026-06-18', category: 'Hardware', duration: '14:42', views: 3771 },
  { id: 'tKCrkvkLdSw', title: "Why I've Been Gone.... How I Built an AI Team to Run My Entire Business With OpenClaw", date: '2026-03-30', category: 'Agents', duration: '9:55', views: 583 },
]

export const channel = {
  name: 'Tech2WiLD',
  handle: '@tech2wild1',
  url: 'https://www.youtube.com/@tech2wild1',
  avatar: 'https://yt3.ggpht.com/d0ht4Sao8_yc-CsqvQqNWTkwgU4EKdp69SBCCOFiEabIQgUXhZ0FfMlMQEJSzl8xh50PGz6mZA8=s800-c-k-c0x00ffffff-no-rj',
  subscribers: 3350,
  views: 231212,
  videoCount: 53,
  founded: '2025-06-25',
  subsGained30d: 1040,
  viewsGained30d: 128034,
  asOf: '2026-09-08',
}
