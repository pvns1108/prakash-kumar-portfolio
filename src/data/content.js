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
  // Hero subtitle: bold part + italic part ("Developer & AI Builder")
  roleBold: 'Developer',
  roleItalic: '& AI Builder',
  /**
   * Hero particle portrait. Best result: a transparent PNG cut-out of
   * you (e.g. /public/prakash-cutout.png) — set `portraitCutout` to it and
   * the mask below is ignored. Without a cut-out, the photo is sampled
   * through this soft silhouette (normalised 0–1 image coordinates) so
   * the brick background is left out.
   */
  portraitCutout: asset('/prakash-cutout.webp'),
  portraitMask: {
    head: { cx: 0.505, cy: 0.285, rx: 0.106, ry: 0.135 },
    body: [
      [0.43, 0.38], [0.6, 0.38], [0.66, 0.47], [0.73, 0.52],
      [0.76, 1], [0.13, 1], [0.15, 0.52], [0.36, 0.45],
    ],
  },
  available: true,
  availabilityText: 'Open to internships & collaborations',
  heroIntro:
    'Computer Science undergraduate at PSIT, Kanpur — building at the intersection of Python automation, AI/LLM integration and modern, responsive web development.',
}

export const socials = {
  github: 'https://github.com/pvns1108',
  linkedin: 'https://www.linkedin.com/in/prakash-kumar-rai-25aaa42b0',
  portfolio: 'https://pvns1108.github.io/prakash-kumar-portfolio/',
}

export const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'certificates', label: 'Certificates' },
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
    { value: '05', label: 'Featured builds' },
  ],
}

/**
 * Projects — `live`, `repo`, `year`, `image`, `accent` are optional.
 * `accent` is the small italic word shown beside the title.
 * Leave them "" and they are simply not shown.
 */
export const projects = [
  {
    id: 'freshlink',
    title: 'Fresh',
    accent: 'link',
    subtitle: 'AI food freshness & donation platform',
    category: 'AI · Full-Stack',
    year: '',
    description:
      'A full-stack platform that fights food waste: AI-assisted scans estimate freshness and read expiry dates, a priority engine ranks inventory by urgency, and an automation engine matches near-expiry surplus with nearby NGOs for pickup — with role-based dashboards for shops, households, NGOs and admins, plus alerts and analytics.',
    tags: ['React', 'Vite', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB'],
    live: 'https://freshlink-jtbw.onrender.com',
    repo: 'https://github.com/pvns1108/freshlink',
    image: asset('/projects/freshlink.webp'),
    visual: 'browser',
  },
  {
    id: 'psit-erp',
    title: 'Campus',
    accent: 'ERP',
    subtitle: 'PSIT digital campus management system',
    category: 'Web · Full-Stack',
    year: '',
    description:
      'A full-stack college ERP with student and admin portals: JWT authentication, profiles with photo, resume and certificate uploads, attendance and results via CSV bulk upload, notices, placements and notifications, login tracking, and PDF marksheets, transcripts and admit cards — also packaged as an Android app with Capacitor.',
    tags: ['Node.js', 'Express', 'MongoDB', 'JWT', 'PDFKit', 'Capacitor'],
    live: 'https://erp-psit.onrender.com',
    repo: 'https://github.com/pvns1108/Erp_psit',
    image: asset('/projects/psit-erp.webp'),
    visual: 'browser',
  },
  {
    id: 'jarvis',
    title: 'Jarvis',
    accent: 'voice', // italic word beside the title
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
    title: 'Developer',
    accent: 'portfolio',
    subtitle: 'Personal website',
    category: 'Web · Frontend',
    year: '',
    description:
      'An interactive, mobile-responsive developer portfolio showcasing technical projects, hackathon achievements and contact channels — built with clean responsive CSS layouts for fast loading and cross-device compatibility.',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'GitHub Pages'],
    live: 'https://pvns1108.github.io/prakash-kumar-portfolio/',
    repo: 'https://github.com/pvns1108/prakash-kumar-portfolio',
    image: '',
    visual: 'browser',
  },
  {
    id: 'voiceshield',
    title: 'Voice',
    accent: 'shield',
    subtitle: 'Audio forensics & AI-voice detection',
    category: 'AI · Security',
    year: '',
    description:
      'A web app that analyses uploaded or recorded audio to estimate whether a voice is real or AI-generated, using the AASIST anti-spoofing model alongside waveform, spectrogram, pitch and signal-quality views, transcription and saved analysis reports.',
    tags: ['Next.js', 'TypeScript', 'FastAPI', 'PyTorch', 'AASIST'],
    live: 'https://voiceshield-forensics.vercel.app/',
    repo: 'https://github.com/pvns1108/voiceshield-forensics',
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

/** Skills — shown as the stack marquee (About) and the numbered accordion. */
export const skills = [
  {
    title: 'Programming Languages',
    blurb: 'The core languages I reach for — Python for automation and AI work, C / C++ for fundamentals, JavaScript for the web and SQL for data.',
    items: ['Python', 'C / C++', 'JavaScript', 'SQL'],
  },
  {
    title: 'Frontend Development',
    blurb: 'Clean, semantic and responsive interfaces that load fast and work across devices — the way this portfolio is built.',
    items: ['HTML5', 'CSS3', 'Bootstrap', 'Semantic HTML', 'Responsive Web Design'],
  },
  {
    title: 'Backend & APIs',
    blurb: 'Wiring things together: RESTful APIs, Python automation scripts and SQL-backed logic behind the interface.',
    items: ['RESTful APIs', 'Python Automation', 'SQL'],
  },
  {
    title: 'AI & Machine Learning',
    blurb: 'Integrating LLMs and speech into real tools — from the Jarvis voice assistant to Claude-powered workflows and prompt engineering.',
    items: ['Claude API', 'Anthropic Tools', 'AI Fluency', 'Prompt Engineering', 'Speech Recognition'],
  },
  {
    title: 'Data & Analytics',
    blurb: 'Analysis, risk and GenAI-assisted analytics practised through the Tata, Deloitte and Goldman Sachs job simulations.',
    items: ['Data Analysis', 'GenAI-assisted Analytics', 'Risk Analysis', 'Data Storytelling'],
  },
  {
    title: 'Tools & Platforms',
    blurb: 'The everyday toolkit for building, versioning and shipping — Git, GitHub, GitHub Pages and VS Code on Linux and Windows.',
    items: ['Git', 'GitHub', 'GitHub Pages', 'VS Code', 'Linux', 'Windows'],
  },
]

export const contact = {
  heading: ['Let’s build', 'something', 'meaningful.'],
  blurb:
    'Have an idea, a hackathon team that needs a builder, or an internship opening? Reach out by email, phone or LinkedIn.',
}
