import mongoose from 'mongoose'

let isConnected = false
async function dbConnect() {
  if (isConnected && mongoose.connection.readyState === 1) return
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000, maxPoolSize: 1 })
  isConnected = true
}

const oaSessionSchema = new mongoose.Schema({
  syncId:    { type: String, required: true, index: true },
  date:      { type: String, required: true },
  subject:   String,
  mcqScore:  Number,
  mcqAnswers: Array,
  dsaProblems: Array,
  tabSwitches: Array,
  durationSeconds: Number,
  completedByTimeout: Boolean,
  createdAt: { type: Date, default: Date.now },
})

const OASession = mongoose.models.OASession || mongoose.model('OASession', oaSessionSchema)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    await dbConnect()
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const { syncId, session } = body
    if (!syncId || !session) return res.status(400).json({ error: 'syncId and session required' })
    await OASession.create({ syncId, ...session })
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('OA session save error:', err)
    return res.status(500).json({ error: err.message })
  }
}
