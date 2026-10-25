import { education, experience } from '../data/content.js'
import { Reveal } from '../lib/motion.jsx'

function Row({ index, left, title, sub, children }) {
  return (
    <Reveal as="li" y={18} className="grid gap-3 border-b border-white/[0.07] py-7 md:grid-cols-12 md:gap-8 md:py-9">
      <div className="flex items-baseline gap-4 md:col-span-3">
        <span className="text-lg tabular-nums text-bone/80">{String(index + 1).padStart(2, '0')}</span>
        {left && <span className="font-mono text-[0.68rem] uppercase tracking-wider text-dim">{left}</span>}
      </div>
      <div className="md:col-span-4">
        <h3 className="text-[1.05rem] font-extrabold uppercase leading-tight tracking-[0.01em] text-bone md:text-[1.2rem]">{title}</h3>
        {sub && <p className="mt-1.5 text-[0.78rem] text-mute">{sub}</p>}
      </div>
      <div className="md:col-span-5">{children}</div>
    </Reveal>
  )
}

export default function Experience() {
  if (!experience.length && !education.length) return null
  return (
    <section id="experience" aria-labelledby="exp-title" className="relative bg-ink pb-16 pt-20 md:pb-24 md:pt-28">
      <div className="container-x">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-14">
          <Reveal as="h2" id="exp-title">
            <span className="chrome text-[clamp(2.8rem,5.6vw,5.2rem)]">On the</span>{' '}
            <span className="serif-i text-[clamp(3rem,6vw,5.6rem)] leading-none text-bone/90">record</span>
          </Reveal>
          <Reveal as="p" delay={0.1} className="label">
            Hackathons · Education
          </Reveal>
        </div>

        {experience.length > 0 && (
          <ul className="border-t border-white/[0.07]">
            {experience.map((e, i) => (
              <Row key={e.org + e.type} index={i} left={e.period} title={e.org} sub={e.type}>
                {e.role && <p className="text-[0.82rem] font-semibold text-bone">{e.role}</p>}
                {e.description && <p className="mt-2 text-[0.82rem] leading-[1.7] text-bone/60">{e.description}</p>}
                {e.points?.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {e.points.map((pt) => (
                      <li key={pt} className="flex gap-3 text-[0.78rem] leading-relaxed text-bone/55">
                        <span className="mt-[0.55em] h-1 w-1 shrink-0 bg-bone/50" aria-hidden="true" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                )}
              </Row>
            ))}
          </ul>
        )}

        {education.length > 0 && (
          <>
            <Reveal as="h3" className="label mb-4 mt-16 md:mt-20">
              Education
            </Reveal>
            <ul className="border-t border-white/[0.07]">
              {education.map((ed, i) => (
                <Row key={ed.school} index={i} left={ed.period} title={ed.school} sub={ed.place}>
                  <p className="text-[0.82rem] leading-[1.7] text-bone/70">{ed.detail}</p>
                </Row>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  )
}
