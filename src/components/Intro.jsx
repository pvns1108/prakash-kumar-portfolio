import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { site } from '../data/content.js'
import { EASE } from '../lib/motion.jsx'

/**
 * Opening sequence: a dot drops in, stretches into "!", tips over while
 * the name spells out, then the name gives way to PORTFOLIO and the
 * overlay lifts to reveal the hero. Click / any key skips it.
 */
const STEPS = { dot: 0, bang: 650, name: 1250, word: 2350, done: 3300 }

export default function Intro({ onDone }) {
  const [phase, setPhase] = useState('dot')
  const [show, setShow] = useState(true)
  const name = site.firstName.toUpperCase()

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setShow(false)
      onDone()
      return
    }
    const timers = [
      setTimeout(() => setPhase('bang'), STEPS.bang),
      setTimeout(() => setPhase('name'), STEPS.name),
      setTimeout(() => setPhase('word'), STEPS.word),
      setTimeout(() => setShow(false), STEPS.done),
    ]
    const skip = () => setShow(false)
    window.addEventListener('keydown', skip)
    document.body.style.overflow = 'hidden'
    return () => {
      timers.forEach(clearTimeout)
      window.removeEventListener('keydown', skip)
      document.body.style.overflow = ''
    }
    // run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Release the scroll lock the moment the overlay starts leaving — the
  // component stays mounted, and a leftover `overflow: hidden` on <body>
  // would also break every position: sticky section.
  useEffect(() => {
    if (!show) document.body.style.overflow = ''
  }, [show])

  return (
    <AnimatePresence onExitComplete={onDone}>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex cursor-pointer items-center justify-center overflow-hidden bg-ink"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          onClick={() => setShow(false)}
          aria-hidden="true"
        >
          {/* soft spotlight */}
          <motion.div
            className="pointer-events-none absolute h-[70vmin] w-[70vmin] rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.09),transparent)]"
            animate={{ opacity: phase === 'word' ? 0.4 : 1, scale: phase === 'name' ? 1.4 : 1 }}
            transition={{ duration: 1, ease: EASE }}
          />

          <div className="relative flex items-center justify-center text-[clamp(3.5rem,13vw,11rem)]">
            {(phase === 'dot' || phase === 'bang') && (
              <div className="relative flex flex-col items-center">
                <motion.span
                  className="block w-[0.12em] rounded-[0.02em] bg-gradient-to-b from-white to-[#9aa0aa]"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: phase === 'bang' ? '0.62em' : 0, opacity: phase === 'bang' ? 1 : 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                />
                <motion.span
                  className="mt-[0.08em] block h-[0.14em] w-[0.14em] rounded-full bg-[#e9eaee]"
                  initial={{ y: '-3em', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 14 }}
                />
              </div>
            )}

            {phase === 'name' && (
              <div className="chrome flex items-end">
                {name.split('').map((ch, i) => (
                  <motion.span
                    key={i}
                    className="inline-block"
                    initial={{ opacity: 0, y: '0.3em', filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.5, ease: EASE, delay: i * 0.07 }}
                  >
                    {ch}
                  </motion.span>
                ))}
                <motion.span
                  className="ml-[0.06em] inline-block h-[0.12em] w-[0.12em] rounded-full bg-[#e9eaee]"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: [1, 1, 0] }}
                  transition={{ duration: 1, times: [0, 0.8, 1] }}
                  style={{ WebkitTextFillColor: 'initial' }}
                />
              </div>
            )}

            {phase === 'word' && (
              <motion.div
                className="chrome text-[clamp(4rem,14vw,13rem)]"
                initial={{ opacity: 0, scale: 1.08, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                Portfolio
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
