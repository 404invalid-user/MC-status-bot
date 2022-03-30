const mongoose = require('mongoose')
const Schema = mongoose.Schema

const logSchema = new Schema(
  {
    _id: {
      type: String,
      required: true
    },
    views: {
      type: Array,
      required: true,
      default: []
    }
  },
  {
    versionKey: false,
    _id: false
  }
)

const Log = mongoose.model('analytis', logSchema)
module.exports = Log
