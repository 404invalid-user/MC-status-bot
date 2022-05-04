const { Schema, model } = require('mongoose')
const action = new Schema(
  {
    _id: { type: String, required: true },
    date: { type: String, required: true, default: Date.now().toString() },
    user: { type: String, required: false },
    guild: { type: String, required: false },
    type: { type: String, required: false },
    error: { type: Boolean, required: false },
    actions: { type: Array, required: false, default: [] }
  },
  { versionKey: false }
)
module.exports = model('auditlog', action)
