# Tech2Wild — Local AI Laboratory site

Premium single-page site for **Tech2Wild** (the digital side of TonyD2WiLD): local AI, DGX Spark clusters, multi-GPU rigs, open models, agentic systems and benchmarks.

Everything on the page is sourced from Tech2Wild's public presence as of 2026-09-01: the YouTube channel (`@tech2wild1`), the X account (`@Tech2Wild`), the `tonyd2wild` GitHub repositories and their README benchmarks, and the `2wild4tv` Hugging Face weights. No numbers, projects or quotes are invented.

## Stack

- Vite 5 + React 18 + TypeScript
- Three.js via React Three Fiber + drei (hero compute-cluster scene, lazy-loaded chunk)
- GSAP + ScrollTrigger (reveals, parallax, pinned manifesto)
- Lenis smooth scrolling
- Plain CSS with design tokens (`src/styles/global.css`), one stylesheet per section

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:5173>.

Production build and preview:

```bash
npm run build
npm run preview
```

## Structure

```
src/
  data/         all real content: deployments, videos, X posts, repos, lab nodes, experiments
  three/        HeroScene.tsx — R3F cluster (4 Sparks, 4 GPUs, RoCE hub, particle streams)
  components/   Preloader, Nav, Cursor, MagneticButton, Reveal, Counter, Marquee, SectionHead
  sections/     Hero, Ticker, Lab, Models, Benchmarks, Experiments, Videos, Feed, Manifesto, Repos, Footer
  hooks/        useLenis (Lenis + ScrollTrigger sync), useMotion (reduced-motion / perf tier), useInView
```

## Performance and accessibility

- `prefers-reduced-motion`: preloader, Lenis, the WebGL scene and all scroll animations are disabled; content renders immediately.
- Perf tier: mobile or low-core/low-memory devices get fewer particles, lower DPR and no antialiasing; the canvas stops rendering when the hero leaves the viewport.
- Custom cursor and magnetic buttons only on fine pointers.
- Thumbnails are hot-linked from YouTube with a lazy `loading` attribute and a fallback resolution.
- A ResizeObserver refreshes ScrollTrigger whenever the document height changes (filters, expanded lists).

## Updating content

Edit the files in `src/data/`. Each deployment, video, post and repo is a plain object; hardware colors and model-family accents live in `src/data/models.ts`.
