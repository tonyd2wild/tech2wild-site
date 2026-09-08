import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Edges, Float, Grid } from '@react-three/drei'
import * as THREE from 'three'

type Vec = [number, number, number]

const SPARKS: Vec[] = [[-3.3, 0.7, -1.2], [-1.1, 1.05, -2.4], [1.1, 1.05, -2.4], [3.3, 0.7, -1.2]]
const GPUS: Vec[] = [[-2.5, -1.15, 1.3], [-0.85, -1.35, 1.9], [0.85, -1.35, 1.9], [2.5, -1.15, 1.3]]
const HUB: Vec = [0, -0.05, 0]

const ACID = new THREE.Color('#c8ff3d')
const EMBER = new THREE.Color('#ff7a1a')
const SKY = new THREE.Color('#4fa3ff')

interface Link { a: Vec; b: Vec; color: THREE.Color; speed: number }
const LINKS: Link[] = [
  ...SPARKS.map((s) => ({ a: s, b: HUB, color: ACID, speed: 0.22 })),
  ...GPUS.map((g) => ({ a: HUB, b: g, color: EMBER, speed: 0.28 })),
  { a: SPARKS[0], b: SPARKS[1], color: SKY, speed: 0.35 },
  { a: SPARKS[2], b: SPARKS[3], color: SKY, speed: 0.35 },
  { a: SPARKS[1], b: SPARKS[2], color: SKY, speed: 0.3 },
]

function SparkNode({ position, delay }: { position: Vec; delay: number }) {
  return (
    <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.35} floatingRange={[-0.08, 0.08]}>
      <group position={position}>
        <mesh>
          <boxGeometry args={[1.05, 0.42, 1.05]} />
          <meshStandardMaterial color="#111317" metalness={0.7} roughness={0.32} />
          <Edges color="#c8ff3d" threshold={15} />
        </mesh>
        <mesh position={[0, 0.215, 0]}>
          <boxGeometry args={[0.8, 0.005, 0.8]} />
          <meshBasicMaterial color="#1c1f24" />
        </mesh>
        <Led position={[0.42, 0.06, 0.53]} color={ACID} delay={delay} />
      </group>
    </Float>
  )
}

function GpuNode({ position, delay }: { position: Vec; delay: number }) {
  return (
    <Float speed={0.9} rotationIntensity={0.1} floatIntensity={0.3} floatingRange={[-0.06, 0.06]}>
      <group position={position} rotation={[0, 0.3, 0]}>
        <mesh>
          <boxGeometry args={[1.5, 0.12, 0.62]} />
          <meshStandardMaterial color="#141416" metalness={0.75} roughness={0.28} />
          <Edges color="#ff7a1a" threshold={15} />
        </mesh>
        {[-0.42, 0.02, 0.46].map((x, i) => (
          <mesh key={i} position={[x, 0.066, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.13, 0.2, 24]} />
            <meshBasicMaterial color="#2a2c31" side={THREE.DoubleSide} />
          </mesh>
        ))}
        <Led position={[0.7, 0.03, 0.33]} color={EMBER} delay={delay} />
      </group>
    </Float>
  )
}

function Led({ position, color, delay }: { position: Vec; color: THREE.Color; delay: number }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const m = ref.current.material as THREE.MeshBasicMaterial
    m.opacity = 0.55 + 0.45 * Math.abs(Math.sin(clock.elapsedTime * 2.2 + delay))
  })
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.035, 10, 10]} />
      <meshBasicMaterial color={color} transparent />
    </mesh>
  )
}

function Hub() {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.elapsedTime * 0.35
    ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.5) * 0.25
  })
  return (
    <group ref={ref} position={HUB}>
      <mesh>
        <octahedronGeometry args={[0.55, 0]} />
        <meshBasicMaterial color="#4fa3ff" wireframe transparent opacity={0.8} />
      </mesh>
      <mesh>
        <octahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial color="#4fa3ff" emissive="#4fa3ff" emissiveIntensity={1.4} />
      </mesh>
    </group>
  )
}

function Streams({ perLink }: { perLink: number }) {
  const total = LINKS.length * perLink
  const { positions, colors, offsets, linkIdx } = useMemo(() => {
    const positions = new Float32Array(total * 3)
    const colors = new Float32Array(total * 3)
    const offsets = new Float32Array(total)
    const linkIdx = new Uint16Array(total)
    let i = 0
    LINKS.forEach((l, li) => {
      for (let k = 0; k < perLink; k++, i++) {
        offsets[i] = Math.random()
        linkIdx[i] = li
        colors[i * 3] = l.color.r; colors[i * 3 + 1] = l.color.g; colors[i * 3 + 2] = l.color.b
      }
    })
    return { positions, colors, offsets, linkIdx }
  }, [perLink, total])
  const geo = useRef<THREE.BufferGeometry>(null)
  const tmp = useMemo(() => new THREE.Vector3(), [])
  useFrame(({ clock }) => {
    const g = geo.current
    if (!g) return
    const attr = g.getAttribute('position') as THREE.BufferAttribute
    const arr = attr.array as Float32Array
    const t = clock.elapsedTime
    for (let i = 0; i < total; i++) {
      const l = LINKS[linkIdx[i]]
      const p = (offsets[i] + t * l.speed) % 1
      const wob = Math.sin(p * Math.PI) * 0.18
      tmp.set(
        l.a[0] + (l.b[0] - l.a[0]) * p + Math.sin(t * 1.3 + offsets[i] * 12) * 0.05 * wob,
        l.a[1] + (l.b[1] - l.a[1]) * p + wob * 0.6 + Math.cos(t * 1.1 + offsets[i] * 9) * 0.05,
        l.a[2] + (l.b[2] - l.a[2]) * p + Math.cos(t * 0.9 + offsets[i] * 7) * 0.05 * wob,
      )
      arr[i * 3] = tmp.x; arr[i * 3 + 1] = tmp.y; arr[i * 3 + 2] = tmp.z
    }
    attr.needsUpdate = true
  })
  return (
    <points>
      <bufferGeometry ref={geo}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.045} vertexColors transparent opacity={0.95} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  )
}

function Lines() {
  const geo = useMemo(() => {
    const pts: number[] = []
    LINKS.forEach((l) => pts.push(...l.a, ...l.b))
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
    return g
  }, [])
  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color="#2a2d33" transparent opacity={0.8} />
    </lineSegments>
  )
}

function Dust({ count }: { count: number }) {
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      a[i * 3] = (Math.random() - 0.5) * 22
      a[i * 3 + 1] = (Math.random() - 0.5) * 12
      a[i * 3 + 2] = (Math.random() - 0.5) * 16 - 3
    }
    return a
  }, [count])
  const ref = useRef<THREE.Points>(null)
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.012 })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#8a8f99" transparent opacity={0.5} sizeAttenuation depthWrite={false} />
    </points>
  )
}

function Rig({ tier }: { tier: 1 | 2 }) {
  const group = useRef<THREE.Group>(null)
  const light = useRef<THREE.PointLight>(null)
  const { pointer, size } = useThree()
  const fit = Math.min(1, Math.max(0.5, size.width / size.height / 1.55))
  useFrame((_, dt) => {
    if (!group.current) return
    const k = Math.min(1, dt * 3)
    group.current.scale.setScalar(fit)
    group.current.position.y = (1 - fit) * -0.6
    group.current.rotation.y += ((pointer.x * 0.22) - group.current.rotation.y) * k
    group.current.rotation.x += ((-pointer.y * 0.12) - group.current.rotation.x) * k
    if (light.current) {
      light.current.position.x += (pointer.x * 5 - light.current.position.x) * k
      light.current.position.y += (pointer.y * 3 + 1.5 - light.current.position.y) * k
    }
  })
  return (
    <group ref={group}>
      <pointLight ref={light} position={[0, 2, 3]} intensity={18} color="#c8ff3d" distance={12} decay={2} />
      <pointLight position={[-4, -2, 3]} intensity={10} color="#ff7a1a" distance={10} decay={2} />
      <pointLight position={[4, 3, -2]} intensity={6} color="#4fa3ff" distance={10} decay={2} />
      <ambientLight intensity={0.35} />
      {SPARKS.map((p, i) => <SparkNode key={i} position={p} delay={i * 1.3} />)}
      {GPUS.map((p, i) => <GpuNode key={i} position={p} delay={i * 0.9 + 2} />)}
      <Hub />
      <Lines />
      <Streams perLink={tier === 2 ? 150 : 60} />
      <Dust count={tier === 2 ? 1400 : 500} />
      <Grid
        position={[0, -2.4, 0]} args={[40, 40]} cellSize={0.6} cellThickness={0.6} cellColor="#1d1f24"
        sectionSize={3} sectionThickness={1} sectionColor="#2a2d34" fadeDistance={22} fadeStrength={1.6} infiniteGrid
      />
    </group>
  )
}

export default function HeroScene({ tier, active }: { tier: 1 | 2; active: boolean }) {
  return (
    <Canvas
      dpr={[1, tier === 2 ? 1.75 : 1.2]}
      camera={{ position: [0, 0.7, 8.2], fov: 38, near: 0.1, far: 60 }}
      gl={{ antialias: tier === 2, powerPreference: 'high-performance', alpha: true }}
      frameloop={active ? 'always' : 'never'}
      style={{ position: 'absolute', inset: 0 }}
      eventSource={typeof document !== 'undefined' ? document.body : undefined}
      eventPrefix="client"
    >
      <fog attach="fog" args={['#070708', 7, 18]} />
      <Rig tier={tier} />
    </Canvas>
  )
}
