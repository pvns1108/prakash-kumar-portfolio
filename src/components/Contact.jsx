import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Check, Copy, Github, Linkedin, Mail, MapPin, Phone, Send } from 'lucide-react'
import { contact, site, socials } from '../data/content.js'
import { LineReveal, Reveal } from '../lib/motion.jsx'

const field =
  'peer w-full border-b border-bone/15 bg-transparent pb-3 pt-6 font-grotesk text-base text-bone placeholder-transparent outline-none transition-colors focus:border-ember'
const label =
  'pointer-events-none absolute left-0 top-0 font-grotesk text-[0.7rem] uppercase tracking-[0.2em] text-mute transition-colors peer-focus:text-ember'

export default function Contact() {
  const [copied, setCopied] = useState(false)
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${site.email}`
    }
  }

  // No backend needed: the form composes an email in the visitor's mail app.
  // To use a form service instead (Formspree, Web3Forms…), POST `form` here.
  const onSubmit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Portfolio enquiry from ${form.name}`)
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`)
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`
    setSent(true)
  }

  const links = [
    { href: `mailto:${site.email}`, label: 'Email', icon: Mail, external: false },
    site.phone && { href: `tel:${site.phone.replace(/\s/g, '')}`, label: 'Call', icon: Phone, external: false },
    socials.github && { href: socials.github, label: 'GitHub', icon: Github, external: true },
    socials.linkedin && { href: socials.linkedin, label: 'LinkedIn', icon: Linkedin, external: true },
    socials.portfolio && { href: socials.portfolio, label: 'GitHub Pages', icon: ArrowUpRight, external: true },
  ].filter(Boolean)

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden bg-ink">
      {/* glow continuity with hero */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="light-cloud light-cloud--a left-[30%] top-[-20%] h-[60vmax] w-[60vmax] opacity-70" />
        <div className="light-cloud light-cloud--b left-[-10%] top-[10%] h-[40vmax] w-[40vmax] opacity-60" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,var(--color-ink)_85%)]" />
      </div>

      <div className="container-x relative py-14 md:py-20">
        <div className="mb-10 flex items-center justify-between md:mb-14">
          <Reveal as="p" className="eyebrow">
            <span className="text-ember">(06)</span>&nbsp;&nbsp;Contact
          </Reveal>
          {site.available && (
            <Reveal as="p" className="eyebrow flex items-center gap-2" delay={0.1}>
              <span className="pulse-dot h-2 w-2 rounded-full bg-green-400" aria-hidden="true" />
              Available
            </Reveal>
          )}
        </div>

        <h2 id="contact-title" className="font-display text-[clamp(3.4rem,11.5vw,12rem)] uppercase leading-[0.86] tracking-tight">
          <LineReveal>{contact.heading[0]}</LineReveal>
          <LineReveal delay={0.08}>
            <span className="text-outline">{contact.heading[1]}</span>
          </LineReveal>
          <LineReveal delay={0.16}>
            {contact.heading[2].replace('.', '')}
            <span className="text-ember">.</span>
          </LineReveal>
        </h2>

        <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <Reveal as="p" className="max-w-md text-lg leading-relaxed text-mute">
              {contact.blurb}
            </Reveal>

            <Reveal delay={0.1} className="mt-10">
              <p className="eyebrow mb-3">Write to me</p>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${site.email}`}
                  className="break-all font-grotesk text-[clamp(1.3rem,2.6vw,2rem)] text-bone underline decoration-bone/20 decoration-1 underline-offset-8 transition-colors hover:text-ember hover:decoration-ember"
                >
                  {site.email}
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="grid h-10 w-10 place-items-center rounded-full border border-bone/15 text-mute transition-colors hover:border-ember hover:text-ember"
                  aria-label={copied ? 'Email address copied' : 'Copy email address'}
                >
                  {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
                </button>
              </div>
              <p className="mt-4 flex items-center gap-2 text-sm text-mute">
                <MapPin size={14} aria-hidden="true" /> {site.location}
              </p>
              {site.phone && (
                <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="mt-2 flex w-fit items-center gap-2 text-sm text-mute transition-colors hover:text-ember">
                  <Phone size={14} aria-hidden="true" /> {site.phone}
                </a>
              )}
            </Reveal>

            <Reveal delay={0.15} className="mt-10">
              <ul className="border-b border-line">
                {links.map(({ href, label, icon: Icon, external }) => (
                  <li key={label} className="border-t border-line">
                    <a
                      href={href}
                      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                      className="group flex items-center justify-between py-4 font-grotesk text-bone transition-colors hover:text-ember"
                    >
                      <span className="flex items-center gap-3">
                        <Icon size={16} aria-hidden="true" className="text-mute group-hover:text-ember" />
                        {label}
                      </span>
                      <ArrowUpRight
                        size={18}
                        aria-hidden="true"
                        className="transition-transform duration-500 ease-[var(--ease-cine)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:rotate-45"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="md:col-span-6 md:col-start-7">
            <form onSubmit={onSubmit} className="rounded-sm border border-line bg-ink-2/60 p-6 backdrop-blur-sm md:p-10" aria-describedby="form-note">
              <p className="eyebrow mb-8">Send a message</p>
              <div className="space-y-8">
                <div className="relative">
                  <input id="cf-name" name="name" required autoComplete="name" placeholder="Your name" className={field} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  <label htmlFor="cf-name" className={label}>Name</label>
                </div>
                <div className="relative">
                  <input id="cf-email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={field} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  <label htmlFor="cf-email" className={label}>Email</label>
                </div>
                <div className="relative">
                  <textarea id="cf-msg" name="message" required rows={4} placeholder="Tell me about your idea" className={`${field} resize-none`} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                  <label htmlFor="cf-msg" className={label}>Message</label>
                </div>
              </div>
              <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
                <p id="form-note" className="max-w-[16rem] text-xs leading-relaxed text-dim" aria-live="polite">
                  {sent ? 'Your mail app should now be open with the message ready to send.' : 'Opens your email app with the message pre-filled.'}
                </p>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex min-h-14 items-center gap-3 rounded-full bg-ember px-7 font-grotesk font-medium text-onember shadow-[0_10px_50px_-12px_rgba(255,90,60,0.8)] transition-colors hover:bg-ember-2"
                >
                  Start a conversation
                  <Send size={16} aria-hidden="true" />
                </motion.button>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
