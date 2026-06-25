import { getSyncId } from '../hooks/useSync'

export async function saveOASession(sessionData) {
  const syncId = getSyncId()
  try {
    await fetch('/api/oa-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ syncId, session: sessionData }),
    })
  } catch {
    // Non-fatal: session data saved locally anyway
  }
}
