import { navLinks, site, socials } from '../data/content.js'
import { scrollToId } from '../lib/motion.jsx'

export default function Footer() {
  return (
    <footer className="bg-[#070809]">
      <div className="container-x flex flex-col gap-4 border-t border-white/[0.06] py-6 text-[0.66rem] text-mute md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} {site.firstName} {site.lastName}. All rights reserved.
        </p>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
          {navLinks.slice(0, 4).map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={(e) => {
                e.preventDefault()
                scrollToId(l.id)
              }}
              className="transition-colors hover:text-bone"
            >
              {l.label}
            </a>
          ))}
          <span className="hidden w-4 md:block" aria-hidden="true" />
          {socials.github && (
            <a href={socials.github} target="_blank" rel="noreferrer" className="transition-colors hover:text-bone">
              GitHub
            </a>
          )}
          {socials.linkedin && (
            <a href={socials.linkedin} target="_blank" rel="noreferrer" className="transition-colors hover:text-bone">
              LinkedIn
            </a>
          )}
        </nav>
      </div>
    </footer>
  )
}
