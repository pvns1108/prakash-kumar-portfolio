import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Plus } from 'lucide-react'
import { navLinks, site, socials } from '../data/content.js'
import { EASE, scrollToId } from '../lib/motion.jsx'
import ThemeToggle from './ThemeToggle.jsx'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuBtn = useRef(null)
  const firstLink = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock scroll, close on Escape, manage focus
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    const t = setTimeout(() => firstLink.current?.focus(), 350)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
      clearTimeout(t)
      menuBtn.current?.focus({ preventScroll: true })
    }
  }, [open])

  const go = (id) => {
    setOpen(false)
    // wait for the overlay to start closing & scroll lock to release
    setTimeout(() => scrollToId(id), 60)
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[70] transition-[background,backdrop-filter,border-color] duration-500 ${
          scrolled && !open
            ? 'border-b border-line bg-ink/70 backdrop-blur-md'
            : 'border-b border-transparent'
        }`}
      >
        <nav className="container-x flex h-16 items-center justify-between md:h-20" aria-label="Primary">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault()
              go('home')
            }}
            className="group flex items-center gap-3"
            aria-label={`${site.firstName} ${site.lastName} — back to top`}
          >
            <span className="grid h-9 w-9 place-items-center rounded-full border border-bone/20 font-grotesk text-[0.72rem] font-semibold tracking-wider transition-colors duration-300 group-hover:border-ember group-hover:text-ember">
              {site.monogram}
            </span>
            <span className="hidden font-grotesk text-[0.78rem] leading-tight text-mute sm:block">
              <span className="block text-bone">
                {site.firstName} {site.lastName}
              </span>
              {site.role}
            </span>
          </a>

          <div className="flex items-center gap-3 md:gap-4">
          <ThemeToggle />
          <button
            ref={menuBtn}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="site-menu"
            className="group relative z-[70] flex items-center gap-2 rounded-full px-1 py-2 font-grotesk text-sm tracking-wide text-bone"
          >
            <span className="relative overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={open ? 'close' : 'menu'}
                  className="block"
                  initial={{ y: '100%' }}
                  animate={{ y: '0%' }}
                  exit={{ y: '-100%' }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  {open ? 'Close' : 'Menu'}
                </motion.span>
              </AnimatePresence>
            </span>
            <motion.span
              animate={{ rotate: open ? 45 : 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="grid h-9 w-9 place-items-center rounded-full border border-bone/20 transition-colors duration-300 group-hover:border-ember group-hover:bg-ember group-hover:text-onember"
            >
              <Plus size={16} strokeWidth={1.6} aria-hidden="true" />
            </motion.span>
          </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="fixed inset-0 z-[55] overflow-y-auto bg-ink"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.75, ease: EASE }}
          >
            {/* glow */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="light-cloud light-cloud--a -right-[20%] top-[10%] h-[70vmax] w-[70vmax] opacity-60" />
            </div>

            <div className="container-x relative flex min-h-full flex-col pb-10 pt-24 md:pt-28">
              <p className="eyebrow mb-6 md:mb-10">Navigation</p>
              <ul className="flex flex-col">
                {navLinks.map((link, i) => (
                  <li key={link.id} className="border-t border-line last:border-b">
                    <motion.a
                      ref={i === 0 ? firstLink : undefined}
                      href={`#${link.id}`}
                      onClick={(e) => {
                        e.preventDefault()
                        go(link.id)
                      }}
                      className="group flex items-baseline justify-between gap-6 py-3 md:py-4"
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.8, ease: EASE, delay: 0.25 + i * 0.06 }}
                    >
                      <span className="flex items-baseline gap-4 md:gap-8">
                        <span className="font-grotesk text-xs text-dim tabular-nums">0{i + 1}</span>
                        <span className="font-display text-[clamp(2.6rem,9vw,6.5rem)] uppercase leading-[0.95] tracking-tight text-bone transition-[color,translate] duration-500 ease-[var(--ease-cine)] group-hover:translate-x-3 group-hover:text-ember">
                          {link.label}
                        </span>
                      </span>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="h-6 w-6 shrink-0 -translate-x-2 text-ember opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100 md:h-10 md:w-10"
                        strokeWidth={1.2}
                      />
                    </motion.a>
                  </li>
                ))}
              </ul>

              <motion.div
                className="mt-auto flex flex-col gap-4 pt-10 font-grotesk text-sm text-mute sm:flex-row sm:items-end sm:justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <div className="flex flex-col gap-1">
                  <a href={`mailto:${site.email}`} className="text-bone transition-colors hover:text-ember">
                    {site.email}
                  </a>
                  {site.phone && (
                    <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="transition-colors hover:text-ember">
                      {site.phone}
                    </a>
                  )}
                </div>
                <div className="flex gap-6">
                  {socials.github && (
                    <a href={socials.github} target="_blank" rel="noreferrer" className="hover:text-ember">
                      GitHub
                    </a>
                  )}
                  {socials.linkedin && (
                    <a href={socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-ember">
                      LinkedIn
                    </a>
                  )}
                  <span>{site.location}</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
