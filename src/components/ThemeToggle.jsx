import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { motion, useAnimationControls } from 'framer-motion'
import { Lightbulb } from 'lucide-react'

const THEME_COLOR = { dark: '#08090c', light: '#f3efe7' }

function currentTheme() {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme])
  try {
    localStorage.setItem('theme', theme)
  } catch {
    /* storage blocked — the switch still works for this visit */
  }
}

/**
 * The bulb: off in dark mode, lit in light mode.
 * Clicking switches theme with a circular "light spreading" reveal
 * from the bulb where the browser supports View Transitions.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState('dark')
  const btn = useRef(null)
  const swing = useAnimationControls()

  useEffect(() => setTheme(currentTheme()), [])

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    swing.start({ rotate: [0, -16, 11, -6, 3, 0], transition: { duration: 0.9, ease: 'easeOut' } })

    const commit = () => {
      flushSync(() => setTheme(next))
      applyTheme(next)
    }

    if (!document.startViewTransition || reduce) {
      commit()
      return
    }

    const r = btn.current.getBoundingClientRect()
    const x = r.left + r.width / 2
    const y = r.top + r.height / 2
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

    const vt = document.startViewTransition(commit)
    vt.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 750, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', pseudoElement: '::view-transition-new(root)' },
        )
      })
      .catch(() => {})
  }

  const lit = theme === 'light'

  return (
    <button
      ref={btn}
      type="button"
      onClick={toggle}
      aria-pressed={lit}
      aria-label={lit ? 'Switch to dark mode' : 'Switch to light mode'}
      title={lit ? 'Lights off' : 'Lights on'}
      className="group relative grid h-9 w-9 place-items-center rounded-full border border-bone/20 text-bone transition-colors duration-300 hover:border-ember"
    >
      {/* soft halo when the bulb is on */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-[-6px] rounded-full bg-[radial-gradient(closest-side,rgba(255,170,60,0.55),transparent)] transition-opacity duration-500 ${
          lit ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <motion.span animate={swing} style={{ originY: 0 }} className="relative block">
        <Lightbulb
          size={17}
          strokeWidth={1.6}
          aria-hidden="true"
          className={`transition-[color,fill,filter] duration-500 ${
            lit
              ? 'fill-[#ffc94d] text-[#b8650a] drop-shadow-[0_0_6px_rgba(255,190,70,0.9)]'
              : 'fill-transparent text-bone group-hover:text-ember'
          }`}
        />
      </motion.span>
    </button>
  )
}
