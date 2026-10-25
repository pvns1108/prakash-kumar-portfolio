import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export const EASE = [0.16, 1, 0.3, 1]

/** Scroll-triggered fade + rise. */
export function Reveal({ children, delay = 0, y = 28, className = '', as = 'div', once = true, amount = 0.15, ...rest }) {
  const Tag = motion[as] ?? motion.div
  return (
    <Tag
      {...rest}
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </Tag>
  )
}

/**
 * Masked line reveal — text slides up from behind a clip.
 *
 * The visibility check watches the OUTER (clipping) span, which is always
 * on screen. Watching the inner text would never fire, because it starts
 * pushed below the clip and so never counts as visible.
 */
export function LineReveal({ children, delay = 0, className = '', inView = true }) {
  const ref = useRef(null)
  const seen = useInView(ref, { once: true, amount: 0.2 })
  const show = inView ? seen : true

  return (
    <span ref={ref} className={`block overflow-hidden pb-[0.06em] ${className}`}>
      <motion.span
        className="block will-change-transform"
        initial={{ y: '110%' }}
        animate={{ y: show ? '0%' : '110%' }}
        transition={{ duration: 1.1, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  )
}

/** Scroll to a section id smoothly. */
export function scrollToId(id) {
  const el = document.getElementById(id)
  if (!el) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  history.replaceState(null, '', `#${id}`)
}
