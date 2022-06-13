const { Schema, model } = require('mongoose');

const serverSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    lan: {
        type: String,
        required: true,
        default: 'en'
    },
    username: {
        type: String,
        required: true
    },
    discriminator: {
        type: String,
        required: true,
        default: '000'
    },
    accessCodes: {
        type: Array,
        required: true,
        default: []
    },
    options: {
        darkMode: {
            type: Boolean,
            required: true,
            default: false
        },
        theme: {
            type: String,
            required: true,
            default: 'default'
        },
        ip: {
            type: String,
            required: false
        }
    },
    avatar: {
        type: String,
        required: true,
        default: '/icon.png'
    },
    guilds: {
        type: Object,
        required: true,
        default: {}
    },
    admin: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    versionKey: false
});
module.exports = model('User', serverSchema)