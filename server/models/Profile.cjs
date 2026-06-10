const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema({
  deviceId: { type: String, required: true, unique: true, index: true },
  name: { type: String, default: 'Shriya' },
  targetDate: { type: String, default: '' },
  streak: { type: Number, default: 0 },
  lastComplete: { type: String, default: '' },
  xp: { type: Number, default: 0 },
  trophies: {
    type: Object,
    default: { firstDay: false, streak3: false, problems50: false, streak7: false, streak14: false, streak30: false },
  },
  schedule: { type: Array, default: [] },
  goals: { type: Array, default: [] },
  resources: { type: Array, default: [] },
  updatedAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Profile', ProfileSchema)
