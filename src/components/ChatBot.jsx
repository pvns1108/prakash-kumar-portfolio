import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, FileText, MessageCircle, Mic, MicOff, Minus, RotateCcw, Send, Sparkles, X } from 'lucide-react'
import { site } from '../data/content.js'
import { EASE, scrollToId } from '../lib/motion.jsx'
import { AI_ENABLED, ask } from '../lib/chat/client.js'
import { RESUME_URL } from '../lib/chat/knowledge.js'

/**
 * Floating portfolio assistant. Self-contained: it adds a button and a
 * chat window on top of the page and changes nothing else on the site.
 */

const WELCOME = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hey! I'm Prakash's AI portfolio assistant. Feel free to ask me anything about his education, technical skills, projects, achievements, and professional background.",
}
const STARTERS = [
  'Summarize Prakash’s portfolio',
  'Tell me about his education',
  'Explore his projects',
  'What are his technical skills?',
  'Tell me about his experience',
  'How can I contact Prakash?',
]
const EXTRAS = [
  { label: 'Recruiter overview', icon: Sparkles },
  ...(RESUME_URL ? [{ label: 'Download his resume', icon: FileText }] : []),
]
const MAX_CHARS = 500
const STORE_KEY = 'pk-chat-v1'

const load = () => {
  try {
    const v = JSON.parse(sessionStorage.getItem(STORE_KEY) || 'null')
    if (v && Array.isArray(v.messages) && v.messages.length) return v
  } catch {
    /* storage unavailable */
  }
  return { messages: [WELCOME], topic: null }
}
const save = (state) => {
  try {
    sessionStorage.setItem(STORE_KEY, JSON.stringify(state))
  } catch {
    /* storage unavailable — conversation still works for this page view */
  }
}
const uid = () => Math.random().toString(36).slice(2, 10)

// ── tiny safe formatter: paragraphs, "- " bullets, **bold**, [label](url), bare URLs ──
const TOKEN = /(\*\*[^*]+\*\*|\[[^\]]+\]\((?:https?:\/\/|mailto:|#)[^)\s]+\)|https?:\/\/[^\s)<>]+[^\s)<>.,;:!?]|#(?:home|about|skills|work|experience|certificates|contact)\b)/g

function Inline({ text, onLink }) {
  return text.split(TOKEN).map((part, i) => {
    if (!part) return null
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i} className="font-semibold text-bone">{part.slice(2, -2)}</strong>
    const md = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (md) return <ChatLink key={i} href={md[2]} onLink={onLink}>{md[1]}</ChatLink>
    if (/^https?:\/\//.test(part)) return <ChatLink key={i} href={part} onLink={onLink}>{part.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</ChatLink>
    if (/^#[a-z]+$/.test(part)) return <ChatLink key={i} href={part} onLink={onLink}>{part.slice(1)} section</ChatLink>
    return <Fragment key={i}>{part}</Fragment>
  })
}

function ChatLink({ href, children, onLink }) {
  const internal = href.startsWith('#')
  return (
    <a
      href={href}
      onClick={internal ? (e) => { e.preventDefault(); onLink(href) } : undefined}
      {...(!internal && !href.startsWith('mailto:') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="break-words font-medium text-bone underline decoration-white/30 underline-offset-2 transition-colors hover:decoration-bone"
    >
      {children}
    </a>
  )
}

function RichText({ text, onLink }) {
  const blocks = text.split(/\n{2,}/)
  return blocks.map((block, bi) => {
    const lines = block.split('\n')
    if (lines.every((l) => /^\s*[-•*]\s+/.test(l))) {
      return (
        <ul key={bi} className="space-y-1.5">
          {lines.map((l, li) => (
            <li key={li} className="flex gap-2">
              <span aria-hidden="true" className="mt-[0.55em] h-px w-2.5 shrink-0 bg-white/40" />
              <span className="min-w-0"><Inline text={l.replace(/^\s*[-•*]\s+/, '')} onLink={onLink} /></span>
            </li>
          ))}
        </ul>
      )
    }
    return (
      <p key={bi}>
        {lines.map((l, li) => (
          <Fragment key={li}>
            {li > 0 && <br />}
            <Inline text={l} onLink={onLink} />
          </Fragment>
        ))}
      </p>
    )
  })
}

function Typing() {
  return (
    <div className="flex items-center gap-1 px-1 py-1.5" role="status" aria-label="Assistant is typing">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-bone/60"
          animate={{ opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.16, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

function Chip({ children, onClick, icon: Icon, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-white/[0.14] bg-white/[0.03] px-3 py-1.5 text-left text-[0.72rem] leading-tight text-bone/85 transition-colors duration-300 hover:border-bone hover:bg-bone hover:text-ink disabled:pointer-events-none disabled:opacity-40"
    >
      {Icon && <Icon size={12} aria-hidden="true" />}
      {children}
    </button>
  )
}

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [{ messages, topic }, setState] = useState(load)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const [lift, setLift] = useState(0)
  const logRef = useRef(null)
  const inputRef = useRef(null)
  const toggleRef = useRef(null)
  const recRef = useRef(null)
  const panelId = 'pk-chat-panel'

  const Speech = typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null

  useEffect(() => save({ messages, topic }), [messages, topic])

  // keep the button clear of the footer links when the footer is on screen
  useEffect(() => {
    let frame = 0
    const measure = () => {
      frame = 0
      const footer = document.querySelector('footer')
      if (!footer) return
      setLift(Math.round(Math.max(0, window.innerHeight - footer.getBoundingClientRect().top)))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // auto-scroll to the newest message
  useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages, loading, open])

  // focus the input on open (pointer devices only, so phones don't pop the keyboard)
  useEffect(() => {
    if (open && window.matchMedia('(pointer: fine)').matches) setTimeout(() => inputRef.current?.focus(), 250)
  }, [open])

  // Escape minimizes
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => () => recRef.current?.abort?.(), [])

  const onLink = useCallback((href) => {
    if (window.matchMedia('(max-width: 639px)').matches) setOpen(false) // let the section be seen on phones
    scrollToId(href.slice(1))
  }, [])

  const send = useCallback(
    async (raw) => {
      const text = String(raw ?? input).trim().slice(0, MAX_CHARS)
      if (!text || loading) return
      setInput('')
      const userMsg = { id: uid(), role: 'user', content: text }
      const history = [...messages.filter((m) => m.id !== 'welcome' && !m.error), userMsg].map(({ role, content }) => ({ role, content }))
      setState((s) => ({ ...s, messages: [...s.messages, userMsg] }))
      setLoading(true)
      try {
        const a = await ask(history, { topic })
        setState((s) => ({
          topic: a.topic ?? s.topic,
          messages: [
            ...s.messages,
            { id: uid(), role: 'assistant', content: a.text, links: a.links, followups: a.followups, notice: a.notice, error: a.source === 'error' },
          ],
        }))
      } catch {
        setState((s) => ({
          ...s,
          messages: [...s.messages, { id: uid(), role: 'assistant', content: 'Something went wrong while answering. Please try again.', error: true, retry: text }],
        }))
      } finally {
        setLoading(false)
      }
    },
    [input, loading, messages, topic],
  )

  const clear = () => {
    recRef.current?.abort?.()
    setListening(false)
    setInput('')
    setState({ messages: [{ ...WELCOME }], topic: null })
    inputRef.current?.focus()
  }

  const toggleVoice = () => {
    if (!Speech) return
    if (listening) {
      recRef.current?.stop()
      return
    }
    const rec = new Speech()
    rec.lang = 'en-IN'
    rec.interimResults = true
    rec.maxAlternatives = 1
    rec.onresult = (e) => setInput(Array.from(e.results).map((r) => r[0].transcript).join(' ').slice(0, MAX_CHARS))
    rec.onend = () => setListening(false)
    rec.onerror = () => setListening(false)
    recRef.current = rec
    try {
      rec.start()
      setListening(true)
    } catch {
      setListening(false)
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      send()
    }
  }

  const fresh = !messages.some((m) => m.role === 'user')
  const last = messages[messages.length - 1]
  const bottom = `calc(${lift}px + max(1rem, env(safe-area-inset-bottom, 0px)))`

  return (
    <div className="pk-chat">
      <AnimatePresence>
        {open && (
          <motion.section
            id={panelId}
            role="dialog"
            aria-label="Portfolio assistant"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97, transition: { duration: 0.2 } }}
            transition={{ duration: 0.45, ease: EASE }}
            style={{ bottom: `calc(${bottom} + 4rem)`, transformOrigin: 'bottom right' }}
            className="fixed inset-x-3 z-[62] flex h-[min(36rem,calc(100svh-7rem))] flex-col overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0b0c0e]/95 shadow-[0_40px_100px_-30px_rgba(0,0,0,1)] backdrop-blur-xl sm:inset-x-auto sm:right-6 sm:w-[24rem]"
          >
            {/* header */}
            <header className="flex items-center gap-3 border-b border-white/[0.07] px-4 py-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-paper text-[0.68rem] font-extrabold tracking-[0.08em] text-onpaper">
                {site.monogram}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[0.85rem] font-semibold text-bone">Portfolio assistant</p>
                <p className="flex items-center gap-1.5 truncate text-[0.62rem] uppercase tracking-[0.16em] text-dim">
                  <span className="pulse-dot h-1.5 w-1.5 shrink-0 rounded-full bg-green-400" aria-hidden="true" />
                  <span className="truncate">{AI_ENABLED ? 'AI · from his portfolio' : 'From his portfolio'}</span>
                </p>
              </div>
              <button type="button" onClick={clear} disabled={fresh && !input} className="grid h-8 w-8 place-items-center rounded-full text-mute transition-colors hover:bg-white/10 hover:text-bone disabled:opacity-30" aria-label="Clear conversation" title="Clear conversation">
                <RotateCcw size={14} aria-hidden="true" />
              </button>
              <button type="button" onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center rounded-full text-mute transition-colors hover:bg-white/10 hover:text-bone" aria-label="Minimize chat" title="Minimize">
                <Minus size={16} aria-hidden="true" />
              </button>
            </header>

            {/* messages */}
            <div ref={logRef} role="log" aria-live="polite" aria-relevant="additions" className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4 [scrollbar-width:thin]">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'user' ? (
                    <p className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-paper px-3.5 py-2.5 text-[0.82rem] leading-relaxed text-onpaper">
                      {m.content}
                    </p>
                  ) : (
                    <div className={`max-w-[92%] space-y-2.5 rounded-2xl rounded-bl-md border px-3.5 py-2.5 text-[0.82rem] leading-relaxed text-bone/85 ${m.error ? 'border-signal/40 bg-signal/[0.06]' : 'border-white/[0.07] bg-white/[0.035]'}`}>
                      <RichText text={m.content} onLink={onLink} />
                      {m.links?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {m.links.map((l) => (
                            <a
                              key={l.href + l.label}
                              href={l.href}
                              onClick={l.href.startsWith('#') ? (e) => { e.preventDefault(); onLink(l.href) } : undefined}
                              {...(/^https?:/.test(l.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                              className="inline-flex items-center gap-1 rounded-full border border-white/[0.14] px-2.5 py-1 text-[0.68rem] font-medium text-bone transition-colors hover:border-bone hover:bg-bone hover:text-ink"
                            >
                              {l.label}
                              <ArrowUpRight size={11} aria-hidden="true" />
                            </a>
                          ))}
                        </div>
                      )}
                      {m.notice && <p className="text-[0.66rem] leading-snug text-dim">{m.notice}</p>}
                      {m.retry && (
                        <button type="button" onClick={() => send(m.retry)} className="text-[0.72rem] font-medium text-bone underline underline-offset-2">
                          Try again
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-md border border-white/[0.07] bg-white/[0.035] px-3">
                    <Typing />
                  </div>
                </div>
              )}

              {/* suggestions */}
              {!loading && fresh && (
                <div className="space-y-2 pt-1">
                  <p className="label !text-[0.55rem]">Try asking</p>
                  <div className="flex flex-wrap gap-1.5">
                    {STARTERS.map((q) => (
                      <Chip key={q} onClick={() => send(q)}>{q}</Chip>
                    ))}
                    {EXTRAS.map(({ label, icon }) => (
                      <Chip key={label} icon={icon} onClick={() => send(label)}>{label}</Chip>
                    ))}
                  </div>
                </div>
              )}
              {!loading && !fresh && last?.role === 'assistant' && last.followups?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-0.5" aria-label="Suggested follow-up questions">
                  {last.followups.map((q) => (
                    <Chip key={q} onClick={() => send(q)}>{q}</Chip>
                  ))}
                </div>
              )}
            </div>

            {/* input */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                send()
              }}
              className="border-t border-white/[0.07] p-3"
            >
              <div className="flex items-end gap-2 rounded-xl border border-white/[0.1] bg-white/[0.03] px-3 py-2 transition-colors focus-within:border-white/30">
                <label htmlFor="pk-chat-input" className="sr-only">Ask about Prakash</label>
                <textarea
                  id="pk-chat-input"
                  ref={inputRef}
                  rows={1}
                  value={input}
                  maxLength={MAX_CHARS}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder={listening ? 'Listening…' : 'Ask about Prakash…'}
                  className="max-h-28 min-h-[1.5rem] flex-1 resize-none bg-transparent text-[16px] leading-6 text-bone placeholder:text-dim focus:outline-none sm:text-[0.84rem]"
                  style={{ fieldSizing: 'content' }}
                />
                {Speech && (
                  <button
                    type="button"
                    onClick={toggleVoice}
                    aria-pressed={listening}
                    aria-label={listening ? 'Stop voice input' : 'Ask with your voice'}
                    title={listening ? 'Stop' : 'Voice input'}
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors ${listening ? 'bg-signal text-white' : 'text-mute hover:bg-white/10 hover:text-bone'}`}
                  >
                    {listening ? <MicOff size={15} aria-hidden="true" /> : <Mic size={15} aria-hidden="true" />}
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  aria-label="Send"
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-paper text-onpaper transition-[background-color,opacity,transform] hover:bg-white active:scale-95 disabled:opacity-30"
                >
                  <Send size={14} aria-hidden="true" />
                </button>
              </div>
              <p className="mt-1.5 flex justify-between px-1 text-[0.6rem] text-dim">
                <span>Enter to send · Shift+Enter for a new line</span>
                {input.length > MAX_CHARS - 100 && <span className="tabular-nums">{input.length}/{MAX_CHARS}</span>}
              </p>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      {/* floating toggle */}
      <motion.button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? 'Minimize chat assistant' : 'Open chat assistant: ask about Prakash'}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.94 }}
        style={{ bottom }}
        className="fixed right-4 z-[62] grid h-[3.25rem] w-[3.25rem] place-items-center rounded-full bg-paper text-onpaper shadow-[0_14px_40px_-12px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.08)] transition-[bottom,background-color] duration-300 hover:bg-white sm:right-6 sm:h-14 sm:w-14"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? 'x' : 'chat'}
            initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="grid place-items-center"
          >
            {open ? <X size={20} aria-hidden="true" /> : <MessageCircle size={21} aria-hidden="true" />}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
