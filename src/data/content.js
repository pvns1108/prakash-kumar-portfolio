/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONTENT — edit everything about the portfolio here.
 *  Components read from this file only, so you never need to
 *  touch JSX to update text, links, projects or skills.
 *
 *  Any field left as "" (or an empty list) is skipped entirely
 *  on the site — no placeholder, no empty gap.
 * ─────────────────────────────────────────────────────────────
 */

// Files in /public are served under the site's base path
// (e.g. /prakash-kumar-portfolio/ on GitHub Pages). asset() adds it.
const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

export const site = {
  firstName: 'Prakash',
  lastName: 'Kumar',
  monogram: 'PK',
  role: 'Developer · AI Builder',
  location: 'Varanasi / Kanpur, India',
  email: 'pvns1108@gmail.com',
  phone: '+91 6394477644',
  photo: asset('/prakash.webp'),
  available: true,
  availabilityText: 'Open to internships & collaborations',
  heroIntro:
    'Computer Science undergraduate at PSIT, Kanpur — building at the intersection of Python automation, AI/LLM integration and modern, responsive web development.',
}

export const socials = {
  github: 'https://github.com/pvns1108',
  linkedin: 'https://www.linkedin.com/in/prakash-kumar-rai-25aaa42b0',
  portfolio: 'https://pvns1108.github.io',
}

export const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'certificates', label: 'Certificates' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
]

export const about = {
  heading: ['I build tools that', 'listen, think', 'and ship.'],
  paragraphs: [
    'I’m a Computer Science & Engineering student at Pranveer Singh Institute of Technology (PSIT), Kanpur, with hands-on experience in Python automation, AI/LLM integration and modern web development.',
    'Most of what I learn, I learn by building — voice-driven assistants, responsive interfaces, and rapid prototypes made under hackathon pressure at IIT BHU, Adobe and IIMT University Meerut. Alongside that I’ve completed job simulations with Tata, Deloitte and Goldman Sachs, and courses from Anthropic and Infosys Springboard.',
  ],
  meta: [
    { label: 'Based in', value: 'Varanasi / Kanpur' },
    { label: 'Studying', value: 'B.Tech CSE · PSIT' },
    { label: 'Focus', value: 'AI · Automation · Web' },
  ],
  stats: [
    { value: '03', label: 'Hackathons competed' },
    { value: '08', label: 'Courses & simulations' },
    { value: '03', label: 'Featured builds' },
  ],
}

/**
 * Projects — `live`, `repo`, `year`, `image` are optional.
 * Leave them "" and they are simply not shown.
 */
export const projects = [
  {
    id: 'jarvis',
    title: 'Jarvis',
    subtitle: 'AI Virtual Desktop Assistant',
    category: 'AI · Automation',
    year: '',
    description:
      'An intelligent voice-activated desktop assistant that executes system operations, manages applications and navigates the web — with conversational intent processing and low-latency responses for hands-free productivity. Built on a modular codebase designed for continuous feature growth and OS-level automation.',
    tags: ['Python', 'SpeechRecognition', 'Pyttsx3', 'AI APIs'],
    live: '',
    repo: 'https://github.com/pvns1108',
    image: '',
    visual: 'voice',
  },
  {
    id: 'portfolio',
    title: 'Developer Portfolio',
    subtitle: 'Personal website',
    category: 'Web · Frontend',
    year: '',
    description:
      'An interactive, mobile-responsive developer portfolio showcasing technical projects, hackathon achievements and contact channels — built with clean responsive CSS layouts for fast loading and cross-device compatibility.',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'GitHub Pages'],
    live: 'https://pvns1108.github.io',
    repo: 'https://github.com/pvns1108',
    image: '',
    visual: 'browser',
  },
  {
    id: 'voiceshield',
    title: 'VoiceShield',
    subtitle: 'Audio forensics & AI-voice detection',
    category: 'AI · Security',
    year: '',
    description:
      'A web app that analyses uploaded or recorded audio to estimate whether a voice is real or AI-generated, using the AASIST anti-spoofing model alongside waveform, spectrogram, pitch and signal-quality views, transcription and saved analysis reports.',
    tags: ['Next.js', 'TypeScript', 'FastAPI', 'PyTorch', 'AASIST'],
    live: '',
    repo: '',
    image: '',
    visual: 'spectrum',
  },
]

/** Experience timeline. `period` and `points` are optional. */
export const experience = [
  {
    period: '2026',
    org: 'IIMT University, Meerut',
    type: 'DevHack 2026 · Hackathon',
    role: 'Participant',
    description:
      'Built and deployed an MVP prototype during an intensive sprint as part of team Programming_for_miles.',
    points: ['Focused on clean UI design and reliable backend logic.'],
  },
  {
    period: 'Aug 2026',
    org: 'Adobe × Unstop',
    type: 'Adobe University Hackathon',
    role: 'Participant & Problem Solver',
    description:
      'Tackled real-world problem statements centred on digital workflows, creative technology and efficient software design.',
    points: [],
  },
  {
    period: '',
    org: 'IIT (BHU) Varanasi',
    type: 'Sangyan Hackathon',
    role: 'Participant & Developer',
    description:
      'A rigorous hackathon sprint to architect, prototype and pitch a functional technology solution.',
    points: [
      'Collaborated within a team under strict deadline constraints.',
      'Presented the final project to an expert jury.',
    ],
  },
]

export const education = [
  {
    school: 'Pranveer Singh Institute of Technology (PSIT)',
    detail: 'B.Tech — Computer Science & Engineering',
    place: 'Kanpur',
    period: 'Currently pursuing',
  },
  {
    school: 'Central Hindu Boys School (C.H.S.), BHU',
    detail: 'Senior Secondary · Class XI – XII',
    place: 'Varanasi',
    period: '',
  },
  {
    school: 'Sunbeam English School, Bhagwanpur',
    detail: 'Secondary · Till Class X',
    place: 'Varanasi',
    period: '',
  },
]

/**
 * Certificates — images live in /public/certificates.
 * `type` drives the small label: Course, Job Simulation, Hackathon.
 */
export const certificates = [
  {
    title: 'AI Fluency for Builders',
    issuer: 'CodePath.org & Anthropic',
    type: 'Course',
    date: '',
    image: asset('/certificates/ai-fluency-for-builders.webp'),
  },
  {
    title: 'Claude 101',
    issuer: 'Anthropic',
    type: 'Course',
    date: '',
    image: asset('/certificates/claude-101.webp'),
  },
  {
    title: 'GenAI Powered Data Analytics Job Simulation',
    issuer: 'Tata · Forage',
    type: 'Job Simulation',
    date: 'Jun 2026',
    image: asset('/certificates/tata-genai-data-analytics.webp'),
  },
  {
    title: 'Data Analytics Job Simulation',
    issuer: 'Deloitte · Forage',
    type: 'Job Simulation',
    date: 'Jun 2026',
    image: asset('/certificates/deloitte-data-analytics.webp'),
  },
  {
    title: 'Risk Job Simulation',
    issuer: 'Goldman Sachs · Forage',
    type: 'Job Simulation',
    date: 'Jul 2026',
    image: asset('/certificates/goldman-sachs-risk.webp'),
  },
  {
    title: 'DevHack 2026 — Participation',
    issuer: 'IIMT University, Meerut · GDG IIMT',
    type: 'Hackathon',
    date: '2026',
    image: asset('/certificates/devhack-2026.webp'),
  },
  {
    title: 'Adobe University Hackathon — Participation',
    issuer: 'Adobe · Unstop',
    type: 'Hackathon',
    date: 'Aug 2026',
    image: asset('/certificates/adobe-hackathon.webp'),
  },
  {
    title: 'HTML5 — The Language',
    issuer: 'Infosys Springboard',
    type: 'Course',
    date: 'Aug 2026',
    image: asset('/certificates/infosys-html5.webp'),
  },
  {
    title: 'CSS3',
    issuer: 'Infosys Springboard',
    type: 'Course',
    date: 'Aug 2026',
    image: asset('/certificates/infosys-css3.webp'),
  },
  {
    title: 'Twitter Bootstrap',
    issuer: 'Infosys Springboard',
    type: 'Course',
    date: 'Sep 2026',
    image: asset('/certificates/infosys-bootstrap.webp'),
  },
]

export const skills = [
  {
    title: 'Programming Languages',
    items: ['Python', 'C / C++', 'JavaScript', 'SQL'],
  },
  {
    title: 'Frontend Development',
    items: ['HTML5', 'CSS3', 'Bootstrap', 'Semantic HTML', 'Responsive Web Design'],
  },
  {
    title: 'Backend & APIs',
    items: ['RESTful APIs', 'Python Automation', 'SQL'],
  },
  {
    title: 'AI & Machine Learning',
    items: ['Claude API', 'Anthropic Tools', 'AI Fluency', 'Prompt Engineering', 'Speech Recognition'],
  },
  {
    title: 'Data & Analytics',
    items: ['Data Analysis', 'GenAI-assisted Analytics', 'Risk Analysis', 'Data Storytelling'],
  },
  {
    title: 'Tools & Platforms',
    items: ['Git', 'GitHub', 'GitHub Pages', 'VS Code', 'Linux', 'Windows'],
  },
]

export const contact = {
  heading: ['Let’s build', 'something', 'meaningful.'],
  blurb:
    'Have an idea, a hackathon team that needs a builder, or an internship opening? Reach out by email, phone or LinkedIn.',
}
