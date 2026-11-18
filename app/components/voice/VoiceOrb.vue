<template>
  <div
    class="relative flex-none"
    :style="{ width: `${size}px`, height: `${size}px` }"
    role="img"
    :aria-label="label"
  >
    <canvas ref="canvas" class="block h-full w-full" />
  </div>
</template>

<script setup lang="ts">
type OrbState = 'idle' | 'speaking' | 'listening' | 'processing' | 'connecting' | 'error'

const props = withDefaults(defineProps<{
  state?: OrbState
  level?: number
  size?: number
  interactive?: boolean
}>(), {
  state: 'idle',
  level: 0,
  size: 220,
  interactive: false,
})

const labels: Record<OrbState, string> = {
  idle: 'Interviewer is idle',
  speaking: 'Interviewer is speaking',
  listening: 'You are speaking',
  processing: 'Interviewer is thinking',
  connecting: 'Connecting to the interviewer',
  error: 'The interviewer needs attention',
}

const label = computed(() => labels[props.state])

// State colours (RGB). The glass body and the particles both blend toward these.
const colours: Record<OrbState, [number, number, number]> = {
  idle: [30, 128, 255],
  speaking: [30, 128, 255],
  listening: [18, 19, 22],
  processing: [96, 150, 255],
  connecting: [146, 152, 163],
  error: [229, 72, 77],
}

interface Params {
  amp: number // surface deformation
  spin: number // rotation speed (rad/s)
  breathe: number // slow radial breathing
  rings: number // pulse ring intensity
  alpha: number // overall dot opacity
  shimmer: number // travelling highlight band (processing)
  scatter: number // dots drifting off the sphere (connecting)
}

const targets: Record<OrbState, Params> = {
  idle: { amp: 0.025, spin: 0.18, breathe: 0.03, rings: 0.35, alpha: 0.85, shimmer: 0, scatter: 0 },
  speaking: { amp: 0.11, spin: 0.38, breathe: 0.015, rings: 1, alpha: 1, shimmer: 0, scatter: 0 },
  listening: { amp: 0.04, spin: 0.3, breathe: 0.01, rings: 0.6, alpha: 1, shimmer: 0, scatter: 0 },
  processing: { amp: 0.02, spin: 1.3, breathe: 0.01, rings: 0, alpha: 0.9, shimmer: 1, scatter: 0 },
  connecting: { amp: 0.0, spin: 0.25, breathe: 0.0, rings: 0, alpha: 0.55, shimmer: 0, scatter: 1 },
  error: { amp: 0.0, spin: 0.05, breathe: 0.0, rings: 0.25, alpha: 0.75, shimmer: 0, scatter: 0 },
}

const canvas = ref<HTMLCanvasElement | null>(null)

let ctx: CanvasRenderingContext2D | null = null
let frame = 0
let last = 0
let time = 0
let rotation = 0
let energy = 0
let reducedMotion = false
let points: Array<[number, number, number, number]> = []
// Pointer-follow (interactive mode): target and eased look offsets in -1..1
let pointerX = 0
let pointerY = 0
let lookX = 0
let lookY = 0

function onPointer(event: PointerEvent) {
  const el = canvas.value
  if (!el) {
    return
  }
  const rect = el.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  pointerX = Math.max(-1, Math.min(1, (event.clientX - cx) / (window.innerWidth / 2)))
  pointerY = Math.max(-1, Math.min(1, (event.clientY - cy) / (window.innerHeight / 2)))
}

const current: Params = { ...targets.idle }
const colour: [number, number, number] = [...colours.idle]

function buildPoints() {
  const count = Math.round(Math.min(Math.max(props.size * 2.1, 260), 760))
  const golden = Math.PI * (3 - Math.sqrt(5))
  points = []
  for (let i = 0; i < count; i += 1) {
    const y = 1 - (i / (count - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = golden * i
    // fourth value is a stable per-point seed
    points.push([Math.cos(theta) * r, y, Math.sin(theta) * r, Math.random()])
  }
}

function resize() {
  const el = canvas.value
  if (!el) {
    return
  }
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  el.width = Math.round(props.size * dpr)
  el.height = Math.round(props.size * dpr)
  ctx = el.getContext('2d')
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
  buildPoints()
}

function lerp(a: number, b: number, k: number) {
  return a + (b - a) * k
}

// Voice energy: real level when provided, otherwise a speech-like envelope.
function targetEnergy(t: number) {
  const level = Math.min(Math.max(props.level, 0), 1)
  if (props.state === 'listening') {
    return Math.min(level * 2.2, 1)
  }
  if (props.state === 'speaking') {
    const syllables = Math.abs(Math.sin(t * 5.3)) * 0.55 + Math.abs(Math.sin(t * 2.1 + 1)) * 0.45
    const phrase = 0.55 + 0.45 * Math.sin(t * 0.9)
    return Math.max(level, syllables * phrase)
  }
  return 0
}

function draw(dt: number) {
  if (!ctx) {
    return
  }
  const size = props.size
  const c = size / 2
  const k = Math.min(dt * 4, 1)
  const target = targets[props.state]
  const tint = colours[props.state]

  for (const key of Object.keys(current) as Array<keyof Params>) {
    current[key] = lerp(current[key], target[key], k)
  }
  for (let i = 0; i < 3; i += 1) {
    colour[i] = lerp(colour[i], tint[i], k)
  }
  energy = lerp(energy, targetEnergy(time), Math.min(dt * 12, 1))

  rotation += current.spin * dt
  lookX = lerp(lookX, pointerX, Math.min(dt * 3, 1))
  lookY = lerp(lookY, pointerY, Math.min(dt * 3, 1))
  const [r, g, b] = colour.map(Math.round)
  const rgba = (a: number) => `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(a, 1)).toFixed(3)})`

  const baseRadius = size * 0.29
  const breath = 1 + Math.sin(time * 1.3) * current.breathe
  const swell = 1 + energy * 0.06
  const radius = baseRadius * breath * swell

  ctx.clearRect(0, 0, size, size)

  // Pulse rings: expand outward from the globe and fade.
  const ringStrength = current.rings * (props.state === 'idle' || props.state === 'error' ? 1 : 0.35 + energy)
  if (ringStrength > 0.01) {
    const period = props.state === 'idle' ? 4.2 : 2.4
    const count = 3
    for (let i = 0; i < count; i += 1) {
      const p = ((time / period) + i / count) % 1
      const rr = radius * (1.08 + p * 0.62)
      if (rr > c - 1) {
        continue
      }
      ctx.beginPath()
      ctx.arc(c, c, rr, 0, Math.PI * 2)
      ctx.lineWidth = 1.25
      ctx.strokeStyle = rgba((1 - p) * 0.45 * ringStrength)
      ctx.stroke()
    }
  }

  // Glass body: a glossy bubble lit from the top left, tinted by the state colour.
  const lx = c - radius * 0.38
  const ly = c - radius * 0.45
  const body = ctx.createRadialGradient(lx, ly, radius * 0.05, c, c, radius * 1.02)
  body.addColorStop(0, 'rgba(255, 255, 255, 0.95)')
  body.addColorStop(0.45, rgba(0.16 + energy * 0.08))
  body.addColorStop(1, rgba(0.42 + energy * 0.12))
  ctx.beginPath()
  ctx.arc(c, c, radius, 0, Math.PI * 2)
  ctx.fillStyle = body
  ctx.fill()

  // Specular highlight.
  const shine = ctx.createRadialGradient(lx, ly, 0, lx, ly, radius * 0.5)
  shine.addColorStop(0, 'rgba(255, 255, 255, 0.85)')
  shine.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.beginPath()
  ctx.arc(lx, ly, radius * 0.5, 0, Math.PI * 2)
  ctx.fillStyle = shine
  ctx.fill()

  // Thin halo outline that hugs the globe.
  ctx.beginPath()
  ctx.arc(c, c, radius * 1.04, 0, Math.PI * 2)
  ctx.lineWidth = 1
  ctx.strokeStyle = rgba(0.12 + energy * 0.2)
  ctx.stroke()

  // Processing: orbiting arc. Connecting: dashed spinner.
  if (current.shimmer > 0.05) {
    ctx.beginPath()
    const start = time * 2.4
    ctx.arc(c, c, radius * 1.22, start, start + Math.PI * 0.6)
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.strokeStyle = rgba(0.8 * current.shimmer)
    ctx.stroke()
  }
  if (current.scatter > 0.05) {
    ctx.save()
    ctx.translate(c, c)
    ctx.rotate(time * 1.6)
    ctx.setLineDash([3, 7])
    ctx.beginPath()
    ctx.arc(0, 0, radius * 1.22, 0, Math.PI * 2)
    ctx.lineWidth = 1.5
    ctx.strokeStyle = rgba(0.6 * current.scatter)
    ctx.stroke()
    ctx.restore()
  }

  // Particle globe.
  const tilt = 0.38 + lookY * 0.45
  const yaw = rotation + lookX * 0.9
  const cosT = Math.cos(tilt)
  const sinT = Math.sin(tilt)
  const cosR = Math.cos(yaw)
  const sinR = Math.sin(yaw)
  const amp = current.amp + energy * 0.16
  const dotBase = Math.max(size / 260, 0.7)

  for (const [px, py, pz, seed] of points) {
    // Organic surface deformation, driven by voice energy.
    const n = (
      Math.sin(px * 3.1 + time * 2.3)
      * Math.sin(py * 2.7 - time * 1.9)
      + Math.sin(pz * 3.7 + time * 1.4) * 0.5
    ) / 1.5
    let d = 1 + n * amp

    if (current.scatter > 0.01) {
      d += Math.sin(time * 2 + seed * 12) * 0.12 * current.scatter
    }

    // rotate around Y, then tilt around X
    const x1 = px * cosR - pz * sinR
    const z1 = px * sinR + pz * cosR
    const y2 = py * cosT - z1 * sinT
    const z2 = py * sinT + z1 * cosT

    const depth = (z2 + 1) / 2 // 0 back → 1 front
    const sx = c + x1 * radius * d
    const sy = c + y2 * radius * d

    let a = (0.06 + Math.pow(depth, 1.6) * 0.8) * current.alpha
    if (current.shimmer > 0.01) {
      const longitude = Math.atan2(z1, x1)
      const band = Math.max(0, Math.cos(longitude - time * 3))
      a *= 1 - current.shimmer * 0.55 + band * band * current.shimmer * 0.9
    }
    if (current.scatter > 0.01) {
      a *= 1 - current.scatter * 0.6 * (0.5 + 0.5 * Math.sin(time * 3 + seed * 20))
    }

    const dot = dotBase * (0.55 + depth * 0.95)
    ctx.beginPath()
    ctx.arc(sx, sy, dot, 0, Math.PI * 2)
    ctx.fillStyle = rgba(a)
    ctx.fill()
  }
}

function loop(now: number) {
  const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016
  last = now
  time += dt
  draw(dt)
  frame = requestAnimationFrame(loop)
}

function renderStatic() {
  // Reduced motion: settle on the target state and draw one still frame.
  Object.assign(current, targets[props.state])
  colour.splice(0, 3, ...colours[props.state])
  energy = props.state === 'speaking' ? 0.4 : 0
  draw(0)
}

onMounted(() => {
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  Object.assign(current, targets[props.state])
  colour.splice(0, 3, ...colours[props.state])
  resize()
  if (reducedMotion) {
    renderStatic()
  } else {
    frame = requestAnimationFrame(loop)
    if (props.interactive) {
      window.addEventListener('pointermove', onPointer, { passive: true })
    }
  }
})

watch(() => props.size, () => {
  resize()
  if (reducedMotion) {
    renderStatic()
  }
})

watch(() => props.state, () => {
  if (reducedMotion) {
    renderStatic()
  }
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  window.removeEventListener('pointermove', onPointer)
})
</script>
