/**
 * Chat client. If the site was built with VITE_CHAT_API_URL (the deployed
 * api/chat.js backend), questions go to the AI; otherwise — or if the AI
 * fails — the built-in engine answers from the portfolio data.
 */
import { localAnswer } from './localAnswer.js'

export const API_URL = (import.meta.env?.VITE_CHAT_API_URL || '').trim()
export const AI_ENABLED = Boolean(API_URL)

/**
 * @param history  [{ role: 'user'|'assistant', content }] — whole conversation, last item = new question
 * @param context  { topic } from the previous answer (built-in engine follow-ups)
 * @returns { text, links, followups, topic, source: 'ai'|'local', notice? }
 */
export async function ask(history, context = {}) {
  const question = history[history.length - 1]?.content || ''

  if (AI_ENABLED) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 25000)
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history.slice(-12).map(({ role, content }) => ({ role, content })) }),
        signal: controller.signal,
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.answer) {
        // the built-in engine still tracks the topic so its fallback can resolve follow-ups
        const local = await localAnswer(question, context)
        return {
          text: data.answer,
          links: [],
          followups: data.followups?.length ? data.followups : local.followups,
          topic: local.topic,
          source: 'ai',
        }
      }
      if (res.status === 429 || res.status === 400) {
        // user-facing limits: show the server's message, don't silently fall back
        return { text: data.error || 'Please try again in a moment.', links: [], followups: [], topic: context.topic, source: 'error' }
      }
      throw new Error(data.error || `HTTP ${res.status}`)
    } catch {
      const local = await localAnswer(question, context)
      return { ...local, source: 'local', notice: 'AI is unavailable right now, so this answer comes straight from the portfolio data.' }
    } finally {
      clearTimeout(timer)
    }
  }

  return { ...(await localAnswer(question, context)), source: 'local' }
}
