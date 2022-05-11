const { Schema, model } = require('mongoose');
const log = new Schema({
    _id: { type: String, required: true },
    time: { type: String, required: true, default: Date.now().toString() },
    user: { type: String, required: false },
    guild: { type: String, required: false },
    error: { type: Boolean, required: false },
    action: { type: String, required: false, default: "" }
}, { versionKey: false })
module.exports = model('auditlog', log);