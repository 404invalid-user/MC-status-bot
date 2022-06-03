const { Schema, model } = require('mongoose');

const logSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    views: {
        type: Array,
        required: true,
        default: []
    }
}, {
    versionKey: false,
    _id: false
});

module.exports = model('analytis', logSchema);