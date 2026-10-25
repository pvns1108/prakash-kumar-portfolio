import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight, Github } from 'lucide-react'
import { EASE, Reveal } from '../lib/motion.jsx'
import ProjectVisual from './ProjectVisual.jsx'

/** A laptop on a spotlit floor, showing the screenshot or a generated mockup. */
function DeviceStage({ project, flip }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [flip ? 16 : -16, flip ? 8 : -8, flip ? 2 : -2])
  const y = useTransform(scrollYProgress, [0, 1], [40, -40])

  return (
    <div ref={ref} className="relative aspect-[16/10] overflow-hidden bg-[#070708] [perspective:1400px]">
      {/* spotlight + floor */}
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(45%_70%_at_50%_0%,rgba(255,255,255,0.12),transparent_75%)]" />
      <div aria-hidden="true" className="absolute inset-x-[8%] bottom-[6%] h-[30%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(200,200,200,0.22),rgba(120,120,120,0.06)_60%,transparent)] blur-md" />
      <motion.div style={{ rotateY: rotate, y }} className="absolute inset-x-[16%] top-[14%] [transform-style:preserve-3d]">
        <div className="rounded-t-[10px] border border-white/15 bg-[#0c0d10] p-[1.6%] shadow-[0_40px_80px_-30px_rgba(0,0,0,1)]">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[4px] bg-ink">
            {project.image ? (
              <img
                src={project.image}
                alt={`${project.title} — screenshot`}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
            ) : (
              <ProjectVisual kind={project.visual} />
            )}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08),transparent_40%)]" />
          </div>
        </div>
        <div className="relative mx-[-6%] h-[0.9rem] rounded-b-[14px] bg-gradient-to-b from-[#2a2c31] to-[#0f1012] md:h-[1.1rem]">
          <span className="absolute left-1/2 top-0 h-1 w-[16%] -translate-x-1/2 rounded-b-md bg-black/50" />
        </div>
      </motion.div>
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(90%_80%_at_50%_50%,transparent_55%,rgba(0,0,0,0.75)_100%)]" />
    </div>
  )
}

export default function ProjectItem({ project, index }) {
  const flip = index % 2 === 1
  const num = String(index + 1).padStart(2, '0')

  return (
    <article className="container-x grid items-center gap-8 md:grid-cols-12 md:gap-12" aria-labelledby={`p-${project.id}`}>
      <motion.div
        className={`md:col-span-6 ${flip ? 'md:order-2 md:col-start-7' : ''}`}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.1, ease: EASE }}
      >
        <DeviceStage project={project} flip={flip} />
      </motion.div>

      <div className={`md:col-span-5 ${flip ? 'md:order-1 md:col-start-1' : 'md:col-start-8'}`}>
        <Reveal as="p" className="mb-4 text-[0.7rem] font-bold tracking-[0.12em] text-bone">
          {num}
          {project.category && <span className="ml-3 font-medium tracking-[0.2em] text-dim uppercase">{project.category}</span>}
          {project.year && <span className="ml-3 font-medium text-dim">{project.year}</span>}
        </Reveal>
        <Reveal as="h3" id={`p-${project.id}`} delay={0.05} className="text-[clamp(2rem,3.4vw,3.1rem)] font-black uppercase leading-[0.95] tracking-[-0.035em] text-bone">
          {project.title}
          {project.accent && <span className="serif-i ml-2 text-[1.08em] font-normal text-bone/90">{project.accent}</span>}
          {project.subtitle && <span className="block">{project.subtitle}</span>}
        </Reveal>
        <Reveal as="p" delay={0.1} className="mt-5 max-w-xl text-[0.82rem] leading-[1.7] text-bone/60">
          {project.description}
        </Reveal>
        {project.tags?.length > 0 && (
          <Reveal as="ul" delay={0.12} className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5" aria-label="Built with">
            {project.tags.map((t) => (
              <li key={t} className="font-mono text-[0.66rem] uppercase tracking-wider text-bone/45">
                {t}
              </li>
            ))}
          </Reveal>
        )}
        {(project.live || project.repo) && (
          <Reveal delay={0.15} className="mt-7 flex flex-wrap gap-3">
            {project.live && (
              <a href={project.live} target="_blank" rel="noreferrer" className="pill pill-solid min-h-9 text-[0.72rem]">
                Live Demo <ArrowUpRight size={12} aria-hidden="true" />
              </a>
            )}
            {project.repo && (
              <a href={project.repo} target="_blank" rel="noreferrer" className="pill min-h-9 text-[0.72rem]">
                GitHub <Github size={12} aria-hidden="true" />
              </a>
            )}
          </Reveal>
        )}
      </div>
    </article>
  )
}
