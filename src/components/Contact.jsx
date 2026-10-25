import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Copy, Github, Globe, Linkedin, Mail, Phone, Send } from 'lucide-react'
import { contact, site, socials } from '../data/content.js'
import { EASE, Reveal } from '../lib/motion.jsx'

const field =
  'w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-bone placeholder:text-dim outline-none transition-colors focus:border-white/40'

function InfoRow({ label, children }) {
  return (
    <div className="border-b border-white/[0.07] py-4 first:pt-0 last:border-0 last:pb-0">
      <p className="label mb-1.5 !text-[0.55rem]">{label}</p>
      {children}
    </div>
  )
}

export default function Contact() {
  const [copied, setCopied] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
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

  const elsewhere = [
    socials.github && { href: socials.github, label: 'GitHub', icon: Github },
    socials.linkedin && { href: socials.linkedin, label: 'LinkedIn', icon: Linkedin },
    socials.portfolio && { href: socials.portfolio, label: 'GitHub Pages', icon: Globe },
  ].filter(Boolean)

  return (
    <section id="contact" aria-labelledby="contact-title" className="marble relative flex min-h-[100svh] flex-col pt-14">
      <div className="container-x grid flex-1 items-center gap-12 py-20 md:grid-cols-12 md:gap-10 md:py-24">
        <div className="md:col-span-5 md:col-start-2 lg:col-span-4 lg:col-start-2">
          {site.available && (
            <Reveal as="p" className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[0.55rem] font-medium uppercase tracking-[0.24em] text-bone/80">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-green-400" aria-hidden="true" />
              Available for work
            </Reveal>
          )}
          <Reveal as="h2" id="contact-title" delay={0.05} className="chrome !normal-case text-[clamp(2.8rem,4.6vw,4.4rem)] !leading-[1]">
            Get in touch
          </Reveal>
          <Reveal as="p" delay={0.1} className="mt-6 max-w-sm text-[0.88rem] leading-relaxed text-bone/75">
            {contact.blurb} {site.availabilityText}.
          </Reveal>
          <Reveal delay={0.15} className="mt-8 flex flex-wrap gap-3">
            <a href={`mailto:${site.email}`} className="pill pill-solid text-[0.72rem]">
              Send an email <Mail size={13} aria-hidden="true" />
            </a>
            <button type="button" onClick={() => setFormOpen((v) => !v)} aria-expanded={formOpen} aria-controls="contact-form" className="pill text-[0.72rem]">
              Write a message <Send size={12} aria-hidden="true" />
            </button>
          </Reveal>

          <AnimatePresence initial={false}>
            {formOpen && (
              <motion.form
                id="contact-form"
                onSubmit={onSubmit}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="overflow-hidden"
                aria-describedby="form-note"
              >
                <div className="space-y-3 pt-6">
                  <label className="sr-only" htmlFor="cf-name">Name</label>
                  <input id="cf-name" name="name" required autoComplete="name" placeholder="Your name" className={field} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  <label className="sr-only" htmlFor="cf-email">Email</label>
                  <input id="cf-email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={field} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  <label className="sr-only" htmlFor="cf-msg">Message</label>
                  <textarea id="cf-msg" name="message" required rows={4} placeholder="Tell me about your idea" className={`${field} resize-none`} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p id="form-note" className="max-w-[15rem] text-[0.7rem] leading-relaxed text-dim" aria-live="polite">
                      {sent ? 'Your mail app should now be open with the message ready to send.' : 'Opens your email app with the message pre-filled.'}
                    </p>
                    <button type="submit" className="pill pill-solid text-[0.72rem]">
                      Start a conversation <Send size={12} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <Reveal delay={0.1} className="md:col-span-5 md:col-start-7 lg:col-span-4 lg:col-start-7">
          <div className="rounded-2xl border border-white/[0.06] bg-[linear-gradient(160deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6 shadow-[0_40px_100px_-40px_rgba(0,0,0,1)] backdrop-blur-[2px]">
            <InfoRow label="Email">
              <div className="flex items-center gap-2">
                <a href={`mailto:${site.email}`} className="break-all text-[0.88rem] font-medium text-bone hover:underline">
                  {site.email}
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-mute transition-colors hover:bg-white/10 hover:text-bone"
                  aria-label={copied ? 'Email address copied' : 'Copy email address'}
                >
                  {copied ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
                </button>
              </div>
            </InfoRow>
            {site.phone && (
              <InfoRow label="Phone">
                <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-2 text-[0.88rem] font-medium text-bone hover:underline">
                  {site.phone} <Phone size={12} className="text-mute" aria-hidden="true" />
                </a>
              </InfoRow>
            )}
            <InfoRow label="Based in">
              <p className="text-[0.88rem] font-medium text-bone">{site.location}</p>
            </InfoRow>
            {elsewhere.length > 0 && (
              <InfoRow label="Elsewhere">
                <ul className="mt-1 flex gap-2">
                  {elsewhere.map(({ href, label, icon: Icon }) => (
                    <li key={label}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={label}
                        title={label}
                        className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-bone/80 transition-colors hover:bg-bone hover:text-ink"
                      >
                        <Icon size={14} aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              </InfoRow>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
