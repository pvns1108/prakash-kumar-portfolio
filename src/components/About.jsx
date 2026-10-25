import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { about, site } from '../data/content.js'
import { LineReveal, Reveal } from '../lib/motion.jsx'

const marqueeWords = ['Python Automation', 'AI / LLM Integration', 'Voice Interfaces', 'Responsive Web', 'Prompt Engineering', 'Rapid Prototyping']

export default function About() {
  const imgWrap = useRef(null)
  const { scrollYProgress } = useScroll({ target: imgWrap, offset: ['start end', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <section id="about" aria-labelledby="about-title" className="relative bg-ink">
      {/* keyword marquee */}
      <div className="overflow-hidden border-y border-line py-5" aria-hidden="true">
        <div className="marquee flex w-max gap-10 whitespace-nowrap font-grotesk text-sm uppercase tracking-[0.28em] text-mute">
          {[...marqueeWords, ...marqueeWords].map((w, i) => (
            <span key={i} className="flex items-center gap-10">
              {w}
              <span className="h-1.5 w-1.5 rounded-full bg-ember" />
            </span>
          ))}
        </div>
      </div>

      <div className="container-x py-14 md:py-20">
        <div className="mb-10 flex items-center justify-between md:mb-14">
          <Reveal as="p" className="eyebrow">
            <span className="text-ember">(01)</span>&nbsp;&nbsp;About
          </Reveal>
          <Reveal as="p" className="eyebrow hidden sm:block" delay={0.1}>
            Who I am
          </Reveal>
        </div>

        <h2
          id="about-title"
          className="font-grotesk text-[clamp(2.4rem,7.2vw,7rem)] font-semibold uppercase leading-[0.95] tracking-[-0.035em]"
        >
          <LineReveal>{about.heading[0]}</LineReveal>
          <LineReveal delay={0.08}>
            <span className="font-light text-mute">{about.heading[1]}</span>
          </LineReveal>
          <LineReveal delay={0.16}>
            <span className="text-outline-ember">{about.heading[2]}</span>
          </LineReveal>
        </h2>

        <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-12 md:items-start md:gap-10">
          {/* portrait */}
          <Reveal className="md:col-span-5 lg:col-span-4 md:sticky md:top-24" y={40}>
            <figure ref={imgWrap} className="group relative aspect-[4/5] overflow-hidden rounded-sm border border-line bg-ink-2">
              <motion.img
                src={site.photo}
                alt={`Portrait of ${site.firstName} ${site.lastName}, wearing a navy blazer, standing with arms crossed on a brick campus walkway`}
                loading="lazy"
                decoding="async"
                width="613"
                height="654"
                style={{ y: imgY }}
                className="absolute inset-x-0 top-[-8%] h-[116%] w-full object-cover object-[50%_20%] grayscale-[0.85] contrast-[1.08] brightness-[0.85] transition-[filter] duration-700 group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_80%_10%,rgba(255,90,60,0.28),transparent_70%)] mix-blend-screen" />
              <figcaption className="absolute bottom-4 left-4 right-4 flex items-end justify-between font-grotesk text-xs text-bone/80">
                <span>
                  {site.firstName} {site.lastName}
                </span>
                <span className="eyebrow !text-[0.6rem]">{site.location.split('/')[0].trim()}</span>
              </figcaption>
            </figure>
          </Reveal>

          {/* copy */}
          <div className="flex flex-col md:col-span-7 lg:col-span-8">
            <div className="space-y-6">
              {about.paragraphs.map((p, i) => (
                <Reveal
                  as="p"
                  key={i}
                  delay={i * 0.1}
                  className={
                    i === 0
                      ? 'font-grotesk text-xl leading-snug text-bone md:text-2xl'
                      : 'max-w-xl leading-relaxed text-mute md:text-lg'
                  }
                >
                  {p}
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.15} className="mt-10">
              <dl className="grid grid-cols-1 border-t border-line sm:grid-cols-3">
                {about.meta.map((m) => (
                  <div key={m.label} className="border-b border-line py-4 sm:border-b-0 sm:py-5 sm:pr-4">
                    <dt className="eyebrow mb-1.5">{m.label}</dt>
                    <dd className="font-grotesk text-sm text-bone">{m.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-line pt-8">
              {about.stats.map((s, i) => (
                <Reveal key={s.label} delay={0.1 * i}>
                  <p className="font-display text-[clamp(3rem,7vw,5.5rem)] leading-none text-bone">
                    {s.value}
                    <span className="text-ember">.</span>
                  </p>
                  <p className="eyebrow mt-3 !tracking-[0.16em]">{s.label}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
