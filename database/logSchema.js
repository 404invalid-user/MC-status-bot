const { Schema, model } = require('mongoose');

const logSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    logs: [{
        timestamp: {
            type: Date,
            default: Date.now
        },
        online: {
            required: true,
            type: Boolean
        },
        playersOnline: {
            type: Number
        },
        playerNamesOnline: {
            type: String
        }
    }]
}, {
    versionKey: false,
    _id: false
})

module.exports = model('log', logSchema);