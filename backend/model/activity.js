const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Creating a schema, sort of like working with an ORM
const ActivitySchema = new Schema({
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
  timestamp: {
    type: Date, default: Date.now
  },
  description: {
    type: String
  }
})

// Creating a table within database with the defined schema
const Activity = mongoose.model('activity', ActivitySchema)

// Exporting table for querying and mutating
module.exports = { Activity }
