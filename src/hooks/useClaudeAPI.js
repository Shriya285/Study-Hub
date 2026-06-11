import { useState, useCallback } from 'react'

const MODEL = 'claude-sonnet-4-20250514'

export function useClaudeAPI() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const call = useCallback(async (prompt, { maxTokens = 1500 } = {}) => {
    const apiKey = localStorage.getItem('study_hub_claude_api_key') || import.meta.env.VITE_CLAUDE_API_KEY
    if (!apiKey) throw Object.assign(new Error('No API key configured'), { code: 'NO_KEY' })

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-calls': 'true',
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: maxTokens,
          messages: [{ role: 'user', content: prompt }],
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error.message)
      return data.content[0].text
    } catch (e) {
      setError(e.message || 'Something went wrong')
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return { call, loading, error, clearError }
}
