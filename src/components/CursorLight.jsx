import { useEffect, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'

/** Soft light that follows the pointer — desktop / fine pointers only. */
export default function CursorLight() {
  const reduce = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const x = useMotionValue(-600)
  const y = useMotionValue(-600)
  const sx = useSpring(x, { stiffness: 120, damping: 25, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 120, damping: 25, mass: 0.6 })

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine) and (min-width: 1024px)')
    const update = () => setEnabled(mq.matches)
    update()
    mq.addEventListener?.('change', update)
    return () => mq.removeEventListener?.('change', update)
  }, [])

  useEffect(() => {
    if (!enabled || reduce) return
    const move = (e) => {
      x.set(e.clientX - 300)
      y.set(e.clientY - 300)
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [enabled, reduce, x, y])

  if (!enabled || reduce) return null
  return (
    <motion.div
      aria-hidden="true"
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[2] h-[600px] w-[600px] rounded-full bg-[radial-gradient(closest-side,rgba(255,110,70,0.10),transparent_70%)] mix-blend-screen"
    />
  )
}
