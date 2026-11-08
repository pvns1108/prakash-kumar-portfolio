/**
 * Built-in answer engine — answers from the portfolio data in the browser.
 * Used when no AI backend is configured, and as a fallback when the AI is
 * unavailable. It never invents anything: every answer is assembled from
 * knowledge.js, and unknown questions get an honest "not available".
 *
 * Answer shape: { text, links: [{label, href}], followups: [string], topic }
 */
import {
  site,
  socials,
  about,
  projects,
  experience,
  education,
  certificates,
  skills,
  fullName,
  projectName,
  sectionLink,
  RESUME_URL,
  fetchGithubRepos,
} from './knowledge.js'

const first = site.firstName

// ── helpers ─────────────────────────────────────────────────────────────
const norm = (s) =>
  ` ${String(s)
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9+#.\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()} `
const has = (q, ...words) => words.some((w) => q.includes(` ${w}`))
const list = (items) => items.map((i) => `- ${i}`).join('\n')
const linksFor = (...ls) => ls.flat().filter(Boolean)
const projectLinks = (p) =>
  linksFor(p.live && { label: `${projectName(p)} live`, href: p.live }, p.repo && { label: `${projectName(p)} on GitHub`, href: p.repo })

const PROJECT_ALIASES = {
  freshlink: ['freshlink', 'fresh link', 'food waste', 'food freshness', 'donation'],
  'psit-erp': ['erp', 'campus erp', 'campus', 'college erp', 'psit erp'],
  jarvis: ['jarvis', 'desktop assistant', 'voice assistant', 'virtual assistant'],
  voiceshield: ['voiceshield', 'voice shield', 'deepfake', 'ai voice detect', 'audio forensic', 'voice detect'],
  portfolio: ['this portfolio website', 'portfolio website', 'this website', 'this site', 'developer portfolio project', 'portfolio project'],
}
function findProject(q) {
  for (const p of projects) {
    const aliases = PROJECT_ALIASES[p.id] || [projectName(p).toLowerCase(), p.title.toLowerCase()]
    if (aliases.some((a) => q.includes(` ${a}`))) return p
  }
  return null
}

const FOLLOW = {
  summary: ['Explore his projects', 'What are his technical skills?', 'Recruiter overview'],
  education: ['What are his technical skills?', 'Tell me about his experience', 'Show his certificates'],
  skills: ['Explore his projects', 'What programming languages does he know?', 'Show his certificates'],
  projects: ['Explain his best project', 'Tell me about FreshLink', 'Does he have open-source work?'],
  experience: ['Show his certificates', 'Explore his projects', 'How can I contact Prakash?'],
  certificates: ['Tell me about his experience', 'What are his technical skills?', 'Recruiter overview'],
  contact: ['Download his resume', 'Recruiter overview', 'Summarize Prakash’s portfolio'],
  github: ['Explore his projects', 'Explain his best project', 'How can I contact Prakash?'],
  recruiter: ['Download his resume', 'How can I contact Prakash?', 'Explain his best project'],
  project: ['What technologies does it use?', 'Show its GitHub repo', 'Explore his other projects'],
  fallback: ['Summarize Prakash’s portfolio', 'Explore his projects', 'How can I contact Prakash?'],
}

// ── answers ─────────────────────────────────────────────────────────────
function summary() {
  const langs = skills.find((g) => /language/i.test(g.title))?.items || []
  const intro = /^I’m /.test(about.paragraphs[0]) ? about.paragraphs[0].replace(/^I’m /, `${fullName} is `) : `${fullName}: ${site.heroIntro}`
  return {
    text:
      `${intro}\n\n` +
      list([
        `**Projects:** ${projects.map(projectName).join(', ')}`,
        `**Languages:** ${langs.join(', ')}`,
        `**Hackathons:** ${experience.map((e) => `${e.type.split('·')[0].trim()} (${e.org})`).join(', ')}`,
        `**Certificates:** ${certificates.length}, including ${[...new Set(certificates.map((c) => c.issuer.split('·')[0].split('&').pop().trim()))].slice(0, 5).join(', ')}`,
      ]) +
      (site.available ? `\n\n${site.availabilityText}.` : ''),
    links: linksFor(sectionLink('about'), sectionLink('work')),
    followups: FOLLOW.summary,
    topic: { kind: 'summary' },
  }
}

function recruiter() {
  const full = projects.filter((p) => p.live)
  return {
    text:
      `**Recruiter overview: ${fullName}**\n\n` +
      list([
        `**Education:** ${education[0].detail}, ${education[0].school} (${education[0].period || education[0].place})`,
        `**Core skills:** ${skills.flatMap((g) => g.items).filter((v, i, a) => a.indexOf(v) === i).slice(0, 12).join(', ')}`,
        `**Shipped work:** ${full.map(projectName).join(', ')}${full.length ? ' (live deployments)' : ''}`,
        `**Hackathons:** ${experience.length}, including ${experience.map((e) => e.org).join(', ')}`,
        `**Job simulations:** ${certificates.filter((c) => c.type === 'Job Simulation').map((c) => c.issuer.split('·')[0].trim()).join(', ')}`,
        `**Availability:** ${site.availabilityText}`,
      ]) +
      `\n\nNo internships or paid roles are listed yet.`,
    links: linksFor(RESUME_URL && { label: 'Download resume (PDF)', href: RESUME_URL }, socials.linkedin && { label: 'LinkedIn', href: socials.linkedin }, { label: 'Email', href: `mailto:${site.email}` }),
    followups: FOLLOW.recruiter,
    topic: { kind: 'recruiter' },
  }
}

function educationAnswer(q) {
  const college = education.find((e) => /institute|university|college|b\.?tech/i.test(`${e.school} ${e.detail}`))
  const schools = education.filter((e) => e !== college)
  const wantsSchool = has(q, 'school', 'class', '12th', '10th', 'xii', 'senior secondary', 'secondary')
  const wantsCollege = has(q, 'college', 'university', 'degree', 'btech', 'b.tech', 'studying', 'pursuing', 'institute', 'psit')
  const fmt = (e) => `**${e.school}**: ${e.detail}${e.place ? `, ${e.place}` : ''}${e.period ? ` (${e.period})` : ''}`
  let text
  if (wantsSchool && !wantsCollege) text = `${first} attended:\n\n${list(schools.map(fmt))}`
  else if (wantsCollege && !wantsSchool && college) text = `${first} is studying at **${college.school}**, ${college.place}: ${college.detail} (${college.period || 'in progress'}).`
  else text = `${first}’s education:\n\n${list(education.map(fmt))}`
  return { text, links: linksFor(sectionLink('experience')), followups: FOLLOW.education, topic: { kind: 'education' } }
}

function skillsAnswer(q) {
  if (has(q, 'language', 'languages', 'code in', 'coding')) {
    const g = skills.find((x) => /language/i.test(x.title))
    return { text: `${first} programs in **${g.items.join(', ')}**.`, links: linksFor(sectionLink('skills')), followups: FOLLOW.skills, topic: { kind: 'skills' } }
  }
  return {
    text: `${first}’s technical skills:\n\n${list(skills.map((g) => `**${g.title}:** ${g.items.join(', ')}`))}`,
    links: linksFor(sectionLink('skills')),
    followups: FOLLOW.skills,
    topic: { kind: 'skills' },
  }
}

function technologiesAnswer() {
  const fromProjects = [...new Set(projects.flatMap((p) => p.tags || []))]
  return {
    text: `Across his projects ${first} has used **${fromProjects.join(', ')}**.\n\nHis listed skill set also covers ${skills.find((g) => /tools/i.test(g.title))?.items.join(', ')}.`,
    links: linksFor(sectionLink('skills'), sectionLink('work')),
    followups: FOLLOW.skills,
    topic: { kind: 'skills' },
  }
}

function projectsAnswer() {
  return {
    text: `${first} has ${projects.length} featured projects:\n\n${list(projects.map((p) => `**${projectName(p)}**: ${p.subtitle}`))}\n\nAsk about any one for details and links.`,
    links: linksFor(sectionLink('work')),
    followups: FOLLOW.projects,
    topic: { kind: 'projects' },
  }
}

function projectAnswer(p, q = ' ') {
  const name = projectName(p)
  if (has(q, 'github', 'repo', 'repository', 'source', 'code')) {
    return p.repo
      ? { text: `Here’s the source for **${name}**: ${p.repo}`, links: projectLinks(p), followups: FOLLOW.project, topic: { kind: 'project', id: p.id } }
      : { text: `A repository link for **${name}** isn’t listed in the portfolio.`, links: projectLinks(p), followups: FOLLOW.project, topic: { kind: 'project', id: p.id } }
  }
  if (has(q, 'live', 'demo', 'deployed', 'url', 'link', 'website', 'try')) {
    return p.live
      ? { text: `**${name}** is live at ${p.live}`, links: projectLinks(p), followups: FOLLOW.project, topic: { kind: 'project', id: p.id } }
      : { text: `There’s no live demo listed for **${name}**.${p.repo ? ' The source code is on GitHub.' : ''}`, links: projectLinks(p), followups: FOLLOW.project, topic: { kind: 'project', id: p.id } }
  }
  if (has(q, 'tech', 'stack', 'built with', 'technologies', 'technology', 'language', 'use', 'uses')) {
    return { text: `**${name}** is built with ${p.tags.join(', ')}.`, links: projectLinks(p), followups: FOLLOW.project, topic: { kind: 'project', id: p.id } }
  }
  return {
    text: `**${name}**: ${p.subtitle} (${p.category})\n\n${p.description}\n\n**Tech:** ${p.tags.join(', ')}`,
    links: projectLinks(p),
    followups: FOLLOW.project,
    topic: { kind: 'project', id: p.id },
  }
}

function bestProject() {
  const ranked = projects.filter((p) => p.live && p.repo)
  const pick = ranked[0] || projects[0]
  return {
    text:
      `The portfolio doesn’t name a single favourite, but **${projectName(pick)}** is his most complete build: a live, full-stack project that leads his Work section.\n\n${pick.description}\n\n**Tech:** ${pick.tags.join(', ')}` +
      (ranked.length > 1 ? `\n\nAlso fully deployed: ${ranked.slice(1).map(projectName).join(', ')}.` : ''),
    links: projectLinks(pick),
    followups: FOLLOW.project,
    topic: { kind: 'project', id: pick.id },
  }
}

function experienceAnswer(q) {
  const text =
    `${first}’s experience so far comes from hackathons:\n\n` +
    list(experience.map((e) => `**${e.type}**, ${e.org}${e.period ? ` (${e.period})` : ''}: ${e.role}. ${e.description}`)) +
    (has(q, 'intern', 'internship', 'job', 'work experience', 'company', 'employ')
      ? `\n\nNo internships or paid roles are listed yet. He’s ${site.availabilityText.toLowerCase()}.`
      : `\n\nHe has also completed job simulations with ${certificates.filter((c) => c.type === 'Job Simulation').map((c) => c.issuer.split('·')[0].trim()).join(', ')}.`)
  return { text, links: linksFor(sectionLink('experience')), followups: FOLLOW.experience, topic: { kind: 'experience' } }
}

function certificatesAnswer() {
  const groups = {}
  certificates.forEach((c) => (groups[c.type] = groups[c.type] || []).push(`${c.title} (${c.issuer})`))
  const text =
    `${first} has ${certificates.length} certificates:\n\n` +
    Object.entries(groups)
      .map(([type, items]) => `**${type}s**\n${list(items)}`)
      .join('\n\n')
  return { text, links: linksFor(sectionLink('certificates')), followups: FOLLOW.certificates, topic: { kind: 'certificates' } }
}

function strengthsAnswer() {
  const live = projects.filter((p) => p.live).map(projectName)
  return {
    text:
      `Based on what his portfolio shows:\n\n` +
      list([
        `**Shipping full-stack products:** ${live.join(', ')} are live`,
        `**AI integration:** ${projects.filter((p) => /AI/.test(p.category)).map(projectName).join(', ')}`,
        `**Building under pressure:** ${experience.length} hackathons`,
        `**Continuous learning:** ${certificates.length} certificates, including job simulations and Anthropic courses`,
      ]),
    links: linksFor(sectionLink('work')),
    followups: FOLLOW.summary,
    topic: { kind: 'summary' },
  }
}

async function githubAnswer(q) {
  const isOpenSource = has(q, 'open source', 'opensource', 'open-source', 'contribut')
  let repos = []
  try {
    repos = await fetchGithubRepos()
  } catch {
    /* offline or rate-limited — answer from portfolio links only */
  }
  const lead = isOpenSource
    ? `The portfolio doesn’t list contributions to other people’s open-source projects. All of his own projects are public on GitHub.`
    : `${first}’s GitHub profile is ${socials.github}`
  const body = repos.length
    ? `\n\n**Recently updated public repositories:**\n${list(repos.slice(0, 6).map((r) => `${r.name}${r.language ? ` (${r.language})` : ''}${r.description ? `: ${r.description}` : ''}`))}`
    : `\n\n**Repositories from his projects:**\n${list(projects.filter((p) => p.repo && p.repo !== socials.github).map((p) => `${projectName(p)}: ${p.repo}`))}`
  return {
    text: lead + body,
    links: linksFor({ label: 'GitHub profile', href: socials.github }, repos.slice(0, 3).map((r) => ({ label: r.name, href: r.url }))),
    followups: FOLLOW.github,
    topic: { kind: 'github' },
  }
}

function contactAnswer(q) {
  const only = has(q, 'email', 'mail') ? 'email' : has(q, 'phone', 'call', 'number', 'whatsapp') ? 'phone' : has(q, 'linkedin') ? 'linkedin' : null
  const items = {
    email: `**Email:** ${site.email}`,
    phone: site.phone && `**Phone:** ${site.phone}`,
    linkedin: socials.linkedin && `**LinkedIn:** ${socials.linkedin}`,
    github: `**GitHub:** ${socials.github}`,
  }
  const text = only && items[only] ? items[only] : `You can reach ${first} here:\n\n${list(Object.values(items).filter(Boolean))}`
  return {
    text,
    links: linksFor({ label: 'Email', href: `mailto:${site.email}` }, socials.linkedin && { label: 'LinkedIn', href: socials.linkedin }, sectionLink('contact')),
    followups: FOLLOW.contact,
    topic: { kind: 'contact' },
  }
}

function resumeAnswer() {
  return RESUME_URL
    ? { text: `Yes. You can download ${first}’s resume as a PDF here: ${RESUME_URL}`, links: [{ label: 'Download resume (PDF)', href: RESUME_URL }], followups: ['Recruiter overview', 'How can I contact Prakash?', 'Explain his best project'], topic: { kind: 'resume' } }
    : { text: `A resume download isn’t available on the portfolio right now. You can ask ${first} directly at ${site.email}.`, links: [], followups: FOLLOW.contact, topic: { kind: 'resume' } }
}

// ── router ──────────────────────────────────────────────────────────────
const PRONOUN = ['it ', 'its ', 'this project', 'that project', 'the project', 'this one', 'that one']
const PROJECT_FOLLOW = ['more', 'detail', 'explain', 'tech', 'stack', 'built', 'live', 'demo', 'github', 'repo', 'source', 'code', 'link', 'feature', 'how does it', 'how it']
const GLOBAL = ['his ', 'he ', 'all ', 'other', 'overall', 'best', 'resume', 'contact', 'email', 'educat', 'certif', 'hackathon', 'experience', 'skill']

export async function localAnswer(question, context = {}) {
  const a = await answer(question, context)
  // never suggest the question that was just asked
  const asked = norm(question)
  return { ...a, followups: a.followups.filter((f) => norm(f) !== asked) }
}

async function answer(question, context) {
  const q = norm(question)
  const lastProject = context.topic?.kind === 'project' ? projects.find((p) => p.id === context.topic.id) : null

  if (!q.trim()) return fallback(q)
  if (/^ (hi|hello|hey|hii|namaste|yo|good (morning|afternoon|evening))( there)? $/.test(q))
    return { text: `Hi! Ask me anything about ${first}’s education, skills, projects, experience or how to contact him.`, links: [], followups: FOLLOW.fallback, topic: context.topic }
  if (has(q, 'thank', 'thanks', 'thx')) return { text: `You’re welcome! Anything else you’d like to know about ${first}?`, links: [], followups: FOLLOW.fallback, topic: context.topic }

  // A named project wins over everything else
  const named = findProject(q)
  if (named) return projectAnswer(named, q)

  // "its GitHub?", "tech stack?", "tell me more" → the project we were just discussing
  if (lastProject && (has(q, ...PRONOUN) || (has(q, ...PROJECT_FOLLOW) && !has(q, ...GLOBAL)))) return projectAnswer(lastProject, q)

  return (await route(q)) || fallback(q)
}

async function route(q) {
  if (has(q, 'resume', 'cv', 'biodata')) return resumeAnswer()
  if (has(q, 'recruit', 'hire', 'hiring', 'qualif', 'why should', 'candidate', 'shortlist')) return recruiter()
  if (has(q, 'contact', 'email', 'mail', 'phone', 'call', 'reach', 'linkedin', 'whatsapp', 'number', 'connect with')) return contactAnswer(q)
  if (has(q, 'best project', 'favourite', 'favorite', 'top project', 'main project', 'flagship', 'proudest', 'best work')) return bestProject()
  if (has(q, 'open source', 'opensource', 'contribut', 'github', 'repo', 'repos', 'repositor')) return githubAnswer(q)
  if (has(q, 'school', 'college', 'universit', 'educat', 'degree', 'btech', 'b.tech', 'study', 'studying', 'studied', 'psit', 'class 12', 'class 10'))
    return educationAnswer(q)
  if (has(q, 'certif', 'course', 'courses', 'achiev', 'award', 'accomplish', 'simulation')) return certificatesAnswer()
  if (has(q, 'hackathon', 'experience', 'intern', 'internship', 'job', 'worked', 'career')) return experienceAnswer(q)
  if (has(q, 'technolog', 'tech stack', 'stack', 'frameworks', 'tools')) return technologiesAnswer()
  if (has(q, 'skill', 'language', 'languages', 'does he know', 'he knows', 'expert', 'proficien')) return skillsAnswer(q)
  if (has(q, 'strength', 'strong', 'good at', 'best at', 'stand out', 'unique')) return strengthsAnswer()
  if (has(q, 'project', 'projects', 'built', 'build', 'developed', 'made', 'work', 'explore')) return projectsAnswer()
  if (has(q, 'where', 'location', 'based', 'city', 'live ')) return { text: `${first} is based in **${site.location}**.`, links: linksFor(sectionLink('about')), followups: FOLLOW.summary, topic: { kind: 'summary' } }
  if (has(q, 'available', 'availability', 'open to', 'freelance', 'collab')) return { text: `${site.availabilityText}. The best way to start is email: ${site.email}`, links: linksFor({ label: 'Email', href: `mailto:${site.email}` }), followups: FOLLOW.contact, topic: { kind: 'contact' } }
  if (has(q, 'summar', 'overview', 'about', 'who is', 'who are', 'introduce', 'tell me about', 'portfolio', 'background', 'profile', 'himself', 'prakash'))
    return summary()
  return null
}

function fallback(q) {
  const aboutHim = has(q, 'he', 'his', 'him', 'prakash', 'you')
  return {
    text: aboutHim
      ? `That isn’t covered in ${first}’s portfolio or resume, so I can’t answer it accurately. You could ask him directly at ${site.email}.`
      : `I can only answer questions about ${first}’s portfolio: his education, skills, projects, experience, certificates and contact details.`,
    links: [],
    followups: FOLLOW.fallback,
    topic: null,
  }
}

