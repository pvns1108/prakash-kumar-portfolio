import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDownLeft } from 'lucide-react'
import { site } from '../data/content.js'
import { EASE, scrollToId } from '../lib/motion.jsx'
import ParticlePortrait from './ParticlePortrait.jsx'

export default function Hero({ ready }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-55%'])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section
      id="home"
      ref={ref}
      aria-label="Introduction"
      className="relative h-[100svh] min-h-[560px] overflow-hidden bg-ink"
    >
      {/* cinematic light */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_60%_at_50%_35%,rgba(255,255,255,0.06),transparent_70%)]" />

      <motion.div style={{ y: titleY }} className="absolute inset-x-0 bottom-[18%] z-0 flex justify-center sm:bottom-[11%] md:bottom-[12%]">
        <div className="relative">
          <motion.h1
            className="chrome text-[clamp(4.2rem,14.2vw,15rem)]"
            initial={{ opacity: 0, y: 40 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, ease: EASE }}
          >
            <span className="sr-only">
              {site.firstName} {site.lastName} —{' '}
            </span>
            Portfolio
          </motion.h1>
        </div>
      </motion.div>

      {/* particle portrait sits over the title, like the reference */}
      <ParticlePortrait
        src={site.photo}
        cutout={site.portraitCutout}
        mask={site.portraitMask}
        active={ready}
        scrollRef={ref}
        className="pointer-events-none absolute inset-x-0 bottom-0 top-14 z-10 h-[calc(100%-3.5rem)] w-full md:top-[3.75rem] md:h-[calc(100%-3.75rem)]"
      />

      <motion.div
        style={{ opacity: fade }}
        className="absolute inset-x-0 bottom-[5%] z-20 flex justify-center px-4 md:bottom-[6%]"
      >
        <motion.div
          className="flex w-[min(100%,calc(14.2vw*5.05))] max-w-[78rem] flex-wrap items-center justify-between gap-4 sm:pl-[1%]"
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: EASE, delay: 0.35 }}
        >
          <p className="text-[clamp(1.05rem,1.9vw,1.6rem)] tracking-tight text-bone">
            <span className="font-semibold">{site.roleBold}</span>{' '}
            <span className="serif-i text-[1.12em] text-bone/85">{site.roleItalic}</span>
          </p>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => scrollToId('about')}
              className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-bone/80 transition-colors hover:bg-bone hover:text-ink"
              aria-label="Scroll to about"
            >
              <ArrowDownLeft size={13} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => scrollToId('contact')} className="pill min-h-9 px-4 text-[0.72rem] italic">
              Contact
            </button>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
