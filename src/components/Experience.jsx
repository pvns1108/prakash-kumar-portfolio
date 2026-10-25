import { education, experience } from '../data/content.js'
import { LineReveal, Reveal } from '../lib/motion.jsx'

export default function Experience() {
  return (
    <section id="experience" aria-labelledby="exp-title" className="relative bg-ink">
      <div className="container-x py-14 md:py-20">
        <div className="mb-10 flex items-center justify-between md:mb-14">
          <Reveal as="p" className="eyebrow">
            <span className="text-ember">(03)</span>&nbsp;&nbsp;Experience
          </Reveal>
          <Reveal as="p" className="eyebrow" delay={0.1}>
            Hackathons · Education
          </Reveal>
        </div>

        <h2 id="exp-title" className="mb-10 font-grotesk text-[clamp(2.4rem,6.5vw,6.5rem)] font-semibold uppercase leading-[0.95] tracking-[-0.035em] md:mb-14">
          <LineReveal>Built under</LineReveal>
          <LineReveal delay={0.08}>
            <span className="font-light text-mute">pressure.</span>
          </LineReveal>
        </h2>

        {/* Timeline */}
        <ol className="border-b border-line">
          {experience.map((e) => (
            <li key={e.org + e.type} className="group border-t border-line">
              <Reveal className="grid gap-4 py-8 md:grid-cols-12 md:gap-10 md:py-11">
                <div className="md:col-span-4">
                  {e.period && <p className="eyebrow mb-3 !text-ember">{e.period}</p>}
                  <p className="font-grotesk text-xl text-bone">{e.org}</p>
                  {e.type && <p className="eyebrow mt-2">{e.type}</p>}
                </div>
                <div className="md:col-span-8">
                  <h3 className="font-grotesk text-[clamp(1.6rem,3.4vw,2.8rem)] font-semibold leading-tight tracking-tight text-bone transition-colors duration-500 group-hover:text-ember">
                    {e.role}
                  </h3>
                  {e.description && <p className="mt-3 max-w-2xl leading-relaxed text-mute md:text-lg">{e.description}</p>}
                  {e.points?.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {e.points.map((p) => (
                        <li key={p} className="flex gap-3 text-bone/80">
                          <span className="mt-[0.6em] h-px w-4 shrink-0 bg-ember" aria-hidden="true" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        {/* Education — one row of columns, no empty side column */}
        {education.length > 0 && (
          <div className="mt-14 md:mt-20">
            <Reveal as="h3" className="eyebrow mb-5">Education</Reveal>
            <ul className={`grid gap-px overflow-hidden border border-line bg-line ${education.length >= 3 ? 'md:grid-cols-3' : education.length === 2 ? 'md:grid-cols-2' : ''}`}>
              {education.map((ed) => {
                const meta = [ed.place, ed.period].filter(Boolean).join(' · ')
                return (
                  <Reveal as="li" key={ed.school} className="flex flex-col gap-2 bg-ink p-6 md:p-7">
                    {meta && <p className="eyebrow !text-ember">{meta}</p>}
                    <p className="font-grotesk text-lg leading-snug text-bone">{ed.school}</p>
                    {ed.detail && <p className="text-sm text-mute">{ed.detail}</p>}
                  </Reveal>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
