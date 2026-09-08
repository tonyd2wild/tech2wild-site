export interface Post {
  id: string
  date: string
  tag: 'BENCH' | 'LAUNCH' | 'HARDWARE' | 'OPINION' | 'RELEASE' | 'EXPERIMENT'
  text: string
  url: string
}

export const xProfile = {
  handle: '@Tech2Wild',
  url: 'https://x.com/Tech2Wild',
  bio: 'Tech, gaming, AI, and everything in between. Building with it, not just talking about it. From the mind of @ToNYD2WiLD',
  followers: 3461,
  following: 182,
  joined: 'March 2026',
}

export const posts: Post[] = [
  {
    id: '2093253642962747847', date: '2026-08-28', tag: 'BENCH',
    text: 'GLM-5.3-Flash + DFlash2, TP2 on 2x DGX Spark (GB10). Last bench numbers I never posted: PEAK 60.6 tok/s single-stream = 2.8x over MTP-4. ~74% draft acceptance, zero extra KV pool. ★★★★★ 93.9 on our 69-task eval — verified lossless.',
    url: 'https://x.com/Tech2Wild/status/2093253642962747847',
  },
  {
    id: '2093178554871632035', date: '2026-08-28', tag: 'RELEASE',
    text: 'DFlash2 is working on GLM-5.3-Flash on 2x DGX Spark (GB10). Same-day as the model drop, we already had it running with fp8 KV cache. Now the incoai DFlash2 drafter is live on the vLLM route: 46.9 tok/s single-stream vs 21.8 for MTP-4 = 2.15× faster. 74.1% draft acceptance.',
    url: 'https://x.com/Tech2Wild/status/2093178554871632035',
  },
  {
    id: '2093171885487816893', date: '2026-08-28', tag: 'LAUNCH',
    text: 'GLM 5.3 FLASH DFLASH2 TP2 on 2 x DGX SPARK FIRST Prompt! PEAK 59 tok/s. More benchmarks coming soon and update to REPO.',
    url: 'https://x.com/Tech2Wild/status/2093171885487816893',
  },
  {
    id: '2089516666837205035', date: '2026-08-18', tag: 'HARDWARE',
    text: 'DGX Spark Running Hot? Read This.',
    url: 'https://x.com/Tech2Wild/status/2089516666837205035',
  },
  {
    id: '2089003239941292403', date: '2026-08-16', tag: 'HARDWARE',
    text: "My DGX Spark was hard powering off every day or two. No kernel panic, no OOM, no logs. Just dead until you power cycle it. Turns out the GB10's embedded controller cuts power on a thermal spike faster than Linux can even write a log line. The fix is one command: sudo nvidia-smi -lgc 300,2200",
    url: 'https://x.com/Tech2Wild/status/2089003239941292403',
  },
  {
    id: '2088387064748265570', date: '2026-08-14', tag: 'BENCH',
    text: 'BREAKING! We ran our full tool-calling benchmark across the entire local fleet. 138 points, 69 scenarios, every model tested the same way. The #1 spot went to a 27B dense model. Qwen3.8-27B topped MiMo 230B, GLM-5.2 744B, DeepSeek V4 Flash, and Kimi K2 1T. Running on two RTX 3090s.',
    url: 'https://x.com/Tech2Wild/status/2088387064748265570',
  },
  {
    id: '2088352322300629326', date: '2026-08-14', tag: 'EXPERIMENT',
    text: "Found the Qwen3.8-27B match for the INT4 AutoRound 3.6-27B I've been running, and the speeds come out basically identical. Sometimes 3.8 edges it, sometimes the 3.6-27B wins, but it's a dead-on replacement for the setup I already trust. This is the AutoRound W4A16 build (4-bit).",
    url: 'https://x.com/Tech2Wild/status/2088352322300629326',
  },
  {
    id: '2079593341662949880', date: '2026-07-21', tag: 'RELEASE',
    text: 'GLM-5.2 (744B) now running a TRUE 4-bit NVFP4 KV cache on 4x DGX Spark. 42 tok/s peak decode. 317K-token KV pool (+58.6% vs fp8). 316K context serving. Needle-verified at 250K depth. Custom Triton + CuTe kernels, built in ONE night.',
    url: 'https://x.com/Tech2Wild/status/2079593341662949880',
  },
  {
    id: '2073657098248884359', date: '2026-07-05', tag: 'RELEASE',
    text: 'Recipe dropped: DeepSeek V4 Flash at 1M token context on 2x NVIDIA DGX Spark. Production-tested, 45 tok/s decode, real 800K prompts served.',
    url: 'https://x.com/Tech2Wild/status/2073657098248884359',
  },
  {
    id: '2070712431710552376', date: '2026-06-27', tag: 'OPINION',
    text: 'Imagine the government shutting down Hugging Face and people having to use something like Pirate Bay to torrent models. Or people SELLING open models to people because they no longer exist to the public but people had them stored. MiniMax M3? $2K.',
    url: 'https://x.com/Tech2Wild/status/2070712431710552376',
  },
]
