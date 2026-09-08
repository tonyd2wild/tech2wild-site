export interface LabNode {
  id: string
  code: string
  name: string
  kind: 'spark' | 'gpu' | 'fabric' | 'control' | 'agents'
  x: number // 0..100 map coords
  y: number
  spec: string[]
  deployed: string
  context: string
  quant: string
  speed: string
  project: string
  repo?: string
  video?: string
}

export const labNodes: LabNode[] = [
  {
    id: 'spark-01', code: 'SPK-01', name: 'DGX Spark · Node 01', kind: 'spark', x: 22, y: 26,
    spec: ['NVIDIA GB10 Grace Blackwell', '128 GB unified memory (~121 GiB usable)', 'sm_121 · ConnectX-7 200GbE'],
    deployed: 'DeepSeek V4 Flash Vision (TP2 head)',
    context: '1,048,576 tokens', quant: 'NVFP4 KV (nvfp4_ds_mla)', speed: '84.3 tok/s peak · 67.6 mean',
    project: 'The 2-Spark daily driver. Full 1M context, native vision, DSpark speculative decoding and a 2.04M-token KV pool. The most-starred recipe in the lab.',
    repo: 'DeepSeek-v4-Flash-Vision-Exp-DSpark-1M-NVFP4-KV-2x-DGX-Spark', video: '0EIt9SdD8is',
  },
  {
    id: 'spark-02', code: 'SPK-02', name: 'DGX Spark · Node 02', kind: 'spark', x: 40, y: 18,
    spec: ['NVIDIA GB10 Grace Blackwell', '128 GB unified memory', 'RoCE / RDMA fabric peer'],
    deployed: 'GLM-5.3 Flash · NVFP4 + DFlash2 (TP2 pair)',
    context: '262,144 tokens', quant: 'NVFP4 W4A4 · fp8 KV', speed: '46.9 tok/s · 60.6 peak',
    project: 'Same-day GLM-5.3 Flash deployment. Extended vLLM NoPE-MLA support to SM121 and shipped the first fp8 KV cache on consumer Blackwell for this model class. 2.15x over MTP-4.',
    repo: 'GLM-5.3-Flash-NVFP4-DFlash2-2x-DGX-Spark', video: 'bD1jCH5c32g',
  },
  {
    id: 'spark-03', code: 'SPK-03', name: 'DGX Spark · Node 03', kind: 'spark', x: 58, y: 26,
    spec: ['NVIDIA GB10 Grace Blackwell', '128 GB unified memory', 'TP4 rank 2'],
    deployed: 'GLM-5.3 Flash · TP4 across four Sparks',
    context: '1,048,576 tokens native', quant: 'NVFP4 · fp8 KV @ 24 GiB/rank', speed: '~55 tok/s structured · 36 MTP',
    project: 'First TP4 glm5_next outside B200 hardware. A page-cache study found the GB10 memory wall was the flusher, not the allocator; unlocking it grew the KV pool to 3.9M tokens.',
    repo: 'GLM-5.3-Flash-NVFP4-1M-KV-4x-DGX-Spark',
  },
  {
    id: 'spark-04', code: 'SPK-04', name: 'DGX Spark · Node 04', kind: 'spark', x: 76, y: 18,
    spec: ['NVIDIA GB10 Grace Blackwell', '128 GB unified memory', 'TP4 rank 3'],
    deployed: 'GLM-5.3 (743B) · Int4-Int8Mix · TP4',
    context: '300K tokens', quant: 'Int4 experts · Int8 linears · NVFP4 KV', speed: '53.32 tok/s DFlash2',
    project: 'The first Int4-Int8Mix quantization of the full 743B GLM-5.3 anywhere. 1507 GB of BF16 became 377 GiB across 282 shards, then served on four desktop boxes. Weights published on Hugging Face.',
    repo: 'GLM-5.3-Int4-Int8Mix-TP4-4x-DGX-Spark',
  },
  {
    id: 'fabric', code: 'ROCE', name: '200GbE RoCE Fabric', kind: 'fabric', x: 49, y: 44,
    spec: ['Switched 200GbE RoCE / RDMA', 'NCCL over ConnectX-7', 'NFS-shared model weights'],
    deployed: 'Tensor-parallel transport for every multi-Spark lane',
    context: '—', quant: '—', speed: 'TP4 beats TP2 once the fabric is fast enough',
    project: 'The interconnect that turns four 128 GB boxes into one 512 GB memory space. DeepSeek V4 Flash at TP4 reaches 402 tok/s aggregate at six streams over this link.',
    repo: 'NFS-Model-Weights',
  },
  {
    id: 'rig', code: 'RIG-3090', name: 'Quad RTX 3090 Rig', kind: 'gpu', x: 24, y: 70,
    spec: ['4× NVIDIA RTX 3090 · 96 GB VRAM', 'Dual NVLink bridges', '31 GB system RAM · NVMe'],
    deployed: 'Qwen3.8-27B · AutoRound W4A16 · DFlash2 (TP2)',
    context: '131K → 234K tokens', quant: 'W4A16 · FP8 KV', speed: '101 tok/s real-agent · 253 structured',
    project: 'The Ampere lane. Qwen3.8-27B on two of these cards took the #1 spot on the 69-scenario tool-calling eval over models up to 1T parameters. Laguna-S 2.1 hits 282 tok/s peak on all four.',
    repo: 'Qwen3.8-27B-DFLASH2-AutoRound-W4A16-2x3090', video: 'hLge7d8og9Q',
  },
  {
    id: 'videogen', code: 'H3-GEN', name: 'Video Generation Lane', kind: 'gpu', x: 50, y: 78,
    spec: ['1× RTX 3090 (24 GB)', 'ComfyUI · --disable-pinned-memory', 'Also co-tenant on 2× / 4× Spark'],
    deployed: 'MiniMax H3 · text / image → video',
    context: '15 s clip · 832×480 · 24 fps', quant: 'bf16 sampling', speed: '~23 min per 362-frame clip',
    project: 'Open-weights video with audio on one consumer card and 31 GB of RAM. One flag dropped page-locked RAM from ~30 GB to 7.5 GB. The factory recipe runs two H3 instances beside a 1M-context LLM.',
    repo: 'MiniMax-H3-Local', video: 'ysD2aR7kKpA',
  },
  {
    id: 'sparky', code: 'CMD', name: 'Sparky Command Center', kind: 'control', x: 76, y: 66,
    spec: ['Python stdlib only · no DB, no build step', 'SSH telemetry per node', 'vLLM / llama.cpp / ComfyUI metrics'],
    deployed: 'Fleet dashboard for every box above',
    context: 'Cumulative token tracker', quant: '—', speed: 'Live tok/s · TTFT · GPU temp / power / VRAM',
    project: 'Single-page command center for DGX Spark fleets: per-GPU sparklines, RoCE switch monitoring over RouterOS, jump-host support, and an ECO mode that caps GPU clocks (the same cap that fixed the log-less power-offs).',
    repo: 'The-Sparky-Command-Center',
  },
  {
    id: 'agents', code: 'AGENTS', name: 'Agent Layer', kind: 'agents', x: 86, y: 44,
    spec: ['OpenClaw multi-agent team', 'DeepSeek Harness + web / vision / browser tools', 'Hermes desktop · 2Wild Vision Mode'],
    deployed: 'Agents that run the channels and the business on local endpoints',
    context: 'Total-Recall archive', quant: 'Qwen3.5-0.8B vision sidecar', speed: '93 tok/s in the DeepSeek Harness',
    project: 'Everything above exists to feed this. An agent team built on open models and the local fleet, with keyless web search, a vision proxy for blind text models, an in-app browser and a searchable memory of every conversation.',
    repo: 'DeepSeek-Harness-Tools', video: 'tKCrkvkLdSw',
  },
]

export const labLinks: [string, string][] = [
  ['spark-01', 'fabric'], ['spark-02', 'fabric'], ['spark-03', 'fabric'], ['spark-04', 'fabric'],
  ['spark-01', 'spark-02'], ['spark-03', 'spark-04'],
  ['fabric', 'rig'], ['fabric', 'sparky'], ['fabric', 'agents'], ['rig', 'videogen'], ['videogen', 'sparky'], ['sparky', 'agents'],
]

export const fleetTotals = {
  sparks: 4,
  gpus3090: 4,
  unifiedMemoryGB: 512,
  vramGB: 96,
  fabric: '200GbE RoCE',
}
