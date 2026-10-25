import { about, site, skills } from '../data/content.js'
import { Reveal } from '../lib/motion.jsx'

/** Splits all skill items into `n` marquee rows. */
function stackRows(n) {
  const all = [...new Set(skills.flatMap((g) => g.items))]
  const rows = Array.from({ length: n }, () => [])
  all.forEach((item, i) => rows[i % n].push(item))
  // pad short rows so each loop is wide enough
  return rows.map((r) => (r.length < 8 ? [...r, ...r, ...r].slice(0, Math.max(8, r.length)) : r))
}

function Chip({ children }) {
  return (
    <li className="flex shrink-0 items-center gap-2 rounded-md border border-white/[0.06] bg-white/[0.035] px-3.5 py-2 text-[0.72rem] font-medium text-bone/85">
      <span className="h-1 w-1 rounded-full bg-bone/40" aria-hidden="true" />
      {children}
    </li>
  )
}

export default function About() {
  const rows = stackRows(4)

  return (
    <section id="about" aria-labelledby="about-title" className="relative overflow-hidden bg-ink pb-20 pt-24 md:pb-28 md:pt-32">
      <div className="container-x grid gap-10 md:grid-cols-12 md:items-start md:gap-8">
        <div className="md:col-span-5">
          <Reveal as="p" className="label mb-3">
            About me
          </Reveal>
          <Reveal as="h2" id="about-title" className="chrome !normal-case text-[clamp(4.2rem,11vw,9.5rem)]" delay={0.05}>
            Intro
          </Reveal>
          <Reveal delay={0.15} className="mt-10 grid grid-cols-3 gap-4 md:max-w-sm">
            {about.stats.map((s) => (
              <div key={s.label}>
                <p className="chrome-soft text-3xl font-black tabular-nums tracking-tight md:text-4xl">{s.value}</p>
                <p className="mt-1 text-[0.68rem] leading-snug text-mute">{s.label}</p>
              </div>
            ))}
          </Reveal>
        </div>

        <Reveal delay={0.1} className="md:col-span-7 md:col-start-6 lg:col-span-6 lg:col-start-7">
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.035] p-6 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] md:p-8">
            <p className="text-[0.92rem] leading-[1.75] text-bone/80">
              Hey, I’m <strong className="font-semibold text-bone">{site.firstName}.</strong> {site.heroIntro}
            </p>
            {about.paragraphs.map((p) => (
              <p key={p.slice(0, 20)} className="mt-4 text-[0.92rem] leading-[1.75] text-bone/70">
                {p}
              </p>
            ))}
            <dl className="mt-7 grid grid-cols-1 gap-4 border-t border-white/[0.07] pt-6 sm:grid-cols-3">
              {about.meta.map((m) => (
                <div key={m.label}>
                  <dt className="label">{m.label}</dt>
                  <dd className="mt-1.5 text-sm font-medium text-bone">{m.value}</dd>
                </div>
              ))}
            </dl>
            {site.available && (
              <p className="mt-6 flex items-center gap-2 text-xs text-mute">
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-green-400" aria-hidden="true" />
                {site.availabilityText}
              </p>
            )}
          </div>
        </Reveal>
      </div>

      <div className="mt-20 md:mt-24">
        <Reveal as="p" className="label container-x mb-5">
          The stack
        </Reveal>
        <Reveal delay={0.1} className="marquee-mask space-y-3">
          {rows.map((row, i) => (
            <div key={i} className="overflow-hidden">
              <ul className={`flex w-max gap-3 ${i % 2 ? 'marquee-rev' : 'marquee'}`} aria-label={i === 0 ? 'Skills' : undefined}>
                {[...row, ...row].map((item, j) => (
                  <Chip key={`${item}-${j}`}>{item}</Chip>
                ))}
              </ul>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
