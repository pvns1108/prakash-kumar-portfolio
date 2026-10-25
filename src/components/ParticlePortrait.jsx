import { useEffect, useRef } from 'react'

/**
 * Particle / mosaic portrait drawn on a canvas.
 *
 * The photo is sampled into a grid; every visible cell becomes a square
 * particle. Particles fly in from scattered dust, swirl away from the
 * pointer, and dissolve upwards as the hero scrolls out of view.
 *
 * - `cutout`: transparent PNG of the subject (preferred, alpha is used)
 * - `mask`:   soft silhouette used when there is no cut-out
 */

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const easeOut = (t) => 1 - Math.pow(1 - t, 3)

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/** Sample the image into a cols×rows grid of {alpha, luminance}. */
function sample(img, cols, rows, mask, useAlpha) {
  const c = document.createElement('canvas')
  c.width = cols
  c.height = rows
  const x = c.getContext('2d', { willReadFrequently: true })
  x.drawImage(img, 0, 0, cols, rows)

  if (!useAlpha && mask) {
    // soft silhouette → keep only the subject
    const m = document.createElement('canvas')
    m.width = cols
    m.height = rows
    const mx = m.getContext('2d')
    mx.filter = `blur(${Math.max(1, cols / 70)}px)`
    mx.fillStyle = '#fff'
    const { head, body } = mask
    mx.beginPath()
    mx.ellipse(head.cx * cols, head.cy * rows, head.rx * cols, head.ry * rows, 0, 0, Math.PI * 2)
    mx.fill()
    mx.beginPath()
    body.forEach(([px, py], i) => (i ? mx.lineTo(px * cols, py * rows) : mx.moveTo(px * cols, py * rows)))
    mx.closePath()
    mx.fill()
    x.globalCompositeOperation = 'destination-in'
    x.drawImage(m, 0, 0)
  }
  const img_ = x.getImageData(0, 0, cols, rows)
  const d = img_.data
  if (!useAlpha) {
    // Drop background-coloured pixels the silhouette still lets through:
    // saturated orange/red brick and green foliage. Skin (warmer, less
    // saturated) and the navy suit survive.
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i], g = d[i + 1], b = d[i + 2]
      const brick = r > 80 && g / r < 0.66 && b / r < 0.62 ? clamp((0.7 - g / r) * 6) : 0
      const leaf = g > r * 1.05 && g > b * 1.05 ? clamp((g / Math.max(r, 1) - 1) * 4) : 0
      d[i + 3] *= 1 - Math.max(brick, leaf)
    }
  }
  // Auto-level the subject so the face reads bright and the suit falls to halftone.
  const lums = []
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] > 60) lums.push(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2])
  }
  lums.sort((a, b) => a - b)
  const lo = lums[Math.floor(lums.length * 0.04)] ?? 0
  const hi = lums[Math.floor(lums.length * 0.985)] ?? 255
  const span = Math.max(20, hi - lo)
  for (let i = 0; i < d.length; i += 4) {
    const k = 255 / span
    d[i] = clamp((d[i] - lo) * k, 0, 255)
    d[i + 1] = clamp((d[i + 1] - lo) * k, 0, 255)
    d[i + 2] = clamp((d[i + 2] - lo) * k, 0, 255)
  }
  return d
}

export default function ParticlePortrait({ src, cutout, mask, active, scrollRef, className = '' }) {
  const canvasRef = useRef(null)
  const activeRef = useRef(active)
  activeRef.current = active

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let img = null
    let particles = []
    let W = 0
    let H = 0
    let cell = 6
    let raf = 0
    let visible = true
    let startT = null
    let built = false
    const pointer = { x: -9999, y: -9999, vx: 0, vy: 0 }

    const build = (assembled) => {
      if (!img) return
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      const rect = canvas.getBoundingClientRect()
      W = rect.width
      H = rect.height
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const ratio = img.width / img.height
      // slightly taller than the stage so the crop sits at the chest, like the reference
      let ph = H * 1.32
      let pw = ph * ratio
      if (pw > W * 1.25) {
        pw = W * 1.25
        ph = pw / ratio
      }
      const ox = (W - pw) / 2
      const oy = H * 0.01
      cell = clamp(pw / 104, 4, 9)
      const cols = Math.floor(pw / cell)
      const rows = Math.floor(ph / cell)
      const data = sample(img, cols, rows, mask, Boolean(cutout))

      const list = []
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = (r * cols + c) * 4
          const a = data[i + 3] / 255
          if (a < 0.15) continue
          const lum = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255
          // shadows (the dark suit) keep a faint halftone floor instead of vanishing
          const v = (0.22 + 0.78 * Math.pow(clamp((lum - 0.08) / 0.7), 1.3)) * a
          if (v < 0.09) continue
          const hx = ox + c * cell + cell / 2
          const hy = oy + r * cell + cell / 2
          const rnd = Math.random()
          // glittery cool tones in the highlights, neutral grey dots in the shadows
          let color
          if (v > 0.42) {
            const hue = 222 + Math.round(rnd * 4) * 8
            const light = 62 + Math.round(v * 4) * 7
            color = `hsl(${hue} 70% ${light}%)`
          } else {
            const g = 120 + Math.round(v * 6) * 18
            color = `rgb(${g} ${g} ${g + 12})`
          }
          const angle = Math.random() * Math.PI * 2
          const sx = assembled ? hx : Math.random() * W
          const sy = assembled ? hy : Math.random() * H * 0.9
          list.push({
            hx,
            hy,
            x: sx,
            y: sy,
            vx: 0,
            vy: 0,
            v,
            rnd,
            color,
            phase: Math.random() * Math.PI * 2,
            dx: Math.cos(angle),
            dy: Math.sin(angle) - 0.6,
            delay: Math.random() * 0.7 + (r / rows) * 0.5,
          })
        }
      }
      // group by colour so fillStyle changes stay few
      list.sort((a, b) => (a.color < b.color ? -1 : 1))
      particles = list
      built = true
    }

    const dissolve = () => {
      const el = scrollRef?.current
      if (!el) return 0
      const r = el.getBoundingClientRect()
      return clamp(-r.top / (r.height * 0.75))
    }

    const draw = (now) => {
      raf = requestAnimationFrame(draw)
      if (!visible || !built || !activeRef.current) return
      if (startT === null) startT = now
      const t = (now - startT) / 1000
      const dis = reduce ? 0 : dissolve()
      ctx.clearRect(0, 0, W, H)

      const R = Math.max(70, W * 0.07)
      const R2 = R * R
      pointer.vx *= 0.9
      pointer.vy *= 0.9
      let lastColor = ''

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        const e = reduce ? 1 : easeOut(clamp((t - p.delay) / 1.8))
        const spread = dis * dis * (260 + p.rnd * 420)
        const tx = p.hx + p.dx * spread
        const ty = p.hy + p.dy * spread - dis * 80

        if (reduce) {
          p.x = tx
          p.y = ty
        } else {
          const k = 0.006 + 0.07 * e
          p.vx += (tx - p.x) * k
          p.vy += (ty - p.y) * k
          if (e < 1) {
            // drifting dust before it settles
            p.vx += Math.sin(t * 1.3 + p.phase) * 0.06 * (1 - e)
            p.vy += Math.cos(t * 1.1 + p.phase) * 0.06 * (1 - e)
          }
          const mx = p.x - pointer.x
          const my = p.y - pointer.y
          const d2 = mx * mx + my * my
          if (d2 < R2) {
            const d = Math.sqrt(d2) || 1
            const f = (1 - d / R) * 2.2
            // push out + swirl around the cursor
            p.vx += (mx / d) * f + (-my / d) * f * 0.9 + pointer.vx * 0.04
            p.vy += (my / d) * f + (mx / d) * f * 0.9 + pointer.vy * 0.04
          }
          p.vx *= 0.84
          p.vy *= 0.84
          p.x += p.vx
          p.y += p.vy
        }

        const tw = 0.82 + 0.18 * Math.sin(t * 2.4 + p.phase)
        const alpha = p.v * (0.25 + 0.75 * e) * tw * (1 - dis * 0.85)
        if (alpha < 0.02) continue
        if (p.color !== lastColor) {
          ctx.fillStyle = p.color
          lastColor = p.color
        }
        ctx.globalAlpha = Math.min(1, alpha * 1.15)
        const s = cell * (0.32 + 0.6 * p.v) * (e < 1 ? 0.6 + 0.4 * e : 1)
        ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s)
      }
      ctx.globalAlpha = 1
    }

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      if (pointer.x > -999) {
        pointer.vx = x - pointer.x
        pointer.vy = y - pointer.y
      }
      pointer.x = x
      pointer.y = y
    }
    const onLeave = () => {
      pointer.x = -9999
      pointer.y = -9999
    }

    let resizeT
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeT)
      resizeT = setTimeout(() => build(startT !== null), 120)
    })
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting))

    loadImage(cutout || src)
      .then((loaded) => {
        img = loaded
        build(false)
        ro.observe(canvas)
        io.observe(canvas)
        raf = requestAnimationFrame(draw)
      })
      .catch(() => {
        /* image missing — the hero simply shows without the portrait */
      })

    if (!reduce) {
      window.addEventListener('pointermove', onMove, { passive: true })
      document.addEventListener('pointerleave', onLeave)
    }
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      clearTimeout(resizeT)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [src, cutout, mask, scrollRef])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
