const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Creating a schema, sort of like working with an ORM
const EventSchema = new Schema({
  creditor: {
    type: Schema.Types.ObjectId, ref: "user"
  },
  debtor: {
    type: Schema.Types.ObjectId, ref: "user"
  },
  amount: {
    type: Number,
    default: 0
  },
  type: {
    type: String,
    enum: ['PERSONAL', 'GROUP'],
    default: 'PERSONAL'
  },
  groupId: {
    type: Schema.Types.ObjectId, ref: "group"
  },
  timestamp: {
    type: Date, default: Date.now
  },
  description: {
    type: String
  }
})

// Creating a table within database with the defined schema
const Event = mongoose.model('event', EventSchema)

// Exporting table for querying and mutating
module.exports = { Event }
