import { ArrowUp } from 'lucide-react'
import { site } from '../data/content.js'
import { scrollToId } from '../lib/motion.jsx'

export default function Footer() {
  return (
    <footer className="relative border-t border-line bg-ink">
      <div className="container-x flex flex-col gap-6 py-8 font-grotesk text-sm text-mute md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} {site.firstName} {site.lastName}. Designed &amp; built with React.
        </p>
        {site.available && (
          <p className="flex items-center gap-2">
            <span className="pulse-dot h-2 w-2 rounded-full bg-green-400" aria-hidden="true" />
            {site.availabilityText}
          </p>
        )}
        <button
          type="button"
          onClick={() => scrollToId('home')}
          className="group flex items-center gap-2 self-start text-bone transition-colors hover:text-ember md:self-auto"
        >
          Back to top
          <span className="grid h-8 w-8 place-items-center rounded-full border border-bone/15 transition-colors group-hover:border-ember">
            <ArrowUp size={14} aria-hidden="true" className="transition-transform duration-500 group-hover:-translate-y-0.5" />
          </span>
        </button>
      </div>
    </footer>
  )
}
