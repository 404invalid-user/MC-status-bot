const {Schema,model } = require('mongoose')
const error = new Schema({
  _id: { type: String, required: true },
  date: { type: String, required: true,default: Date.now().toString() },
  user: { type: String, required: false },
  error: { type: String, required: false },
  description: { type: String, required: false, default: '' },
  solved: { type: Boolean, required: true, default: false },
  sloveDate: { type: String, required: false,default: '' }
}, { versionKey: false });
module.exports = model('error', error)
