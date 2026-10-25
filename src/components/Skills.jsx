import { motion } from 'framer-motion'
import { skills } from '../data/content.js'
import { EASE, LineReveal, Reveal } from '../lib/motion.jsx'

export default function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="relative bg-[linear-gradient(180deg,var(--color-ink)_0%,var(--color-navy)_100%)]">
      <div className="container-x py-14 md:py-20">
        <div className="mb-10 flex items-center justify-between md:mb-14">
          <Reveal as="p" className="eyebrow">
            <span className="text-ember">(05)</span>&nbsp;&nbsp;Skills
          </Reveal>
          <Reveal as="p" className="eyebrow" delay={0.1}>
            Toolkit
          </Reveal>
        </div>

        <h2 id="skills-title" className="mb-10 font-display text-[clamp(3.2rem,10vw,10rem)] uppercase leading-[0.86] tracking-tight md:mb-14">
          <LineReveal>Tools of</LineReveal>
          <LineReveal delay={0.08}>
            <span className="text-outline">the trade</span>
            <span className="text-ember">.</span>
          </LineReveal>
        </h2>

        <div className="grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((group, gi) => (
            <motion.div
              key={group.title}
              className="group relative border-b border-r border-line p-6 md:p-9"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, ease: EASE, delay: (gi % 3) * 0.08 }}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_0%_0%,rgba(255,90,60,0.12),transparent_70%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100"
              />
              <div className="relative">
                <div className="mb-8 flex items-baseline justify-between">
                  <h3 className="font-grotesk text-lg font-medium text-bone">{group.title}</h3>
                  <span className="font-grotesk text-xs text-dim tabular-nums">0{gi + 1}</span>
                </div>
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((s) => (
                    <li
                      key={s}
                      className="rounded-full border border-bone/10 bg-bone/[0.02] px-3 py-1.5 font-grotesk text-[0.8rem] text-bone/80 transition-colors duration-300 hover:border-ember/60 hover:text-bone"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
