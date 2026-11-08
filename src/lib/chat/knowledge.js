/**
 * Chatbot knowledge — built ONLY from the existing portfolio content
 * (src/data/content.js) plus the existing resume file. Nothing here is
 * typed in by hand, so updating content.js updates the chatbot too.
 *
 * Shared by the browser (built-in answer engine) and the backend
 * (api/chat.js, as the AI's only source of truth).
 */
import {
  site,
  socials,
  navLinks,
  about,
  projects,
  experience,
  education,
  certificates,
  skills,
  contact,
} from '../../data/content.js'

export const PORTFOLIO_URL = socials.portfolio || ''
export const RESUME_PATH = 'resume/Prakash_Kumar_Resume.pdf'
export const RESUME_URL = PORTFOLIO_URL ? new URL(RESUME_PATH, PORTFOLIO_URL).href : ''
export const GITHUB_USER = (socials.github || '').replace(/\/+$/, '').split('/').pop() || ''

export const fullName = `${site.firstName} ${site.lastName}`.trim()

/** Readable project name: title + accent ("Fresh" + "link" → "Freshlink"). */
export function projectName(p) {
  const a = p.accent || ''
  // Decorative accents that aren't part of the name ("Jarvis · voice")
  if (!a || a === 'voice') return p.title
  // "Developer" + "portfolio" / "Campus" + "ERP" → two words
  if (a === 'portfolio' || /^[A-Z]/.test(a)) return `${p.title} ${a}`
  // "Fresh" + "link" → "FreshLink", "Voice" + "shield" → "VoiceShield"
  return `${p.title}${a.charAt(0).toUpperCase()}${a.slice(1)}`
}

/** In-page section links, e.g. { id: 'work', label: 'Work', href: '#work' } */
export const sections = navLinks.map((n) => ({ ...n, href: `#${n.id}` }))
export const sectionLink = (id) => {
  const s = sections.find((x) => x.id === id)
  return s ? { label: `${s.label} section`, href: s.href } : null
}

export { site, socials, about, projects, experience, education, certificates, skills, contact }

/**
 * Plain-text knowledge document — the backend gives this to the AI as its
 * only source. Kept factual: just what the portfolio and resume say.
 */
export function buildKnowledgeText({ githubRepos = [] } = {}) {
  const L = []
  const line = (s = '') => L.push(s)

  line(`# ${fullName}`)
  line(`Role: ${site.role}`)
  line(`Location: ${site.location}`)
  line(`Introduction: ${site.heroIntro}`)
  if (site.available && site.availabilityText) line(`Availability: ${site.availabilityText}`)
  line()

  line('## About')
  about.paragraphs.forEach((p) => line(p))
  about.meta.forEach((m) => line(`${m.label}: ${m.value}`))
  about.stats.forEach((s) => line(`${s.label}: ${Number(s.value)}`))
  line()

  line('## Education')
  education.forEach((e) =>
    line(`- ${e.school} — ${e.detail}${e.place ? `, ${e.place}` : ''}${e.period ? ` (${e.period})` : ''}`),
  )
  line()

  line('## Skills')
  skills.forEach((g) => line(`- ${g.title}: ${g.items.join(', ')}. ${g.blurb || ''}`.trim()))
  line()

  line('## Projects')
  projects.forEach((p) => {
    line(`### ${projectName(p)} — ${p.subtitle}`)
    line(`Category: ${p.category}${p.year ? ` · ${p.year}` : ''}`)
    line(p.description)
    if (p.tags?.length) line(`Technologies: ${p.tags.join(', ')}`)
    if (p.live) line(`Live site: ${p.live}`)
    if (p.repo) line(`Source code: ${p.repo}`)
  })
  line()

  line('## Experience (hackathons)')
  experience.forEach((e) => {
    line(`- ${e.type} at ${e.org}${e.period ? ` (${e.period})` : ''} — ${e.role}. ${e.description} ${(e.points || []).join(' ')}`.trim())
  })
  line('No internships or paid work experience are listed in the portfolio or resume.')
  line()

  line('## Certificates')
  certificates.forEach((c) => line(`- ${c.title} — ${c.issuer} (${c.type}${c.date ? `, ${c.date}` : ''})`))
  line()

  line('## Contact')
  line(`Email: ${site.email}`)
  if (site.phone) line(`Phone: ${site.phone}`)
  if (socials.linkedin) line(`LinkedIn: ${socials.linkedin}`)
  if (socials.github) line(`GitHub: ${socials.github}`)
  if (PORTFOLIO_URL) line(`Portfolio: ${PORTFOLIO_URL}`)
  if (RESUME_URL) line(`Resume (PDF download): ${RESUME_URL}`)
  line()

  line('## Portfolio sections (link with these anchors)')
  sections.forEach((s) => line(`- ${s.label}: ${s.href}`))

  if (githubRepos.length) {
    line()
    line('## Public GitHub repositories (live from the GitHub API)')
    githubRepos.forEach((r) =>
      line(`- ${r.name}${r.language ? ` [${r.language}]` : ''}${r.description ? ` — ${r.description}` : ''}: ${r.url}`),
    )
  }
  return L.join('\n')
}

/** Every URL the assistant is allowed to show (used to strip invented links). */
export function knownUrls({ githubRepos = [] } = {}) {
  const urls = new Set(
    [socials.github, socials.linkedin, PORTFOLIO_URL, RESUME_URL, ...projects.flatMap((p) => [p.live, p.repo])].filter(Boolean),
  )
  githubRepos.forEach((r) => urls.add(r.url))
  return urls
}

/** Public repos via the GitHub API (no key needed). Cached per page load / server instance. */
let repoCache = null
let repoCacheAt = 0
export async function fetchGithubRepos({ token, maxAgeMs = 60 * 60 * 1000 } = {}) {
  if (!GITHUB_USER) return []
  if (repoCache && Date.now() - repoCacheAt < maxAgeMs) return repoCache
  const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=pushed&per_page=30`, {
    headers: { Accept: 'application/vnd.github+json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  })
  if (!res.ok) throw new Error(`GitHub API ${res.status}`)
  const data = await res.json()
  repoCache = data
    .filter((r) => !r.fork && !r.private)
    .map((r) => ({
      name: r.name,
      description: r.description || '',
      language: r.language || '',
      url: r.html_url,
      homepage: r.homepage || '',
      pushedAt: r.pushed_at,
    }))
  repoCacheAt = Date.now()
  return repoCache
}
