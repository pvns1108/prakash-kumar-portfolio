import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { site } from '../data/content.js'
import { EASE, scrollToId } from '../lib/motion.jsx'

const letter = {
  hidden: { y: '105%' },
  show: (i) => ({ y: '0%', transition: { duration: 1.2, ease: EASE, delay: 0.35 + i * 0.05 } }),
}

function SplitWord({ word, outline = false, offset = 0 }) {
  return (
    <span className="flex overflow-hidden" aria-hidden="true">
      {word.split('').map((ch, i) => (
        <motion.span
          key={i}
          custom={i + offset}
          variants={letter}
          initial="hidden"
          animate="show"
          className={`inline-block will-change-transform ${outline ? 'text-outline' : ''}`}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  )
}

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const nameY = useTransform(scrollYProgress, [0, 1], ['0%', '-18%'])
  const glowScale = useTransform(scrollYProgress, [0, 1], [1, 1.35])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section
      id="home"
      ref={ref}
      aria-label="Introduction"
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[radial-gradient(140%_90%_at_50%_0%,var(--color-navy)_0%,var(--color-ink)_60%)]"
    >
      {/* Atmospheric light — layered, slowly drifting clouds */}
      <motion.div
        aria-hidden="true"
        style={{ scale: glowScale, opacity: fade }}
        className="pointer-events-none absolute inset-0"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2.4, ease: 'easeOut', delay: 0.1 }}
          className="absolute inset-0"
        >
          <div className="light-cloud light-cloud--c left-[-15%] top-[5%] h-[75vmax] w-[75vmax]" />
          <div className="light-cloud light-cloud--a left-[18%] top-[8%] h-[62vmax] w-[62vmax] md:left-[28%]" />
          <div className="light-cloud light-cloud--b left-[40%] top-[30%] h-[42vmax] w-[42vmax]" />
        </motion.div>
        {/* horizon line of light */}
        <div className="absolute inset-x-0 top-[58%] h-px bg-gradient-to-r from-transparent via-ember/50 to-transparent" />
      </motion.div>
      <div className="vignette !absolute" aria-hidden="true" />

      <div className="container-x relative z-10 flex flex-1 flex-col pb-8 pt-24 md:pb-10 md:pt-28">
        {/* top meta row */}
        <motion.div
          className="flex items-start justify-between gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <p className="eyebrow">
            Portfolio <span className="text-ember">/</span> {new Date().getFullYear()}
          </p>
          <p className="eyebrow hidden text-right sm:block">
            {site.location}
            <br />
            B.Tech CSE · PSIT
          </p>
        </motion.div>

        {/* Giant name */}
        <motion.h1
          style={{ y: nameY }}
          className="my-auto select-none py-10 font-display uppercase leading-[0.82] tracking-[-0.01em] text-bone"
        >
          <span className="sr-only">
            {site.firstName} {site.lastName} — {site.role}
          </span>
          <span className="block text-[clamp(4.6rem,21.5vw,23rem)]">
            <SplitWord word={site.firstName} />
          </span>
          <span className="flex items-end justify-end gap-4 lg:justify-between text-[clamp(4.6rem,21.5vw,23rem)]">
            <motion.span
              aria-hidden="true"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: EASE, delay: 1.1 }}
              className="mb-[0.18em] hidden max-w-[16rem] font-grotesk text-[0.8rem] normal-case leading-relaxed tracking-normal text-mute lg:block"
            >
              <span className="mb-2 block h-px w-10 bg-ember" />
              Python · AI / LLM · Web
              <br />
              Builder of voice-first tools &amp; fast interfaces.
            </motion.span>
            <SplitWord word={site.lastName} outline offset={site.firstName.length} />
          </span>
        </motion.h1>

        {/* bottom row */}
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <motion.p
            className="max-w-md font-grotesk text-base leading-relaxed text-bone/80 md:text-lg"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: EASE, delay: 1.2 }}
          >
            {site.heroIntro}
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-x-7 gap-y-4 md:flex-col md:items-end"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: EASE, delay: 1.4 }}
          >
            <motion.a
              href="#work"
              onClick={(e) => {
                e.preventDefault()
                scrollToId('work')
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex min-h-14 items-center gap-3 rounded-full bg-ember py-2 pl-7 pr-2 font-grotesk text-[0.95rem] font-medium text-onember shadow-[0_10px_60px_-10px_rgba(255,90,60,0.7)] transition-colors duration-300 hover:bg-ember-2"
            >
              Explore Work
              <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-ink text-bone">
                <ArrowUpRight
                  size={18}
                  aria-hidden="true"
                  className="transition-transform duration-500 ease-[var(--ease-cine)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:rotate-45"
                />
              </span>
            </motion.a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                scrollToId('contact')
              }}
              className="group relative font-grotesk text-sm tracking-wide text-bone"
            >
              Let’s Talk
              <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-100 bg-bone/40 transition-transform duration-500 group-hover:origin-left group-hover:bg-ember" />
            </a>
          </motion.div>
        </div>

        {/* scroll indicator */}
        <motion.button
          type="button"
          onClick={() => scrollToId('about')}
          className="mx-auto mt-10 flex flex-col items-center gap-3 text-mute transition-colors hover:text-bone md:mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          aria-label="Scroll to About section"
        >
          <span className="eyebrow !text-[0.62rem]">Scroll to explore</span>
          <span className="relative block h-10 w-px overflow-hidden bg-bone/10">
            <span className="scroll-line absolute inset-0 bg-ember" />
          </span>
          <ArrowDown size={12} aria-hidden="true" className="sr-only" />
        </motion.button>
      </div>
    </section>
  )
}
