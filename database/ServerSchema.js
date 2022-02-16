const mongoose = require('mongoose')
const Schema = mongoose.Schema

const serverSchema = new Schema(
  {
    _id: {
      type: String,
      required: true
    },
    IP: {
      type: String,
      default: ''
    },
    Bedrock: {
      type: Boolean,
      required: false
    },
    Logging: {
      type: Boolean,
      default: false
    },
    StatusChannId: {
      type: String,
      required: false
    },
    StatusChannValue: {
      type: String,
      required: false
    },
    NumberChannId: {
      type: String,
      required: false
    },
    NumberChannValue: {
      type: String,
      required: false
    },
    MemberChannEnabled: {
      type: Boolean,
      required: false
    },
    channel: {
      status: {
        type: String,
        required: false
      },
      members: {
        type: String,
        required: false
      }
    },
    pinger: {
      status: {
        type: String,
        required: false
      },
      members: {
        type: String,
        required: false
      }
    },
    CategoryId: {
      type: String,
      required: false
    }
  },
  {
    versionKey: false
  }
)

const Server = mongoose.model('Server', serverSchema)
module.exports = Server
