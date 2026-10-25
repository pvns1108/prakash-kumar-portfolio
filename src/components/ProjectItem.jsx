import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight, Github } from 'lucide-react'
import ProjectVisual from './ProjectVisual.jsx'
import { EASE, Reveal } from '../lib/motion.jsx'

function ActionLink({ href, children, primary = false }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`group/link inline-flex min-h-11 items-center gap-2 rounded-full border px-5 font-grotesk text-sm transition-colors duration-300 ${
        primary
          ? 'border-ember bg-ember text-onember hover:bg-ember-2'
          : 'border-bone/15 text-bone hover:border-ember hover:text-ember'
      }`}
    >
      {children}
      <ArrowUpRight
        size={15}
        aria-hidden="true"
        className="transition-transform duration-500 ease-[var(--ease-cine)] group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
      />
    </a>
  )
}

export default function ProjectItem({ project, reverse, index }) {
  const num = String(index + 1).padStart(2, '0')
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])

  const primaryHref = project.live || project.repo
  const meta = [project.category, project.year].filter(Boolean).join(' · ')

  const Media = (
    <motion.div
      ref={ref}
      className="group/media relative aspect-[16/11] overflow-hidden rounded-sm border border-line bg-ink-2"
      initial={{ clipPath: 'inset(12% 8% 12% 8%)', opacity: 0 }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.4, ease: EASE }}
    >
      <motion.div
        style={{ y }}
        className="absolute inset-x-0 top-[-7%] h-[114%] transition-[scale] duration-[1.2s] ease-[var(--ease-cine)] group-hover/media:scale-[1.04]"
      >
        {project.image ? (
          <img
            src={project.image}
            alt={`${project.title} — ${project.subtitle} screenshot`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          <div role="img" aria-label={`Illustrative mockup of ${project.title}, ${project.subtitle}`} className="h-full w-full">
            <ProjectVisual kind={project.visual} />
          </div>
        )}
      </motion.div>

      {/* hover overlay (pointer devices) — only when there is somewhere to go */}
      {primaryHref && (
        <div className="pointer-events-none absolute inset-0 hidden items-end justify-between bg-gradient-to-t from-ink/85 via-ink/20 to-transparent p-6 opacity-0 transition-opacity duration-500 group-hover/media:opacity-100 md:flex">
          <span className="eyebrow !text-bone">{project.live ? 'View live project' : 'View on GitHub'}</span>
          <span className="grid h-14 w-14 translate-y-3 place-items-center rounded-full bg-ember text-onember transition-transform duration-500 ease-[var(--ease-cine)] group-hover/media:translate-y-0">
            <ArrowUpRight size={22} aria-hidden="true" />
          </span>
        </div>
      )}
      <span className="absolute left-4 top-4 font-grotesk text-[0.7rem] tracking-[0.2em] text-bone/70">
        {num}
      </span>
    </motion.div>
  )

  return (
    <article className="grid items-center gap-8 border-t border-line py-12 md:grid-cols-12 md:gap-10 md:py-16">
      <div className={`md:col-span-7 ${reverse ? 'md:order-2' : ''}`}>
        {primaryHref ? (
          <a href={primaryHref} target="_blank" rel="noreferrer" aria-label={`Open ${project.title}`} className="block">
            {Media}
          </a>
        ) : (
          Media
        )}
      </div>

      <div className={`md:col-span-5 ${reverse ? 'md:order-1 md:pr-6' : 'md:pl-6'}`}>
        <Reveal className="mb-6 flex items-center justify-between gap-4">
          {meta && <span className="eyebrow">{meta}</span>}
          <span className="font-grotesk text-xs text-dim">({num})</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h3 className="font-display text-[clamp(2.8rem,5.4vw,5.2rem)] uppercase leading-[0.9] tracking-tight text-bone [overflow-wrap:anywhere]">
            {project.title}
          </h3>
          <p className="mt-3 font-grotesk text-lg text-ember">{project.subtitle}</p>
        </Reveal>
        <Reveal as="p" delay={0.1} className="mt-6 max-w-lg leading-relaxed text-mute">
          {project.description}
        </Reveal>
        {project.tags?.length > 0 && (
        <Reveal delay={0.15}>
          <ul className="mt-7 flex flex-wrap gap-2" aria-label="Technologies">
            {project.tags.map((t) => (
              <li key={t} className="rounded-full border border-bone/12 px-3 py-1 font-grotesk text-xs text-bone/80">
                {t}
              </li>
            ))}
          </ul>
        </Reveal>
        )}
        {(project.live || project.repo) && (
        <Reveal delay={0.2} className="mt-8 flex flex-wrap gap-3">
          {project.live && (
            <ActionLink href={project.live} primary>
              Live site
            </ActionLink>
          )}
          {project.repo && (
            <ActionLink href={project.repo}>
              <Github size={15} aria-hidden="true" />
              {project.repoLabel || 'GitHub'}
            </ActionLink>
          )}
        </Reveal>
        )}
      </div>
    </article>
  )
}
