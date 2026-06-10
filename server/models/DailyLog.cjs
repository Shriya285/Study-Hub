const mongoose = require('mongoose')

const DailyLogSchema = new mongoose.Schema({
  deviceId: { type: String, required: true, index: true },
  date: { type: String, required: true },
  quests: { type: Array, default: [] },
  poms: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
})

DailyLogSchema.index({ deviceId: 1, date: 1 }, { unique: true })

module.exports = mongoose.model('DailyLog', DailyLogSchema)
