export type RepoLane = 'DGX Spark' | 'RTX 3090' | 'Tools' | 'Agents'

export interface Repo {
  name: string
  desc: string
  model: string
  hardware: string
  type: string
  lane: RepoLane
  stars: number
  lang: string
  pushed: string
}

export const githubUser = 'tonyd2wild'
export const githubUrl = `https://github.com/${githubUser}`
export const repoUrl = (name: string) => `${githubUrl}/${name}`
export const hfWeights = 'https://huggingface.co/2wild4tv/GLM-5.3-Int4-Int8Mix'
export const githubProfile = {
  name: 'Tony DeAngelo',
  location: 'Atlanta, GA',
  company: '2Wild Agency',
  publicRepos: 63,
  followers: 204,
  avatar: 'https://avatars.githubusercontent.com/u/219747476?v=4',
}

export const repos: Repo[] = [
  { name: 'DeepSeek-v4-Flash-Vision-Exp-DSpark-1M-NVFP4-KV-2x-DGX-Spark', desc: 'DeepSeek V4 Flash DSpark 1M NVFP4 KV recipe for 2x DGX Spark. Native vision, staged NVFP4 runtime patches, 40-min soak with zero degenerate outputs.', model: 'DeepSeek V4 Flash Vision', hardware: '2x DGX Spark', type: 'vLLM TP2 recipe', lane: 'DGX Spark', stars: 464, lang: 'Python', pushed: '2026-08-31' },
  { name: 'GLM-5.3-Flash-NVFP4-DFlash2-2x-DGX-Spark', desc: 'GLM-5.3-Flash (NVFP4) on 2x DGX Spark. World-first deploy recipe with 7 day-0 bugs identified and fixed. DFlash2 drafter, 262K context.', model: 'GLM-5.3 Flash', hardware: '2x DGX Spark', type: 'vLLM TP2 recipe', lane: 'DGX Spark', stars: 140, lang: 'Python', pushed: '2026-08-30' },
  { name: 'Deepseek-v4-Flash-TP2-DGX-Spark-500k-CTX', desc: 'Working recipe to serve DeepSeek-V4-Flash across two DGX Spark nodes with vLLM (TP=2, FP8 KV, MTP).', model: 'DeepSeek V4 Flash', hardware: '2x DGX Spark', type: 'vLLM TP2 recipe', lane: 'DGX Spark', stars: 81, lang: 'Shell', pushed: '2026-07-13' },
  { name: 'GLM-5.2-QuantTrio-200K-4x-DGX-Spark--36tok-s', desc: 'GLM-5.2 (unpruned QuantTrio Int4-Int8Mix) at 200K ctx with MTP spec decode on a 4x DGX Spark cluster.', model: 'GLM-5.2', hardware: '4x DGX Spark', type: 'vLLM TP4 recipe', lane: 'DGX Spark', stars: 76, lang: 'Python', pushed: '2026-07-25' },
  { name: 'Qwen3.8-Flash-Next-NVFP4-DGX-Spark', desc: 'Day-0 deployment of Qwen3.8-Flash-Next (NVFP4) on 2x DGX Spark TP2 via SGLang. Includes the SM121 QSA kernel guard.', model: 'Qwen3.8 Flash-Next', hardware: '2x DGX Spark', type: 'SGLang TP2 recipe', lane: 'DGX Spark', stars: 49, lang: 'Python', pushed: '2026-08-30' },
  { name: 'MiniMax-M3-2x-DGX-Spark-36-tok-s', desc: 'MiniMax-M3 (428B, no pruning) at 36 tok/s on 2x DGX Spark. W4A16 GPTQ + NVFP4 KV + EAGLE-3 speculative decoding.', model: 'MiniMax M3', hardware: '2x DGX Spark', type: 'vLLM TP2 recipe', lane: 'DGX Spark', stars: 45, lang: 'Docker', pushed: '2026-07-13' },
  { name: 'MiniMax-H3-Local', desc: 'Run MiniMax H3 locally: a full 15s clip with audio on a single RTX 3090. The fix is one flag.', model: 'MiniMax H3', hardware: '1x RTX 3090', type: 'ComfyUI video gen', lane: 'RTX 3090', stars: 42, lang: 'Shell', pushed: '2026-08-04' },
  { name: 'The-Sparky-Command-Center', desc: 'Plug-and-play, dependency-free web command center for DGX Spark fleets (and any GPU boxes): live per-node GPU telemetry, tok/s, TTFT, RoCE switch monitoring.', model: 'Any', hardware: 'Any GPU fleet', type: 'Fleet dashboard', lane: 'Tools', stars: 40, lang: 'Python', pushed: '2026-08-24' },
  { name: 'MiMo-V2.5-TP2-1M-NVFP4-KV-2xDGX-Spark', desc: 'MiMo-V2.5 Omni TP=2 on 2x DGX Spark. 1M context, NVFP4 4-bit KV (~1.97M-token pool), ~30 tok/s, 69-scenario eval.', model: 'MiMo-V2.5 Omni', hardware: '2x DGX Spark', type: 'vLLM TP2 recipe', lane: 'DGX Spark', stars: 40, lang: 'Python', pushed: '2026-07-13' },
  { name: 'GLM5.2-2bit-2-DGX-Spark--21.5tok-s', desc: 'GLM-5.2 with 2-bit experts and FP8 attention on two DGX Sparks. 21.5 tok/s.', model: 'GLM-5.2', hardware: '2x DGX Spark', type: 'TP2 recipe', lane: 'DGX Spark', stars: 40, lang: 'Python', pushed: '2026-07-17' },
  { name: 'DeepSeek-V4-Flash-2x-Spark-1M', desc: 'DeepSeek V4 Flash at 1M token context on 2x DGX Spark. Production-tested recipe (45 tok/s decode, real 800K prompts served).', model: 'DeepSeek V4 Flash', hardware: '2x DGX Spark', type: 'vLLM TP2 recipe', lane: 'DGX Spark', stars: 38, lang: 'Shell', pushed: '2026-07-13' },
  { name: 'GLM-5.3-Flash-NVFP4-1M-KV-4x-DGX-Spark', desc: 'GLM-5.3-Flash (320B MoE) at TP4 across four DGX Sparks, same day as the model drop. First TP4 glm5_next outside B200 hardware. Includes the GB10 memory study.', model: 'GLM-5.3 Flash', hardware: '4x DGX Spark', type: 'vLLM TP4 recipe', lane: 'DGX Spark', stars: 34, lang: 'Python', pushed: '2026-08-31' },
  { name: 'DS4-H3-Video-Gen-Factory', desc: 'Run DeepSeek-V4-Flash at full 1M context AND two MiniMax H3 video instances on the same two DGX Sparks. Benchmarked co-tenancy.', model: 'DeepSeek V4 Flash + MiniMax H3', hardware: '2x DGX Spark', type: 'Co-tenancy recipe', lane: 'DGX Spark', stars: 34, lang: 'Python', pushed: '2026-08-07' },
  { name: 'GLM-5.2-655K-MTP-4x-DGX-Spark---25-32tok-s', desc: 'GLM-5.2 at 655,360-token context + MTP spec decode (DCP4, fp8_ds_mla) on 4x DGX Spark.', model: 'GLM-5.2', hardware: '4x DGX Spark', type: 'vLLM TP4 · DCP4', lane: 'DGX Spark', stars: 31, lang: 'Shell', pushed: '2026-07-13' },
  { name: 'DeepSeek-v4-Flash-0731-Vision-DSpark-1M-NVFP4-KV-2x-DGX-Spark', desc: 'Give DeepSeek V4 Flash eyes. OpenAI-compatible shim + tiny local VLM. Point any harness at one URL.', model: 'DeepSeek V4 Flash 0731', hardware: '2x DGX Spark', type: 'Vision shim', lane: 'DGX Spark', stars: 31, lang: 'Python', pushed: '2026-08-09' },
  { name: '2Wild-Vision-Mode', desc: 'Give any blind LLM eyes, on any machine, in one shot. Tiny local VLM (Qwen3.5-0.8B) as an OpenAI-compatible endpoint.', model: 'Qwen3.5-0.8B VLM', hardware: 'Mac / NVIDIA / DGX Spark', type: 'Vision sidecar', lane: 'Agents', stars: 29, lang: 'Python', pushed: '2026-07-07' },
  { name: '2Wild-Coding-Agent-Latency-Monitor', desc: 'Live dashboard: fire N parallel streaming coding-agent runs at any OpenAI-compatible endpoint. Per-run TTFT and tok/s.', model: 'Any', hardware: 'Any endpoint', type: 'Benchmark tool', lane: 'Tools', stars: 25, lang: 'HTML', pushed: '2026-07-23' },
  { name: 'DeepSeek-v4-Flash-DSpark-60-tok-s-900K-ctx-2x-DGX-Spark', desc: 'Self-contained DeepSeek V4 Flash DSpark TP=2 recipe for 2x DGX Spark with 62 tok/s benchmark.', model: 'DeepSeek V4 Flash', hardware: '2x DGX Spark', type: 'vLLM TP2 recipe', lane: 'DGX Spark', stars: 24, lang: 'Python', pushed: '2026-07-13' },
  { name: 'Hy3-295B-NVFP4-MTP-2x-DGX-Spark', desc: 'Tencent Hunyuan 3 (295B MoE) on 2x DGX Spark: NVFP4 W4A16 + native MTP speculative decoding. First published recipe.', model: 'Hunyuan 3', hardware: '2x DGX Spark', type: 'vLLM TP2 recipe', lane: 'DGX Spark', stars: 19, lang: 'Shell', pushed: '2026-07-13' },
  { name: 'DeepSeek-Harness-Web-Tools', desc: 'Free, keyless web_search and web_fetch for the DeepSeek Harness (dsh). DuckDuckGo-backed, no signup.', model: 'Any (dsh)', hardware: 'Any', type: 'Agent plugin', lane: 'Agents', stars: 17, lang: 'Python', pushed: '2026-08-13' },
  { name: 'Qwen3.8-27B-DFLASH2-AutoRound-W4A16-2x3090', desc: 'Production Docker deployment for Qwen3.8-27B AutoRound W4A16 on 2x RTX 3090 (NVLink or PCIe). 101 tok/s real-agent decode.', model: 'Qwen3.8-27B', hardware: '2x RTX 3090', type: 'vLLM TP2 recipe', lane: 'RTX 3090', stars: 16, lang: 'Python', pushed: '2026-08-20' },
  { name: 'Minimax-M3-NVFP-3x-DGX-Sparks-TP-3', desc: 'MiniMax-M3 NVFP4 at tensor-parallel 3 across 3x DGX Spark with clean tool-calling.', model: 'MiniMax M3', hardware: '3x DGX Spark', type: 'vLLM TP3 recipe', lane: 'DGX Spark', stars: 16, lang: 'Shell', pushed: '2026-07-13' },
  { name: 'DGX-Spark-Hard-Poweroff-Fix', desc: 'DGX Spark (GB10) random hard power-off: how to diagnose the log-less crash signature and stop it with a GPU clock cap.', model: '—', hardware: 'DGX Spark', type: 'Hardware fix', lane: 'Tools', stars: 14, lang: 'Shell', pushed: '2026-08-16' },
  { name: 'DeepSeek-Harness-Browser', desc: 'An in-app browser pane for DeepSeek Harness. Real Chrome over CDP, plus rendered previews of local files.', model: 'Any (dsh)', hardware: 'Any', type: 'Agent plugin', lane: 'Agents', stars: 14, lang: 'JavaScript', pushed: '2026-08-21' },
  { name: 'GLM-5.2-NVFP4-KV-4x-DGX-Spark-300kctx-42tok-s', desc: 'GLM-5.2 744B with a true 4-bit NVFP4 KV cache on 4x DGX Spark: 42 tok/s peak, 317K-token KV pool (+58.6% vs fp8).', model: 'GLM-5.2', hardware: '4x DGX Spark', type: 'vLLM TP4 recipe', lane: 'DGX Spark', stars: 14, lang: 'Python', pushed: '2026-07-21' },
  { name: 'Qwen3.8-27B-NVFP4-DGX-Spark', desc: 'Reproducible Docker deployment for Qwen3.8-27B NVFP4 on a single DGX Spark via OpenAI-compatible vLLM.', model: 'Qwen3.8-27B', hardware: '1x DGX Spark', type: 'vLLM recipe', lane: 'DGX Spark', stars: 13, lang: 'Shell', pushed: '2026-08-14' },
  { name: 'DeepSeek-Harness-Vision-Tools', desc: 'Give the DeepSeek Harness (dsh) eyes with any text model + any vision model: a vision proxy for chat image attachments.', model: 'Any (dsh)', hardware: 'Any', type: 'Agent plugin', lane: 'Agents', stars: 12, lang: 'Python', pushed: '2026-08-21' },
  { name: 'DeepSeek-Harness-Tools', desc: 'A front door to community tools that extend the DeepSeek Harness (dsh): web access, vision, browser and more.', model: 'Any (dsh)', hardware: 'Any', type: 'Agent toolkit', lane: 'Agents', stars: 11, lang: 'Markdown', pushed: '2026-08-21' },
  { name: 'GLM-5.3-Int4-Int8Mix-TP4-4x-DGX-Spark', desc: 'First Int4-Int8Mix quantization of the full GLM-5.3 (743B), served on 4x DGX Spark at TP4. Quant scripts, verification gates, serving recipes.', model: 'GLM-5.3 (743B)', hardware: '4x DGX Spark', type: 'Quantization + recipe', lane: 'DGX Spark', stars: 10, lang: 'Python', pushed: '2026-08-29' },
  { name: 'GLM-5.3-DGX-Spark-Cookbook', desc: 'Index / recipe book for every GLM-5.3 (and GLM-5.2 foundation) serving recipe on DGX Spark.', model: 'GLM-5.3 / 5.2', hardware: 'DGX Spark', type: 'Cookbook', lane: 'DGX Spark', stars: 10, lang: 'Markdown', pushed: '2026-08-29' },
  { name: 'Eyes-Of-Kai', desc: 'A local-first AI companion that keeps watching while nobody is talking, so it can tell you what you were doing.', model: 'Local VLM', hardware: 'Any', type: 'Agent', lane: 'Agents', stars: 10, lang: 'JavaScript', pushed: '2026-07-29' },
  { name: 'Deepseek-V4-Flash-TP4-Plus-Minimax-H3-Cotenant-DGX-Spark', desc: 'Run DeepSeek-V4-Flash (TP=4, four DGX Sparks) AND MiniMax-H3 image/video on the SAME four GB10s.', model: 'DeepSeek V4 Flash + H3', hardware: '4x DGX Spark', type: 'Co-tenancy recipe', lane: 'DGX Spark', stars: 9, lang: 'Shell', pushed: '2026-08-24' },
  { name: 'Qwen3.8-27B-SGLang-vs-vLLM-2x3090', desc: 'Measured head-to-head: SGLang+DSpark vs vLLM+MTP serving Qwen3.8-27B on 2x RTX 3090. Same GPUs, same prompts.', model: 'Qwen3.8-27B', hardware: '2x RTX 3090', type: 'Engine benchmark', lane: 'RTX 3090', stars: 7, lang: 'Python', pushed: '2026-08-20' },
  { name: 'Qwen3.8-27B-3090-Cookbook', desc: 'Start here: every way to serve Qwen3.8-27B on RTX 3090 (TP2 DFlash2, TP4, SGLang vs vLLM, FP8) with the decision matrix.', model: 'Qwen3.8-27B', hardware: 'RTX 3090', type: 'Cookbook', lane: 'RTX 3090', stars: 7, lang: 'Markdown', pushed: '2026-08-20' },
  { name: 'Deepseek-V4-Flash-TP4-4x-DGX-Spark', desc: 'Serve DeepSeek-V4-Flash at tensor-parallel 4 across four DGX Sparks. 120 tok/s on predictable prompts, 402 tok/s aggregate at c6.', model: 'DeepSeek V4 Flash', hardware: '4x DGX Spark', type: 'vLLM TP4 recipe', lane: 'DGX Spark', stars: 6, lang: 'Shell', pushed: '2026-08-24' },
  { name: 'Qwen3.8-Flash-Next-Fleet-Deploy', desc: 'Day-0 deployment of Qwen3.8-Flash-Next two ways: NVFP4 on 2x DGX Spark (~52 tok/s) and GGUF on 4x RTX 3090.', model: 'Qwen3.8 Flash-Next', hardware: '2x Spark / 4x 3090', type: 'Fleet recipe', lane: 'DGX Spark', stars: 4, lang: 'Shell', pushed: '2026-08-26' },
  { name: 'Qwen38-Flash-Next-4x3090', desc: 'Qwen3.8-Flash-Next on 4x RTX 3090 via a llama.cpp PR build. 2 users at full 262K context, +45% agentic throughput with n-gram speculation.', model: 'Qwen3.8 Flash-Next', hardware: '4x RTX 3090', type: 'llama.cpp recipe', lane: 'RTX 3090', stars: 4, lang: 'Shell', pushed: '2026-08-26' },
  { name: 'Qwen3.8-27B-FP8-2x-3090', desc: 'Production Docker deployment for Qwen3.8-27B FP8 on 2x RTX 3090. Highest-fidelity tier.', model: 'Qwen3.8-27B', hardware: '2x RTX 3090', type: 'vLLM TP2 recipe', lane: 'RTX 3090', stars: 4, lang: 'Shell', pushed: '2026-08-14' },
  { name: '2Wild-Beast', desc: 'YOUR RIG, LIVE. Config-driven dashboard for any NVIDIA GPU box. Auto-detects GPUs and CPU temps.', model: 'Any', hardware: 'Any NVIDIA box', type: 'Dashboard', lane: 'Tools', stars: 4, lang: 'Python', pushed: '2026-06-19' },
  { name: 'Parakeet-STT-Gateway', desc: 'Private OpenAI-compatible speech-to-text gateway with local Parakeet and OpenAI backends.', model: 'Parakeet', hardware: 'Any', type: 'STT gateway', lane: 'Agents', stars: 3, lang: 'Python', pushed: '2026-07-11' },
  { name: 'Laguna-S-2.1-INT4-DFlash-4x-RTX3090-200-tok-s', desc: 'poolside Laguna-S-2.1 INT4 + DFlash speculative decoding on 4x RTX 3090: 200K context, 282 tok/s peak decode.', model: 'Laguna-S 2.1', hardware: '4x RTX 3090', type: 'vLLM TP4 recipe', lane: 'RTX 3090', stars: 2, lang: 'Python', pushed: '2026-07-22' },
  { name: 'NFS-Model-Weights', desc: 'Share one copy of a model checkpoint across N nodes over NFS instead of copying it to every node.', model: 'Any', hardware: 'Multi-node', type: 'Infra', lane: 'Tools', stars: 2, lang: 'Shell', pushed: '2026-07-31' },
  { name: '2Wild-Model-Eval', desc: 'Self-hosted tool-calling / reasoning benchmark harness: 69 scenarios across 15 categories, 138 points, Quality / Responsiveness / Deployability scores.', model: 'Any', hardware: 'Any endpoint', type: 'Eval harness', lane: 'Tools', stars: 2, lang: 'Python', pushed: '2026-08-20' },
  { name: 'Total-Recall', desc: 'Full conversation archiver for OpenClaw agents. Every word, every agent, timestamped and searchable forever.', model: 'Any', hardware: 'Any', type: 'Agent memory', lane: 'Agents', stars: 1, lang: 'Python', pushed: '2026-03-22' },
]
