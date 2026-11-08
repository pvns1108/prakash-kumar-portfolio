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

## AI chatbot

A floating assistant (bottom-right) answers visitors' questions about Prakash using **only** the
portfolio content (`src/data/content.js`) and the resume (`public/resume/Prakash_Kumar_Resume.pdf`).
Update `content.js` and the chatbot's knowledge updates with it.

| File | What it does |
| --- | --- |
| `src/components/ChatBot.jsx` | Floating button + chat window (suggestions, follow-ups, voice input, clear, typing indicator) |
| `src/lib/chat/knowledge.js` | Builds the chatbot's knowledge from `content.js` (+ live public repos from the GitHub API) |
| `src/lib/chat/localAnswer.js` | Built-in answer engine: works with no API key, and is the fallback if the AI is down |
| `src/lib/chat/client.js` | Sends questions to the AI backend when configured, otherwise uses the built-in engine |
| `api/chat.js` | Serverless AI backend for Vercel: holds the API key, rate limits, validates input, blocks prompt injection, strips invented links |

**Without any setup** the chatbot runs on the built-in engine, answering directly from the portfolio data.

### Turn on full AI answers

1. **Get an API key.** OpenAI (`gpt-4o-mini` is cheap), or a free Google Gemini key from
   https://aistudio.google.com/apikey.
2. **Deploy the backend to Vercel.** On vercel.com, click *Add New → Project*, import this repo and click *Deploy*.
3. **Add the key** in Vercel, under *Project → Settings → Environment Variables*:
   - `OPENAI_API_KEY` = your key
   - Gemini only: `OPENAI_BASE_URL` = `https://generativelanguage.googleapis.com/v1beta/openai` and `CHAT_MODEL` = `gemini-2.5-flash`

   Then *Deployments → ⋯ → Redeploy*. Check that it works: `https://<your-project>.vercel.app/api/chat`
   should show `{"status":"ok","ai":true}`.
4. **Point the site at it.** In GitHub, open this repo's *Settings → Secrets and variables → Actions → Variables* and add
   `CHAT_API_URL` = `https://<your-project>.vercel.app/api/chat`. Then re-run the deploy, either from
   *Actions → Deploy to GitHub Pages → Run workflow* or by pushing a commit.

The key only ever lives in Vercel. The website only knows the backend's URL, which is not a secret.
For local development, create `.env.local` with `VITE_CHAT_API_URL=...` (see `.env.example`).

## Notes

- Motion respects the OS "reduce motion" setting (`MotionConfig reducedMotion="user"` + CSS fallbacks).
- The contact form has no backend: it opens the visitor's email app with the message pre-filled. To use Formspree/Web3Forms, POST the form data in `Contact.jsx → onSubmit`.
