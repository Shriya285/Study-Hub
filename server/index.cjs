require('dotenv').config({ path: __dirname + '/.env' })
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const Profile = require('./models/Profile.cjs')
const DailyLog = require('./models/DailyLog.cjs')

const app = express()
app.use(cors({ origin: true }))
app.use(express.json())

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err))

// --- Profile ---

app.get('/api/profile', async (req, res) => {
  const { deviceId } = req.query
  if (!deviceId) return res.status(400).json({ error: 'deviceId required' })
  try {
    const doc = await Profile.findOne({ deviceId }).lean()
    if (!doc) return res.status(404).json({ error: 'not found' })
    res.json(doc)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.post('/api/profile', async (req, res) => {
  const { deviceId, ...data } = req.body
  if (!deviceId) return res.status(400).json({ error: 'deviceId required' })
  try {
    const doc = await Profile.findOneAndUpdate(
      { deviceId },
      { $set: { ...data, updatedAt: new Date() } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean()
    res.json(doc)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// --- Daily Log ---

app.get('/api/daily/:date', async (req, res) => {
  const { deviceId } = req.query
  if (!deviceId) return res.status(400).json({ error: 'deviceId required' })
  try {
    const doc = await DailyLog.findOne({ deviceId, date: req.params.date }).lean()
    if (!doc) return res.status(404).json({ error: 'not found' })
    res.json(doc)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.post('/api/daily', async (req, res) => {
  const { deviceId, date, ...data } = req.body
  if (!deviceId || !date) return res.status(400).json({ error: 'deviceId and date required' })
  try {
    const doc = await DailyLog.findOneAndUpdate(
      { deviceId, date },
      { $set: { ...data, updatedAt: new Date() } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean()
    res.json(doc)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`API server running on http://localhost:${PORT}`))
