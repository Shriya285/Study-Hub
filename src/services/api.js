// Persistent device ID — identifies this browser's data in MongoDB
const DEVICE_ID = (() => {
  let id = localStorage.getItem('study_hub_device_id')
  if (!id) {
    id = Date.now().toString(36) + Math.random().toString(36).slice(2)
    localStorage.setItem('study_hub_device_id', id)
  }
  return id
})()

async function apiFetch(path, options = {}) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error(`${res.status}`)
  return res.json()
}

export async function fetchProfile() {
  return apiFetch(`/api/profile?deviceId=${DEVICE_ID}`).catch(() => null)
}

export async function saveProfile(data) {
  return apiFetch('/api/profile', {
    method: 'POST',
    body: JSON.stringify({ ...data, deviceId: DEVICE_ID }),
  }).catch(() => null)
}

export async function fetchDaily(date) {
  return apiFetch(`/api/daily/${date}?deviceId=${DEVICE_ID}`).catch(() => null)
}

export async function saveDaily(data) {
  return apiFetch('/api/daily', {
    method: 'POST',
    body: JSON.stringify({ ...data, deviceId: DEVICE_ID }),
  }).catch(() => null)
}
