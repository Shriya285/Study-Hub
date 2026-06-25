import { FALLBACK_MCQS } from '../data/fallbackMCQs'

const SYSTEM_PROMPT = 'You are a technical interview question generator. Return ONLY valid JSON with no markdown, no backticks, no preamble. The JSON must match this exact shape: {"questions":[{"id":1,"question":"...","options":{"A":"...","B":"...","C":"...","D":"..."},"correct":"B","explanation":"..."}]}'

async function callAPI(subject) {
  const res = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: `Generate exactly 10 multiple-choice questions on the subject: ${subject}. Generate 4 Easy, 4 Medium, and 2 Hard questions. Each question must have exactly 4 options (A, B, C, D), one correct answer letter, and a brief 1-2 sentence explanation. Return only the JSON object.`,
      }],
    }),
  })
  if (!res.ok) throw new Error(`API ${res.status}`)
  const data = await res.json()
  const text = data.content?.[0]?.text || ''
  const parsed = JSON.parse(text)
  if (!Array.isArray(parsed.questions) || parsed.questions.length < 8) throw new Error('Bad shape')
  return parsed.questions.slice(0, 10)
}

export async function generateMCQs(subject) {
  try {
    return await callAPI(subject)
  } catch {
    try {
      return await callAPI(subject)
    } catch {
      return FALLBACK_MCQS[subject] ?? FALLBACK_MCQS['Operating Systems']
    }
  }
}
