import { useEffect, useRef, useState } from 'react'
import { RotateCcw } from 'lucide-react'

/**
 * "Break it if you can. It still ships." — a tiny brick-breaker where the
 * bricks spell HELLO WORLD in a 5×7 pixel font. Pointer / touch / arrow keys
 * move the paddle; click or Space launches the ball.
 */

const FONT = {
  H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  W: ['10001', '10001', '10001', '10101', '10101', '11011', '10001'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
}
const LINES = ['HELLO', 'WORLD']

export default function HelloWorld() {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const api = useRef({})
  const [state, setState] = useState('idle') // idle | playing | won

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let W = 0
    let H = 0
    let raf = 0
    let visible = false
    let bricks = []
    let size = 10
    let mode = 'idle'
    const paddle = { x: 0, w: 120, h: 9, y: 0, target: 0 }
    const ball = { x: 0, y: 0, vx: 0, vy: 0, r: 6 }
    const keys = { left: false, right: false }

    const setMode = (m) => {
      mode = m
      setState(m)
    }

    const layout = (keepBricks) => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      const rect = canvas.getBoundingClientRect()
      const prevW = W || rect.width
      W = rect.width
      H = rect.height
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const cols = 5 * 5 + 4
      size = Math.min((W * (W < 640 ? 0.86 : 0.5)) / cols, (H * 0.5) / 16)
      const textW = cols * size
      const x0 = (W - textW) / 2
      const y0 = H * 0.1
      const alive = keepBricks ? new Set(bricks.filter((b) => b.alive).map((b) => b.key)) : null
      bricks = []
      LINES.forEach((word, li) => {
        word.split('').forEach((ch, ci) => {
          FONT[ch].forEach((row, ry) => {
            row.split('').forEach((bit, rx) => {
              if (bit !== '1') return
              const key = `${li}-${ci}-${rx}-${ry}`
              bricks.push({
                key,
                x: x0 + (ci * 6 + rx) * size,
                y: y0 + (li * 9 + ry) * size,
                alive: alive ? alive.has(key) : true,
                fade: alive && !alive.has(key) ? 0 : 1,
              })
            })
          })
        })
      })
      paddle.w = Math.max(90, Math.min(190, W * 0.14))
      paddle.y = H - 46
      paddle.x = paddle.x ? (paddle.x / prevW) * W : W / 2
      paddle.target = paddle.x
      ball.r = Math.max(5, size * 0.32)
      if (mode !== 'playing') resetBall()
    }

    const resetBall = () => {
      ball.x = paddle.x
      ball.y = paddle.y - ball.r - 30
      ball.vx = 0
      ball.vy = 0
    }

    const launch = () => {
      if (mode === 'won') {
        reset()
        return
      }
      if (mode === 'playing') return
      const speed = Math.max(5, H / 120)
      const angle = (-Math.PI / 2) + (Math.random() - 0.5) * 0.8
      ball.vx = Math.cos(angle) * speed
      ball.vy = Math.sin(angle) * speed
      setMode('playing')
    }

    const reset = () => {
      bricks.forEach((b) => {
        b.alive = true
        b.fade = 1
      })
      setMode('idle')
      resetBall()
    }

    api.current = { launch, reset }

    const step = () => {
      if (keys.left) paddle.target -= 12
      if (keys.right) paddle.target += 12
      paddle.target = Math.max(paddle.w / 2, Math.min(W - paddle.w / 2, paddle.target))
      paddle.x += (paddle.target - paddle.x) * 0.35

      if (mode !== 'playing') {
        ball.x = paddle.x
        return
      }
      // sub-steps keep the ball from tunnelling through bricks
      const sub = 3
      for (let s = 0; s < sub; s++) {
        ball.x += ball.vx / sub
        ball.y += ball.vy / sub
        if (ball.x < ball.r || ball.x > W - ball.r) {
          ball.vx *= -1
          ball.x = Math.max(ball.r, Math.min(W - ball.r, ball.x))
        }
        if (ball.y < ball.r) {
          ball.vy = Math.abs(ball.vy)
        }
        // paddle
        if (
          ball.vy > 0 &&
          ball.y + ball.r >= paddle.y &&
          ball.y + ball.r <= paddle.y + paddle.h + 8 &&
          Math.abs(ball.x - paddle.x) <= paddle.w / 2 + ball.r
        ) {
          const hit = (ball.x - paddle.x) / (paddle.w / 2)
          const speed = Math.hypot(ball.vx, ball.vy) * 1.01
          const angle = -Math.PI / 2 + hit * 1.05
          ball.vx = Math.cos(angle) * speed
          ball.vy = Math.sin(angle) * speed
          ball.y = paddle.y - ball.r
        }
        // bricks
        const bs = size * 0.78
        for (const b of bricks) {
          if (!b.alive) continue
          const cx = Math.max(b.x, Math.min(ball.x, b.x + bs))
          const cy = Math.max(b.y, Math.min(ball.y, b.y + bs))
          const dx = ball.x - cx
          const dy = ball.y - cy
          if (dx * dx + dy * dy <= ball.r * ball.r) {
            b.alive = false
            if (Math.abs(dx) > Math.abs(dy)) ball.vx *= -1
            else ball.vy *= -1
            break
          }
        }
      }
      if (ball.y - ball.r > H) {
        setMode('idle')
        resetBall()
      }
      if (bricks.every((b) => !b.alive)) {
        setMode('won')
        resetBall()
      }
    }

    const render = () => {
      ctx.clearRect(0, 0, W, H)
      const bs = size * 0.78
      ctx.fillStyle = '#f2f1ec'
      for (const b of bricks) {
        if (!b.alive && b.fade > 0) b.fade = Math.max(0, b.fade - 0.06)
        const a = b.alive ? 1 : b.fade
        if (a <= 0) continue
        ctx.globalAlpha = a
        const grow = b.alive ? 0 : (1 - a) * bs * 0.4
        ctx.fillRect(b.x - grow / 2, b.y - grow / 2, bs + grow, bs + grow)
      }
      ctx.globalAlpha = 1
      // paddle
      const r = paddle.h / 2
      ctx.beginPath()
      ctx.roundRect(paddle.x - paddle.w / 2, paddle.y, paddle.w, paddle.h, r)
      ctx.fill()
      // ball
      ctx.beginPath()
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2)
      ctx.fill()
    }

    const loop = () => {
      raf = requestAnimationFrame(loop)
      if (!visible) return
      step()
      render()
    }

    const onPointer = (e) => {
      const r = canvas.getBoundingClientRect()
      paddle.target = e.clientX - r.left
    }
    const onKey = (e, down) => {
      if (!visible) return
      if (e.key === 'ArrowLeft') keys.left = down
      else if (e.key === 'ArrowRight') keys.right = down
      else if (down && e.key === ' ' && document.activeElement === canvas) {
        e.preventDefault()
        launch()
      } else return
      if (document.activeElement === canvas) e.preventDefault()
    }
    const kd = (e) => onKey(e, true)
    const ku = (e) => onKey(e, false)

    layout(false)
    const ro = new ResizeObserver(() => layout(true))
    ro.observe(canvas)
    const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting), { threshold: 0.1 })
    io.observe(canvas)
    canvas.addEventListener('pointermove', onPointer)
    canvas.addEventListener('pointerdown', onPointer)
    window.addEventListener('keydown', kd)
    window.addEventListener('keyup', ku)
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      canvas.removeEventListener('pointermove', onPointer)
      canvas.removeEventListener('pointerdown', onPointer)
      window.removeEventListener('keydown', kd)
      window.removeEventListener('keyup', ku)
    }
  }, [])

  return (
    <section ref={wrapRef} aria-label="Hello World mini game" className="relative bg-ink pb-10 pt-16 md:pt-24">
      <div className="container-x relative flex items-start justify-between">
        <p className="border-b border-bone/70 pb-1 text-[0.78rem] font-medium text-bone">Break it if you can. It still ships.</p>
        <button
          type="button"
          onClick={() => api.current.reset?.()}
          className="group flex h-9 items-center gap-1.5 px-2"
          aria-label="Reset the bricks"
          title="Reset"
        >
          <span className="flex gap-1 group-hover:hidden" aria-hidden="true">
            {[0, 1, 2].map((d) => (
              <span key={d} className="h-1.5 w-1.5 rounded-full bg-bone" />
            ))}
          </span>
          <RotateCcw size={15} className="hidden text-bone group-hover:block" aria-hidden="true" />
        </button>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          tabIndex={0}
          onClick={() => api.current.launch?.()}
          className="block h-[min(88vh,820px)] min-h-[440px] w-full cursor-none touch-pan-y outline-none"
          aria-label="Brick breaker spelling HELLO WORLD. Move the pointer or use the arrow keys to steer the paddle; click or press Space to launch."
        />
        {state !== 'playing' && (
          <div className="pointer-events-none absolute inset-x-0 bottom-20 flex justify-center md:justify-end md:pr-[12%]">
            <button type="button" onClick={() => api.current.launch?.()} className="btn-box pointer-events-auto bg-ink/60 px-4 tracking-[0.3em]">
              {state === 'won' ? 'Shipped — again?' : 'Play'}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
