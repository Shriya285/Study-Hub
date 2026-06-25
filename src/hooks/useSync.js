import { useEffect, useRef, useCallback } from 'react'

const SYNC_KEYS = [
  'study_hub_settings',
  'study_hub_today',
  'study_hub_streak',
  'study_hub_last_complete',
  'study_hub_trophies',
  'study_hub_notes',
  'study_hub_xp',
  'study_hub_level',
  'study_hub_session_guides',
  'study_hub_theme',
  'study_hub_custom_subjects',
  'study_hub_last_oa_date',
  'study_hub_oa_subject_index',
  'study_hub_oa_seen_problems',
]

export function getSyncId() {
  let id = localStorage.getItem('study_hub_sync_id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('study_hub_sync_id', id)
  }
  return id
}

function gatherData() {
  const data = {}
  for (const key of SYNC_KEYS) {
    const val = localStorage.getItem(key)
    if (val !== null) data[key] = val
  }
  return data
}

export function applyServerData(serverData) {
  for (const [key, val] of Object.entries(serverData)) {
    if (SYNC_KEYS.includes(key) && val !== null) {
      localStorage.setItem(key, val)
    }
  }
}

export async function fetchAndApplySync(syncId) {
  const res = await fetch(`/api/sync?syncId=${encodeURIComponent(syncId)}`)
  if (!res.ok) return null
  const doc = await res.json()
  return doc
}

async function pushToServer(syncId) {
  const data = gatherData()
  const res = await fetch('/api/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ syncId, data }),
  })
  if (res.ok) {
    const json = await res.json()
    if (json.updatedAt) localStorage.setItem('study_hub_sync_ts', String(new Date(json.updatedAt).getTime()))
  }
}

export function useSync() {
  const syncId = getSyncId()
  const pushTimer = useRef(null)
  const didInit = useRef(false)

  function doPush() {
    pushToServer(syncId).catch(() => {})
  }

  // On mount: pull from server; reload if server is newer, else push local data up
  useEffect(() => {
    if (didInit.current) return
    didInit.current = true

    fetchAndApplySync(syncId).then(doc => {
      const localTs = Number(localStorage.getItem('study_hub_sync_ts') || '0')
      if (doc?.data && doc.updatedAt) {
        const serverTs = new Date(doc.updatedAt).getTime()
        if (serverTs > localTs + 5000) {
          applyServerData(doc.data)
          localStorage.setItem('study_hub_sync_ts', String(serverTs))
          window.location.reload()
          return
        }
      }
      // Local is same or newer — push up to server
      doPush()
    }).catch(() => {
      // Offline: proceed with local data
    })
  }, [])

  // Periodic push every 60s
  useEffect(() => {
    const id = setInterval(doPush, 60_000)
    return () => clearInterval(id)
  }, [])

  // Push on tab close/navigate away (sendBeacon is fire-and-forget)
  useEffect(() => {
    function onUnload() {
      const data = gatherData()
      const payload = JSON.stringify({ syncId, data })
      navigator.sendBeacon?.('/api/sync', new Blob([payload], { type: 'application/json' }))
    }
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') onUnload()
    })
    return () => window.removeEventListener('visibilitychange', onUnload)
  }, [])

  // Debounced push — call this after any data save
  const push = useCallback(() => {
    clearTimeout(pushTimer.current)
    pushTimer.current = setTimeout(doPush, 2000)
  }, [syncId])

  return { syncId, push }
}
