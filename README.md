# Prakash Kumar — Portfolio

Cinematic developer portfolio built with **React + Vite + Tailwind CSS v4 + Framer Motion + Lucide React**.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in /dist
npm run preview  # preview the production build
```

Requires Node.js 18+ (20+ recommended).

## Edit your content

Everything lives in **`src/data/content.js`** — name, intro, links, projects, hackathons, education, certifications and skills. Components only read from that file.

- **Any empty field (`""`) or empty list is skipped entirely** — no placeholder, no gap.
- **Certificates**: add the image to `public/certificates/` and an entry to `certificates` in `content.js`. The grid always fills complete rows, whatever the count.
- **Phone / LinkedIn**: set in `site.phone` and `socials.linkedin`; clear them to hide.
- **Project screenshots**: drop an image in `public/projects/` and set `image: '/projects/jarvis.webp'`. Until then a generated mockup is drawn.
- **Project links**: `live` and `repo` are hidden when empty. The Jarvis and portfolio "GitHub" buttons currently point to your GitHub profile; replace with the exact repo URLs.
- **Years**: add `year: '2026'` etc. to show it beside the category.
- **Photo**: replace `public/prakash.webp`.

## Structure

```
src/
  data/content.js        ← all editable content (incl. hero portrait mask)
  lib/motion.jsx         ← Reveal / LineReveal helpers, smooth scroll
  components/
    Intro.jsx            ← opening sequence: dot → "!" → name → PORTFOLIO
    Navbar.jsx           ← name + uppercase links, active underline, scroll-progress line, mobile menu
    Hero.jsx             ← chrome PORTFOLIO title + role + CTAs
    ParticlePortrait.jsx ← canvas mosaic portrait (assembles, swirls on hover, dissolves on scroll)
    About.jsx            ← "Intro" card, stats, facts, scrolling stack
    Skills.jsx           ← "What I can do" numbered accordion
    SelectedWork.jsx     ← "Selected work" header
    ProjectItem.jsx      ← single alternating project row
    ProjectVisual.jsx    ← generated monochrome mockups
    Experience.jsx       ← hackathons + education rows
    Certificates.jsx     ← sticky horizontal shelf + lightbox
    HelloWorld.jsx       ← "HELLO WORLD" brick-breaker mini-game
    Contact.jsx          ← "Get in touch", info card, mailto form
    Footer.jsx
```

**Hero portrait:** it is sampled from `public/prakash.webp` through a silhouette mask
(`site.portraitMask`). For a cleaner result add a transparent-background cut-out PNG
(e.g. `public/prakash-cutout.png`) and set `site.portraitCutout: asset('/prakash-cutout.png')`.

## Deploy

Live at **https://pvns1108.github.io/prakash-kumar-portfolio/**

Every push to `main` builds and deploys automatically via `.github/workflows/deploy.yml`
(repo Settings → Pages → Source must be **GitHub Actions**).

`base` in `vite.config.js` is `/prakash-kumar-portfolio/`. If you move the site to a repo named
`pvns1108.github.io`, change it to `/`.

## Notes

- Motion respects the OS "reduce motion" setting (`MotionConfig reducedMotion="user"` + CSS fallbacks).
- The contact form has no backend: it opens the visitor's email app with the message pre-filled. To use Formspree/Web3Forms, POST the form data in `Contact.jsx → onSubmit`.
