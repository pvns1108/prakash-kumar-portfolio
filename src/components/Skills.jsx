import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { skills } from '../data/content.js'
import { EASE, Reveal, scrollToId } from '../lib/motion.jsx'

/** "What I can do" — numbered full-width accordion built from the skill groups. */
export default function Skills() {
  const [open, setOpen] = useState(null)
  if (!skills.length) return null

  return (
    <section id="skills" aria-labelledby="skills-title" className="relative bg-ink pb-16 pt-20 md:pb-24 md:pt-28">
      <div className="container-x mb-10 flex justify-end md:mb-14">
        <Reveal as="h2" id="skills-title" className="chrome text-right text-[clamp(3rem,7.4vw,7rem)]">
          What I
          <br />
          can do
        </Reveal>
      </div>

      <ul className="border-t border-white/[0.07]">
        {skills.map((group, i) => {
          const isOpen = open === i
          const panelId = `skill-panel-${i}`
          return (
            <Reveal as="li" key={group.title} delay={i * 0.04} y={16} className="border-b border-white/[0.07]">
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className={`group flex w-full items-center gap-6 px-4 py-4 text-left transition-colors duration-300 md:gap-10 md:px-10 md:py-[1.15rem] ${
                    isOpen ? 'bg-paper text-onpaper' : 'text-bone hover:bg-white/[0.12]'
                  }`}
                >
                  <span className={`w-7 text-lg tabular-nums md:text-xl ${isOpen ? 'text-onpaper/70' : 'text-bone/80'}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="flex-1 text-[0.9rem] font-extrabold uppercase tracking-[0.02em] md:text-[1.05rem]">
                    {group.title}
                  </span>
                  {isOpen ? (
                    <ArrowUpRight size={18} strokeWidth={1.6} aria-hidden="true" />
                  ) : (
                    <ArrowDownRight
                      size={18}
                      strokeWidth={1.6}
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
                    />
                  )}
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={panelId}
                    role="region"
                    key="panel"
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.55, ease: EASE }}
                    className="overflow-hidden bg-paper text-onpaper"
                  >
                    <div className="grid gap-8 px-4 pb-8 pt-2 md:grid-cols-12 md:px-10 md:pb-10 md:pl-[6.6rem]">
                      <ul className="space-y-2 md:col-span-5">
                        {group.items.map((item) => (
                          <li key={item} className="flex items-center gap-3 text-[0.8rem] text-onpaper/75">
                            <span className="h-1 w-1 bg-onpaper/70" aria-hidden="true" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <div className="md:col-span-6 md:col-start-7">
                        {group.blurb && <p className="max-w-md text-[0.85rem] leading-relaxed text-onpaper/80">{group.blurb}</p>}
                        <button
                          type="button"
                          onClick={() => scrollToId('work')}
                          className="mt-6 flex w-full max-w-md items-center gap-2 bg-onpaper px-4 py-3 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-paper transition-colors hover:bg-black"
                        >
                          <span aria-hidden="true">⌜</span> View projects <span aria-hidden="true">⌟</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Reveal>
          )
        })}
      </ul>
    </section>
  )
}
