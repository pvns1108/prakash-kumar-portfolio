import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { navLinks, site, socials } from '../data/content.js'
import { EASE, scrollToId } from '../lib/motion.jsx'

/** Which section is currently in the middle of the viewport. */
function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id))
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ids])
  return active
}

const ids = navLinks.map((l) => l.id)

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const active = useActiveSection(ids)
  const menuBtn = useRef(null)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
      menuBtn.current?.focus({ preventScroll: true })
    }
  }, [open])

  const go = (id) => {
    setOpen(false)
    setTimeout(() => scrollToId(id), 40)
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[70] bg-ink/90 backdrop-blur-md">
        <nav className="flex h-14 items-center justify-between px-4 md:h-[3.75rem] md:px-7" aria-label="Primary">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault()
              go('home')
            }}
            className="text-[0.95rem] font-extrabold uppercase tracking-[0.12em] text-bone md:text-base"
            aria-label={`${site.firstName} ${site.lastName} — back to top`}
          >
            {site.firstName} {site.lastName}
          </a>

          <ul className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    go(link.id)
                  }}
                  aria-current={active === link.id ? 'true' : undefined}
                  className={`relative block py-1 text-[0.66rem] font-medium uppercase tracking-[0.08em] transition-colors duration-300 ${
                    active === link.id ? 'text-bone' : 'text-bone/70 hover:text-bone'
                  }`}
                >
                  {link.label}
                  {active === link.id && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-0.5 left-0 right-0 h-px bg-bone"
                      transition={{ duration: 0.5, ease: EASE }}
                    />
                  )}
                </a>
              </li>
            ))}
          </ul>

          <button
            ref={menuBtn}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="site-menu"
            className="relative z-[80] -mr-2 grid h-11 w-11 place-items-center lg:hidden"
          >
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
            <span aria-hidden="true" className="relative block h-3 w-6">
              <span className={`absolute left-0 h-px w-6 bg-bone transition-all duration-500 ${open ? 'top-1.5 rotate-45' : 'top-0'}`} />
              <span className={`absolute left-0 h-px w-6 bg-bone transition-all duration-500 ${open ? 'top-1.5 -rotate-45' : 'top-3'}`} />
            </span>
          </button>
        </nav>
        {/* thin divider that fills with scroll progress */}
        <div className="relative h-px bg-white/[0.07]">
          <motion.div className="absolute inset-y-0 left-0 w-full origin-left bg-white/45" style={{ scaleX: progress }} />
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="fixed inset-0 z-[65] overflow-y-auto bg-ink"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <div className="flex min-h-full flex-col px-4 pb-8 pt-24 md:px-7">
              <ul>
                {navLinks.map((link, i) => (
                  <li key={link.id} className="border-t border-line last:border-b">
                    <motion.a
                      href={`#${link.id}`}
                      onClick={(e) => {
                        e.preventDefault()
                        go(link.id)
                      }}
                      className="flex items-baseline gap-5 py-4"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, ease: EASE, delay: 0.15 + i * 0.05 }}
                    >
                      <span className="text-xs tabular-nums text-dim">0{i + 1}</span>
                      <span className={`chrome text-[clamp(2.2rem,11vw,4.5rem)] ${active === link.id ? '' : 'opacity-70'}`}>
                        {link.label}
                      </span>
                    </motion.a>
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-col gap-2 pt-10 text-sm text-mute">
                <a href={`mailto:${site.email}`} className="text-bone">
                  {site.email}
                </a>
                {site.phone && <a href={`tel:${site.phone.replace(/\s/g, '')}`}>{site.phone}</a>}
                <div className="mt-2 flex gap-5">
                  {socials.github && (
                    <a href={socials.github} target="_blank" rel="noreferrer">
                      GitHub
                    </a>
                  )}
                  {socials.linkedin && (
                    <a href={socials.linkedin} target="_blank" rel="noreferrer">
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
