const MODEL = 'claude-sonnet-4-20250514'

export async function callClaude({ userPrompt, systemPrompt, maxTokens = 1000 }) {
  const body = {
    model: MODEL,
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: userPrompt }],
  }
  if (systemPrompt) body.system = systemPrompt

  const res = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`API error ${res.status}`)
  const data = await res.json()
  if (data.error) throw new Error(data.error.message)
  return data.content[0].text
}

export async function callClaudeChat({ systemPrompt, messages, maxTokens = 600 }) {
  const res = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages,
    }),
  })
  if (!res.ok) throw new Error(`API error ${res.status}`)
  const data = await res.json()
  if (data.error) throw new Error(data.error.message)
  return data.content[0].text
}
