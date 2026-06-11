import mongoose from 'mongoose'

let isConnected = false

async function dbConnect() {
  if (isConnected && mongoose.connection.readyState === 1) return
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    maxPoolSize: 1,
  })
  isConnected = true
}

const schema = new mongoose.Schema({
  syncId:    { type: String, required: true, unique: true, index: true },
  data:      { type: Object, default: {} },
  updatedAt: { type: Date, default: Date.now },
})

const SyncData = mongoose.models.SyncData || mongoose.model('SyncData', schema)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    await dbConnect()

    if (req.method === 'GET') {
      const { syncId } = req.query
      if (!syncId) return res.status(400).json({ error: 'syncId required' })
      const doc = await SyncData.findOne({ syncId }).lean()
      return res.status(200).json(doc || null)
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
      const { syncId, data } = body
      if (!syncId) return res.status(400).json({ error: 'syncId required' })
      const now = new Date()
      await SyncData.findOneAndUpdate(
        { syncId },
        { $set: { data, updatedAt: now } },
        { upsert: true, new: true }
      )
      return res.status(200).json({ ok: true, updatedAt: now.toISOString() })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('Sync error:', err)
    return res.status(500).json({ error: err.message })
  }
}
