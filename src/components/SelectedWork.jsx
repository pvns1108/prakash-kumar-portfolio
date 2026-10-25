import { ArrowUpRight } from 'lucide-react'
import { projects, socials } from '../data/content.js'
import { Reveal } from '../lib/motion.jsx'
import ProjectItem from './ProjectItem.jsx'

export default function SelectedWork() {
  if (!projects.length) return null
  return (
    <section id="work" aria-labelledby="work-title" className="relative bg-ink pb-16 pt-20 md:pb-24 md:pt-28">
      <div className="container-x mb-16 grid gap-8 md:mb-24 md:grid-cols-12">
        <Reveal as="h2" id="work-title" className="md:col-span-7">
          <span className="chrome text-[clamp(2.8rem,5.6vw,5.2rem)]">Selected</span>{' '}
          <span className="serif-i text-[clamp(3rem,6vw,5.6rem)] leading-none text-bone/90">work</span>
        </Reveal>
        <Reveal delay={0.1} className="md:col-span-4 md:col-start-9 md:pt-2">
          <p className="max-w-sm text-[0.82rem] leading-relaxed text-bone/75">
            A few things I’ve built — voice-driven AI tools, audio forensics and the web — each one a way of learning by shipping.
          </p>
          {socials.github && (
            <a href={socials.github} target="_blank" rel="noreferrer" className="pill pill-solid mt-5 min-h-8 px-3.5 text-[0.7rem]">
              More on GitHub <ArrowUpRight size={12} aria-hidden="true" />
            </a>
          )}
        </Reveal>
      </div>

      <div className="flex flex-col gap-24 md:gap-36">
        {projects.map((p, i) => (
          <ProjectItem key={p.id} project={p} index={i} />
        ))}
      </div>
    </section>
  )
}
