const { Schema, model } = require('mongoose')
const error = new Schema({
        _id: { type: String, required: true },
        date: { type: String, required: true, default: Date.now().toString() },
        user: { type: String, required: false },
        guild: { type: String, required: false },
        type: { type: String, required: false },
        description: { type: String, required: false, default: 'naa' },
        systemerror: { type: String, required: false, default: 'naa' },
    },
    { versionKey: false })
module.exports = model('actionlog', error)
