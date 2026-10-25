import { projects } from '../data/content.js'
import { LineReveal, Reveal } from '../lib/motion.jsx'
import ProjectItem from './ProjectItem.jsx'

export default function SelectedWork() {
  return (
    <section id="work" aria-labelledby="work-title" className="relative bg-[linear-gradient(180deg,var(--color-ink)_0%,var(--color-navy)_50%,var(--color-ink)_100%)]">
      <div className="container-x py-14 md:py-20">
        <div className="mb-10 flex items-center justify-between md:mb-14">
          <Reveal as="p" className="eyebrow">
            <span className="text-ember">(02)</span>&nbsp;&nbsp;Selected Work
          </Reveal>
          <Reveal as="p" className="eyebrow" delay={0.1}>
            {String(projects.length).padStart(2, '0')} Projects
          </Reveal>
        </div>

        <div className="mb-8 grid gap-8 md:mb-10 md:grid-cols-12 md:items-end">
          <h2
            id="work-title"
            className="font-display text-[clamp(3.4rem,11vw,11rem)] uppercase leading-[0.86] tracking-tight md:col-span-8"
          >
            <LineReveal>Selected</LineReveal>
            <LineReveal delay={0.08}>
              <span className="text-outline">Work</span>
              <span className="text-ember">.</span>
            </LineReveal>
          </h2>
          <Reveal as="p" delay={0.2} className="max-w-sm text-mute md:col-span-4 md:justify-self-end">
            A few things I’ve designed and built — from voice-driven automation to responsive interfaces and audio forensics.
          </Reveal>
        </div>

        <div className="border-b border-line">
          {projects.map((p, i) => (
            <ProjectItem key={p.id} project={p} index={i} reverse={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  )
}
