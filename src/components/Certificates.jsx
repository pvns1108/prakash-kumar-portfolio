import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react'
import { certificates } from '../data/content.js'
import { EASE, Reveal, scrollToId } from '../lib/motion.jsx'

function summary(list) {
  const counts = {}
  list.forEach((c) => (counts[c.type] = (counts[c.type] || 0) + 1))
  return Object.entries(counts)
    .map(([type, count]) => `${count} ${type === 'Job Simulation' ? 'job simulations' : `${type.toLowerCase()}s`}`)
    .join(', ')
}

function useIsDesktop() {
  const [desk, setDesk] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const on = () => setDesk(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return desk
}

function CertCard({ cert, dim, onOpen, triggerRef }) {
  return (
    <li className={`w-[72vw] shrink-0 snap-start transition-opacity duration-500 sm:w-[44vw] md:w-[17.5vw] md:min-w-[210px] ${dim ? 'md:opacity-35' : 'opacity-100'}`}>
      <div className="relative flex h-full flex-col border border-white/[0.09] bg-[#0d0e10]">
        <button
          ref={triggerRef}
          type="button"
          onClick={onOpen}
          className="group relative block aspect-[4/3.4] overflow-hidden bg-[radial-gradient(80%_70%_at_50%_10%,#2a2440,#0d0e10_75%)]"
          aria-label={`View certificate: ${cert.title}, ${cert.issuer}`}
        >
          <span className="absolute inset-x-0 top-0 flex items-center gap-1 px-2.5 py-2" aria-hidden="true">
            {[0, 1, 2].map((d) => (
              <span key={d} className="h-1 w-1 rounded-full bg-white/30" />
            ))}
            <span className="ml-auto font-mono text-[0.5rem] uppercase tracking-widest text-white/40">{cert.type}</span>
          </span>
          <img
            src={cert.image}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 m-auto h-[72%] w-[86%] object-contain shadow-[0_18px_40px_-14px_rgba(0,0,0,0.9)] transition-transform duration-700 ease-[var(--ease-cine)] group-hover:scale-[1.05]"
          />
        </button>
        <div className="flex flex-1 flex-col border-t border-white/[0.07] p-3.5">
          <div className="flex items-start justify-between gap-3">
            <p className="text-[0.82rem] font-semibold leading-snug text-bone">{cert.title}</p>
            {cert.date && <p className="shrink-0 font-mono text-[0.6rem] text-mute">{cert.date}</p>}
          </div>
          <p className="mt-1 text-[0.68rem] text-mute">{cert.issuer}</p>
          <button
            type="button"
            onClick={onOpen}
            className="mt-auto flex items-center justify-end gap-1 pt-4 font-mono text-[0.55rem] font-bold uppercase tracking-[0.2em] text-bone/70 hover:text-bone"
            tabIndex={-1}
            aria-hidden="true"
          >
            View <ArrowUpRight size={10} />
          </button>
        </div>
      </div>
    </li>
  )
}

export default function Certificates() {
  const n = certificates.length
  const [active, setActive] = useState(null)
  const [current, setCurrent] = useState(0)
  const [pct, setPct] = useState(0)
  const desktop = useIsDesktop()
  const sectionRef = useRef(null)
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const triggers = useRef([])
  const [distance, setDistance] = useState(0)

  // how far the track must slide
  useEffect(() => {
    const measure = () => {
      if (!trackRef.current || !viewportRef.current) return
      setDistance(Math.max(0, trackRef.current.scrollWidth - viewportRef.current.clientWidth))
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (trackRef.current) ro.observe(trackRef.current)
    return () => ro.disconnect()
  }, [desktop])

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance])
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setPct(v)
    setCurrent(Math.min(n - 1, Math.round(v * (n - 1))))
  })

  const close = useCallback(() => setActive(null), [])
  const step = useCallback((d) => setActive((i) => (i === null ? i : (i + d + n) % n)), [n])

  useEffect(() => {
    if (active === null) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    const opened = active
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
      triggers.current[opened]?.focus({ preventScroll: true })
    }
    // re-run only when opening/closing, not on every step
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active === null])

  if (n === 0) return null
  const cert = active !== null ? certificates[active] : null

  return (
    <section
      id="certificates"
      ref={sectionRef}
      aria-labelledby="cert-title"
      className="relative bg-ink"
      style={desktop ? { height: `calc(100vh + ${distance}px)` } : undefined}
    >
      <div className={desktop ? 'sticky top-0 flex h-screen flex-col justify-center pt-14' : 'py-20'}>
        <div className="container-x grid gap-6 md:grid-cols-[minmax(220px,0.27fr)_1fr] md:gap-5">
          {/* intro card */}
          <Reveal className="flex flex-col self-start bg-[#0b0c0d] p-1 md:p-2">
            <h2 id="cert-title" className="text-[clamp(2.1rem,3.2vw,2.9rem)] font-black leading-[0.95] tracking-[-0.045em] text-bone">
              Proof of work, earned under pressure.
            </h2>
            <p className="mt-5 max-w-xs text-[0.75rem] leading-relaxed text-bone/65">
              {n} certificates in total — {summary(certificates)} — from Anthropic, Tata, Deloitte, Goldman Sachs, Adobe and Infosys.
            </p>
            <div className="mt-7 flex flex-col items-start gap-3 bg-[#0e0f11] py-4">
              <button type="button" onClick={() => setActive(0)} className="btn-box btn-box-solid">
                Browse them all <ArrowUpRight size={11} aria-hidden="true" />
              </button>
              <button type="button" onClick={() => scrollToId('contact')} className="btn-box">
                Message me
              </button>
            </div>
          </Reveal>

          {/* shelf */}
          <div className="min-w-0 bg-[#0b0c0d] p-3 md:p-4">
            <div ref={viewportRef} className={desktop ? 'overflow-hidden' : 'overflow-x-auto snap-x snap-mandatory [scrollbar-width:none]'}>
              <motion.ul ref={trackRef} style={desktop ? { x } : undefined} className="flex gap-4 md:gap-5" aria-label="Certificates">
                {certificates.map((c, i) => (
                  <CertCard
                    key={c.image}
                    cert={c}
                    index={i}
                    dim={i < current - 1 || i > current + 3}
                    onOpen={() => setActive(i)}
                    triggerRef={(el) => (triggers.current[i] = el)}
                  />
                ))}
              </motion.ul>
            </div>
            <div className="mt-4 flex items-center gap-4 font-mono text-[0.55rem] uppercase tracking-[0.22em]">
              <div className="flex gap-1" aria-hidden="true">
                {certificates.map((c, i) => (
                  <span key={c.image} className={`h-px transition-all duration-300 ${i === current ? 'w-4 bg-bone' : 'w-2 bg-white/25'}`} />
                ))}
              </div>
              <span className="hidden text-signal md:inline">↓ Scroll to spin the shelf</span>
              <span className="text-signal md:hidden">← Swipe the shelf</span>
              <span className="ml-auto tabular-nums text-dim">
                {current + 1} / {n}
              </span>
            </div>
          </div>
        </div>

        {desktop && (
          <div className="container-x mt-6 flex items-center gap-4 font-mono text-[0.55rem] uppercase tracking-[0.22em] text-dim" aria-hidden="true">
            <span>Scroll ↓ Shelf</span>
            <span className="relative h-px flex-1 bg-white/10">
              <span className="absolute inset-y-0 left-0 bg-white/50" style={{ width: `${pct * 100}%` }} />
            </span>
            <span className="tabular-nums">P {pct.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {cert && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${cert.title} certificate`}
            className="fixed inset-0 z-[90] flex flex-col bg-ink/95 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={close}
          >
            <div className="container-x flex items-center justify-between gap-4 py-4" onClick={(e) => e.stopPropagation()}>
              <p className="font-mono text-xs tabular-nums text-mute">
                {String(active + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
              </p>
              <button
                type="button"
                autoFocus
                onClick={close}
                className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-bone transition-colors hover:bg-bone hover:text-ink"
                aria-label="Close certificate"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-20">
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={cert.image}
                  src={cert.image}
                  alt={`${cert.title} certificate issued by ${cert.issuer}`}
                  className="max-h-full max-w-full rounded-sm object-contain shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  onClick={(e) => e.stopPropagation()}
                />
              </AnimatePresence>
              {n > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      step(-1)
                    }}
                    className="absolute left-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 text-bone transition-colors hover:bg-bone hover:text-ink md:grid"
                    aria-label="Previous certificate"
                  >
                    <ArrowLeft size={18} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      step(1)
                    }}
                    className="absolute right-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 text-bone transition-colors hover:bg-bone hover:text-ink md:grid"
                    aria-label="Next certificate"
                  >
                    <ArrowRight size={18} aria-hidden="true" />
                  </button>
                </>
              )}
            </div>

            <div className="container-x flex items-end justify-between gap-6 py-5" onClick={(e) => e.stopPropagation()}>
              <div className="min-w-0">
                <p className="label !text-mute">{[cert.type, cert.date].filter(Boolean).join(' · ')}</p>
                <p className="mt-1 text-lg font-semibold text-bone md:text-xl">{cert.title}</p>
                {cert.issuer && <p className="text-sm text-mute">{cert.issuer}</p>}
              </div>
              {n > 1 && (
                <div className="flex shrink-0 gap-2 md:hidden">
                  <button type="button" onClick={() => step(-1)} className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-bone" aria-label="Previous certificate">
                    <ArrowLeft size={18} aria-hidden="true" />
                  </button>
                  <button type="button" onClick={() => step(1)} className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-bone" aria-label="Next certificate">
                    <ArrowRight size={18} aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
