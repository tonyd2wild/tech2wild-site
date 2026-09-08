export interface Experiment {
  n: string
  slug: string
  title: string
  kicker: string
  hardware: string
  model: string
  body: string
  results: { label: string; value: string }[]
  repo?: string
  video?: string
  post?: string
  hf?: string
  accent: string
}

export const experiments: Experiment[] = [
  {
    n: '01', slug: 'one-million',
    title: 'One million tokens on two desktop boxes',
    kicker: 'DeepSeek V4 Flash · NVFP4 KV · DSpark',
    hardware: '2× NVIDIA DGX Spark (GB10) · TP2',
    model: 'DeepSeek V4 Flash Vision · 284B / 13B active',
    body: 'A 4-bit NVFP4 KV cache on a padded sparse-MLA envelope doubled the KV pool to over two million tokens, which is enough to hold a full 1,048,576-token context twice. DSpark speculative decoding with probabilistic draft sampling pushed single-stream decode past 80 tok/s on structured output. A 40-minute soak at four concurrent streams produced 553 requests with zero degenerate outputs.',
    results: [
      { label: 'Peak decode', value: '84.3 tok/s' },
      { label: 'KV pool', value: '2.04M tokens' },
      { label: 'Context', value: '1M' },
      { label: 'GitHub stars', value: '464' },
    ],
    repo: 'DeepSeek-v4-Flash-Vision-Exp-DSpark-1M-NVFP4-KV-2x-DGX-Spark',
    video: '0EIt9SdD8is',
    accent: '#4FA3FF',
  },
  {
    n: '02', slug: 'same-day-glm',
    title: 'Same-day GLM-5.3 Flash, with a drafter',
    kicker: 'World-first deploy recipe · 7 day-0 bugs fixed',
    hardware: '2× DGX Spark · vLLM TP2',
    model: 'GLM-5.3 Flash · 320B / 18B active · NVFP4',
    body: 'GLM-5.3 Flash dropped and was running on two Sparks with an fp8 KV cache the same day, after extending vLLM\'s SM90 sparse-attention backend to Blackwell and resizing FlashInfer CTA tiles for the GB10\'s 101 KB shared memory. The incoai DFlash2 drafter then slot-shared the MLA tensors with zero extra KV cost, taking decode from 21.8 tok/s with MTP-4 to 46.9, with a 60.6 peak.',
    results: [
      { label: 'Speed-up', value: '2.15×' },
      { label: 'Draft acceptance', value: '74.1%' },
      { label: 'Eval score', value: '93.9 / 100' },
      { label: 'Context', value: '262K' },
    ],
    repo: 'GLM-5.3-Flash-NVFP4-DFlash2-2x-DGX-Spark',
    video: 'bD1jCH5c32g',
    post: 'https://x.com/Tech2Wild/status/2093178554871632035',
    accent: '#C8FF3D',
  },
  {
    n: '03', slug: 'quantize-743b',
    title: 'Quantizing a 743B model in the lab',
    kicker: 'First Int4-Int8Mix GLM-5.3 anywhere',
    hardware: '4× DGX Spark · TP4',
    model: 'GLM-5.3 (full) · 743B / ~40B active',
    body: 'Data-free round-to-nearest with group size 128: 57,600 expert modules to 4-bit, 616 linears to 8-bit, routers, indexers and the LM head kept at BF16. Shard-streaming quantization brought 1,507 GB of BF16 down to 377.4 GiB across 282 shards without ever holding the whole model in memory. Served at TP4 with DFlash2 the model decodes at 53 tok/s on structured output.',
    results: [
      { label: 'Size', value: '1507 GB → 377 GiB' },
      { label: 'Decode', value: '53.32 tok/s' },
      { label: 'Context', value: '300K' },
      { label: 'KV pool', value: '317,278' },
    ],
    repo: 'GLM-5.3-Int4-Int8Mix-TP4-4x-DGX-Spark',
    hf: 'https://huggingface.co/2wild4tv/GLM-5.3-Int4-Int8Mix',
    accent: '#8CFF7A',
  },
  {
    n: '04', slug: 'twenty-seven-b',
    title: 'The 27B that beat the giants',
    kicker: '2Wild tool-calling eval · 69 scenarios · 138 points',
    hardware: '2× RTX 3090 · NVLink · TP2',
    model: 'Qwen3.8-27B · AutoRound W4A16 · DFlash2',
    body: 'Every model in the fleet ran the same 69-scenario, 15-category tool-calling and reasoning eval. The top spot went to a 27B dense model on two consumer cards, ahead of MiMo 230B, GLM-5.2 744B, DeepSeek V4 Flash and Kimi K2 at a trillion parameters. With the DFlash2 n=7 drafter it decodes at 101 tok/s on real agent turns and 253 tok/s on structured output, with a 528 ms median turn latency.',
    results: [
      { label: 'Eval rank', value: '#1 · 97.1' },
      { label: 'Real-agent decode', value: '101.1 tok/s' },
      { label: 'Structured', value: '252.9 tok/s' },
      { label: 'Median turn', value: '528 ms' },
    ],
    repo: 'Qwen3.8-27B-DFLASH2-AutoRound-W4A16-2x3090',
    video: 'd31KL5Fc-EM',
    post: 'https://x.com/Tech2Wild/status/2088387064748265570',
    accent: '#FF7A1A',
  },
  {
    n: '05', slug: 'video-one-card',
    title: 'Fifteen seconds of video on one card',
    kicker: 'MiniMax H3 · the fix is one flag',
    hardware: '1× RTX 3090 · 31 GB system RAM',
    model: 'MiniMax H3 · text / image → video with audio',
    body: 'Prior local runs of MiniMax H3 needed around 90 GB of RAM for shorter clips. ComfyUI\'s default page-locks up to 90% of system memory, which the kernel then cannot swap, so it OOM-kills the process. Disabling pinned memory dropped RAM use from nearly 30 GB to 7.5 GB and a full 362-frame clip renders in about 23 minutes at 832×480.',
    results: [
      { label: 'Clip', value: '15 s · 24 fps' },
      { label: 'System RAM', value: '30 → 7.5 GB' },
      { label: 'Render', value: '~23 min' },
      { label: 'VRAM', value: '24 GB' },
    ],
    repo: 'MiniMax-H3-Local',
    video: 'ysD2aR7kKpA',
    accent: '#FF4FA3',
  },
  {
    n: '06', slug: 'cotenant',
    title: 'An LLM and two video renders on the same two Sparks',
    kicker: 'DS4 × H3 Video Gen Factory',
    hardware: '2× DGX Spark · 121 GiB unified each',
    model: 'DeepSeek V4 Flash @ 1M + 2× MiniMax H3',
    body: 'Unified memory means the CPU and GPU share one pool, so ordering matters. Start the LLM first, then let each H3 instance size itself to what remains. DeepSeek keeps a 1.47M-token KV pool and sub-second time to first token while one or two 15-second clips render beside it, at 46% and 35% of its solo throughput.',
    results: [
      { label: 'LLM context', value: '1M' },
      { label: 'KV pool', value: '1.47M' },
      { label: 'TTFT', value: '< 1 s' },
      { label: 'Throughput kept', value: '46% / 35%' },
    ],
    repo: 'DS4-H3-Video-Gen-Factory',
    accent: '#B98CFF',
  },
  {
    n: '07', slug: 'logless-crash',
    title: 'The crash that never wrote a log',
    kicker: 'DGX Spark hard power-off · root cause and fix',
    hardware: 'DGX Spark (GB10) under sustained decode',
    model: 'Any',
    body: 'About twenty hard power-offs in three weeks, with no kernel panic, no OOM and nothing in the journal. The hotspot climbs from ~90 °C to ~98 °C in two seconds and the embedded controller cuts power before Linux can throttle or log. Capping the graphics clock at 2200 MHz gives thermal management the headroom to engage first, for roughly a 5% throughput cost.',
    results: [
      { label: 'Before', value: '~20 crashes / 3 wk' },
      { label: 'After', value: '0' },
      { label: 'Cost', value: '~5% tok/s' },
      { label: 'Fix', value: 'nvidia-smi -lgc 300,2200' },
    ],
    repo: 'DGX-Spark-Hard-Poweroff-Fix',
    post: 'https://x.com/Tech2Wild/status/2089003239941292403',
    accent: '#FF5C2A',
  },
]
