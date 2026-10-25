import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Expand, X } from 'lucide-react'
import { certificates } from '../data/content.js'
import { EASE, LineReveal, Reveal } from '../lib/motion.jsx'

/**
 * Column spans that always fill complete rows, whatever the count:
 * md = 2 columns, lg = 6-track grid (rows of 3, or rows of 2 for the first few).
 */
function spanFor(i, n) {
  const mdWide = n % 2 === 1 && i === 0 ? 'md:col-span-2' : ''
  const wideCount = n % 3 === 1 ? 4 : n % 3 === 2 ? 2 : 0
  const lg = i < wideCount ? 'lg:col-span-3' : 'lg:col-span-2'
  return `${mdWide} ${lg}`
}

function summary(list) {
  const counts = {}
  list.forEach((c) => (counts[c.type] = (counts[c.type] || 0) + 1))
  return Object.entries(counts)
}

export default function Certificates() {
  const [active, setActive] = useState(null)
  const n = certificates.length
  const triggers = useRef([])

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
    <section id="certificates" aria-labelledby="cert-title" className="relative bg-[linear-gradient(180deg,var(--color-ink)_0%,var(--color-navy)_100%)]">
      <div className="container-x py-14 md:py-20">
        <div className="mb-10 flex items-center justify-between md:mb-14">
          <Reveal as="p" className="eyebrow">
            <span className="text-ember">(04)</span>&nbsp;&nbsp;Certificates
          </Reveal>
          <Reveal as="p" className="eyebrow" delay={0.1}>
            {String(n).padStart(2, '0')} Earned
          </Reveal>
        </div>

        <div className="mb-10 grid gap-6 md:mb-14 md:grid-cols-12 md:items-end">
          <h2 id="cert-title" className="font-display text-[clamp(3.2rem,10vw,10rem)] uppercase leading-[0.86] tracking-tight md:col-span-8">
            <LineReveal>Proof of</LineReveal>
            <LineReveal delay={0.08}>
              <span className="text-outline">work</span>
              <span className="text-ember">.</span>
            </LineReveal>
          </h2>
          <Reveal delay={0.15} className="md:col-span-4 md:justify-self-end">
            <dl className="flex gap-8 md:gap-10">
              {summary(certificates).map(([type, count]) => (
                <div key={type}>
                  <dt className="eyebrow">{type === 'Job Simulation' ? 'Simulations' : `${type}s`}</dt>
                  <dd className="mt-1 font-display text-4xl leading-none text-bone tabular-nums">
                    {String(count).padStart(2, '0')}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <ul className="grid gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-6">
          {certificates.map((c, i) => (
            <motion.li
              key={c.image}
              className={spanFor(i, n)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.9, ease: EASE, delay: (i % 3) * 0.06 }}
            >
              <button
                ref={(el) => (triggers.current[i] = el)}
                type="button"
                onClick={() => setActive(i)}
                className="group flex h-full w-full flex-col overflow-hidden rounded-sm border border-line bg-ink-2 text-left transition-colors duration-500 hover:border-ember/50"
                aria-label={`View certificate: ${c.title}, ${c.issuer}`}
              >
                <span className="relative block aspect-[7/5] overflow-hidden bg-ink-2">
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-[radial-gradient(70%_60%_at_80%_0%,rgba(255,90,60,0.18),transparent_70%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                  />
                  <img
                    src={c.image}
                    alt={`${c.title} certificate issued by ${c.issuer}`}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 m-auto h-[86%] w-[90%] object-contain shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] transition-[scale] duration-700 ease-[var(--ease-cine)] group-hover:scale-[1.04]"
                  />
                  <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-ink/70 text-bone opacity-0 backdrop-blur transition-opacity duration-500 group-hover:opacity-100">
                    <Expand size={15} aria-hidden="true" />
                  </span>
                </span>
                <span className="flex flex-1 flex-col gap-1.5 border-t border-line p-5">
                  <span className="flex items-center justify-between gap-4">
                    <span className="eyebrow !text-ember">{c.type}</span>
                    {c.date && <span className="eyebrow">{c.date}</span>}
                  </span>
                  <span className="font-grotesk text-lg leading-snug text-bone">{c.title}</span>
                  {c.issuer && <span className="text-sm text-mute">{c.issuer}</span>}
                </span>
              </button>
            </motion.li>
          ))}
        </ul>
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
              <p className="font-grotesk text-sm tabular-nums text-mute">
                {String(active + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
              </p>
              <button
                type="button"
                autoFocus
                onClick={close}
                className="grid h-11 w-11 place-items-center rounded-full border border-bone/20 text-bone transition-colors hover:border-ember hover:bg-ember hover:text-onember"
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
                    className="absolute left-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-bone/20 text-bone transition-colors hover:border-ember hover:text-ember md:grid"
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
                    className="absolute right-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-bone/20 text-bone transition-colors hover:border-ember hover:text-ember md:grid"
                    aria-label="Next certificate"
                  >
                    <ArrowRight size={18} aria-hidden="true" />
                  </button>
                </>
              )}
            </div>

            <div className="container-x flex items-end justify-between gap-6 py-5" onClick={(e) => e.stopPropagation()}>
              <div className="min-w-0">
                <p className="eyebrow !text-ember">
                  {[cert.type, cert.date].filter(Boolean).join(' · ')}
                </p>
                <p className="mt-1 font-grotesk text-lg text-bone md:text-xl">{cert.title}</p>
                {cert.issuer && <p className="text-sm text-mute">{cert.issuer}</p>}
              </div>
              {n > 1 && (
                <div className="flex shrink-0 gap-2 md:hidden">
                  <button type="button" onClick={() => step(-1)} className="grid h-11 w-11 place-items-center rounded-full border border-bone/20 text-bone" aria-label="Previous certificate">
                    <ArrowLeft size={18} aria-hidden="true" />
                  </button>
                  <button type="button" onClick={() => step(1)} className="grid h-11 w-11 place-items-center rounded-full border border-bone/20 text-bone" aria-label="Next certificate">
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
